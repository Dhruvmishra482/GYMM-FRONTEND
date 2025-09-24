
import axiosInstance from "../../../../axios.config";

// Get slot booking page data (JWT protected)
export const getSlotBookingPage = async (token) => {
  try {
    const res = await axiosInstance.get("/slots/book", {
      params: { token }
    });
    return res.data;
  } catch (err) {
    console.error("Slot booking page fetch error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to load booking page");
  }
};

// Book a slot (JWT protected)
export const bookSlot = async (bookingData) => {
  try {
    const res = await axiosInstance.post("/slots/book", bookingData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (err) {
    console.error("Slot booking error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to book slot");
  }
};

// Cancel slot booking (JWT protected)
export const cancelSlotBooking = async (bookingId, token) => {
  try {
    const res = await axiosInstance.delete(`/slots/book/${bookingId}`, {
      params: { token }
    });
    return res.data;
  } catch (err) {
    console.error("Slot cancellation error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to cancel booking");
  }
};

// Get slot availability for specific date (public)
export const getSlotAvailability = async (ownerId, date) => {
  try {
    const res = await axiosInstance.get(`/slots/availability/${ownerId}/${date}`);
    return res.data;
  } catch (err) {
    console.error("Slot availability fetch error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to fetch slot availability");
  }
};

// Get member booking history (JWT protected)
export const getMemberBookingHistory = async (memberId, params = {}) => {
  try {
    const res = await axiosInstance.get(`/slots/member/${memberId}/history`, { params });
    return res.data;
  } catch (err) {
    console.error("Booking history fetch error:", err.response?.data);
    throw new Error(err.response?.data?.message || "Failed to fetch booking history");
  }
};