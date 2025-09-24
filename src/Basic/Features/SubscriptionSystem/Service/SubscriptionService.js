// services/subscriptionService.js
import axiosInstance from "../../../../axios.config";

// Get comprehensive subscription details with usage analytics
export const getSubscriptionDetails = async () => {
  try {
    const response = await axiosInstance.get("/subscription/details");
    return response.data;
  } catch (error) {
    console.error("Get subscription details error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to fetch subscription details");
  }
};

// Get plan comparison with current usage context
export const getPlanComparison = async () => {
  try {
    const response = await axiosInstance.get("/subscription/plans");
    return response.data;
  } catch (error) {
    console.error("Get plan comparison error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to fetch plan comparison");
  }
};

// Calculate prorated upgrade pricing
export const calculateUpgradePrice = async (targetPlan, billing = "monthly") => {
  try {
    const response = await axiosInstance.post("/subscription/calculate-upgrade", {
      targetPlan,
      billing
    });
    return response.data;
  } catch (error) {
    console.error("Calculate upgrade price error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to calculate upgrade price");
  }
};

// Process subscription upgrade
export const processUpgrade = async (targetPlan, billing, paymentId, orderId) => {
  try {
    const response = await axiosInstance.post("/subscription/upgrade", {
      targetPlan,
      billing,
      paymentId,
      orderId
    });
    return response.data;
  } catch (error) {
    console.error("Process upgrade error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to process upgrade");
  }
};

// Get usage analytics for dashboard
export const getUsageAnalytics = async () => {
  try {
    const response = await axiosInstance.get("/subscription/analytics");
    return response.data;
  } catch (error) {
    console.error("Get usage analytics error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to fetch usage analytics");
  }
};

// Check usage limits before performing actions
export const checkUsageLimit = async (action, count = 1) => {
  try {
    const response = await axiosInstance.post("/subscription/check-limit", {
      action,
      count
    });
    return response.data;
  } catch (error) {
    console.error("Check usage limit error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to check usage limit");
  }
};

// Track feature usage
export const trackFeatureUsage = async (feature) => {
  try {
    const response = await axiosInstance.post("/subscription/track-usage", {
      feature
    });
    return response.data;
  } catch (error) {
    console.error("Track feature usage error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to track feature usage");
  }
};

// Update notification preferences
export const updateNotificationSettings = async (expiryReminders) => {
  try {
    const response = await axiosInstance.put("/subscription/notifications", {
      expiryReminders
    });
    return response.data;
  } catch (error) {
    console.error("Update notification settings error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to update notification settings");
  }
};