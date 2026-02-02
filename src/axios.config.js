// axios.config.js - PRODUCTION READY VERSION
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.fittracker.in/api/v1",
  withCredentials: true,
  timeout: 60000, // ✅ Increased to 60 seconds for email operations
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// const axiosInstance = axios.create({
//   baseURL:
//     import.meta.env.MODE === "development"
//       ? "http://localhost:4000/api/v1"  
//       : "https://api.fittracker.in/api/v1",
//   withCredentials: true,
//   timeout: 60000, // ✅ Increased to 60 seconds for email operations
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// ========================================
// REQUEST INTERCEPTOR
// ========================================
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method.toUpperCase()} ${config.url}`);

    // Add timestamp to prevent caching issues
    config.params = {
      ...config.params,
      _t: Date.now(),
    };

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ========================================
// RESPONSE INTERCEPTOR
// ========================================
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, {
      status: response.status,
      success: response.data?.success,
    });
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.code === "ECONNABORTED") {
      console.error("❌ Request Timeout:", error.config?.url);
      error.message =
        "Request timeout. Please check your internet connection and try again.";
    } else if (error.code === "ERR_NETWORK") {
      console.error("❌ Network Error:", error.config?.url);
      error.message = "Network error. Please check your internet connection.";
    } else if (error.response) {
      // Server responded with error
      console.error(`❌ API Error: ${error.config?.url}`, {
        status: error.response.status,
        message: error.response.data?.message,
      });

      // Handle specific status codes
      if (error.response.status === 401) {
        console.log("🔐 Unauthorized - Redirecting to login");
        // Clear any stored tokens
        localStorage.removeItem("token");
        // You can dispatch a logout action here if needed
      } else if (error.response.status === 500) {
        error.message = "Server error. Please try again later.";
      }
    } else {
      console.error("❌ Unknown Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
