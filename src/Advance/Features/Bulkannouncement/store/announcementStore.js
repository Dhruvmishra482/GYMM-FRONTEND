import { create } from "zustand";
import {
  sendAnnouncementService,
  getAllAnnouncementsService,
  getAnnouncementByIdService,
  getAnnouncementStatsService,
  deleteAnnouncementService,
  previewAnnouncementMessageService,
  updateAnnouncementService,
} from "../service/announcementService";
import { toast } from "react-hot-toast";

export const useAnnouncementStore = create((set, get) => ({
  announcements: [],
  currentAnnouncement: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  previewMessage: null,

  // Action to send an announcement
  sendAnnouncement: async (announcementData) => {
    set({ loading: true, error: null });
    try {
      const response = await sendAnnouncementService(announcementData);
      set((state) => ({
        loading: false,
        announcements: [response.data, ...state.announcements], // Assuming response contains the new announcement object
      }));
      toast.success(response.message || "Announcement sent successfully!");
      return response;
    } catch (err) {
      set({ loading: false, error: err.message });
      toast.error(err.message || "Failed to send announcement.");
      return { success: false, message: err.message };
    }
  },

  // Action to fetch all announcements
  getAllAnnouncements: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllAnnouncementsService(page, limit);
      set({
        loading: false,
        announcements: response.data,
        pagination: response.pagination,
      });
      return response;
    } catch (err) {
      set({ loading: false, error: err.message });
      toast.error(err.message || "Failed to fetch announcements.");
      return { success: false, message: err.message };
    }
  },

  // Action to fetch a single announcement by ID
  getAnnouncementById: async (announcementId) => {
    set({ loading: true, error: null, currentAnnouncement: null });
    try {
      const response = await getAnnouncementByIdService(announcementId);
      set({ loading: false, currentAnnouncement: response.data });
      return response;
    } catch (err) {
      set({ loading: false, error: err.message });
      toast.error(err.message || "Failed to fetch announcement details.");
      return { success: false, message: err.message };
    }
  },

  // Action to update an announcement
  updateAnnouncement: async (announcementId, updateData) => {
    set({ loading: true, error: null });
    try {
      const response = await updateAnnouncementService(announcementId, updateData);
      set((state) => ({
        loading: false,
        announcements: state.announcements.map((ann) =>
          ann._id === announcementId ? response.data : ann
        ),
        currentAnnouncement: response.data,
      }));
      toast.success(response.message || "Announcement updated successfully!");
      return response;
    } catch (err) {
      set({ loading: false, error: err.message });
      toast.error(err.message || "Failed to update announcement.");
      return { success: false, message: err.message };
    }
  },

  // Action to get announcement statistics
  getAnnouncementStats: async (announcementId) => {
    set({ loading: true, error: null });
    try {
      const response = await getAnnouncementStatsService(announcementId);
      set({ loading: false, currentAnnouncement: { ...get().currentAnnouncement, stats: response.data } });
      return response;
    } catch (err) {
      set({ loading: false, error: err.message });
      toast.error(err.message || "Failed to fetch announcement stats.");
      return { success: false, message: err.message };
    }
  },

  // Action to delete an announcement
  deleteAnnouncement: async (announcementId) => {
    set({ loading: true, error: null });
    try {
      const response = await deleteAnnouncementService(announcementId);
      set((state) => ({
        loading: false,
        announcements: state.announcements.filter(
          (ann) => ann._id !== announcementId
        ),
      }));
      toast.success(response.message || "Announcement deleted successfully!");
      return response;
    } catch (err) {
      set({ loading: false, error: err.message });
      toast.error(err.message || "Failed to delete announcement.");
      return { success: false, message: err.message };
    }
  },

  // Action to preview an announcement message
  previewAnnouncementMessage: async (previewData) => {
    set({ loading: true, error: null, previewMessage: null });
    try {
      const response = await previewAnnouncementMessageService(previewData);
      set({ loading: false, previewMessage: response.data });
      return response;
    } catch (err) {
      set({ loading: false, error: err.message });
      toast.error(err.message || "Failed to preview message.");
      return { success: false, message: err.message };
    }
  },

  // Clear error message
  clearError: () => set({ error: null }),
}));

