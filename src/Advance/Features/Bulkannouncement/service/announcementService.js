// announcementService.js
import axiosInstance from "../../../../axios.config";

const API_TIMEOUT = 30000; // 30 seconds timeout

const ANNOUNCEMENT_BASE_URL = "/announcement";

// Send an announcement
export const sendAnnouncementService = async (announcementData) => {
  try {
    const res = await axiosInstance.post(
      `${ANNOUNCEMENT_BASE_URL}/send`,
      announcementData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Send announcement error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please check your internet connection and try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to send announcement");
  }
};

// Get all announcements for owner
export const getAllAnnouncementsService = async (page = 1, limit = 10) => {
  try {
    const res = await axiosInstance.get(
      `${ANNOUNCEMENT_BASE_URL}/all?page=${page}&limit=${limit}`,
      {
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Fetch all announcements error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to fetch announcements");
  }
};

// Get single announcement by ID
export const getAnnouncementByIdService = async (announcementId) => {
  try {
    const res = await axiosInstance.get(
      `${ANNOUNCEMENT_BASE_URL}/${announcementId}`,
      {
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Fetch announcement by ID error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to fetch announcement");
  }
};

// Get announcement statistics
export const getAnnouncementStatsService = async (announcementId) => {
  try {
    const res = await axiosInstance.get(
      `${ANNOUNCEMENT_BASE_URL}/${announcementId}/stats`,
      {
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Fetch announcement stats error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to fetch announcement stats");
  }
};

// Delete announcement
export const deleteAnnouncementService = async (announcementId) => {
  try {
    const res = await axiosInstance.delete(
      `${ANNOUNCEMENT_BASE_URL}/${announcementId}`,
      {
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Delete announcement error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to delete announcement");
  }
};

// Update announcement
export const updateAnnouncementService = async (announcementId, updateData) => {
  try {
    const res = await axiosInstance.put(
      `${ANNOUNCEMENT_BASE_URL}/${announcementId}`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Update announcement error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to update announcement");
  }
};

// Preview announcement message
export const previewAnnouncementMessageService = async (previewData) => {
  try {
    const res = await axiosInstance.post(
      `${ANNOUNCEMENT_BASE_URL}/preview`,
      previewData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: API_TIMEOUT,
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Preview announcement message error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!err.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(err.response?.data?.message || "Failed to preview announcement message");
  }
};