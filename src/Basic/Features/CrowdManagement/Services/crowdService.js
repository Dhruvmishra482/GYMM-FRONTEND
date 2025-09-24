
import axiosInstance from "../../../../axios.config";

// Get crowd management dashboard data
export const getCrowdDashboard = async (date = null) => {
  try {
    const params = date ? { date } : {};
    const res = await axiosInstance.get("/slots/crowd-dashboard", { params });
    return res.data;
  } catch (err) {
    console.error("Crowd dashboard fetch error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to fetch crowd dashboard");
  }
};

// Update slot capacity settings
export const updateSlotCapacity = async (capacityData) => {
  try {
    const res = await axiosInstance.patch("/slots/settings/capacity", capacityData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (err) {
    console.error("Capacity update error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to update slot capacity");
  }
};

// Manual booking for walk-ins (owner only)
export const manualBookSlot = async (bookingData) => {
  try {
    const res = await axiosInstance.post("/slots/manual-book", bookingData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (err) {
    console.error("Manual booking error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to book slot manually");
  }
};

// Get slot statistics
export const getSlotStatistics = async (params = {}) => {
  try {
    const res = await axiosInstance.get("/slots/statistics", { params });
    return res.data;
  } catch (err) {
    console.error("Statistics fetch error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to fetch statistics");
  }
};

// Export slot data
export const exportSlotData = async (params = {}) => {
  try {
    const res = await axiosInstance.get("/slots/export", { 
      params: { format: 'csv', ...params },
      responseType: 'blob'
    });
    return res.data;
  } catch (err) {
    console.error("Export error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to export data");
  }
};

// Get all bookings for debugging
export const getAllBookings = async (params = {}) => {
  try {
    const res = await axiosInstance.get("/slots/all-bookings", { params });
    return res.data;
  } catch (err) {
    console.error("All bookings fetch error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to fetch all bookings");
  }
};