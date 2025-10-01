import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// ==================== CUSTOM HOOKS ====================

// Custom animation hook
const useModalAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return isVisible;
};

// Prevent body scroll when modal is open
const useBodyScrollLock = () => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
};

// ==================== MEMOIZED COMPONENTS ====================

// Memoized Close Icon Component
const CloseIcon = React.memo(() => (
  <svg 
    className="w-6 h-6" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
));

CloseIcon.displayName = 'CloseIcon';

// Memoized Slot Capacity Card Component
const SlotCapacityCard = React.memo(({ 
  slotTime, 
  slotSpecificCapacity, 
  defaultCapacity, 
  onCapacityChange, 
  onRemove 
}) => {
  const hasSpecificCapacity = slotSpecificCapacity > 0;
  const effectiveCapacity = slotSpecificCapacity || defaultCapacity;

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    // Debounce logic: only update if value is valid
    if (value === '' || (parseInt(value) >= 5 && parseInt(value) <= 100)) {
      onCapacityChange(slotTime, value);
    }
  }, [slotTime, onCapacityChange]);

  const handleRemove = useCallback(() => {
    onRemove(slotTime);
  }, [slotTime, onRemove]);

  // Memoize card class
  const cardClass = useMemo(() => 
    `border rounded-lg p-4 transition-all duration-200 ${
      hasSpecificCapacity ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
    }`,
    [hasSpecificCapacity]
  );

  // Memoize placeholder text
  const placeholder = useMemo(() => `Default (${defaultCapacity})`, [defaultCapacity]);

  return (
    <div className={cardClass}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-sm text-gray-900">{slotTime}</span>
        <span className="text-xs text-gray-500">
          Current: {effectiveCapacity} members
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="5"
          max="100"
          value={slotSpecificCapacity || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
          aria-label={`Capacity for ${slotTime}`}
        />
        
        {hasSpecificCapacity && (
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 active:text-red-900 text-sm transition-colors duration-200 px-2 py-1 rounded hover:bg-red-50"
            title="Use default capacity"
            aria-label={`Reset capacity for ${slotTime}`}
          >
            Reset
          </button>
        )}
      </div>

      {hasSpecificCapacity && (
        <p className="text-xs text-blue-600 mt-1 animate-fadeIn">
          Using custom capacity: {slotSpecificCapacity} members
        </p>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for deep optimization
  return (
    prevProps.slotTime === nextProps.slotTime &&
    prevProps.slotSpecificCapacity === nextProps.slotSpecificCapacity &&
    prevProps.defaultCapacity === nextProps.defaultCapacity &&
    prevProps.onCapacityChange === nextProps.onCapacityChange &&
    prevProps.onRemove === nextProps.onRemove
  );
});

SlotCapacityCard.displayName = 'SlotCapacityCard';

// Memoized Summary Component
const CapacitySummary = React.memo(({ 
  defaultCapacity, 
  slotSpecificCapacity, 
  allSlotTimes, 
  getEffectiveCapacity 
}) => {
  const customSlotsCount = useMemo(() => {
    return Object.keys(slotSpecificCapacity).filter(key => slotSpecificCapacity[key] > 0).length;
  }, [slotSpecificCapacity]);

  const totalDailyCapacity = useMemo(() => {
    return allSlotTimes.reduce((sum, slot) => sum + getEffectiveCapacity(slot), 0);
  }, [allSlotTimes, getEffectiveCapacity]);

  const averagePerSlot = useMemo(() => {
    return Math.round(totalDailyCapacity / allSlotTimes.length);
  }, [totalDailyCapacity, allSlotTimes.length]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 mb-6 border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
        <span className="mr-2">📊</span>
        Summary
      </h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <span className="text-gray-600 block mb-1">Default Capacity:</span>
          <span className="text-lg font-bold text-blue-600">{defaultCapacity}</span>
          <span className="text-gray-500 text-xs ml-1">members</span>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <span className="text-gray-600 block mb-1">Custom Slots:</span>
          <span className="text-lg font-bold text-purple-600">{customSlotsCount}</span>
          <span className="text-gray-500 text-xs ml-1">slots</span>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <span className="text-gray-600 block mb-1">Total Daily Capacity:</span>
          <span className="text-lg font-bold text-green-600">{totalDailyCapacity}</span>
          <span className="text-gray-500 text-xs ml-1">members</span>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <span className="text-gray-600 block mb-1">Average per Slot:</span>
          <span className="text-lg font-bold text-orange-600">{averagePerSlot}</span>
          <span className="text-gray-500 text-xs ml-1">members</span>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.defaultCapacity === nextProps.defaultCapacity &&
    JSON.stringify(prevProps.slotSpecificCapacity) === JSON.stringify(nextProps.slotSpecificCapacity) &&
    prevProps.allSlotTimes.length === nextProps.allSlotTimes.length
  );
});

CapacitySummary.displayName = 'CapacitySummary';

// Memoized Loading Spinner
const LoadingSpinner = React.memo(() => (
  <div 
    className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
    role="status"
    aria-label="Loading"
  />
));

LoadingSpinner.displayName = 'LoadingSpinner';

// ==================== MAIN COMPONENT ====================

const CapacityControls = ({ currentSettings, onClose, onSave, loading }) => {
  const isVisible = useModalAnimation();
  useBodyScrollLock();
  
  const modalRef = useRef(null);

  const [defaultCapacity, setDefaultCapacity] = useState(20);
  const [slotSpecificCapacity, setSlotSpecificCapacity] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Memoized slot times array
  const allSlotTimes = useMemo(() => [
    "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00",
    "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
    "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00",
    "21:00-22:00"
  ], []);

  // Initialize form data
  useEffect(() => {
    if (currentSettings) {
      setDefaultCapacity(currentSettings.defaultCapacity || 20);
      setSlotSpecificCapacity(currentSettings.slotSpecificCapacity || {});
    }
  }, [currentSettings]);

  // Memoized function to get effective capacity
  const getEffectiveCapacity = useCallback((slotTime) => {
    return slotSpecificCapacity[slotTime] || defaultCapacity;
  }, [slotSpecificCapacity, defaultCapacity]);

  // Debounced handlers with useCallback
  const handleDefaultCapacityChange = useCallback((value) => {
    const newValue = parseInt(value) || 20;
    if (newValue >= 5 && newValue <= 100) {
      setDefaultCapacity(newValue);
      setHasChanges(true);
    }
  }, []);

  const handleSlotCapacityChange = useCallback((slotTime, value) => {
    const newValue = parseInt(value) || '';
    setSlotSpecificCapacity(prev => ({
      ...prev,
      [slotTime]: newValue
    }));
    setHasChanges(true);
  }, []);

  const removeSlotSpecificCapacity = useCallback((slotTime) => {
    setSlotSpecificCapacity(prev => {
      const updated = { ...prev };
      delete updated[slotTime];
      return updated;
    });
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const data = {
        defaultCapacity,
        slotSpecificCapacity: Object.fromEntries(
          Object.entries(slotSpecificCapacity).filter(([_, value]) => value > 0)
        )
      };

      const success = await onSave(data);
      if (success) {
        setHasChanges(false);
        onClose();
      }
    } catch (error) {
      console.error('Failed to save capacity settings:', error);
    }
  }, [defaultCapacity, slotSpecificCapacity, onSave, onClose]);

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose();
    }
  }, [loading, onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Keyboard event handler (ESC to close)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !loading) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClose, loading]);

  // Memoized class names
  const backdropClass = useMemo(() => 
    `fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-all duration-300 ${
      isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
    }`,
    [isVisible]
  );

  const modalClass = useMemo(() => 
    `bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 shadow-2xl ${
      isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
    }`,
    [isVisible]
  );

  const saveButtonClass = useMemo(() => 
    'px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
    []
  );

  const cancelButtonClass = useMemo(() => 
    'px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200',
    []
  );

  // Memoized status message
  const statusMessage = useMemo(() => 
    hasChanges ? '⚠️ You have unsaved changes' : '✅ No changes made',
    [hasChanges]
  );

  const statusMessageClass = useMemo(() => 
    `text-sm ${hasChanges ? 'text-orange-600 font-medium' : 'text-gray-600'}`,
    [hasChanges]
  );

  return (
    <div 
      className={backdropClass}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="capacity-modal-title"
    >
      <div 
        ref={modalRef}
        className={modalClass}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 
                id="capacity-modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                ⚙️ Capacity Settings
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage gym capacity for each time slot
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
              disabled={loading}
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Default Capacity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Capacity (applies to all slots unless overridden)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="5"
                max="100"
                value={defaultCapacity}
                onChange={(e) => handleDefaultCapacityChange(e.target.value)}
                className="flex-1 accent-blue-600"
                aria-label="Default capacity slider"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={defaultCapacity}
                  onChange={(e) => handleDefaultCapacityChange(e.target.value)}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Default capacity input"
                />
                <span className="text-sm text-gray-600 font-medium">members</span>
              </div>
            </div>
          </div>

          {/* Slot-Specific Capacities */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
              <span className="mr-2">🕐</span>
              Slot-Specific Capacities
            </h3>
            <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
              💡 <strong>Tip:</strong> Override the default capacity for specific time slots. Leave empty to use default capacity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allSlotTimes.map((slotTime) => (
                <SlotCapacityCard
                  key={slotTime}
                  slotTime={slotTime}
                  slotSpecificCapacity={slotSpecificCapacity[slotTime]}
                  defaultCapacity={defaultCapacity}
                  onCapacityChange={handleSlotCapacityChange}
                  onRemove={removeSlotSpecificCapacity}
                />
              ))}
            </div>
          </div>

          {/* Summary */}
          <CapacitySummary
            defaultCapacity={defaultCapacity}
            slotSpecificCapacity={slotSpecificCapacity}
            allSlotTimes={allSlotTimes}
            getEffectiveCapacity={getEffectiveCapacity}
          />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-between items-center">
            <p className={statusMessageClass}>
              {statusMessage}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className={cancelButtonClass}
                disabled={loading}
                aria-label="Cancel changes"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || loading}
                className={saveButtonClass}
                aria-label="Save capacity changes"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner />
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export with deep comparison
export default React.memo(CapacityControls, (prevProps, nextProps) => {
  return (
    prevProps.loading === nextProps.loading &&
    JSON.stringify(prevProps.currentSettings) === JSON.stringify(nextProps.currentSettings) &&
    prevProps.onClose === nextProps.onClose &&
    prevProps.onSave === nextProps.onSave
  );
});