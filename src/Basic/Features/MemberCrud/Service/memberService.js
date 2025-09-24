
import axiosInstance from "../../../../axios.config";

// Validation function for member data
export const validateMemberData = (formData) =>
{
  const errors = [];

  // Required fields validation
  if (!formData.name || formData.name.trim() === "")
  {
    errors.push("Name is required");
  }

  if (!formData.phoneNo || formData.phoneNo.trim() === "")
  {
    errors.push("Phone number is required");
  } else if (!/^\d{10}$/.test(formData.phoneNo.replace(/\D/g,'')))
  {
    errors.push("Phone number must be 10 digits");
  }

  if (!formData.feesAmount || formData.feesAmount.trim() === "")
  {
    errors.push("Fees amount is required");
  } else if (isNaN(formData.feesAmount) || parseFloat(formData.feesAmount) <= 0)
  {
    errors.push("Fees amount must be a valid positive number");
  }

  if (!formData.nextDueDate || formData.nextDueDate.trim() === "")
  {
    errors.push("Next due date is required");
  }

  if (!formData.address || formData.address.trim() === "")
  {
    errors.push("Address is required");
  }

  // Email validation (if provided)
  if (formData.email && formData.email.trim() !== "")
  {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
    {
      errors.push("Please enter a valid email address");
    }
  }

  // Age validation (if provided)
  if (formData.age && formData.age.trim() !== "")
  {
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 12 || age > 100)
    {
      errors.push("Age must be between 12 and 100");
    }
  }

  // Date validation
  if (formData.nextDueDate)
  {
    const nextDueDate = new Date(formData.nextDueDate);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (nextDueDate < today)
    {
      errors.push("Next due date cannot be in the past");
    }
  }

  if (formData.lastPaidOn && formData.lastPaidOn.trim() !== "")
  {
    const lastPaidDate = new Date(formData.lastPaidOn);
    const today = new Date();

    if (lastPaidDate > today)
    {
      errors.push("Last paid date cannot be in the future");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Search member by name or phone - FIXED VERSION
export const searchMember = async (query) =>
{
  try
  {
    console.log("Starting search for:",query);

    // Get all members first
    const allMembersResponse = await getAllMembers();

    if (!allMembersResponse.success)
    {
      console.log("Failed to get all members:",allMembersResponse);
      return allMembersResponse;
    }

    const members = allMembersResponse.data;
    console.log("Total members found:",members.length);

    // Clean and prepare search terms
    const cleanQuery = query.trim();

    if (!cleanQuery)
    {
      return {
        success: false,
        message: "Search query cannot be empty"
      };
    }

    // Check if query is purely numeric (phone number)
    const isPhoneQuery = /^\d+$/.test(cleanQuery);
    console.log("Is phone query:",isPhoneQuery,"Query:",cleanQuery);

    // Search logic
    let foundMember = null;

    if (isPhoneQuery)
    {
      // Phone number search - exact match
      foundMember = members.find(member =>
        member.phoneNo === cleanQuery
      );
      console.log("Phone search result:",foundMember ? foundMember.name : "Not found");
    } else
    {
      // Name search - case insensitive, with trimming
      const searchLower = cleanQuery.toLowerCase();

      // Try exact match first
      foundMember = members.find(member =>
        member.name && member.name.trim().toLowerCase() === searchLower
      );

      // If no exact match, try partial match
      if (!foundMember)
      {
        foundMember = members.find(member =>
          member.name && member.name.trim().toLowerCase().includes(searchLower)
        );
      }

      console.log("Name search result:",foundMember ? foundMember.name : "Not found");
    }

    if (foundMember)
    {
      console.log("Member found:",foundMember.name);
      return {
        success: true,
        message: "Member found successfully",
        data: foundMember
      };
    } else
    {
      console.log("No member found with query:",cleanQuery);
      return {
        success: false,
        message: isPhoneQuery
          ? `No member found with phone number: ${cleanQuery}`
          : `No member found with name: ${cleanQuery}`
      };
    }
  } catch (error)
  {
    console.error("Search member error:",error);
    return {
      success: false,
      message: "An error occurred while searching for the member"
    };
  }
};

// Add new member
export const addMember = async (memberData) =>
{
  try
  {
    const response = await axiosInstance.post("/member/addmember",memberData);
    return {
      success: true,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error)
  {
    console.error("Add member error:",error);

    if (error.response)
    {
      // Server responded with error status
      const { status,data } = error.response;

      if (status === 409)
      {
        return {
          success: false,
          message: "Member with this phone number already exists"
        };
      }

      if (status === 400)
      {
        // Validation errors from backend
        const validationErrors = data.errors ?
          data.errors.map(err => err.msg || err.message).join(", ") :
          data.message;

        return {
          success: false,
          message: validationErrors || "Invalid data provided"
        };
      }

      if (status === 401)
      {
        return {
          success: false,
          message: "Authentication failed. Please login again."
        };
      }

      if (status === 403)
      {
        return {
          success: false,
          message: "Access denied. Only gym owners can add members."
        };
      }

      return {
        success: false,
        message: data.message || "Failed to add member"
      };
    }

    if (error.request)
    {
      // Network error
      return {
        success: false,
        message: "Network error. Please check your connection and try again."
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again."
    };
  }
};

// Edit member
export const editMember = async (phoneNo,updateData) =>
{
  try
  {
    const response = await axiosInstance.patch(`/member/editmember/${phoneNo}`,updateData);
    return {
      success: true,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error)
  {
    console.error("Edit member error:",error);

    if (error.response)
    {
      const { status,data } = error.response;

      if (status === 404)
      {
        return {
          success: false,
          message: "Member not found with this phone number"
        };
      }

      if (status === 400)
      {
        return {
          success: false,
          message: data.message || "Invalid update data"
        };
      }

      if (status === 401)
      {
        return {
          success: false,
          message: "Authentication failed. Please login again."
        };
      }

      if (status === 403)
      {
        return {
          success: false,
          message: "Access denied. Only gym owners can edit members."
        };
      }

      return {
        success: false,
        message: data.message || "Failed to update member"
      };
    }

    if (error.request)
    {
      return {
        success: false,
        message: "Network error. Please check your connection and try again."
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again."
    };
  }
};

// // Delete member
// export const deleteMember = async (phoneNo) =>
// {
//   try
//   {
//     const response = await axiosInstance.delete(`/member/deletemember/${phoneNo}`);
//     return {
//       success: true,
//       message: response.data.message,
//       data: response.data.data
//     };
//   } catch (error)
//   {
//     console.error("Delete member error:",error);

//     if (error.response)
//     {
//       const { status,data } = error.response;

//       if (status === 404)
//       {
//         return {
//           success: false,
//           message: "Member not found with this phone number"
//         };
//       }

//       if (status === 401)
//       {
//         return {
//           success: false,
//           message: "Authentication failed. Please login again."
//         };
//       }

//       if (status === 403)
//       {
//         return {
//           success: false,
//           message: "Access denied. Only gym owners can delete members."
//         };
//       }

//       return {
//         success: false,
//         message: data.message || "Failed to delete member"
//       };
//     }

//     if (error.request)
//     {
//       return {
//         success: false,
//         message: "Network error. Please check your connection and try again."
//       };
//     }

//     return {
//       success: false,
//       message: "An unexpected error occurred. Please try again."
//     };
//   }
// };

// Get all members
export const getAllMembers = async () =>
{
  try
  {
    const response = await axiosInstance.get("/member/allmembers");
    return {
      success: true,
      data: response.data.data
    };
  } catch (error)
  {
    console.error("Get all members error:",error);

    if (error.response)
    {
      const { status,data } = error.response;

      if (status === 401)
      {
        return {
          success: false,
          message: "Authentication failed. Please login again."
        };
      }

      return {
        success: false,
        message: data.message || "Failed to fetch members"
      };
    }

    if (error.request)
    {
      return {
        success: false,
        message: "Network error. Please check your connection and try again."
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again."
    };
  }
};

// Get member by phone number
export const getMemberByPhone = async (phoneNo) =>
{
  try
  {
    const response = await axiosInstance.get(`/member/getmember/${phoneNo}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error)
  {
    console.error("Get member error:",error);

    if (error.response)
    {
      const { status,data } = error.response;

      if (status === 404)
      {
        return {
          success: false,
          message: "Member not found with this phone number"
        };
      }

      if (status === 401)
      {
        return {
          success: false,
          message: "Authentication failed. Please login again."
        };
      }

      return {
        success: false,
        message: data.message || "Failed to fetch member"
      };
    }

    if (error.request)
    {
      return {
        success: false,
        message: "Network error. Please check your connection and try again."
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again."
    };
  }
};
export const getAllDueMembers = async () => {
  try {
    console.log("🌐 getAllDueMembers service called");
    console.log("📡 Making request to: /member/duemembers");
    
    const response = await axiosInstance.get("/member/duemembers");
    
    console.log("📥 Service response status:", response.status);
    console.log("📥 Service response data:", response.data);
    console.log("📊 Members count from service:", response.data?.count);
    
    if (response.data?.success) {
      console.log("✅ Service: Successfully fetched due members");
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        statistics: response.data.statistics
      };
    } else {
      console.warn("⚠️ Service: Response indicates failure:", response.data?.message);
      return {
        success: false,
        message: response.data?.message || "Failed to fetch due members",
        data: [],
        count: 0
      };
    }
    
  } catch (error) {
    console.error("❌ getAllDueMembers service error:", error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error("📍 Response error - Status:", status, "Data:", data);
      
      if (status === 401) {
        console.error("🔐 Authentication failed");
        return {
          success: false,
          message: "Authentication failed. Please login again.",
          data: [],
          count: 0
        };
      }
      
      if (status === 403) {
        console.error("🚫 Access denied");
        return {
          success: false,
          message: "Access denied. Only gym owners can view due members.",
          data: [],
          count: 0
        };
      }
      
      if (status === 404) {
        console.error("🔍 Route not found - Check if route is properly registered");
        return {
          success: false,
          message: "Route not found. Please check server configuration.",
          data: [],
          count: 0
        };
      }
      
      return {
        success: false,
        message: data?.message || `Server error: ${status}`,
        data: [],
        count: 0
      };
    }
    
    if (error.request) {
      console.error("📡 Network error - No response received");
      console.error("📍 Request details:", error.request);
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
        data: [],
        count: 0
      };
    }
    
    console.error("🔧 Unexpected error:", error.message);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      data: [],
      count: 0
    };
  }
};


// Add these service functions to your memberService.js file

// Send reminder to a specific member
export const sendMemberReminder = async (memberId) => {
  try {
    console.log("🌐 sendMemberReminder service called for member:", memberId);
    console.log("📡 Making request to: /member/" + memberId + "/send-reminder");
    
    const response = await axiosInstance.post(`/member/${memberId}/send-reminder`);
    
    console.log("📥 Service response status:", response.status);
    console.log("📥 Service response data:", response.data);
    
    if (response.data?.success) {
      console.log("✅ Service: Reminder sent successfully");
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      console.warn("⚠️ Service: Response indicates failure:", response.data?.message);
      return {
        success: false,
        message: response.data?.message || "Failed to send reminder"
      };
    }
    
  } catch (error) {
    console.error("❌ sendMemberReminder service error:", error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error("📍 Response error - Status:", status, "Data:", data);
      
      if (status === 404) {
        return {
          success: false,
          message: "Member not found"
        };
      }
      
      if (status === 400) {
        return {
          success: false,
          message: data?.message || "Member phone number not found"
        };
      }
      
      return {
        success: false,
        message: data?.message || `Server error: ${status}`
      };
    }
    
    if (error.request) {
      console.error("📡 Network error - No response received");
      return {
        success: false,
        message: "Network error. Please check your connection and try again."
      };
    }
    
    console.error("🔧 Unexpected error:", error.message);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again."
    };
  }
};

// Mark member fee as paid
export const markMemberFeePaid = async (memberId, paymentData = {}) => {
  try {
    console.log("🌐 markMemberFeePaid service called for member:", memberId);
    console.log("📡 Making request to: /member/" + memberId + "/mark-paid");
    console.log("💰 Payment data:", paymentData);
    
    const response = await axiosInstance.patch(`/member/${memberId}/mark-paid`, paymentData);
    
    console.log("📥 Service response status:", response.status);
    console.log("📥 Service response data:", response.data);
    
    if (response.data?.success) {
      console.log("✅ Service: Member marked as paid successfully");
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      console.warn("⚠️ Service: Response indicates failure:", response.data?.message);
      return {
        success: false,
        message: response.data?.message || "Failed to mark member as paid"
      };
    }
    
  } catch (error) {
    console.error("❌ markMemberFeePaid service error:", error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error("📍 Response error - Status:", status, "Data:", data);
      
      if (status === 404) {
        return {
          success: false,
          message: "Member not found"
        };
      }
      
      return {
        success: false,
        message: data?.message || `Server error: ${status}`
      };
    }
    
    if (error.request) {
      console.error("📡 Network error - No response received");
      return {
        success: false,
        message: "Network error. Please check your connection and try again."
      };
    }
    
    console.error("🔧 Unexpected error:", error.message);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again."
    };
  }
};

// Get detailed member information
export const getMemberDetails = async (memberId) => {
  try {
    console.log("🌐 getMemberDetails service called for member:", memberId);
    console.log("📡 Making request to: /member/" + memberId + "/details");
    
    const response = await axiosInstance.get(`/member/${memberId}/details`);
    
    console.log("📥 Service response status:", response.status);
    console.log("📥 Service response data:", response.data);
    
    if (response.data?.success) {
      console.log("✅ Service: Member details fetched successfully");
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      console.warn("⚠️ Service: Response indicates failure:", response.data?.message);
      return {
        success: false,
        message: response.data?.message || "Failed to fetch member details",
        data: null
      };
    }
    
  } catch (error) {
    console.error("❌ getMemberDetails service error:", error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error("📍 Response error - Status:", status, "Data:", data);
      
      if (status === 404) {
        return {
          success: false,
          message: "Member not found",
          data: null
        };
      }
      
      return {
        success: false,
        message: data?.message || `Server error: ${status}`,
        data: null
      };
    }
    
    if (error.request) {
      console.error("📡 Network error - No response received");
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
        data: null
      };
    }
    
    console.error("🔧 Unexpected error:", error.message);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      data: null
    };
  }
};

// Send reminders to all due members (bulk operation)
export const sendAllMemberReminders = async () => {
  try {
    console.log("🌐 sendAllMemberReminders service called");
    console.log("📡 Making request to: /member/send-all-reminders");
    
    const response = await axiosInstance.post("/member/send-all-reminders");
    
    console.log("📥 Service response status:", response.status);
    console.log("📥 Service response data:", response.data);
    
    if (response.data?.success) {
      console.log("✅ Service: Bulk reminders sent successfully");
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      console.warn("⚠️ Service: Response indicates failure:", response.data?.message);
      return {
        success: false,
        message: response.data?.message || "Failed to send bulk reminders",
        data: {
          totalMembers: 0,
          successful: 0,
          failed: 0,
          results: []
        }
      };
    }
    
  } catch (error) {
    console.error("❌ sendAllMemberReminders service error:", error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error("📍 Response error - Status:", status, "Data:", data);
      
      return {
        success: false,
        message: data?.message || `Server error: ${status}`,
        data: {
          totalMembers: 0,
          successful: 0,
          failed: 0,
          results: []
        }
      };
    }
    
    if (error.request) {
      console.error("📡 Network error - No response received");
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
        data: {
          totalMembers: 0,
          successful: 0,
          failed: 0,
          results: []
        }
      };
    }
    
    console.error("🔧 Unexpected error:", error.message);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      data: {
        totalMembers: 0,
        successful: 0,
        failed: 0,
        results: []
      }
    };
  }
};




// Get owner profile
export const getOwnerProfile = async () => {
  try {
    console.log("🌐 getOwnerProfile service called");
    console.log("📡 Making request to: /owner/profile");
    
    const response = await axiosInstance.get("/owner/profile");
    
    console.log("📥 Service response status:", response.status);
    console.log("📥 Service response data:", response.data);
    
    if (response.data?.success) {
      console.log("✅ Service: Profile fetched successfully");
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      console.warn("⚠️ Service: Response indicates failure:", response.data?.message);
      return {
        success: false,
        message: response.data?.message || "Failed to fetch profile",
        data: null
      };
    }
    
  } catch (error) {
    console.error("❌ getOwnerProfile service error:", error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error("📍 Response error - Status:", status, "Data:", data);
      
      if (status === 401) {
        return {
          success: false,
          message: "Session expired. Please login again.",
          data: null,
          needsLogin: true
        };
      }
      
      if (status === 404) {
        return {
          success: false,
          message: "Profile not found.",
          data: null
        };
      }
      
      return {
        success: false,
        message: data?.message || `Server error: ${status}`,
        data: null
      };
    }
    
    if (error.request) {
      console.error("📡 Network error - No response received");
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
        data: null
      };
    }
    
    console.error("🔧 Unexpected error:", error.message);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      data: null
    };
  }
};

// Update owner profile
export const updateOwnerProfile = async (profileData) => {
  try {
    console.log("🌐 updateOwnerProfile service called");
    console.log("📡 Making request to: /owner/profile");
    console.log("📤 Profile data:", profileData);
    
    const response = await axiosInstance.put("/owner/profile", profileData);
    
    console.log("📥 Service response status:", response.status);
    console.log("📥 Service response data:", response.data);
    
    if (response.data?.success) {
      console.log("✅ Service: Profile updated successfully");
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      console.warn("⚠️ Service: Response indicates failure:", response.data?.message);
      return {
        success: false,
        message: response.data?.message || "Failed to update profile",
        data: null
      };
    }
    
  } catch (error) {
    console.error("❌ updateOwnerProfile service error:", error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error("📍 Response error - Status:", status, "Data:", data);
      
      if (status === 400) {
        return {
          success: false,
          message: data?.message || "Invalid data provided",
          data: null,
          validationErrors: data?.errors || []
        };
      }
      
      if (status === 401) {
        return {
          success: false,
          message: "Session expired. Please login again.",
          data: null,
          needsLogin: true
        };
      }
      
      if (status === 404) {
        return {
          success: false,
          message: "Profile not found.",
          data: null
        };
      }
      
      if (status === 409) {
        return {
          success: false,
          message: data?.message || "Email or mobile number already exists",
          data: null
        };
      }
      
      return {
        success: false,
        message: data?.message || `Server error: ${status}`,
        data: null
      };
    }
    
    if (error.request) {
      console.error("📡 Network error - No response received");
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
        data: null
      };
    }
    
    console.error("🔧 Unexpected error:", error.message);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      data: null
    };
  }
};

// Validate profile data before sending to server
export const validateProfileData = (profileData) => {
  const errors = {};
  
  // First name validation
  if (!profileData.firstName || profileData.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters long';
  } else if (profileData.firstName.trim().length > 50) {
    errors.firstName = 'First name must be less than 50 characters';
  } else if (!/^[a-zA-Z\s]+$/.test(profileData.firstName.trim())) {
    errors.firstName = 'First name can only contain letters and spaces';
  }
  
  // Last name validation
  if (!profileData.lastName || profileData.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters long';
  } else if (profileData.lastName.trim().length > 50) {
    errors.lastName = 'Last name must be less than 50 characters';
  } else if (!/^[a-zA-Z\s]+$/.test(profileData.lastName.trim())) {
    errors.lastName = 'Last name can only contain letters and spaces';
  }
  
  // Mobile number validation
  if (!profileData.mobileNumber) {
    errors.mobileNumber = 'Mobile number is required';
  } else {
    const cleanMobile = profileData.mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      errors.mobileNumber = 'Mobile number must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      errors.mobileNumber = 'Please enter a valid Indian mobile number starting with 6-9';
    }
  }
  
  // Email validation
  if (!profileData.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email.trim())) {
    errors.email = 'Please enter a valid email address';
  } else if (profileData.email.trim().length > 100) {
    errors.email = 'Email address is too long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Format phone number for display
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const clean = phoneNumber.replace(/\D/g, '');
  if (clean.length === 10) {
    return `${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return phoneNumber;
};

// Get initials from name
export const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}` || 'NA';
};