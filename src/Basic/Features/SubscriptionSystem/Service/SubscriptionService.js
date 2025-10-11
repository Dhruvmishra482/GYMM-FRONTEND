// services/subscriptionService.js
import axiosInstance from "../../../../axios.config";

// Get comprehensive subscription details with usage analytics
export const getSubscriptionDetails = async () => {
  try {
    const response = await axiosInstance.get("/subscription/details");
    return response.data;
  } catch (error) {
    console.error("Get subscription details error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to fetch subscription details"
    );
  }
};

// Get plan comparison with current usage context
export const getPlanComparison = async () => {
  try {
    const response = await axiosInstance.get("/subscription/plans");
    return response.data;
  } catch (error) {
    console.error("Get plan comparison error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to fetch plan comparison"
    );
  }
};

// Calculate prorated upgrade pricing
export const calculateUpgradePrice = async (
  targetPlan,
  billing = "monthly"
) => {
  try {
    const response = await axiosInstance.post(
      "/subscription/calculate-upgrade",
      {
        targetPlan,
        billing,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Calculate upgrade price error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to calculate upgrade price"
    );
  }
};

// Process subscription upgrade
export const processUpgrade = async (
  targetPlan,
  billing,
  paymentId,
  orderId
) => {
  try {
    const response = await axiosInstance.post("/subscription/upgrade", {
      targetPlan,
      billing,
      paymentId,
      orderId,
    });
    return response.data;
  } catch (error) {
    console.error("Process upgrade error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to process upgrade"
    );
  }
};

// Get usage analytics for dashboard
export const getUsageAnalytics = async () => {
  try {
    const response = await axiosInstance.get("/subscription/analytics");
    return response.data;
  } catch (error) {
    console.error("Get usage analytics error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to fetch usage analytics"
    );
  }
};

// Check usage limits before performing actions
export const checkUsageLimit = async (action, count = 1) => {
  try {
    const response = await axiosInstance.post("/subscription/check-limit", {
      action,
      count,
    });
    return response.data;
  } catch (error) {
    console.error("Check usage limit error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to check usage limit"
    );
  }
};

// Track feature usage
export const trackFeatureUsage = async (feature) => {
  try {
    const response = await axiosInstance.post("/subscription/track-usage", {
      feature,
    });
    return response.data;
  } catch (error) {
    console.error("Track feature usage error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to track feature usage"
    );
  }
};

// Update notification preferences
export const updateNotificationSettings = async (expiryReminders) => {
  try {
    const response = await axiosInstance.put("/subscription/notifications", {
      expiryReminders,
    });
    return response.data;
  } catch (error) {
    console.error("Update notification settings error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to update notification settings"
    );
  }
};

/*  const allPlans = [
      {
        id: "BASIC",
        name: "Basic",
        tagline: "Start Your Gym Journey",
        description:
          "Perfect for small gyms and personal trainers looking to digitize operations.",
        prices: {
          monthly: 399,
          quarterly: 1097,
          halfYearly: 2095,
          yearly: 3990,
        },
        savings: {
          quarterly: "Save ₹100",
          halfYearly: "Save ₹299",
          yearly: "Save ₹798",
        },
        features: [
          { name: "Up to 150 members", included: true },
          { name: "Member dashboard & profiles", included: true },
          // { name: "Attendance tracking", included: true },
          { name: "Due notifications", included: true },
          { name: "Basic fee tracking", included: true },
          { name: "Emergency contacts", included: true },
          { name: "Basic analytics", included: true },
          { name: "Data backup & security", included: true },
          { name: "24/7 support", included: true },
        ],
        buttonText: "Start Your Journey",
        popular: false,
        current: currentPlan?.id === "BASIC",
      },
      {
        id: "ADVANCED",
        name: "Advanced",
        tagline: "Scale Your Fitness Business",
        description:
          "Growing gyms with automation, smart reminders, and advanced analytics.",
        prices: {
          monthly: 699,
          quarterly: 1897,
          halfYearly: 3595,
          yearly: 6990,
        },
        savings: {
          quarterly: "Save ₹200",
          halfYearly: "Save ₹599",
          yearly: "Save ₹1398",
        },
        features: [
          { name: "Up to 400 members", included: true },
          { name: "All Basic features", included: true },
          { name: "WhatsApp notifications", included: true },
          { name: "Predictive fee tracking", included: true },
          { name: "Inactive member alerts", included: true },
          { name: "Advanced analytics", included: true },
          { name: "AI Diet Plans", included: true },
          { name: "AI workout recommendations", included: true },
          { name: "Bulk messaging", included: true },
          { name: "Equipment reminders", included: true },
          { name: "Priority support", included: true },
        ],
        buttonText: "Unleash Your Potential",
        popular: true,
        current: currentPlan?.id === "ADVANCED",
      },
      {
        id: "ENTERPRISE",
        name: "Enterprise",
        tagline: "For Fitness Empires",
        description:
          "Most powerful tools for multiple gyms and maximum member engagement.",
        prices: {
          monthly: 999,
          quarterly: 2697,
          halfYearly: 5095,
          yearly: 9990,
        },
        savings: {
          quarterly: "Save ₹300",
          halfYearly: "Save ₹899",
          yearly: "Save ₹1998",
        },
        features: [
          { name: "Unlimited members", included: true },
          { name: "All Advanced features", included: true },
          { name: "Multiple branches", included: true },
          { name: "Daily WhatsApp reports", included: true },
          { name: "Smart reminders + QR", included: true },
          { name: "AI crowd prediction", included: true },
          { name: "Birthday alerts", included: true },
          { name: "Advanced AI workouts", included: true },
          { name: "Nutrition tracking", included: true },
          { name: "Re-activation campaigns", included: true },
          { name: "Expense tracking", included: true },
          { name: "Class scheduling", included: true },
          { name: "Success manager", included: true },
          { name: "Early access features", included: true },
        ],
        buttonText: "Claim Your Throne",
        popular: false,
        current: currentPlan?.id === "ENTERPRISE",
      },
    ]; */
