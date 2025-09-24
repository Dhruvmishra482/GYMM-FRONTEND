
import axiosInstance from "../../../../axios.config";

// Check onboarding status
export const checkOnboardingStatusService = async () => {
  try {
    console.log('🔍 Checking onboarding status...');
    const res = await axiosInstance.get("/owner/onboarding-status", {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Onboarding status response:', res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Check onboarding status error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Failed to check onboarding status");
  }
};

// Complete gym onboarding
export const completeGymOnboardingService = async (gymData) => {
  try {
    console.log('🚀 Starting gym onboarding with data:', {
      gymName: gymData.gymName,
      hasLogo: !!gymData.gymLogo,
      logoSize: gymData.gymLogo ? gymData.gymLogo.length : 0
    });

    // Clean and validate the data
    const cleanedData = {
      gymName: gymData.gymName?.trim(),
      gymLogo: gymData.gymLogo || null
    };

    console.log('🧹 Cleaned data:', {
      gymName: cleanedData.gymName,
      hasLogo: !!cleanedData.gymLogo
    });

    // Validate gym name
    if (!cleanedData.gymName || cleanedData.gymName.length < 3) {
      throw new Error("Gym name must be at least 3 characters long");
    }

    // Validate logo format if provided
    if (cleanedData.gymLogo && !cleanedData.gymLogo.startsWith('data:image/')) {
      throw new Error("Invalid logo format. Please upload a valid image.");
    }

    console.log('📡 Making API request to /owner/complete-onboarding...');
    
    const res = await axiosInstance.post("/owner/complete-onboarding", cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ API Response:', res.data);

    // Verify the response structure
    if (!res.data.success) {
      throw new Error(res.data.message || "API returned unsuccessful response");
    }

    return res.data;
  } catch (err) {
    console.error("❌ Complete onboarding error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      statusText: err.response?.statusText
    });

    // Provide more specific error messages
    if (err.response?.status === 404) {
      throw new Error("Onboarding endpoint not found. Please check your API configuration.");
    } else if (err.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (err.response?.status === 403) {
      throw new Error("Access denied. Please check your permissions.");
    } else if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error(err.message || "Failed to complete gym setup");
    }
  }
};

// Get owner profile with gym details
export const getOwnerProfileService = async () => {
  try {
    console.log('👤 Fetching owner profile...');
    const res = await axiosInstance.get("/owner/profile", {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Owner profile response:', {
      success: res.data.success,
      hasGymDetails: !!res.data.data?.gymDetails,
      gymName: res.data.data?.gymDetails?.gymName,
      isOnboardingComplete: res.data.data?.gymDetails?.isOnboardingComplete
    });
    return res.data;
  } catch (err) {
    console.error("❌ Get owner profile error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Failed to fetch profile");
  }
};