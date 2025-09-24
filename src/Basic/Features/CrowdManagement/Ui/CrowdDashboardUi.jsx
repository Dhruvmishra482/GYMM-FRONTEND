import React, { useState } from 'react';
import SlotGrid from './SlotGrid';
import StatisticsPanel from './StatisticsPanel';
import CapacityControls from './CapacityControl';

const CrowdDashboardUI = ({
  dashboardData,
  loading,
  error,
  onDateChange,
  onRefresh,
  onCapacityUpdate,
  // onManualBooking,
  onExportData,
  capacityUpdateLoading,
  // manualBookingLoading,
  gymName,
  subscriptionPlan
}) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);

  // Handle date selection
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  // Get today's date for date input restrictions
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7); // Allow 7 days in future
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading crowd dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Failed to load dashboard</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
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
                  onChange={handleDateChange}
                  min={today}
                  max={maxDateStr}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>

              {/* Settings Button */}
              <button
                onClick={() => setShowCapacityModal(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

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
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setShowManualBookingModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
          >
            Manual Booking
          </button>
          
          <button
            onClick={() => onExportData({ date: selectedDate })}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm"
          >
            Export Data
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Slot Grid */}
        <SlotGrid
          slots={dashboardData?.slots || []}
          onSlotClick={(slot) => console.log('Slot clicked:', slot)}
          loading={loading}
        />
      </div>

      {/* Capacity Controls Modal */}
      {showCapacityModal && (
        <CapacityControls
          currentSettings={dashboardData?.settings}
          onClose={() => setShowCapacityModal(false)}
          onSave={onCapacityUpdate}
          loading={capacityUpdateLoading}
        />
      )}

      {/* Manual Booking Modal - Placeholder */}
      {showManualBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Manual Booking</h3>
            <p className="text-gray-600 mb-4">
              Manual booking functionality will be implemented in the next component.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowManualBookingModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrowdDashboardUI;