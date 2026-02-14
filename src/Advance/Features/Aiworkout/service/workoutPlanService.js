// src/Advance/Features/AiWorkoutPlan/Service/workoutPlanService.js
import axiosInstance from "../../../../axios.config";

const workoutPlanService = {
  // Create new workout plan
  createWorkoutPlan: async (data) => {
    try {
      const response = await axiosInstance.post('/workout-plan/create', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all workout plans
  getAllWorkoutPlans: async (params = {}) => {
    try {
      const { status, page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (status && status !== 'All') {
        queryParams.append('status', status);
      }
      
      const response = await axiosInstance.get(`/workout-plan/all?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single workout plan by ID
  getWorkoutPlanById: async (planId) => {
    try {
      const response = await axiosInstance.get(`/workout-plan/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update workout plan
  updateWorkoutPlan: async (planId, data) => {
    try {
      const response = await axiosInstance.put(`/workout-plan/${planId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete workout plan
  deleteWorkoutPlan: async (planId) => {
    try {
      const response = await axiosInstance.delete(`/workout-plan/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Broadcast workout plan to members
  broadcastWorkoutPlan: async (planId, filters = {}) => {
    try {
      const response = await axiosInstance.post(`/workout-plan/${planId}/broadcast`, filters);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get workout plan statistics
  getWorkoutPlanStats: async (planId) => {
    try {
      const response = await axiosInstance.get(`/workout-plan/${planId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Preview workout plan message
  previewWorkoutPlanMessage: async (planId) => {
    try {
      const response = await axiosInstance.get(`/workout-plan/${planId}/preview`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default workoutPlanService;