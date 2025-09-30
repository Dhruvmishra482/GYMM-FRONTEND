import React, { useMemo, useCallback, useEffect, useState } from 'react';

// Custom animation hook
const useModalAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return isVisible;
};

// Memoized Warning Message Component
const WarningMessage = React.memo(({ warning, getWarningColors }) => {
  return (
    <div className={`rounded-lg border p-3 mb-4 transition-all duration-300 ${getWarningColors(warning.type)}`}>
      <div className="flex items-start space-x-2">
        <span className="text-lg">{warning.icon}</span>
        <div className="flex-1">
          <h5 className="font-medium">{warning.title}</h5>
          <p className="text-sm mt-1">{warning.message}</p>
        </div>
      </div>
    </div>
  );
});

WarningMessage.displayName = 'WarningMessage';

// Memoized Slot Details Component
const SlotDetails = React.memo(({ slot, isUpdate, currentBooking }) => {
  return (
    <div className="mb-4">
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">{slot.color}</div>
        <h4 className="text-xl font-bold text-gray-900">
          {slot.slotTime}
        </h4>
        <p className="text-sm text-gray-600">
          {new Date().toLocaleDateString()} • Workout Time
        </p>
      </div>

      {/* Current vs New Booking */}
      {isUpdate && currentBooking && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 animate-fadeIn">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current:</span>
            <span className="font-medium">{currentBooking.slotTime}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">New:</span>
            <span className="font-medium text-blue-600">{slot.slotTime}</span>
          </div>
        </div>
      )}
    </div>
  );
});

SlotDetails.displayName = 'SlotDetails';

// Memoized Capacity Info Component
const CapacityInfo = React.memo(({ slot }) => {
  return (
    <div className="text-sm text-gray-600 space-y-1">
      <div className="flex justify-between">
        <span>Capacity:</span>
        <span>{slot.currentBookings}/{slot.maxCapacity}</span>
      </div>
      <div className="flex justify-between">
        <span>Status:</span>
        <span className="capitalize">{slot.status.toLowerCase().replace('_', ' ')}</span>
      </div>
      {slot.availableSpots > 0 && (
        <div className="flex justify-between">
          <span>Spots remaining:</span>
          <span>{slot.availableSpots}</span>
        </div>
      )}
    </div>
  );
});

CapacityInfo.displayName = 'CapacityInfo';

// Memoized Loading Spinner Component
const LoadingSpinner = React.memo(() => (
  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

const BookingConfirmation = ({
  slot,
  currentBooking,
  memberName,
  onConfirm,
  onCancel,
  loading
}) => {
  const isVisible = useModalAnimation();
  
  // Memoize isUpdate calculation
  const isUpdate = useMemo(() => Boolean(currentBooking), [currentBooking]);
  
  // Memoize warning message calculation
  const warning = useMemo(() => {
    if (slot.percentage > 100) {
      return {
        type: 'error',
        title: 'OVERCROWDED SLOT',
        message: `This slot will have ${slot.currentBookings} members (${slot.overflowCount} over the ${slot.maxCapacity} limit). The gym will be very crowded.`,
        icon: '🚨'
      };
    }
    
    if (slot.percentage >= 90) {
      return {
        type: 'warning',
        title: 'ALMOST FULL',
        message: `This slot will be very busy with ${slot.currentBookings}/${slot.maxCapacity} members.`,
        icon: '⚠️'
      };
    }
    
    if (slot.percentage >= 75) {
      return {
        type: 'info',
        title: 'GETTING BUSY',
        message: `This slot will be moderately busy with ${slot.currentBookings}/${slot.maxCapacity} members.`,
        icon: 'ℹ️'
      };
    }
    
    return {
      type: 'success',
      title: 'GOOD AVAILABILITY',
      message: `This slot has good availability with ${slot.currentBookings}/${slot.maxCapacity} members.`,
      icon: '✅'
    };
  }, [slot.percentage, slot.currentBookings, slot.maxCapacity, slot.overflowCount]);
  
  // Memoize warning colors function
  const getWarningColors = useCallback((type) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  }, []);

  // Memoize button styling
  const confirmButtonClass = useMemo(() => {
    return `flex-1 px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 transition-all duration-200 ${
      warning.type === 'error' 
        ? 'bg-red-600 hover:bg-red-700' 
        : 'bg-blue-600 hover:bg-blue-700'
    }`;
  }, [warning.type]);

  // Memoize button text
  const confirmButtonText = useMemo(() => {
    if (loading) {
      return isUpdate ? 'Updating...' : 'Booking...';
    }
    return isUpdate ? 'Update Slot' : 'Confirm Booking';
  }, [loading, isUpdate]);

  // useCallback for event handlers
  const handleConfirm = useCallback(() => {
    if (!loading) {
      onConfirm();
    }
  }, [loading, onConfirm]);

  const handleCancel = useCallback(() => {
    if (!loading) {
      onCancel();
    }
  }, [loading, onCancel]);

  // Memoize current date
  const currentDate = useMemo(() => new Date().toLocaleDateString(), []);

  return (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-all duration-300 ${
        isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
      onClick={handleCancel}
    >
      <div 
        className={`bg-white rounded-lg w-full max-w-md transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isUpdate ? 'Update Booking' : 'Confirm Booking'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {memberName}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Slot Details */}
          <SlotDetails 
            slot={slot} 
            isUpdate={isUpdate} 
            currentBooking={currentBooking}
          />

          {/* Capacity Warning */}
          <WarningMessage 
            warning={warning} 
            getWarningColors={getWarningColors}
          />

          {/* Additional Info */}
          <CapacityInfo slot={slot} />

          {/* Terms */}
          <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded p-2">
            <p>
              By confirming, you agree to arrive at your selected time. 
              You can modify your booking until 30 minutes before the slot starts.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex space-x-3">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={confirmButtonClass}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner />
                {confirmButtonText}
              </div>
            ) : (
              confirmButtonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BookingConfirmation);