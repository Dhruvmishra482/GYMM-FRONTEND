// src/Advance/Features/BulkAnnouncement/Service/announcementService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Send announcement to all members
export const sendAnnouncement = async (announcementData) => {
  return apiCall('/api/v1/announcement/send', {
    method: 'POST',
    body: JSON.stringify(announcementData),
  });
};

// Get all announcements
export const getAllAnnouncements = async (page = 1, limit = 10) => {
  return apiCall(`/api/v1/announcement/all?page=${page}&limit=${limit}`);
};

// Get single announcement by ID
export const getAnnouncementById = async (announcementId) => {
  return apiCall(`/api/v1/announcement/${announcementId}`);
};

// Get announcement statistics
export const getAnnouncementStats = async (announcementId) => {
  return apiCall(`/api/v1/announcement/${announcementId}/stats`);
};

// Delete announcement
export const deleteAnnouncement = async (announcementId) => {
  return apiCall(`/api/v1/announcement/${announcementId}`, {
    method: 'DELETE',
  });
};

// Preview announcement message
export const previewAnnouncementMessage = async (title, message, priority) => {
  return apiCall('/api/v1/announcement/preview', {
    method: 'POST',
    body: JSON.stringify({ title, message, priority }),
  });
};