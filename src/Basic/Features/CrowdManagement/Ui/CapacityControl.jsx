import React, { useState, useEffect } from 'react';

const CapacityControls = ({ currentSettings, onClose, onSave, loading }) => {
  const [defaultCapacity, setDefaultCapacity] = useState(20);
  const [slotSpecificCapacity, setSlotSpecificCapacity] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // All available slot times
  const allSlotTimes = [
    "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00",
    "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
    "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00",
    "21:00-22:00"
  ];

  // Initialize form data
  useEffect(() => {
    if (currentSettings) {
      setDefaultCapacity(currentSettings.defaultCapacity || 20);
      setSlotSpecificCapacity(currentSettings.slotSpecificCapacity || {});
    }
  }, [currentSettings]);

  // Handle default capacity change
  const handleDefaultCapacityChange = (value) => {
    const newValue = parseInt(value) || 20;
    setDefaultCapacity(newValue);
    setHasChanges(true);
  };

  // Handle slot-specific capacity change
  const handleSlotCapacityChange = (slotTime, value) => {
    const newValue = parseInt(value) || '';
    setSlotSpecificCapacity(prev => ({
      ...prev,
      [slotTime]: newValue
    }));
    setHasChanges(true);
  };

  // Remove slot-specific capacity (use default)
  const removeSlotSpecificCapacity = (slotTime) => {
    setSlotSpecificCapacity(prev => {
      const updated = { ...prev };
      delete updated[slotTime];
      return updated;
    });
    setHasChanges(true);
  };

  // Handle save
  const handleSave = async () => {
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
  };

  // Get effective capacity for a slot
  const getEffectiveCapacity = (slotTime) => {
    return slotSpecificCapacity[slotTime] || defaultCapacity;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Capacity Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                  className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm"
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
              {allSlotTimes.map((slotTime) => {
                const hasSpecificCapacity = slotSpecificCapacity[slotTime] > 0;
                const effectiveCapacity = getEffectiveCapacity(slotTime);

                return (
                  <div
                    key={slotTime}
                    className={`border rounded-lg p-4 ${
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
                        value={slotSpecificCapacity[slotTime] || ''}
                        onChange={(e) => handleSlotCapacityChange(slotTime, e.target.value)}
                        placeholder={`Default (${defaultCapacity})`}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                      />
                      
                      {hasSpecificCapacity && (
                        <button
                          onClick={() => removeSlotSpecificCapacity(slotTime)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          title="Use default capacity"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {hasSpecificCapacity && (
                      <p className="text-xs text-blue-600 mt-1">
                        Using custom capacity: {slotSpecificCapacity[slotTime]} members
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Default Capacity:</span>
                <span className="ml-2 font-medium">{defaultCapacity} members</span>
              </div>
              <div>
                <span className="text-gray-600">Custom Slots:</span>
                <span className="ml-2 font-medium">
                  {Object.keys(slotSpecificCapacity).filter(key => slotSpecificCapacity[key] > 0).length} slots
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Daily Capacity:</span>
                <span className="ml-2 font-medium">
                  {allSlotTimes.reduce((sum, slot) => sum + getEffectiveCapacity(slot), 0)} members
                </span>
              </div>
              <div>
                <span className="text-gray-600">Average per Slot:</span>
                <span className="ml-2 font-medium">
                  {Math.round(allSlotTimes.reduce((sum, slot) => sum + getEffectiveCapacity(slot), 0) / allSlotTimes.length)} members
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {hasChanges ? 'You have unsaved changes' : 'No changes made'}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default CapacityControls;