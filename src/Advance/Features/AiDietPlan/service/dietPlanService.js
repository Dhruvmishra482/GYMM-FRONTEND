// dietPlanService.js
import axiosInstance from "../../../../axios.config";

const API_TIMEOUT = 30000; // 30 seconds timeout

const DIET_BASE_URL = "/diet-plan";

// Create a new diet plan
export const createDietPlanService = async (planData) => {
  try {
    const res = await axiosInstance.post(
      `${DIET_BASE_URL}/create`,
      planData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Create diet plan error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please check your internet connection and try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to create diet plan");
  }
};

// Get all diet plans for owner
export const getAllDietPlansService = async (page = 1, limit = 10) => {
  try {
    const res = await axiosInstance.get(
      `${DIET_BASE_URL}/all?page=${page}&limit=${limit}`,
      {
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Fetch all diet plans error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to fetch diet plans");
  }
};

// Get single diet plan by ID
export const getDietPlanByIdService = async (planId) => {
  try {
    const res = await axiosInstance.get(
      `${DIET_BASE_URL}/${planId}`,
      {
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Fetch diet plan by ID error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to fetch diet plan");
  }
};

// Update diet plan
export const updateDietPlanService = async (planId, planData) => {
  try {
    const res = await axiosInstance.put(
      `${DIET_BASE_URL}/${planId}`,
      planData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Update diet plan error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to update diet plan");
  }
};

// Delete diet plan
export const deleteDietPlanService = async (planId) => {
  try {
    const res = await axiosInstance.delete(
      `${DIET_BASE_URL}/${planId}`,
      {
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Delete diet plan error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to delete diet plan");
  }
};

// Broadcast diet plan to members
export const broadcastDietPlanService = async (planId, filterData) => {
  try {
    const res = await axiosInstance.post(
      `${DIET_BASE_URL}/${planId}/broadcast`,
      filterData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Broadcast diet plan error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to broadcast diet plan");
  }
};

// Get diet plan statistics
export const getDietPlanStatsService = async (planId) => {
  try {
    const res = await axiosInstance.get(
      `${DIET_BASE_URL}/${planId}/stats`,
      {
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Fetch diet plan stats error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to fetch diet plan stats");
  }
};

// Preview diet plan message
export const previewDietPlanMessageService = async (planId) => {
  try {
    const res = await axiosInstance.get(
      `${DIET_BASE_URL}/${planId}/preview`,
      {
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Preview diet plan message error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to preview diet plan message");
  }
};

// Default export mapping to match store usage
export default {
  createDietPlan: createDietPlanService,
  getAllDietPlans: getAllDietPlansService,
  getDietPlanById: getDietPlanByIdService,
  updateDietPlan: updateDietPlanService,
  deleteDietPlan: deleteDietPlanService,
  broadcastDietPlan: broadcastDietPlanService,
  getDietPlanStats: getDietPlanStatsService,
  previewDietPlanMessage: previewDietPlanMessageService,
};
