// src/Advance/Features/AiWorkoutPlan/Store/useWorkoutPlanStore.js
import { create } from 'zustand';
import workoutPlanService from '../service/workoutPlanService';
import toast from 'react-hot-toast';

const useWorkoutPlanStore = create((set, get) => ({
  // State
  workoutPlans: [],
  currentPlan: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  filters: {
    status: 'All',
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),

  // Fetch all workout plans
  fetchWorkoutPlans: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const { filters, pagination } = get();
      
      const queryParams = {
        status: params.status || filters.status,
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
      };

      const response = await workoutPlanService.getAllWorkoutPlans(queryParams);
      
      set({
        workoutPlans: response.data || [],
        pagination: response.pagination || pagination,
        loading: false,
      });

      return response;
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch workout plans';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Fetch single workout plan
  fetchWorkoutPlanById: async (planId) => {
    try {
      set({ loading: true, error: null });
      const response = await workoutPlanService.getWorkoutPlanById(planId);
      
      set({
        currentPlan: response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch workout plan';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Create new workout plan
  createWorkoutPlan: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await workoutPlanService.createWorkoutPlan(data);
      
      // Add new plan to the list
      set((state) => ({
        workoutPlans: [response.data, ...state.workoutPlans],
        loading: false,
      }));

      toast.success('Workout plan created successfully!');
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to create workout plan';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Update workout plan
  updateWorkoutPlan: async (planId, data) => {
    try {
      set({ loading: true, error: null });
      const response = await workoutPlanService.updateWorkoutPlan(planId, data);
      
      // Update in the list
      set((state) => ({
        workoutPlans: state.workoutPlans.map((plan) =>
          plan._id === planId ? response.data : plan
        ),
        currentPlan: state.currentPlan?._id === planId ? response.data : state.currentPlan,
        loading: false,
      }));

      toast.success('Workout plan updated successfully!');
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to update workout plan';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Delete workout plan
  deleteWorkoutPlan: async (planId) => {
    try {
      set({ loading: true, error: null });
      await workoutPlanService.deleteWorkoutPlan(planId);
      
      // Remove from list
      set((state) => ({
        workoutPlans: state.workoutPlans.filter((plan) => plan._id !== planId),
        currentPlan: state.currentPlan?._id === planId ? null : state.currentPlan,
        loading: false,
      }));

      toast.success('Workout plan deleted successfully!');
    } catch (error) {
      const errorMsg = error.message || 'Failed to delete workout plan';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Broadcast workout plan
  broadcastWorkoutPlan: async (planId, filters = {}) => {
    try {
      set({ loading: true, error: null });
      const response = await workoutPlanService.broadcastWorkoutPlan(planId, filters);
      
      // Update the plan's broadcast details
      set((state) => ({
        workoutPlans: state.workoutPlans.map((plan) =>
          plan._id === planId
            ? { ...plan, status: 'Active', broadcastDetails: response.data }
            : plan
        ),
        loading: false,
      }));

      toast.success(`Workout plan sent to ${response.data.successfulDeliveries} members!`);
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to broadcast workout plan';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Get workout plan stats
  getWorkoutPlanStats: async (planId) => {
    try {
      const response = await workoutPlanService.getWorkoutPlanStats(planId);
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch stats';
      toast.error(errorMsg);
      throw error;
    }
  },

  // Preview workout plan message
  previewWorkoutPlanMessage: async (planId) => {
    try {
      const response = await workoutPlanService.previewWorkoutPlanMessage(planId);
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to preview message';
      toast.error(errorMsg);
      throw error;
    }
  },

  // Change page
  changePage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
    get().fetchWorkoutPlans({ page });
  },

  // Reset current plan
  resetCurrentPlan: () => set({ currentPlan: null }),

  // Reset store
  reset: () =>
    set({
      workoutPlans: [],
      currentPlan: null,
      loading: false,
      error: null,
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      filters: {
        status: 'All',
      },
    }),
}));

export default useWorkoutPlanStore;