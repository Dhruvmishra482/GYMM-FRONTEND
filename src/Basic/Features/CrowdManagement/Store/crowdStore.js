import { create } from "zustand";
import { getCrowdDashboard,updateSlotCapacity,manualBookSlot } from "../Services/crowdService";

export const useCrowdStore = create((set, get) => ({
  // Dashboard data
  dashboardData: null,
  loading: false,
  error: null,
  lastUpdated: null,
  
  // Auto-refresh settings
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  refreshTimer: null,
  
  // Capacity update state
  capacityUpdateLoading: false,
  capacityUpdateError: null,
  
  // Manual booking state
  manualBookingLoading: false,
  manualBookingError: null,
  
  // Selected date for dashboard
  selectedDate: null,

  // Fetch crowd dashboard data
  fetchCrowdDashboard: async (date = null, showLoading = true) => {
    if (showLoading) {
      set({ loading: true, error: null });
    }
    
    try {
      const response = await getCrowdDashboard(date);
      
      if (response.success) {
        set({
          dashboardData: response.data,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
          selectedDate: date
        });
        return response.data;
      } else {
        set({
          loading: false,
          error: response.message || "Failed to fetch dashboard data"
        });
        return null;
      }
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Failed to fetch dashboard data"
      });
      return null;
    }
  },

  // Update slot capacity
  updateCapacity: async (capacityData) => {
    set({ capacityUpdateLoading: true, capacityUpdateError: null });
    
    try {
      const response = await updateSlotCapacity(capacityData);
      
      if (response.success) {
        set({ capacityUpdateLoading: false });
        
        // Refresh dashboard data after capacity update
        await get().fetchCrowdDashboard(get().selectedDate, false);
        
        return response;
      } else {
        set({
          capacityUpdateLoading: false,
          capacityUpdateError: response.message || "Failed to update capacity"
        });
        return null;
      }
    } catch (error) {
      set({
        capacityUpdateLoading: false,
        capacityUpdateError: error.message || "Failed to update capacity"
      });
      throw error;
    }
  },

  // Manual slot booking
  bookSlotManually: async (bookingData) => {
    set({ manualBookingLoading: true, manualBookingError: null });
    
    try {
      const response = await manualBookSlot(bookingData);
      
      if (response.success) {
        set({ manualBookingLoading: false });
        
        // Refresh dashboard data after booking
        await get().fetchCrowdDashboard(get().selectedDate, false);
        
        return response;
      } else {
        set({
          manualBookingLoading: false,
          manualBookingError: response.message || "Failed to book slot"
        });
        return null;
      }
    } catch (error) {
      set({
        manualBookingLoading: false,
        manualBookingError: error.message || "Failed to book slot"
      });
      throw error;
    }
  },

  // Start auto-refresh
  startAutoRefresh: () => {
    const { autoRefresh, refreshInterval } = get();
    
    if (!autoRefresh) return;
    
    // Clear existing timer
    get().stopAutoRefresh();
    
    const timer = setInterval(() => {
      const { selectedDate } = get();
      get().fetchCrowdDashboard(selectedDate, false);
    }, refreshInterval);
    
    set({ refreshTimer: timer });
  },

  // Stop auto-refresh
  stopAutoRefresh: () => {
    const { refreshTimer } = get();
    if (refreshTimer) {
      clearInterval(refreshTimer);
      set({ refreshTimer: null });
    }
  },

  // Toggle auto-refresh
  toggleAutoRefresh: () => {
    const { autoRefresh } = get();
    set({ autoRefresh: !autoRefresh });
    
    if (!autoRefresh) {
      get().startAutoRefresh();
    } else {
      get().stopAutoRefresh();
    }
  },

  // Set refresh interval
  setRefreshInterval: (interval) => {
    set({ refreshInterval: interval });
    
    if (get().autoRefresh) {
      get().stopAutoRefresh();
      get().startAutoRefresh();
    }
  },

  // Clear errors
  clearErrors: () => {
    set({
      error: null,
      capacityUpdateError: null,
      manualBookingError: null
    });
  },

  // Reset store
  resetStore: () => {
    get().stopAutoRefresh();
    set({
      dashboardData: null,
      loading: false,
      error: null,
      lastUpdated: null,
      capacityUpdateLoading: false,
      capacityUpdateError: null,
      manualBookingLoading: false,
      manualBookingError: null,
      selectedDate: null,
      refreshTimer: null
    });
  },

  // Get formatted last updated time
  getLastUpdatedText: () => {
    const { lastUpdated } = get();
    if (!lastUpdated) return "Never";
    
    const now = Date.now();
    const diff = now - lastUpdated;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  }
}));