// src/utils/planUtils.js

// Plan feature mapping (matches your backend)
const PLAN_FEATURES = {
  NONE: {
    memberLimit: 0,
    statusFiltering: false,
    dueMembers: false,
    whatsappNotifications: false,
    advancedAnalytics: false,
    inactiveAlerts: false,
    multiLocation: false,
    automatedReports: false
  },
  BASIC: {
    memberLimit: 150,
    statusFiltering: false,
    dueMembers: true,
    whatsappNotifications: false,
    advancedAnalytics: false,
    inactiveAlerts: false,
    multiLocation: false,
    automatedReports: false
  },
  ADVANCED: {
    memberLimit: 400,
    statusFiltering: true,
    dueMembers: true,
    whatsappNotifications: true,
    advancedAnalytics: true,
    inactiveAlerts: true,
    multiLocation: false,
    automatedReports: false
  },
  ENTERPRISE: {
    memberLimit: Infinity,
    statusFiltering: true,
    dueMembers: true,
    whatsappNotifications: true,
    advancedAnalytics: true,
    inactiveAlerts: true,
    multiLocation: true,
    automatedReports: true
  }
};


// Check if user has access to a specific feature
export const hasFeatureAccess = (userPlan, featureName) => {
  const plan = PLAN_FEATURES[userPlan] || PLAN_FEATURES.NONE;
  return plan[featureName] || false;
};

// API calls for subscription
export const subscriptionAPI = {
  // Check if user can add members
  checkUsageLimit: async (action, count = 1) => {
    try {
      const response = await fetch('/api/subscription/check-limit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, count })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to check usage limit:', error);
      return { success: false, error: error.message };
    }
  }
};