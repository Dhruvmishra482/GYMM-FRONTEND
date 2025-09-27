import axiosInstance from "../../axios.config";

export const signUpService = async (userData) => {
  try {
    // Clean the data
    const cleanedData = {
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      mobileNumber: userData.mobileNumber.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      confirmPassword: userData.confirmPassword,
    };

    const res = await axiosInstance.post("/auth/signup", cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (err) {
    console.error("Full error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Signup failed");
  }
};

export const verifyOTPService = async (otpData) => {
  try {
    const res = await axiosInstance.post("/auth/verify-otp", otpData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (err) {
    console.error("OTP verification error:", err.response?.data);
    throw new Error(err.response?.data?.message || "OTP verification failed");
  }
};

export const resendOTPService = async (email, firstName) => {
  try {
    const res = await axiosInstance.post("/auth/resend-otp", {
      email: email.trim().toLowerCase(),
      firstName: firstName?.trim()
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (err) {
    console.error("Resend OTP error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to resend OTP");
  }
};

export const loginService = async (email, password) => {
  try {
    const res = await axiosInstance.post("/auth/login", { email, password });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || "Login failed!";
    throw new Error(message);
  }
}

// FIXED: fetchCurrentUser to properly extract user data
export const fetchCurrentUser = async () => {
  try {
    console.log('🔍 Fetching current user profile...');
    const res = await axiosInstance.get("/owner/profile");
    
    console.log('✅ Profile API response:', {
      success: res.data.success,
      hasData: !!res.data.data,
      gymName: res.data.data?.gymDetails?.gymName,
      isOnboardingComplete: res.data.data?.gymDetails?.isOnboardingComplete
    });
    
    if (res.data.success && res.data.data) {
      // Return the structure expected by AuthStore
      return {
        success: true,
        user: res.data.data // Extract the actual user data
      };
    } else {
      throw new Error(res.data.message || 'Failed to fetch user profile');
    }
  } catch (err) {
    console.error('❌ fetchCurrentUser error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Failed to fetch current user");
  }
};

export const logoutService = async () => {
  try {
    const res = await axiosInstance.get("/auth/logout");
    return res.data; // { success, message }
  } catch (err) {
    throw err.response?.data?.message || "Logout failed!";
  }
};

// Forgot Password API
export const forgotPasswordAPI = async (email) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', {
      email
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Network error occurred' 
    };
  }
};

// Reset Password API
export const resetPasswordAPI = async (token, newPassword, confirmPassword) => {
  try {
    const response = await axiosInstance.post(`/auth/reset-password/${token}`, {
      newPassword,
      confirmPassword
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Network error occurred' 
    };
  }
};

// authService.js में add करें:
