import React, { useState, useMemo, useCallback } from 'react';
import SlotGrid from './SlotGrid';
import StatisticsPanel from './StatisticsPanel';
import CapacityControls from './CapacityControl';

// Custom animation hook
const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// Memoized Loading Spinner Component
const LoadingSpinner = React.memo(() => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading crowd dashboard...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Memoized Error Display Component
const ErrorDisplay = React.memo(({ error, onRetry }) => {
  const handleRetry = useCallback(() => {
    onRetry();
  }, [onRetry]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="text-red-600 text-xl mb-4">Failed to load dashboard</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  );
});

ErrorDisplay.displayName = 'ErrorDisplay';

// Memoized Header Component
const DashboardHeader = React.memo(({ 
  gymName, 
  subscriptionPlan, 
  selectedDate, 
  onDateChange, 
  onRefresh, 
  onSettings, 
  loading,
  today,
  maxDateStr
}) => {
  const isVisible = useFadeIn(0);

  return (
    <div className={`bg-white shadow-sm border-b transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Crowd Management Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              {gymName} • {subscriptionPlan} Plan
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Date Picker */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={onDateChange}
                min={today}
                max={maxDateStr}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors duration-200"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>

            {/* Settings Button */}
            <button
              onClick={onSettings}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm transition-colors duration-200"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

// Memoized Action Buttons Component
const ActionButtons = React.memo(({ onManualBooking, onExport }) => {
  return (
    <div className="mb-6 flex space-x-4">
      <button
        onClick={onManualBooking}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm transition-colors duration-200"
      >
        Manual Booking
      </button>
      
      <button
        onClick={onExport}
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm transition-colors duration-200"
      >
        Export Data
      </button>
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';

// Memoized Error Banner Component
const ErrorBanner = React.memo(({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 animate-fadeIn">
      <p className="text-red-800 text-sm">{error}</p>
    </div>
  );
});

ErrorBanner.displayName = 'ErrorBanner';

// Memoized Manual Booking Modal Component
const ManualBookingModal = React.memo(({ onClose }) => {
  const isVisible = useFadeIn(10);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-all duration-300 ${
        isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg p-6 w-96 transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <h3 className="text-lg font-semibold mb-4">Manual Booking</h3>
        <p className="text-gray-600 mb-4">
          Manual booking functionality will be implemented in the next component.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

ManualBookingModal.displayName = 'ManualBookingModal';

const CrowdDashboardUI = ({
  dashboardData,
  loading,
  error,
  onDateChange,
  onRefresh,
  onCapacityUpdate,
  onExportData,
  capacityUpdateLoading,
  gymName,
  subscriptionPlan
}) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);

  // Memoize date calculations
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const maxDateStr = useMemo(() => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7); // Allow 7 days in future
    return maxDate.toISOString().split('T')[0];
  }, []);

  // Memoize slots data
  const slots = useMemo(() => dashboardData?.slots || [], [dashboardData?.slots]);

  // useCallback for event handlers
  const handleDateChange = useCallback((e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    onDateChange(newDate);
  }, [onDateChange]);

  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const handleOpenCapacityModal = useCallback(() => {
    setShowCapacityModal(true);
  }, []);

  const handleCloseCapacityModal = useCallback(() => {
    setShowCapacityModal(false);
  }, []);

  const handleOpenManualBookingModal = useCallback(() => {
    setShowManualBookingModal(true);
  }, []);

  const handleCloseManualBookingModal = useCallback(() => {
    setShowManualBookingModal(false);
  }, []);

  const handleExportData = useCallback(() => {
    onExportData({ date: selectedDate });
  }, [onExportData, selectedDate]);

  const handleSlotClick = useCallback((slot) => {
    console.log('Slot clicked:', slot);
  }, []);

  // Early returns for loading and error states
  if (loading && !dashboardData) {
    return <LoadingSpinner />;
  }

  if (error && !dashboardData) {
    return <ErrorDisplay error={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader
        gymName={gymName}
        subscriptionPlan={subscriptionPlan}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onRefresh={handleRefresh}
        onSettings={handleOpenCapacityModal}
        loading={loading}
        today={today}
        maxDateStr={maxDateStr}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Statistics Panel */}
        <div className="mb-6">
          <StatisticsPanel
            statistics={dashboardData?.statistics}
            lastUpdated={dashboardData?.lastUpdated}
            loading={loading}
          />
        </div>

        {/* Action Buttons */}
        <ActionButtons
          onManualBooking={handleOpenManualBookingModal}
          onExport={handleExportData}
        />

        {/* Error Display */}
        <ErrorBanner error={error} />

        {/* Slot Grid */}
        <SlotGrid
          slots={slots}
          onSlotClick={handleSlotClick}
          loading={loading}
        />
      </div>

      {/* Capacity Controls Modal */}
      {showCapacityModal && (
        <CapacityControls
          currentSettings={dashboardData?.settings}
          onClose={handleCloseCapacityModal}
          onSave={onCapacityUpdate}
          loading={capacityUpdateLoading}
        />
      )}

      {/* Manual Booking Modal */}
      {showManualBookingModal && (
        <ManualBookingModal onClose={handleCloseManualBookingModal} />
      )}
    </div>
  );
};

export default React.memo(CrowdDashboardUI);