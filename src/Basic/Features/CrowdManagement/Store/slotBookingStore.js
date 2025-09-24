import { create } from "zustand";
import { getSlotBookingPage,bookSlot,cancelSlotBooking } from "../Services/slotBookingService";


export const useSlotBookingStore = create((set, get) => ({
  // Page data
  bookingPageData: null,
  loading: false,
  error: null,
  
  // Token and member info
  token: null,
  memberInfo: null,
  gymInfo: null,
  
  // Booking state
  bookingLoading: false,
  bookingError: null,
  bookingSuccess: false,
  
  // Cancellation state
  cancellationLoading: false,
  cancellationError: null,
  
  // Selected slot
  selectedSlot: null,
  
  // Available slots
  availableSlots: [],

  // Load booking page data
  loadBookingPage: async (token) => {
    set({ loading: true, error: null, token });
    
    try {
      const response = await getSlotBookingPage(token);
      
      if (response.success) {
        set({
          bookingPageData: response.data,
          memberInfo: response.data.member,
          gymInfo: response.data.gym,
          availableSlots: response.data.slots || [],
          loading: false,
          error: null
        });
        return response.data;
      } else {
        set({
          loading: false,
          error: response.message || "Failed to load booking page"
        });
        return null;
      }
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Failed to load booking page"
      });
      return null;
    }
  },

  // Book a slot
  bookSlotTime: async (slotTime) => {
    const { token } = get();
    
    set({ bookingLoading: true, bookingError: null, bookingSuccess: false });
    
    try {
      const response = await bookSlot({
        token,
        slotTime
      });
      
      if (response.success) {
        set({
          bookingLoading: false,
          bookingSuccess: true,
          bookingError: null,
          selectedSlot: slotTime
        });
        
        // Refresh booking page data to get updated info
        await get().loadBookingPage(token);
        
        return response;
      } else {
        set({
          bookingLoading: false,
          bookingError: response.message || "Failed to book slot",
          bookingSuccess: false
        });
        return null;
      }
    } catch (error) {
      set({
        bookingLoading: false,
        bookingError: error.message || "Failed to book slot",
        bookingSuccess: false
      });
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const { token } = get();
    
    set({ cancellationLoading: true, cancellationError: null });
    
    try {
      const response = await cancelSlotBooking(bookingId, token);
      
      if (response.success) {
        set({
          cancellationLoading: false,
          cancellationError: null,
          selectedSlot: null
        });
        
        // Refresh booking page data
        await get().loadBookingPage(token);
        
        return response;
      } else {
        set({
          cancellationLoading: false,
          cancellationError: response.message || "Failed to cancel booking"
        });
        return null;
      }
    } catch (error) {
      set({
        cancellationLoading: false,
        cancellationError: error.message || "Failed to cancel booking"
      });
      throw error;
    }
  },

  // Set selected slot
  setSelectedSlot: (slotTime) => {
    set({ selectedSlot: slotTime });
  },

  // Clear booking success state
  clearBookingSuccess: () => {
    set({ bookingSuccess: false });
  },

  // Clear errors
  clearErrors: () => {
    set({
      error: null,
      bookingError: null,
      cancellationError: null
    });
  },

  // Reset store
  resetStore: () => {
    set({
      bookingPageData: null,
      loading: false,
      error: null,
      token: null,
      memberInfo: null,
      gymInfo: null,
      bookingLoading: false,
      bookingError: null,
      bookingSuccess: false,
      cancellationLoading: false,
      cancellationError: null,
      selectedSlot: null,
      availableSlots: []
    });
  },

  // Get slot by time
  getSlotByTime: (slotTime) => {
    const { availableSlots } = get();
    return availableSlots.find(slot => slot.slotTime === slotTime);
  },

  // Check if slot is available
  isSlotAvailable: (slotTime) => {
    const slot = get().getSlotByTime(slotTime);
    return slot?.isAvailable || false;
  },

  // Get current booking info
  getCurrentBooking: () => {
    const { bookingPageData } = get();
    return bookingPageData?.booking?.currentBooking || null;
  },

  // Check if member has booking today
  hasBookingToday: () => {
    return get().getCurrentBooking() !== null;
  }
}));