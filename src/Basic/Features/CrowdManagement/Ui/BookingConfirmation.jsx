import React, { useMemo, useCallback, useEffect, useState, lazy, Suspense } from 'react';

// ==================== CUSTOM HOOKS ====================

// Custom animation hook with cleanup
const useModalAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return isVisible;
};

// Custom hook for click outside
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    // Use passive event listeners for better scroll performance
    document.addEventListener('mousedown', listener, { passive: true });
    document.addEventListener('touchstart', listener, { passive: true });

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// ==================== MEMOIZED COMPONENTS ====================

// Memoized Warning Message Component
const WarningMessage = React.memo(({ warning, getWarningColors }) => {
  return (
    <div className={`rounded-lg border p-3 mb-4 transition-all duration-300 ${getWarningColors(warning.type)}`}>
      <div className="flex items-start space-x-2">
        <span className="text-lg" role="img" aria-label={warning.title}>
          {warning.icon}
        </span>
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
const SlotDetails = React.memo(({ slot, isUpdate, currentBooking, currentDate }) => {
  return (
    <div className="mb-4">
      <div className="text-center mb-4">
        <div className="text-3xl mb-2" role="img" aria-label="Slot indicator">
          {slot.color}
        </div>
        <h4 className="text-xl font-bold text-gray-900">
          {slot.slotTime}
        </h4>
        <p className="text-sm text-gray-600">
          {currentDate} • Workout Time
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
}, (prevProps, nextProps) => {
  // Custom comparison function for deeper optimization
  return (
    prevProps.slot.slotTime === nextProps.slot.slotTime &&
    prevProps.slot.color === nextProps.slot.color &&
    prevProps.isUpdate === nextProps.isUpdate &&
    prevProps.currentDate === nextProps.currentDate &&
    prevProps.currentBooking?.slotTime === nextProps.currentBooking?.slotTime
  );
});

SlotDetails.displayName = 'SlotDetails';

// Memoized Capacity Info Component
const CapacityInfo = React.memo(({ slot }) => {
  // Memoize status text transformation
  const statusText = useMemo(() => 
    slot.status.toLowerCase().replace('_', ' '),
    [slot.status]
  );

  return (
    <div className="text-sm text-gray-600 space-y-1">
      <div className="flex justify-between">
        <span>Capacity:</span>
        <span className="font-medium">
          {slot.currentBookings}/{slot.maxCapacity}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Status:</span>
        <span className="capitalize font-medium">{statusText}</span>
      </div>
      {slot.availableSpots > 0 && (
        <div className="flex justify-between">
          <span>Spots remaining:</span>
          <span className="font-medium text-green-600">{slot.availableSpots}</span>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Deep comparison for slot properties
  return (
    prevProps.slot.currentBookings === nextProps.slot.currentBookings &&
    prevProps.slot.maxCapacity === nextProps.slot.maxCapacity &&
    prevProps.slot.status === nextProps.slot.status &&
    prevProps.slot.availableSpots === nextProps.slot.availableSpots
  );
});

CapacityInfo.displayName = 'CapacityInfo';

// Memoized Loading Spinner Component
const LoadingSpinner = React.memo(() => (
  <div 
    className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
    role="status"
    aria-label="Loading"
  />
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Memoized Terms Component
const TermsAndConditions = React.memo(() => (
  <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded p-2">
    <p>
      By confirming, you agree to arrive at your selected time. 
      You can modify your booking until 30 minutes before the slot starts.
    </p>
  </div>
));

TermsAndConditions.displayName = 'TermsAndConditions';

// ==================== MAIN COMPONENT ====================

const BookingConfirmation = ({
  slot,
  currentBooking,
  memberName,
  onConfirm,
  onCancel,
  loading
}) => {
  const isVisible = useModalAnimation();
  const modalRef = React.useRef(null);
  
  // Memoize isUpdate calculation
  const isUpdate = useMemo(() => Boolean(currentBooking), [currentBooking]);
  
  // Memoize current date (calculate once)
  const currentDate = useMemo(() => new Date().toLocaleDateString(), []);
  
  // Memoize warning message calculation with proper dependencies
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
  
  // Memoize warning colors function (stable reference)
  const getWarningColors = useCallback((type) => {
    const colorMap = {
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      success: 'bg-green-50 border-green-200 text-green-800'
    };
    return colorMap[type] || colorMap.success;
  }, []);

  // Memoize button styling
  const confirmButtonClass = useMemo(() => {
    const baseClass = 'flex-1 px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 transition-all duration-200';
    const colorClass = warning.type === 'error' 
      ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' 
      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800';
    
    return `${baseClass} ${colorClass}`;
  }, [warning.type]);

  // Memoize button text
  const confirmButtonText = useMemo(() => {
    if (loading) {
      return isUpdate ? 'Updating...' : 'Booking...';
    }
    return isUpdate ? 'Update Slot' : 'Confirm Booking';
  }, [loading, isUpdate]);

  // Memoize cancel button class
  const cancelButtonClass = useMemo(() => 
    'flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 transition-colors duration-200',
    []
  );

  // Optimized event handlers with useCallback
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

  // Throttled backdrop click handler
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  }, [handleCancel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Keyboard event handler (ESC to close)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !loading) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleCancel, loading]);

  // Memoize backdrop class
  const backdropClass = useMemo(() => 
    `fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-all duration-300 ${
      isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
    }`,
    [isVisible]
  );

  // Memoize modal class
  const modalClass = useMemo(() => 
    `bg-white rounded-lg w-full max-w-md transform transition-all duration-300 ${
      isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
    }`,
    [isVisible]
  );

  return (
    <div 
      className={backdropClass}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div 
        ref={modalRef}
        className={modalClass}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 
            id="booking-modal-title"
            className="text-lg font-semibold text-gray-900"
          >
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
            currentDate={currentDate}
          />

          {/* Capacity Warning */}
          <WarningMessage 
            warning={warning} 
            getWarningColors={getWarningColors}
          />

          {/* Additional Info */}
          <CapacityInfo slot={slot} />

          {/* Terms */}
          <TermsAndConditions />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex space-x-3">
          <button
            onClick={handleCancel}
            disabled={loading}
            className={cancelButtonClass}
            aria-label="Cancel booking"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={confirmButtonClass}
            aria-label={confirmButtonText}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner />
                <span>{confirmButtonText}</span>
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

// Export with React.memo and custom comparison
export default React.memo(BookingConfirmation, (prevProps, nextProps) => {
  return (
    prevProps.slot.slotTime === nextProps.slot.slotTime &&
    prevProps.slot.currentBookings === nextProps.slot.currentBookings &&
    prevProps.slot.percentage === nextProps.slot.percentage &&
    prevProps.memberName === nextProps.memberName &&
    prevProps.loading === nextProps.loading &&
    prevProps.currentBooking?.slotTime === nextProps.currentBooking?.slotTime &&
    prevProps.onConfirm === nextProps.onConfirm &&
    prevProps.onCancel === nextProps.onCancel
  );
});