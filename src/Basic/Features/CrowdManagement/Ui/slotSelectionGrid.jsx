import React from 'react';

const SlotSelectionGrid = ({
  slots,
  currentBooking,
  preferredSlot,
  onSlotSelect,
  disabled
}) => {
  // Get status color class for mobile-friendly design
  const getStatusColorClass = (slot) => {
    if (!slot.isAvailable) {
      return 'bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed';
    }

    if (slot.isOverflow || slot.percentage > 100) {
      return 'bg-red-600 text-white border-red-700 hover:bg-red-700';
    }

    switch (slot.status) {
      case 'SAFE':
        return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
      case 'MODERATE':
      case 'BUSY':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200';
      case 'NEARLY_FULL':
        return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200';
      case 'OVERFLOW':
        return 'bg-red-600 text-white border-red-700 hover:bg-red-700';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200';
    }
  };

  // Get warning message for overcrowded slots
  const getWarningMessage = (slot) => {
    if (slot.percentage > 100) {
      return `Will be overcrowded (${slot.currentBookings}/${slot.maxCapacity})`;
    }
    if (slot.percentage >= 90) {
      return `Almost full (${slot.currentBookings}/${slot.maxCapacity})`;
    }
    if (slot.percentage >= 75) {
      return `Getting busy (${slot.currentBookings}/${slot.maxCapacity})`;
    }
    return null;
  };

  // Check if slot is current booking
  const isCurrentBooking = (slotTime) => {
    return currentBooking?.slotTime === slotTime;
  };

  // Check if slot is preferred
  const isPreferredSlot = (slotTime) => {
    return preferredSlot === slotTime;
  };

  // Format slot time for mobile display
  const formatSlotTime = (slotTime) => {
    const [start, end] = slotTime.split('-');
    return { start, end };
  };

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No slots available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Available Time Slots
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slots.map((slot) => {
          const { start, end } = formatSlotTime(slot.slotTime);
          const warningMessage = getWarningMessage(slot);
          const isCurrent = isCurrentBooking(slot.slotTime);
          const isPreferred = isPreferredSlot(slot.slotTime);
          
          return (
            <button
              key={slot.slotTime}
              onClick={() => slot.isAvailable && !disabled && onSlotSelect(slot)}
              disabled={!slot.isAvailable || disabled}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all duration-200
                ${getStatusColorClass(slot)}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              `}
            >
              {/* Current Booking Badge */}
              {isCurrent && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Current
                </div>
              )}
              
              {/* Preferred Slot Badge */}
              {isPreferred && !isCurrent && (
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  Usual
                </div>
              )}

              {/* Slot Time */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-lg font-bold">
                    {start}
                  </div>
                  <div className="text-sm opacity-75">
                    to {end}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl">
                    {slot.color}
                  </div>
                </div>
              </div>

              {/* Capacity Info */}
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Capacity:</span>
                  <span className="font-medium">
                    {slot.currentBookings}/{slot.maxCapacity}
                  </span>
                </div>
                
                {/* Capacity Bar */}
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      slot.percentage > 100 ? 'bg-white' :
                      slot.percentage >= 85 ? 'bg-red-400' :
                      slot.percentage >= 70 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${Math.min(slot.percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="text-xs mt-1 opacity-75">
                  {slot.percentage}% full
                </div>
              </div>

              {/* Status Message */}
              <div className="text-sm">
                {!slot.isAvailable ? (
                  <span className="font-medium">FULL</span>
                ) : warningMessage ? (
                  <span className="font-medium">{warningMessage}</span>
                ) : (
                  <span>Good availability</span>
                )}
              </div>

              {/* Overflow Warning */}
              {slot.isOverflow && (
                <div className="mt-2 text-xs font-bold bg-white bg-opacity-20 rounded px-2 py-1">
                  OVERCROWDED SLOT
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-3">Color Guide:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Safe (Good availability)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Busy (Filling up)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Almost Full</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>Overcrowded</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          You can still book overcrowded slots, but expect a busy gym experience.
        </p>
      </div>
    </div>
  );
};

export default SlotSelectionGrid;