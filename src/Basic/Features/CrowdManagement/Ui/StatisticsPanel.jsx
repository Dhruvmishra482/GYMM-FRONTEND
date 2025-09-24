import React from 'react';

const StatisticsPanel = ({ statistics, lastUpdated, loading }) => {
  // Format numbers for display
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  // Format percentage for display
  const formatPercentage = (num) => {
    return `${num || 0}%`;
  };

  // Get last updated text
  const getLastUpdatedText = () => {
    if (!lastUpdated) return 'Never updated';
    
    const now = Date.now();
    const diff = now - lastUpdated;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (loading && !statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Bookings',
      value: formatNumber(statistics?.totalBookings),
      subtitle: 'Today',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: '📊'
    },
    {
      title: 'Average Occupancy',
      value: formatNumber(statistics?.averageOccupancy),
      subtitle: 'Members per slot',
      color: 'bg-green-50 text-green-700 border-green-200',
      icon: '👥'
    },
    {
      title: 'Busy Slots',
      value: formatNumber(statistics?.busySlots),
      subtitle: `${statistics?.safeSlots || 0} safe slots`,
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: '⚠️'
    },
    {
      title: 'Check-in Rate',
      value: formatPercentage(statistics?.checkInRate),
      subtitle: 'Members checked in',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: '✅'
    },
    {
      title: 'Completion Rate',
      value: formatPercentage(statistics?.completionRate),
      subtitle: 'Workouts completed',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: '🎯'
    }
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg border-2 p-4 ${stat.color}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              )}
            </div>
            
            <h3 className="text-sm font-medium opacity-75 mb-1">
              {stat.title}
            </h3>
            
            <div className="text-2xl font-bold mb-1">
              {stat.value}
            </div>
            
            <p className="text-xs opacity-60">
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Summary Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Today's Overview
            </h3>
            <div className="flex space-x-6 text-sm text-gray-600">
              <span>
                <strong>{statistics?.totalCapacity || 0}</strong> total capacity
              </span>
              <span>
                <strong>{statistics?.fullSlots || 0}</strong> full slots
              </span>
              <span>
                Utilization: <strong>{statistics?.utilizationRate || 0}%</strong>
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Last updated: {getLastUpdatedText()}
            </p>
            <div className="flex items-center justify-end mt-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-xs text-gray-400 ml-2">Live data</span>
            </div>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="mt-4 flex space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safe (0-69%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Busy (70-84%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Full (85%+)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Overflow (100%+)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;