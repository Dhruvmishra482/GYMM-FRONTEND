// src/Advance/Features/AiWorkoutPlan/Service/workoutPlanService.js
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

const workoutPlanService = {
  // Create new workout plan
  createWorkoutPlan: async (data) => {
    try {
      const response = await api.post('/v1/workout-plan/create', data);
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
      
      const response = await api.get(`/v1/workout-plan/all?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single workout plan by ID
  getWorkoutPlanById: async (planId) => {
    try {
      const response = await api.get(`/v1/workout-plan/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update workout plan
  updateWorkoutPlan: async (planId, data) => {
    try {
      const response = await api.put(`/v1/workout-plan/${planId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete workout plan
  deleteWorkoutPlan: async (planId) => {
    try {
      const response = await api.delete(`/v1/workout-plan/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Broadcast workout plan to members
  broadcastWorkoutPlan: async (planId, filters = {}) => {
    try {
      const response = await api.post(`/v1/workout-plan/${planId}/broadcast`, filters);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get workout plan statistics
  getWorkoutPlanStats: async (planId) => {
    try {
      const response = await api.get(`/v1/workout-plan/${planId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Preview workout plan message
  previewWorkoutPlanMessage: async (planId) => {
    try {
      const response = await api.get(`/v1/workout-plan/${planId}/preview`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default workoutPlanService;