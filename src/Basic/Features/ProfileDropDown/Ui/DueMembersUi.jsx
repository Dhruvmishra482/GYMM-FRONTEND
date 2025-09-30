import React, { useMemo, useCallback } from 'react';

// Custom animation hook
const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// Memoized Loading State Component
const LoadingState = React.memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading due members...</p>
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

// Memoized Refresh Icon Component
const RefreshIcon = React.memo(() => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
));

RefreshIcon.displayName = 'RefreshIcon';

// Memoized Header Component
const DueMembersHeader = React.memo(({ onRefresh, loading }) => {
  const isVisible = useFadeIn(0);

  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <div className={`mb-8 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Due Members</h1>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <RefreshIcon />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
});

DueMembersHeader.displayName = 'DueMembersHeader';

// Memoized Statistic Card Component
const StatCard = React.memo(({ icon, title, value, color, index }) => {
  const isVisible = useFadeIn(index * 100);

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-center">
        <div className={`p-2 ${color.bg} rounded-lg`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color.text}`}>{value}</p>
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

// Memoized Statistics Panel Component
const StatisticsPanel = React.memo(({ statistics }) => {
  const statsConfig = useMemo(() => [
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      title: 'Total Due',
      value: statistics?.total || 0,
      color: { bg: 'bg-blue-100', text: 'text-gray-900' }
    },
    {
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      title: 'Overdue',
      value: statistics?.overdue || 0,
      color: { bg: 'bg-red-100', text: 'text-red-600' }
    },
    {
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Due Today',
      value: statistics?.dueToday || 0,
      color: { bg: 'bg-yellow-100', text: 'text-yellow-600' }
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: 'Pending Payment',
      value: statistics?.pending || 0,
      color: { bg: 'bg-blue-100', text: 'text-blue-600' }
    }
  ], [statistics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statsConfig.map((stat, index) => (
        <StatCard key={index} {...stat} index={index} />
      ))}
    </div>
  );
});

StatisticsPanel.displayName = 'StatisticsPanel';

// Memoized Error Banner Component
const ErrorBanner = React.memo(({ error, onRefresh }) => {
  if (!error) return null;

  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-fadeIn">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-red-700 flex-1">{error}</p>
        <button 
          onClick={handleRefresh}
          className="ml-4 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
});

ErrorBanner.displayName = 'ErrorBanner';

// Memoized Search Input Component
const SearchInput = React.memo(({ searchTerm, onSearchChange }) => {
  const handleChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="flex-1">
      <label htmlFor="member-search" className="sr-only">Search members</label>
      <div className="relative">
        <input
          type="text"
          id="member-search"
          name="memberSearch"
          placeholder="Search by name, email, phone, or member ID..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

// Memoized Filter Buttons Component
const FilterButtons = React.memo(({ filterType, onFilterChange }) => {
  const filters = useMemo(() => ['all', 'overdue', 'dueToday', 'pending'], []);
  
  const filterLabels = useMemo(() => ({
    all: 'All',
    overdue: 'Overdue',
    dueToday: 'Due Today',
    pending: 'Pending'
  }), []);

  const handleFilterClick = useCallback((filter) => {
    onFilterChange(filter);
  }, [onFilterChange]);

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === filter
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filterLabels[filter]}
        </button>
      ))}
    </div>
  );
});

FilterButtons.displayName = 'FilterButtons';

// Memoized Search and Filter Component
const SearchAndFilter = React.memo(({ 
  searchTerm, 
  filterType, 
  statistics, 
  onSearchChange, 
  onFilterChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />
        <FilterButtons filterType={filterType} onFilterChange={onFilterChange} />
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Showing {statistics?.filtered || 0} of {statistics?.total || 0} members
        {searchTerm && <span className="ml-2 text-blue-600">• Searching for: "{searchTerm}"</span>}
        {filterType !== 'all' && <span className="ml-2 text-blue-600">• Filter: {filterType}</span>}
      </div>
    </div>
  );
});

SearchAndFilter.displayName = 'SearchAndFilter';
// Memoized Empty State Component
const EmptyState = React.memo(({ error, searchTerm, filterType, onRefresh }) => {
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Due Members Found</h3>
      <p className="text-gray-500 mb-4">
        {error ? 'Unable to load due members data.' :
         searchTerm || filterType !== 'all' 
          ? 'No members match your current search or filter criteria.'
          : 'All members are up to date with their payments.'}
      </p>
      {error && (
        <button 
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

// Memoized Member Card Component (Mobile)
const MemberCard = React.memo(({ 
  member, 
  index,
  actionLoading, 
  onMemberAction, 
  formatDate, 
  formatCurrency, 
  getStatusText 
}) => {
  const isVisible = useFadeIn(index * 50);

  const statusClass = useMemo(() => {
    if (member.isOverdue) return 'bg-red-100 text-red-800';
    if (member.isDueToday) return 'bg-yellow-100 text-yellow-800';
    if (member.paymentStatus === 'Pending') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  }, [member.isOverdue, member.isDueToday, member.paymentStatus]);

  const handleAction = useCallback((action) => {
    onMemberAction(member._id, action);
  }, [member._id, onMemberAction]);

  const amount = useMemo(() => {
    return member.feesAmount || member.feeAmount || member.amount;
  }, [member.feesAmount, member.feeAmount, member.amount]);

  return (
    <div className={`border border-gray-200 rounded-lg p-4 bg-gray-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {member.name?.charAt(0)?.toUpperCase() || 'M'}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{member.name || 'N/A'}</div>
            <div className="text-xs text-gray-500">ID: {member.memberId || member._id?.slice(-6) || 'N/A'}</div>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusClass}`}>
          {getStatusText(member)}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Email:</span>
          <span className="text-gray-900">{member.email || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Phone:</span>
          <span className="text-gray-900">{member.phoneNo || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Due Date:</span>
          <span className="text-gray-900">{formatDate(member.nextDueDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Amount:</span>
          <span className="text-gray-900 font-medium">{formatCurrency(amount)}</span>
        </div>
      </div>
      
      <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={() => handleAction('sendReminder')}
          disabled={actionLoading[member._id] === 'sendReminder'}
          className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:bg-blue-25 disabled:text-blue-400 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
        >
          {actionLoading[member._id] === 'sendReminder' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            'Send Reminder'
          )}
        </button>
        <button
          onClick={() => handleAction('markPaid')}
          disabled={actionLoading[member._id] === 'markPaid'}
          className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 disabled:bg-green-25 disabled:text-green-400 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
        >
          {actionLoading[member._id] === 'markPaid' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
          ) : (
            'Mark Paid'
          )}
        </button>
        <button
          onClick={() => handleAction('viewDetails')}
          disabled={actionLoading[member._id] === 'viewDetails'}
          className="bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:bg-gray-25 disabled:text-gray-400 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
        >
          {actionLoading[member._id] === 'viewDetails' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          ) : (
            'Details'
          )}
        </button>
      </div>
    </div>
  );
});

MemberCard.displayName = 'MemberCard';

// Memoized Mobile View Component
const MobileView = React.memo(({ 
  dueMembers, 
  actionLoading, 
  onMemberAction, 
  formatDate, 
  formatCurrency, 
  getStatusText 
}) => (
  <div className="block md:hidden">
    <div className="p-4 space-y-4">
      {dueMembers.map((member, index) => (
        <MemberCard
          key={member._id || index}
          member={member}
          index={index}
          actionLoading={actionLoading}
          onMemberAction={onMemberAction}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusText={getStatusText}
        />
      ))}
    </div>
  </div>
));

MobileView.displayName = 'MobileView';

// Memoized Table Row Component
const MemberTableRow = React.memo(({ 
  member, 
  actionLoading, 
  onMemberAction, 
  formatDate, 
  formatCurrency, 
  getStatusText 
}) => {
  const statusClass = useMemo(() => {
    if (member.isOverdue) return 'bg-red-100 text-red-800';
    if (member.isDueToday) return 'bg-yellow-100 text-yellow-800';
    if (member.paymentStatus === 'Pending') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  }, [member.isOverdue, member.isDueToday, member.paymentStatus]);

  const amount = useMemo(() => {
    return member.feesAmount || member.feeAmount || member.amount;
  }, [member.feesAmount, member.feeAmount, member.amount]);

  const handleAction = useCallback((action) => {
    onMemberAction(member._id, action);
  }, [member._id, onMemberAction]);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {member.name?.charAt(0)?.toUpperCase() || 'M'}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{member.name || 'N/A'}</div>
            <div className="text-sm text-gray-500">ID: {member.memberId || member._id?.slice(-6) || 'N/A'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{member.email || 'N/A'}</div>
        <div className="text-sm text-gray-500">{member.phoneNo || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div>{formatDate(member.nextDueDate)}</div>
        {member.lastPaidOn && (
          <div className="text-xs text-gray-500">
            Last paid: {formatDate(member.lastPaidOn)}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
          {getStatusText(member)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="font-medium">{formatCurrency(amount)}</div>
        {member.planDuration && (
          <div className="text-xs text-gray-500">{member.planDuration}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => handleAction('sendReminder')}
            disabled={actionLoading[member._id] === 'sendReminder'}
            className="text-blue-600 hover:text-blue-900 disabled:text-blue-300 transition-colors p-1 rounded"
            title="Send Reminder"
          >
            {actionLoading[member._id] === 'sendReminder' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => handleAction('markPaid')}
            disabled={actionLoading[member._id] === 'markPaid'}
            className="text-green-600 hover:text-green-900 disabled:text-green-300 transition-colors p-1 rounded"
            title="Mark as Paid"
          >
            {actionLoading[member._id] === 'markPaid' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => handleAction('viewDetails')}
            disabled={actionLoading[member._id] === 'viewDetails'}
            className="text-gray-600 hover:text-gray-900 disabled:text-gray-300 transition-colors p-1 rounded"
            title="View Details"
          >
            {actionLoading[member._id] === 'viewDetails' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
});

MemberTableRow.displayName = 'MemberTableRow';

// Memoized Desktop Table View Component
const DesktopTableView = React.memo(({ 
  dueMembers, 
  actionLoading, 
  onMemberAction, 
  formatDate, 
  formatCurrency, 
  getStatusText 
}) => (
  <div className="hidden md:block overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {dueMembers.map((member, index) => (
          <MemberTableRow
            key={member._id || index}
            member={member}
            actionLoading={actionLoading}
            onMemberAction={onMemberAction}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            getStatusText={getStatusText}
          />
        ))}
      </tbody>
    </table>
  </div>
));

DesktopTableView.displayName = 'DesktopTableView';

// Memoized Summary Footer Component
const SummaryFooter = React.memo(({ 
  dueMembers, 
  statistics, 
  loading, 
  onSendAllReminders, 
  onExportData 
}) => {
  const handleSendAll = useCallback(() => {
    onSendAllReminders();
  }, [onSendAllReminders]);

  const handleExport = useCallback(() => {
    onExportData();
  }, [onExportData]);

  if (!dueMembers || dueMembers.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600 mb-2 md:mb-0">
          <span className="font-medium">Summary:</span> {statistics?.total || 0} total members with due payments
          {statistics?.overdue > 0 && (
            <span className="text-red-600 ml-2 font-medium">
              ({statistics.overdue} overdue)
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSendAll}
            disabled={loading || !dueMembers || dueMembers.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send All Reminders
              </>
            )}
          </button>
          <button
            onClick={handleExport}
            disabled={!dueMembers || dueMembers.length === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
});

SummaryFooter.displayName = 'SummaryFooter';

const DueMembersUI = ({
  dueMembers,
  loading,
  error,
  statistics,
  searchTerm,
  filterType,
  actionLoading,
  onRefresh,
  onSearchChange,
  onFilterChange,
  onMemberAction,
  onSendAllReminders,
  onExportData,
  formatDate,
  formatCurrency,
  getStatusColor,
  getStatusText
}) => {
  // Memoize handlers
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const handleSearchChange = useCallback((value) => {
    onSearchChange(value);
  }, [onSearchChange]);

  const handleFilterChange = useCallback((filter) => {
    onFilterChange(filter);
  }, [onFilterChange]);

  const handleMemberAction = useCallback((memberId, action) => {
    onMemberAction(memberId, action);
  }, [onMemberAction]);

  const handleSendAllReminders = useCallback(() => {
    onSendAllReminders();
  }, [onSendAllReminders]);

  const handleExportData = useCallback(() => {
    onExportData();
  }, [onExportData]);

  // Early return for loading state
  if (loading) {
    return <LoadingState />;
  }

  const hasMembers = dueMembers && dueMembers.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DueMembersHeader onRefresh={handleRefresh} loading={loading} />
        <StatisticsPanel statistics={statistics} />
        <ErrorBanner error={error} onRefresh={handleRefresh} />
        <SearchAndFilter
          searchTerm={searchTerm}
          filterType={filterType}
          statistics={statistics}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />

        {!hasMembers ? (
          <EmptyState
            error={error}
            searchTerm={searchTerm}
            filterType={filterType}
            onRefresh={handleRefresh}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <MobileView
              dueMembers={dueMembers}
              actionLoading={actionLoading}
              onMemberAction={handleMemberAction}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusText={getStatusText}
            />
            <DesktopTableView
              dueMembers={dueMembers}
              actionLoading={actionLoading}
              onMemberAction={handleMemberAction}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusText={getStatusText}
            />
          </div>
        )}

        <SummaryFooter
          dueMembers={dueMembers}
          statistics={statistics}
          loading={loading}
          onSendAllReminders={handleSendAllReminders}
          onExportData={handleExportData}
        />
      </div>
    </div>
  );
};

export default React.memo(DueMembersUI);