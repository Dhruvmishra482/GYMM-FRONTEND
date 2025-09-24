import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../Auth/Store/AuthStore';
import { useCrowdStore } from '../Store/crowdStore';
import CrowdDashboardUI from '../Ui/CrowdDashboardUi';
import { toast } from 'react-toastify';

const CrowdManagementPage = () => {
  const navigate = useNavigate();
  const { user, subscription, hasActiveSubscription } = useAuthStore();
  const {
    dashboardData,
    loading,
    error,
    fetchCrowdDashboard,
    updateCapacity,
    bookSlotManually,
    startAutoRefresh,
    stopAutoRefresh,
    clearErrors,
    resetStore,
    capacityUpdateLoading,
    manualBookingLoading,
    selectedDate
  } = useCrowdStore();

  const [planCheckComplete, setPlanCheckComplete] = useState(false);

  // Check subscription plan on mount
  useEffect(() => {
    const checkPlanAccess = () => {
      if (!user) {
        navigate('/login');
        return;
      }

      // Check if user has active subscription
      if (!hasActiveSubscription()) {
        toast.error('Active subscription required for crowd management features');
        navigate('/my-subscription');
        return;
      }

      // Check if plan is Advanced or Enterprise
      if (!subscription || !['ADVANCED', 'ENTERPRISE'].includes(subscription.plan)) {
        toast.error('Crowd Management is available for Advanced and Enterprise plans only');
        navigate('/pricing');
        return;
      }

      setPlanCheckComplete(true);
    };

    if (user && subscription !== null) {
      checkPlanAccess();
    }
  }, [user, subscription, hasActiveSubscription, navigate]);

  // Initial data fetch and auto-refresh setup
  useEffect(() => {
    if (planCheckComplete) {
      // Fetch initial data
      fetchCrowdDashboard();
      
      // Start auto-refresh
      startAutoRefresh();

      // Cleanup on unmount
      return () => {
        stopAutoRefresh();
        resetStore();
      };
    }
  }, [planCheckComplete, fetchCrowdDashboard, startAutoRefresh, stopAutoRefresh, resetStore]);

  // Handle date change
  const handleDateChange = async (date) => {
    clearErrors();
    await fetchCrowdDashboard(date);
  };

  // Handle manual refresh
  const handleManualRefresh = async () => {
    clearErrors();
    await fetchCrowdDashboard(selectedDate);
    toast.success('Dashboard refreshed');
  };

  // Handle capacity update
  const handleCapacityUpdate = async (capacityData) => {
    try {
      clearErrors();
      const result = await updateCapacity(capacityData);
      
      if (result) {
        toast.success('Capacity updated successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.message || 'Failed to update capacity');
      return false;
    }
  };

  // Handle manual booking
  const handleManualBooking = async (bookingData) => {
    try {
      clearErrors();
      const result = await bookSlotManually(bookingData);
      
      if (result) {
        toast.success(`Slot booked for ${bookingData.memberName || 'member'}`);
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.message || 'Failed to book slot');
      return false;
    }
  };

  // Handle export data
  const handleExportData = async (exportParams) => {
    try {
      // This will be implemented when we add export functionality
      toast.info('Export functionality will be available soon');
    } catch (error) {9
      toast.error('Failed to export data');
    }
  };

  // Show loading if plan check is not complete
  if (!planCheckComplete) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Verifying access...</div>
      </div>
    );
  }

  // Show error if plan check failed
  if (!user || !hasActiveSubscription() || !['ADVANCED', 'ENTERPRISE'].includes(subscription?.plan)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">Access denied. Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CrowdDashboardUI
        dashboardData={dashboardData}
        loading={loading}
        error={error}
        onDateChange={handleDateChange}
        onRefresh={handleManualRefresh}
        onCapacityUpdate={handleCapacityUpdate}
        onManualBooking={handleManualBooking}
        onExportData={handleExportData}
        capacityUpdateLoading={capacityUpdateLoading}
        manualBookingLoading={manualBookingLoading}
        gymName={user?.firstName ? `${user.firstName} ${user.lastName}` : 'Your Gym'}
        subscriptionPlan={subscription?.plan || 'UNKNOWN'}
      />
    </div>
  );
};

export default CrowdManagementPage;