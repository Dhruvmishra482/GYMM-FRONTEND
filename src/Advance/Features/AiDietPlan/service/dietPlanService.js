// src/Advance/Features/AiDietPlan/Service/dietPlanService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const dietPlanService = {
  // Create new diet plan
  createDietPlan: async (data) => {
    try {
      const response = await api.post('/diet-plan/create', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all diet plans
  getAllDietPlans: async (params = {}) => {
    try {
      const { status, page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (status && status !== 'All') {
        queryParams.append('status', status);
      }
      
      const response = await api.get(`/diet-plan/all?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single diet plan by ID
  getDietPlanById: async (planId) => {
    try {
      const response = await api.get(`/diet-plan/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update diet plan
  updateDietPlan: async (planId, data) => {
    try {
      const response = await api.put(`/diet-plan/${planId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete diet plan
  deleteDietPlan: async (planId) => {
    try {
      const response = await api.delete(`/diet-plan/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Broadcast diet plan to members
  broadcastDietPlan: async (planId, filters = {}) => {
    try {
      const response = await api.post(`/diet-plan/${planId}/broadcast`, filters);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get diet plan statistics
  getDietPlanStats: async (planId) => {
    try {
      const response = await api.get(`/diet-plan/${planId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Preview diet plan message
  previewDietPlanMessage: async (planId) => {
    try {
      const response = await api.get(`/diet-plan/${planId}/preview`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default dietPlanService;