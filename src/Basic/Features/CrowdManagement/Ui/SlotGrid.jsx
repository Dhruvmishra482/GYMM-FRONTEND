import React from 'react';

const SlotGrid = ({ slots, onSlotClick, loading }) => {
  // Get status color class
  const getStatusColorClass = (status, isOverflow) => {
    if (isOverflow) return 'bg-red-600 text-white border-red-700';
    
    switch (status) {
      case 'SAFE':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'BUSY':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'NEARLY_FULL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'OVERFLOW':
        return 'bg-red-600 text-white border-red-700';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  // Get capacity bar color
  const getCapacityBarColor = (percentage, isOverflow) => {
    if (isOverflow || percentage > 100) return 'bg-red-600';
    if (percentage >= 85) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Format slot time for display
  const formatSlotTime = (slotTime) => {
    const [start, end] = slotTime.split('-');
    return `${start} - ${end}`;
  };

  if (loading && (!slots || slots.length === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No slot data available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {slots.map((slot) => {
        const capacityPercentage = Math.min(slot.percentage || 0, 100);
        const overflowPercentage = Math.max((slot.percentage || 0) - 100, 0);
        
        return (
          <div
            key={slot.slotTime}
            onClick={() => onSlotClick(slot)}
            className={`
              bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200
              hover:shadow-md hover:scale-105
              ${getStatusColorClass(slot.status, slot.isOverflow)}
            `}
          >
            {/* Slot Time Header */}
            <div className="text-center mb-3">
              <h3 className="font-semibold text-lg">
                {formatSlotTime(slot.slotTime)}
              </h3>
              <p className="text-sm opacity-75">
                {slot.color} {slot.status}
              </p>
            </div>

            {/* Capacity Information */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Capacity:</span>
                <span className="font-medium">
                  {slot.currentBookings}/{slot.maxCapacity}
                  {slot.isOverflow && (
                    <span className="text-red-600 font-bold">
                      (+{slot.overflowCount})
                    </span>
                  )}
                </span>
              </div>
              
              {/* Capacity Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                {/* Normal Capacity */}
                <div
                  className={`h-full transition-all duration-300 ${getCapacityBarColor(capacityPercentage, false)}`}
                  style={{ width: `${capacityPercentage}%` }}
                ></div>
                
                {/* Overflow Indicator */}
                {slot.isOverflow && (
                  <div
                    className="h-full bg-red-600 opacity-80"
                    style={{ 
                      width: `${Math.min(overflowPercentage, 50)}%`,
                      marginTop: '-12px'
                    }}
                  ></div>
                )}
              </div>
              
              <div className="flex justify-between text-xs mt-1 opacity-75">
                <span>{slot.percentage}% full</span>
                {slot.availableSpots > 0 ? (
                  <span>{slot.availableSpots} spots left</span>
                ) : (
                  <span className="text-red-600 font-medium">FULL</span>
                )}
              </div>
            </div>

            {/* Member Count */}
            <div className="text-center">
              <p className="text-sm font-medium">
                {slot.currentBookings} {slot.currentBookings === 1 ? 'Member' : 'Members'}
              </p>
              
              {slot.isOverflow && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  OVERCROWDED
                </p>
              )}
              
              {slot.status === 'SAFE' && (
                <p className="text-xs text-green-600 mt-1">
                  Good availability
                </p>
              )}
            </div>

            {/* Crowd Level Indicator */}
            <div className="mt-2 text-center">
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${slot.crowdLevel === 'COMFORTABLE' ? 'bg-green-200 text-green-800' :
                  slot.crowdLevel === 'MODERATE' ? 'bg-yellow-200 text-yellow-800' :
                  slot.crowdLevel === 'BUSY' ? 'bg-orange-200 text-orange-800' :
                  slot.crowdLevel === 'PACKED' ? 'bg-red-200 text-red-800' :
                  'bg-red-600 text-white'
                }
              `}>
                {slot.crowdLevel}
              </span>
            </div>

            {/* Members List Preview */}
            {slot.members && slot.members.length > 0 && (
              <div className="mt-3 text-xs">
                <p className="font-medium mb-1">Recent bookings:</p>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {slot.members.slice(0, 3).map((member, index) => (
                    <div key={index} className="flex justify-between opacity-75">
                      <span className="truncate">{member.name}</span>
                      <span className="text-xs">
                        {member.bookingMethod === 'WHATSAPP_LINK' ? 'WA' :
                         member.bookingMethod === 'MANUAL_OWNER' ? 'Manual' :
                         member.bookingMethod === 'PREVIOUS_SLOT' ? 'Auto' : 'Other'}
                      </span>
                    </div>
                  ))}
                  {slot.members.length > 3 && (
                    <p className="text-center opacity-50">
                      +{slot.members.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SlotGrid;