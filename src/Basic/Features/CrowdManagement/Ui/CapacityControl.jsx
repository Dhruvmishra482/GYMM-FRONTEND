import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Custom animation hook
const useModalAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return isVisible;
};

// Memoized Close Icon Component
const CloseIcon = React.memo(() => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    onCapacityChange(slotTime, e.target.value);
  }, [slotTime, onCapacityChange]);

  const handleRemove = useCallback(() => {
    onRemove(slotTime);
  }, [slotTime, onRemove]);

  return (
    <div
      className={`border rounded-lg p-4 transition-all duration-200 ${
        hasSpecificCapacity ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-sm">{slotTime}</span>
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
          placeholder={`Default (${defaultCapacity})`}
          className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {hasSpecificCapacity && (
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 text-sm transition-colors duration-200"
            title="Use default capacity"
          >
            Reset
          </button>
        )}
      </div>

      {hasSpecificCapacity && (
        <p className="text-xs text-blue-600 mt-1">
          Using custom capacity: {slotSpecificCapacity} members
        </p>
      )}
    </div>
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
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Default Capacity:</span>
          <span className="ml-2 font-medium">{defaultCapacity} members</span>
        </div>
        <div>
          <span className="text-gray-600">Custom Slots:</span>
          <span className="ml-2 font-medium">{customSlotsCount} slots</span>
        </div>
        <div>
          <span className="text-gray-600">Total Daily Capacity:</span>
          <span className="ml-2 font-medium">{totalDailyCapacity} members</span>
        </div>
        <div>
          <span className="text-gray-600">Average per Slot:</span>
          <span className="ml-2 font-medium">{averagePerSlot} members</span>
        </div>
      </div>
    </div>
  );
});

CapacitySummary.displayName = 'CapacitySummary';

const CapacityControls = ({ currentSettings, onClose, onSave, loading }) => {
  const isVisible = useModalAnimation();

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

  // useCallback for event handlers
  const handleDefaultCapacityChange = useCallback((value) => {
    const newValue = parseInt(value) || 20;
    setDefaultCapacity(newValue);
    setHasChanges(true);
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

  return (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-all duration-300 ${
        isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Capacity Settings
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={loading}
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
                className="flex-1"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={defaultCapacity}
                  onChange={(e) => handleDefaultCapacityChange(e.target.value)}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">members</span>
              </div>
            </div>
          </div>

          {/* Slot-Specific Capacities */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Slot-Specific Capacities
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Override the default capacity for specific time slots. Leave empty to use default capacity.
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
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {hasChanges ? 'You have unsaved changes' : 'No changes made'}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CapacityControls);