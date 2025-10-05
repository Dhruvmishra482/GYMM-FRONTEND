import React, { useMemo, useCallback } from 'react';

// Custom animation hook for staggered appearance
const useStaggerAnimation = (index, totalItems) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const delay = Math.min(index * 50, 800); // Max 800ms delay
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [index]);

  return isVisible;
};

// Memoized Loading Skeleton Component
const LoadingSkeleton = React.memo(() => (
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
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Memoized No Data Component
const NoDataDisplay = React.memo(() => (
  <div className="text-center py-8">
    <p className="text-gray-600">No slot data available</p>
  </div>
));

NoDataDisplay.displayName = 'NoDataDisplay';

// Memoized Capacity Bar Component
const CapacityBar = React.memo(({ percentage, isOverflow, overflowCount }) => {
  const capacityPercentage = Math.min(percentage || 0, 100);
  const overflowPercentage = Math.max((percentage || 0) - 100, 0);

  const getCapacityBarColor = useCallback((percent, overflow) => {
    if (overflow || percent > 100) return 'bg-red-600';
    if (percent >= 85) return 'bg-red-500';
    if (percent >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  }, []);

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      {/* Normal Capacity */}
      <div
        className={`h-full transition-all duration-300 ${getCapacityBarColor(capacityPercentage, false)}`}
        style={{ width: `${capacityPercentage}%` }}
      ></div>
      
      {/* Overflow Indicator */}
      {isOverflow && (
        <div
          className="h-full bg-red-600 opacity-80"
          style={{ 
            width: `${Math.min(overflowPercentage, 50)}%`,
            marginTop: '-12px'
          }}
        ></div>
      )}
    </div>
  );
});

CapacityBar.displayName = 'CapacityBar';

// Memoized Members List Component
const MembersList = React.memo(({ members }) => {
  if (!members || members.length === 0) return null;

  const getBookingMethodLabel = useCallback((method) => {
    switch (method) {
      case 'WHATSAPP_LINK': return 'WA';
      case 'MANUAL_OWNER': return 'Manual';
      case 'PREVIOUS_SLOT': return 'Auto';
      default: return 'Other';
    }
  }, []);

  return (
    <div className="mt-3 text-xs">
      <p className="font-medium mb-1">Recent bookings:</p>
      <div className="space-y-1 max-h-20 overflow-y-auto">
        {members.slice(0, 3).map((member, index) => (
          <div key={index} className="flex justify-between opacity-75">
            <span className="truncate">{member.name}</span>
            <span className="text-xs">
              {getBookingMethodLabel(member.bookingMethod)}
            </span>
          </div>
        ))}
        {members.length > 3 && (
          <p className="text-center opacity-50">
            +{members.length - 3} more
          </p>
        )}
      </div>
    </div>
  );
});

MembersList.displayName = 'MembersList';

// Memoized Slot Card Component
const SlotCard = React.memo(({ 
  slot, 
  index, 
  onSlotClick, 
  getStatusColorClass,
  formatSlotTime 
}) => {
  const isVisible = useStaggerAnimation(index, 16);

  const handleClick = useCallback(() => {
    onSlotClick(slot);
  }, [slot, onSlotClick]);

  const crowdLevelClass = useMemo(() => {
    switch (slot.crowdLevel) {
      case 'COMFORTABLE': return 'bg-green-200 text-green-800';
      case 'MODERATE': return 'bg-yellow-200 text-yellow-800';
      case 'BUSY': return 'bg-orange-200 text-orange-800';
      case 'PACKED': return 'bg-red-200 text-red-800';
      default: return 'bg-red-600 text-white';
    }
  }, [slot.crowdLevel]);

  return (
    <div
      onClick={handleClick}
      className={`
        bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-300
        hover:shadow-md hover:scale-105
        ${getStatusColorClass(slot.status, slot.isOverflow)}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
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
        <CapacityBar
          percentage={slot.percentage}
          isOverflow={slot.isOverflow}
          overflowCount={slot.overflowCount}
        />
        
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
        <span className={`text-xs px-2 py-1 rounded-full ${crowdLevelClass}`}>
          {slot.crowdLevel}
        </span>
      </div>

      {/* Members List Preview */}
      <MembersList members={slot.members} />
    </div>
  );
});

SlotCard.displayName = 'SlotCard';

const SlotGrid = ({ slots, onSlotClick, loading }) => {
  // Memoize status color function
  const getStatusColorClass = useCallback((status, isOverflow) => {
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
  }, []);

  // Memoize slot time formatter
  const formatSlotTime = useCallback((slotTime) => {
    const [start, end] = slotTime.split('-');
    return `${start} - ${end}`;
  }, []);

  // Memoize slot click handler
  const handleSlotClick = useCallback((slot) => {
    onSlotClick(slot);
  }, [onSlotClick]);

  // Early return for loading state
  if (loading && (!slots || slots.length === 0)) {
    return <LoadingSkeleton />;
  }

  // Early return for no data
  if (!slots || slots.length === 0) {
    return <NoDataDisplay />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {slots.map((slot, index) => (
        <SlotCard
          key={slot.slotTime}
          slot={slot}
          index={index}
          onSlotClick={handleSlotClick}
          getStatusColorClass={getStatusColorClass}
          formatSlotTime={formatSlotTime}
        />
      ))}
    </div>
  );
};

export default React.memo(SlotGrid);