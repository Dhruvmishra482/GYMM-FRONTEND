// src/Advance/Features/AiDietPlan/Store/useDietPlanStore.js
import { create } from 'zustand';
import dietPlanService from "../service/dietPlanService"
import toast from 'react-hot-toast';

const useDietPlanStore = create((set, get) => ({
  // State
  dietPlans: [],
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

  // Fetch all diet plans
  fetchDietPlans: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const { filters, pagination } = get();
      
      const queryParams = {
        status: params.status || filters.status,
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
      };

      const response = await dietPlanService.getAllDietPlans(queryParams);
      
      set({
        dietPlans: response.data || [],
        pagination: response.pagination || pagination,
        loading: false,
      });

      return response;
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch diet plans';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Fetch single diet plan
  fetchDietPlanById: async (planId) => {
    try {
      set({ loading: true, error: null });
      const response = await dietPlanService.getDietPlanById(planId);
      
      set({
        currentPlan: response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch diet plan';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Create new diet plan
  createDietPlan: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await dietPlanService.createDietPlan(data);
      
      // Add new plan to the list
      set((state) => ({
        dietPlans: [response.data, ...state.dietPlans],
        loading: false,
      }));

      toast.success('Diet plan created successfully!');
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to create diet plan';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Update diet plan
  updateDietPlan: async (planId, data) => {
    try {
      set({ loading: true, error: null });
      const response = await dietPlanService.updateDietPlan(planId, data);
      
      // Update in the list
      set((state) => ({
        dietPlans: state.dietPlans.map((plan) =>
          plan._id === planId ? response.data : plan
        ),
        currentPlan: state.currentPlan?._id === planId ? response.data : state.currentPlan,
        loading: false,
      }));

      toast.success('Diet plan updated successfully!');
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to update diet plan';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Delete diet plan
  deleteDietPlan: async (planId) => {
    try {
      set({ loading: true, error: null });
      await dietPlanService.deleteDietPlan(planId);
      
      // Remove from list
      set((state) => ({
        dietPlans: state.dietPlans.filter((plan) => plan._id !== planId),
        currentPlan: state.currentPlan?._id === planId ? null : state.currentPlan,
        loading: false,
      }));

      toast.success('Diet plan deleted successfully!');
    } catch (error) {
      const errorMsg = error.message || 'Failed to delete diet plan';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Broadcast diet plan
  broadcastDietPlan: async (planId, filters = {}) => {
    try {
      set({ loading: true, error: null });
      const response = await dietPlanService.broadcastDietPlan(planId, filters);
      
      // Update the plan's broadcast details
      set((state) => ({
        dietPlans: state.dietPlans.map((plan) =>
          plan._id === planId
            ? { ...plan, status: 'Active', broadcastDetails: response.data }
            : plan
        ),
        loading: false,
      }));

      toast.success(`Diet plan sent to ${response.data.successfulDeliveries} members!`);
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to broadcast diet plan';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Get diet plan stats
  getDietPlanStats: async (planId) => {
    try {
      const response = await dietPlanService.getDietPlanStats(planId);
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch stats';
      toast.error(errorMsg);
      throw error;
    }
  },

  // Preview diet plan message
  previewDietPlanMessage: async (planId) => {
    try {
      const response = await dietPlanService.previewDietPlanMessage(planId);
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
    get().fetchDietPlans({ page });
  },

  // Reset current plan
  resetCurrentPlan: () => set({ currentPlan: null }),

  // Reset store
  reset: () =>
    set({
      dietPlans: [],
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

export default useDietPlanStore;