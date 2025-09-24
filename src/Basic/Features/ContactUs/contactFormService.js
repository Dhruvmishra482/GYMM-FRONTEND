// services/contactService.js

import axiosInstance from "../../../axios.config";

export const contactFormService = {
  // Submit contact form
  submitContactForm: async (contactData) => {
    try {
      // Clean and validate the data
      const cleanedData = {
        name: contactData.name?.trim() || '',
        email: contactData.email?.trim().toLowerCase() || '',
        phone: contactData.phone?.trim() || '',
        subject: contactData.subject?.trim() || '',
        inquiry: contactData.inquiry || 'general',
        message: contactData.message?.trim() || '',
        gymName: contactData.gymName?.trim() || '',
        ownerName: contactData.ownerName?.trim() || '',
      };

      // Frontend validation
      if (!cleanedData.name || cleanedData.name.length < 2) {
        throw new Error("Name must be at least 2 characters long");
      }

      if (!cleanedData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedData.email)) {
        throw new Error("Please provide a valid email address");
      }

      if (!cleanedData.subject || cleanedData.subject.length < 5) {
        throw new Error("Subject must be at least 5 characters long");
      }

      if (!cleanedData.message || cleanedData.message.length < 10) {
        throw new Error("Message must be at least 10 characters long");
      }

      if (cleanedData.phone && cleanedData.phone.length > 0 && cleanedData.phone.length < 10) {
        throw new Error("Please provide a valid phone number");
      }

      // Remove empty optional fields
      Object.keys(cleanedData).forEach(key => {
        if (!cleanedData[key] || cleanedData[key] === '') {
          delete cleanedData[key];
        }
      });

      console.log("Submitting contact form:", cleanedData);

      const response = await axiosInstance.post("/contact", cleanedData, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000, // 15 seconds timeout
        withCredentials: true // Include cookies for potential user auth
      });

      console.log("Contact form response:", response.data);
      return response.data;

    } catch (err) {
      console.error("Contact form submission error:", err.response?.data || err.message);
      
      // Handle different types of errors
      if (err.code === 'ECONNABORTED') {
        throw new Error("Request timeout. Please check your internet connection and try again.");
      }
      
      if (err.response?.status === 429) {
        throw new Error("Too many submissions. Please wait a few minutes before trying again.");
      }
      
      if (err.response?.status === 400) {
        const errorMessage = err.response.data?.errors?.[0]?.msg || 
                           err.response.data?.message || 
                           "Please check your form data and try again.";
        throw new Error(errorMessage);
      }
      
      if (err.response?.status === 413) {
        throw new Error("Message too large. Please shorten your message and try again.");
      }
      
      if (err.response?.status >= 500) {
        throw new Error("Server error. Please try again later or contact us directly.");
      }
      
      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your connection and try again.");
      }
      
      // If it's already a custom error message, use it
      if (err.message && !err.response) {
        throw err;
      }
      
      throw new Error("Failed to send message. Please try again or contact us directly.");
    }
  },

  // Validate form data before submission
  validateFormData: (formData) => {
    const errors = {};

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = "Name is required and must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      errors.name = "Name must be less than 100 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      errors.email = "Please provide a valid email address";
    }

    // Phone validation (optional but if provided should be valid)
    if (formData.phone && formData.phone.trim().length > 0) {
      const cleanPhone = formData.phone.replace(/\s+/g, '').replace(/[-()+]/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        errors.phone = "Please provide a valid phone number (10-15 digits)";
      }
      // if (!/^[\+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      //   errors.phone = "Phone number can only contain numbers, spaces, +, -, (, )";
      // }
    }

    // Subject validation
    if (!formData.subject || formData.subject.trim().length < 5) {
      errors.subject = "Subject is required and must be at least 5 characters";
    } else if (formData.subject.trim().length > 200) {
      errors.subject = "Subject must be less than 200 characters";
    }

    // Message validation
    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = "Message is required and must be at least 10 characters";
    } else if (formData.message.length > 2000) {
      errors.message = "Message must be less than 2000 characters";
    }

    // Inquiry type validation
    const validInquiryTypes = ['general', 'sales', 'support', 'demo', 'partnership'];
    if (formData.inquiry && !validInquiryTypes.includes(formData.inquiry)) {
      errors.inquiry = "Please select a valid inquiry type";
    }

    // Optional field length validation
    if (formData.gymName && formData.gymName.length > 100) {
      errors.gymName = "Gym name must be less than 100 characters";
    }

    if (formData.ownerName && formData.ownerName.length > 100) {
      errors.ownerName = "Owner name must be less than 100 characters";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Check if user is rate limited
  checkRateLimit: () => {
    const lastSubmission = localStorage.getItem('lastContactSubmission');
    if (lastSubmission) {
      const timeDiff = Date.now() - parseInt(lastSubmission);
      const rateLimit = 15 * 60 * 1000; // 15 minutes in milliseconds
      
      if (timeDiff < rateLimit) {
        const remainingTime = Math.ceil((rateLimit - timeDiff) / 60000); // minutes
        return {
          isRateLimited: true,
          remainingMinutes: remainingTime
        };
      }
    }
    
    return {
      isRateLimited: false,
      remainingMinutes: 0
    };
  },

  // Set rate limit timestamp
  setRateLimitTimestamp: () => {
    localStorage.setItem('lastContactSubmission', Date.now().toString());
  },

  // Format phone number for display
  formatPhoneNumber: (phone) => {
    if (!phone) return '';
    
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    return phone; // Return original if can't format
  },

  // Get inquiry type display name
  getInquiryDisplayName: (inquiryType) => {
    const inquiryTypes = {
      general: 'General Inquiry',
      sales: 'Sales & Pricing',
      support: 'Technical Support',
      demo: 'Request Demo',
      partnership: 'Partnership'
    };
    
    return inquiryTypes[inquiryType] || 'General Inquiry';
  },

  // Clean form data for display
  cleanFormData: (formData) => {
    const cleaned = {};
    
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'string') {
        cleaned[key] = formData[key].trim();
      } else {
        cleaned[key] = formData[key];
      }
    });
    
    return cleaned;
  },

  // Check if form has unsaved changes
  hasUnsavedChanges: (formData, initialData = {}) => {
    const keys = ['name', 'email', 'phone', 'subject', 'message', 'gymName', 'ownerName', 'inquiry'];
    
    return keys.some(key => {
      const currentValue = formData[key]?.trim() || '';
      const initialValue = initialData[key]?.trim() || '';
      return currentValue !== initialValue;
    });
  }
};

// Named export for individual functions if needed
export const {
  submitContactForm,
  validateFormData,
  checkRateLimit,
  setRateLimitTimestamp,
  formatPhoneNumber,
  getInquiryDisplayName,
  cleanFormData,
  hasUnsavedChanges
} = contactFormService;

// Default export
export default contactFormService;