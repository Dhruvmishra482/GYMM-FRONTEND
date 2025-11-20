// authService.js - PRODUCTION READY VERSION
import axiosInstance from "../../axios.config";

// ========================================
// REQUEST TIMEOUT CONFIGURATION
// ========================================
const API_TIMEOUT = 30000; // 30 seconds timeout for production

// ========================================
// SIGNUP SERVICE
// ========================================
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

    console.log("🔄 Sending signup request...");

    const res = await axiosInstance.post("/auth/signup", cleanedData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: API_TIMEOUT,
    });

    console.log("✅ Signup successful:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Signup error:", err.response?.data || err.message);

    // Handle timeout
    if (err.code === "ECONNABORTED") {
      throw new Error(
        "Request timeout. Please check your internet connection and try again."
      );
    }

    // Handle network errors
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw new Error(err.response?.data?.message || "Signup failed");
  }
};

// ========================================
// VERIFY OTP SERVICE
// ========================================
export const verifyOTPService = async (otpData) => {
  try {
    console.log("🔄 Verifying OTP...");

    const res = await axiosInstance.post("/auth/verify-otp", otpData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: API_TIMEOUT,
    });

    console.log("✅ OTP verified successfully");
    return res.data;
  } catch (err) {
    console.error(
      "❌ OTP verification error:",
      err.response?.data || err.message
    );

    // Handle timeout
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    // Handle network errors
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw new Error(err.response?.data?.message || "OTP verification failed");
  }
};

// ========================================
// RESEND OTP SERVICE
// ========================================
export const resendOTPService = async (email, firstName) => {
  try {
    console.log("🔄 Resending OTP...");

    const res = await axiosInstance.post(
      "/auth/resend-otp",
      {
        email: email.trim().toLowerCase(),
        firstName: firstName?.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: API_TIMEOUT,
      }
    );

    console.log("✅ OTP resent successfully");
    return res.data;
  } catch (err) {
    console.error("❌ Resend OTP error:", err.response?.data || err.message);

    // Handle timeout
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    // Handle network errors
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw new Error(err.response?.data?.message || "Failed to resend OTP");
  }
};

// ========================================
// LOGIN SERVICE
// ========================================
export const loginService = async (email, password) => {
  try {
    console.log("🔄 Logging in...");

    const res = await axiosInstance.post(
      "/auth/login",
      {
        email: email.trim().toLowerCase(),
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: API_TIMEOUT,
      }
    );

    console.log("✅ Login successful");
    return res.data;
  } catch (err) {
    console.error("❌ Login error:", err.response?.data || err.message);

    // Handle timeout
    if (err.code === "ECONNABORTED") {
      throw new Error(
        "Request timeout. Please check your internet connection and try again."
      );
    }

    // Handle network errors
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }

    const message = err.response?.data?.message || "Login failed!";
    throw new Error(message);
  }
};

// ========================================
// FETCH CURRENT USER
// ========================================
export const fetchCurrentUser = async () => {
  try {
    console.log("🔍 Fetching current user profile...");

    const res = await axiosInstance.get("/owner/profile", {
      timeout: API_TIMEOUT,
    });

    console.log("✅ Profile API response:", {
      success: res.data.success,
      hasData: !!res.data.data,
      gymName: res.data.data?.gymDetails?.gymName,
      isOnboardingComplete: res.data.data?.gymDetails?.isOnboardingComplete,
    });

    if (res.data.success && res.data.data) {
      // Return the structure expected by AuthStore
      return {
        success: true,
        user: res.data.data, // Extract the actual user data
      };
    } else {
      throw new Error(res.data.message || "Failed to fetch user profile");
    }
  } catch (err) {
    console.error(
      "❌ fetchCurrentUser error:",
      err.response?.data || err.message
    );

    // Handle timeout
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    // Handle network errors
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw new Error(
      err.response?.data?.message || "Failed to fetch current user"
    );
  }
};

// ========================================
// LOGOUT SERVICE
// ========================================
export const logoutService = async () => {
  try {
    console.log("🔄 Logging out...");

    const res = await axiosInstance.get("/auth/logout", {
      timeout: API_TIMEOUT,
    });

    console.log("✅ Logout successful");
    return res.data; // { success, message }
  } catch (err) {
    console.error("❌ Logout error:", err.response?.data || err.message);

    // Handle timeout
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    // Handle network errors
    if (!err.response) {
      throw new Error("Network error occurred");
    }

    throw new Error(err.response?.data?.message || "Logout failed!");
  }
};

// ========================================
// FORGOT PASSWORD API
// ========================================
export const forgotPasswordAPI = async (email) => {
  try {
    console.log("🔄 Sending password reset email...");

    const response = await axiosInstance.post(
      "/auth/forgot-password",
      {
        email: email.trim().toLowerCase(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: API_TIMEOUT,
      }
    );

    console.log("✅ Password reset email sent");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Forgot password error:",
      error.response?.data || error.message
    );

    // Handle timeout
    if (error.code === "ECONNABORTED") {
      throw {
        success: false,
        message: "Request timeout. Please try again.",
      };
    }

    // Handle network errors
    if (!error.response) {
      throw {
        success: false,
        message: "Network error. Please check your internet connection.",
      };
    }

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to send reset email",
      }
    );
  }
};

// ========================================
// RESET PASSWORD API
// ========================================
export const resetPasswordAPI = async (token, newPassword, confirmPassword) => {
  try {
    console.log("🔄 Resetting password...");

    const response = await axiosInstance.post(
      `/auth/reset-password/${token}`,
      {
        newPassword,
        confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: API_TIMEOUT,
      }
    );

    console.log("✅ Password reset successful");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Reset password error:",
      error.response?.data || error.message
    );

    // Handle timeout
    if (error.code === "ECONNABORTED") {
      throw {
        success: false,
        message: "Request timeout. Please try again.",
      };
    }

    // Handle network errors
    if (!error.response) {
      throw {
        success: false,
        message: "Network error. Please check your internet connection.",
      };
    }

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to reset password",
      }
    );
  }
};
