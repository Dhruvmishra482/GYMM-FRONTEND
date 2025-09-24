import { create } from "zustand";
import { loginService,fetchCurrentUser,logoutService,forgotPasswordAPI,resetPasswordAPI } from "../Service/authService";
import { getSubscriptionStatus } from "../../Basic/Features/PaaymentSystem/Service/paymentService";
import { cookieUtils } from "../../utils/cookieUtils";

const AUTH_COOKIE_NAME = 'user_data';
const IS_AUTHENTICATED_COOKIE = 'is_authenticated';
const SUBSCRIPTION_COOKIE_NAME = 'subscription_data';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  isInitialized: false,
  
  // Subscription state
  subscription: null,
  subscriptionLoading: false,
  subscriptionError: null,
  subscriptionLastUpdated: null,

  // Helper method
  hasActiveSubscription: () => {
    const { subscription } = get();
    return subscription?.isActive && subscription?.plan !== "NONE";
  },

  // Helper method to check if user needs onboarding
  needsOnboarding: () => {
    const { user } = get();
    return !user?.gymDetails?.isOnboardingComplete;
  },

  // Initialize method
  initializeAuth: () => {
    const userData = cookieUtils.getJSON(AUTH_COOKIE_NAME);
    const isAuthenticated = cookieUtils.get(IS_AUTHENTICATED_COOKIE) === 'true';
    const subscriptionData = cookieUtils.getJSON(SUBSCRIPTION_COOKIE_NAME);
    
    if (userData && isAuthenticated) {
      set({ 
        user: userData, 
        subscription: subscriptionData,
        subscriptionLastUpdated: subscriptionData ? Date.now() : null,
        isInitialized: true,
        loading: false 
      });
    } else {
      cookieUtils.remove(AUTH_COOKIE_NAME);
      cookieUtils.remove(IS_AUTHENTICATED_COOKIE);
      cookieUtils.remove(SUBSCRIPTION_COOKIE_NAME);
      
      set({ 
        user: null, 
        subscription: null,
        isInitialized: true,
        loading: false 
      });
    }
  },

  // Subscription fetch method
  fetchSubscriptionStatus: async (force = false) => {
    const { subscription, subscriptionLastUpdated, subscriptionLoading } = get();
    
    if (subscriptionLoading) return subscription;
    
    const cacheAge = subscriptionLastUpdated ? Date.now() - subscriptionLastUpdated : Infinity;
    if (!force && subscription && cacheAge < 5 * 60 * 1000) {
      return subscription;
    }

    set({ subscriptionLoading: true, subscriptionError: null });
    
    try {
      const response = await getSubscriptionStatus();
      
      if (response.success && response.data?.subscription) {
        const subscriptionData = response.data.subscription;
        
        const cookieOptions = {
          days: 1,
          secure: window.location.protocol === 'https:',
          sameSite: 'Lax'
        };
        cookieUtils.setJSON(SUBSCRIPTION_COOKIE_NAME, subscriptionData, cookieOptions);
        
        set({ 
          subscription: subscriptionData,
          subscriptionLoading: false,
          subscriptionError: null,
          subscriptionLastUpdated: Date.now()
        });
        
        return subscriptionData;
      } else {
        const noSubData = { isActive: false, plan: "NONE", needsSubscription: true };
        
        set({ 
          subscription: noSubData,
          subscriptionLoading: false,
          subscriptionError: response.message || null,
          subscriptionLastUpdated: Date.now()
        });
        
        cookieUtils.remove(SUBSCRIPTION_COOKIE_NAME);
        return noSubData;
      }
    } catch (error) {
      console.error("Subscription fetch error:", error);
      
      const noSubData = { isActive: false, plan: "NONE", needsSubscription: true };
      
      set({ 
        subscription: noSubData,
        subscriptionLoading: false,
        subscriptionError: error.message,
        subscriptionLastUpdated: Date.now()
      });
      
      cookieUtils.remove(SUBSCRIPTION_COOKIE_NAME);
      return noSubData;
    }
  },

  // Refresh subscription
  refreshSubscription: async () => {
    return get().fetchSubscriptionStatus(true);
  },

  // Login method - UPDATED to ensure gym details are included
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginService(email, password);
      const user = data.user || null;
      
      if (user) {
        // Ensure user object includes gym details structure
        if (!user.gymDetails) {
          user.gymDetails = {
            gymName: null,
            gymLogo: null,
            isOnboardingComplete: false,
            onboardingCompletedAt: null
          };
        }
        
        const cookieOptions = {
          days: 7,
          secure: window.location.protocol === 'https:',
          sameSite: 'Lax'
        };
        
        cookieUtils.setJSON(AUTH_COOKIE_NAME, user, cookieOptions);
        cookieUtils.set(IS_AUTHENTICATED_COOKIE, 'true', cookieOptions);
        
        set({ 
          user,
          loading: false,
          isInitialized: true 
        });

        get().fetchSubscriptionStatus();
      }
      
      return true;
    } catch (err) {
      cookieUtils.remove(AUTH_COOKIE_NAME);
      cookieUtils.remove(IS_AUTHENTICATED_COOKIE);
      cookieUtils.remove(SUBSCRIPTION_COOKIE_NAME);
      
      set({ 
        error: err?.message || "Login failed", 
        loading: false,
        user: null,
        subscription: null
      });
      return false;
    }
  },

  // Other methods
  logout: async () => {
    set({ loading: true });
    try {
      await logoutService();
    } catch (err) {
      console.log("Logout error:", err);
    }
    
    cookieUtils.remove(AUTH_COOKIE_NAME);
    cookieUtils.remove(IS_AUTHENTICATED_COOKIE);
    cookieUtils.remove(SUBSCRIPTION_COOKIE_NAME);
    
    set({ 
      user: null, 
      subscription: null,
      loading: false,
      error: null,
      isInitialized: true
    });
  },

  setUser: (user) => {
    if (user) {
      // Ensure gym details are present
      if (!user.gymDetails) {
        user.gymDetails = {
          gymName: null,
          gymLogo: null,
          isOnboardingComplete: false,
          onboardingCompletedAt: null
        };
      }
      
      const cookieOptions = {
        days: 7,
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax'
      };
      
      cookieUtils.setJSON(AUTH_COOKIE_NAME, user, cookieOptions);
      cookieUtils.set(IS_AUTHENTICATED_COOKIE, 'true', cookieOptions);
    }
    set({ user, isInitialized: true });
  },

  // Check auth method - UPDATED to ensure gym details
  checkAuth: async () => {
    const currentState = get();
    
    if (currentState.user && currentState.isInitialized) {
      return;
    }

    const isAuthenticated = cookieUtils.get(IS_AUTHENTICATED_COOKIE) === 'true';
    if (!isAuthenticated) {
      set({ 
        user: null,
        subscription: null,
        loading: false,
        isInitialized: true 
      });
      return;
    }

    set({ loading: true });
    try {
      const data = await fetchCurrentUser();
      const user = data.user || null;
      
      if (user) {
        // Ensure gym details are present
        if (!user.gymDetails) {
          user.gymDetails = {
            gymName: null,
            gymLogo: null,
            isOnboardingComplete: false,
            onboardingCompletedAt: null
          };
        }
        
        const cookieOptions = {
          days: 7,
          secure: window.location.protocol === 'https:',
          sameSite: 'Lax'
        };
        
        cookieUtils.setJSON(AUTH_COOKIE_NAME, user, cookieOptions);
        cookieUtils.set(IS_AUTHENTICATED_COOKIE, 'true', cookieOptions);
        
        set({ 
          user,
          loading: false,
          isInitialized: true,
          error: null
        });

        get().fetchSubscriptionStatus();
      } else {
        cookieUtils.remove(AUTH_COOKIE_NAME);
        cookieUtils.remove(IS_AUTHENTICATED_COOKIE);
        cookieUtils.remove(SUBSCRIPTION_COOKIE_NAME);
        
        set({ 
          user: null,
          subscription: null,
          loading: false,
          isInitialized: true,
          error: null
        });
      }
    } catch (error) {
      cookieUtils.remove(AUTH_COOKIE_NAME);
      cookieUtils.remove(IS_AUTHENTICATED_COOKIE);
      cookieUtils.remove(SUBSCRIPTION_COOKIE_NAME);
      
      set({ 
        user: null,
        subscription: null,
        loading: false,
        isInitialized: true,
        error: null
      });
    }
  },

  // UPDATED: Refresh user method with gym details handling
// In AuthStore
// Enhanced refreshUser method in AuthStore with detailed debugging
refreshUser: async () => {
  console.log('🔄 Starting refreshUser...');
  
  if (!cookieUtils.exists(IS_AUTHENTICATED_COOKIE)) {
    console.log('❌ No auth cookie found');
    return;
  }

  try {
    console.log('📡 Calling fetchCurrentUser API...');
    const data = await fetchCurrentUser();
    
    console.log('✅ fetchCurrentUser response:', data);
    
    if (data.success && data.user) {
      const user = data.user;
      
      console.log('👤 User data received:', {
        firstName: user.firstName,
        lastName: user.lastName,
        gymDetails: user.gymDetails
      });
      
      // Ensure gym details structure
      if (!user.gymDetails) {
        console.log('⚠️ No gymDetails found, creating default structure');
        user.gymDetails = {
          gymName: null,
          gymLogo: null,
          isOnboardingComplete: false,
          onboardingCompletedAt: null
        };
      }
      
      const cookieOptions = {
        days: 7,
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax'
      };
      
      console.log('💾 Saving user to cookies...');
      cookieUtils.setJSON(AUTH_COOKIE_NAME, user, cookieOptions);
      
      console.log('🔄 Updating AuthStore state...');
      const currentState = get();
      set({ 
        user,
        error: null
      });
      
      // Verify the update worked
      const newState = get();
      console.log('✅ AuthStore updated:', {
        oldGymName: currentState.user?.gymDetails?.gymName,
        newGymName: newState.user?.gymDetails?.gymName,
        isOnboardingComplete: newState.user?.gymDetails?.isOnboardingComplete
      });
      
      // Also refresh subscription
      get().refreshSubscription();
      
      return user;
    } else {
      console.log('❌ Invalid response from fetchCurrentUser:', data);
    }
  } catch (error) {
    console.error("❌ Failed to refresh user data:", error);
  }
},

  // NEW: Method to update gym details after onboarding
  updateGymDetails: (gymDetails) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = {
      ...user,
      gymDetails: {
        ...user.gymDetails,
        ...gymDetails
      }
    };

    const cookieOptions = {
      days: 7,
      secure: window.location.protocol === 'https:',
      sameSite: 'Lax'
    };
    
    cookieUtils.setJSON(AUTH_COOKIE_NAME, updatedUser, cookieOptions);
    set({ user: updatedUser });
    
    console.log('Gym details updated:', updatedUser.gymDetails);
  },

  clearAuth: () => {
    cookieUtils.remove(AUTH_COOKIE_NAME);
    cookieUtils.remove(IS_AUTHENTICATED_COOKIE);
    cookieUtils.remove(SUBSCRIPTION_COOKIE_NAME);
    
    set({ 
      user: null, 
      subscription: null,
      loading: false, 
      error: null,
      isInitialized: false
    });
  }
}));

export const usePasswordResetStore = create((set, get) => ({
  isLoading: false,
  error: null,
  success: false,
  message: '',
  
  resetState: () => {
    set({
      isLoading: false,
      error: null,
      success: false,
      message: ''
    });
  },

  forgotPassword: async (email) => {
    set({ 
      isLoading: true, 
      error: null, 
      success: false, 
      message: '' 
    });
    
    try {
      const response = await forgotPasswordAPI(email);
      
      if (response.success) {
        set({
          isLoading: false,
          success: true,
          message: response.message || 'Reset link sent to your email',
          error: null
        });
        return { success: true, message: response.message };
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to send reset link',
          success: false,
          message: ''
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Something went wrong. Please try again.';
      set({
        isLoading: false,
        error: errorMessage,
        success: false,
        message: ''
      });
      return { success: false, message: errorMessage };
    }
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    set({ 
      isLoading: true, 
      error: null, 
      success: false, 
      message: '' 
    });
    
    try {
      const response = await resetPasswordAPI(token, newPassword, confirmPassword);
      
      if (response.success) {
        set({
          isLoading: false,
          success: true,
          message: response.message || 'Password reset successfully',
          error: null
        });
        return { success: true, message: response.message };
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to reset password',
          success: false,
          message: ''
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Something went wrong. Please try again.';
      set({
        isLoading: false,
        error: errorMessage,
        success: false,
        message: ''
      });
      return { success: false, message: errorMessage };
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearSuccess: () => {
    set({ success: false, message: '' });
  }
}));