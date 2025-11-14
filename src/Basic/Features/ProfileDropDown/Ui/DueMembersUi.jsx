// import React, { useMemo, useCallback, useState, useEffect } from "react";

// // ==================== CUSTOM HOOKS (APIs unchanged) ====================

// const useFadeIn = (delay = 0) => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setIsVisible(true), delay);
//     return () => clearTimeout(timer);
//   }, [delay]);

//   return isVisible;
// };

// const useDebounce = (value, delay = 300) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

// // ==================== RESPONSIVE ICON COMPONENTS ====================

// const RefreshIcon = React.memo(() => (
//   <svg
//     className="w-3 h-3 sm:w-4 sm:h-4"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     aria-hidden="true"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//     />
//   </svg>
// ));
// RefreshIcon.displayName = "RefreshIcon";

// const BackIcon = React.memo(() => (
//   <svg
//     className="w-3 h-3 sm:w-4 sm:h-4"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     aria-hidden="true"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M10 19l-7-7m0 0l7-7m-7 7h18"
//     />
//   </svg>
// ));
// BackIcon.displayName = "BackIcon";

// const SearchIcon = React.memo(() => (
//   <svg
//     className="w-4 h-4 sm:w-5 sm:h-5"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     aria-hidden="true"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//     />
//   </svg>
// ));
// SearchIcon.displayName = "SearchIcon";

// const MailIcon = React.memo(() => (
//   <svg
//     className="w-4 h-4 sm:w-5 sm:h-5"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     aria-hidden="true"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//     />
//   </svg>
// ));
// MailIcon.displayName = "MailIcon";

// const CheckIcon = React.memo(() => (
//   <svg
//     className="w-4 h-4 sm:w-5 sm:h-5"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     aria-hidden="true"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//     />
//   </svg>
// ));
// CheckIcon.displayName = "CheckIcon";

// const EyeIcon = React.memo(() => (
//   <svg
//     className="w-4 h-4 sm:w-5 sm:h-5"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     aria-hidden="true"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//     />
//   </svg>
// ));
// EyeIcon.displayName = "EyeIcon";

// // ==================== RESPONSIVE COMPONENTS ====================

// const LoadingState = React.memo(() => (
//   <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//     <div className="text-center">
//       <div
//         className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"
//         role="status"
//         aria-label="Loading due members"
//       />
//       <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading due members...</p>
//     </div>
//   </div>
// ));
// LoadingState.displayName = "LoadingState";

// const LoadingSpinner = React.memo(
//   ({ size = "h-4 w-4", color = "border-blue-600" }) => (
//     <div
//       className={`animate-spin rounded-full border-b-2 ${size} ${color}`}
//       role="status"
//       aria-label="Loading"
//     />
//   )
// );
// LoadingSpinner.displayName = "LoadingSpinner";

// // Responsive Header Component
// const DueMembersHeader = React.memo(
//   ({ onRefresh, onBackToDashboard, loading }) => {
//     const isVisible = useFadeIn(0);

//     const handleRefresh = useCallback(() => {
//       onRefresh();
//     }, [onRefresh]);

//     const handleBack = useCallback(() => {
//       onBackToDashboard();
//     }, [onBackToDashboard]);

//     const headerClass = useMemo(
//       () =>
//         `mb-4 sm:mb-6 md:mb-8 transition-opacity duration-500 ${
//           isVisible ? "opacity-100" : "opacity-0"
//         }`,
//       [isVisible]
//     );

//     return (
//       <div className={headerClass}>
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
//           <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
//             <button
//               onClick={handleBack}
//               className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 transition-colors text-sm sm:text-base"
//               aria-label="Back to dashboard"
//             >
//               <BackIcon />
//               <span className="hidden sm:inline">Back</span>
//             </button>
//             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Due Members</h1>
//           </div>
//           <button
//             onClick={handleRefresh}
//             disabled={loading}
//             className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors text-sm sm:text-base"
//             aria-label={loading ? "Loading" : "Refresh due members"}
//           >
//             <RefreshIcon />
//             {loading ? "Loading..." : "Refresh"}
//           </button>
//         </div>
//       </div>
//     );
//   },
//   (prevProps, nextProps) => {
//     return prevProps.loading === nextProps.loading;
//   }
// );
// DueMembersHeader.displayName = "DueMembersHeader";

// // Responsive Statistic Card
// const StatCard = React.memo(
//   ({ icon, title, value, color, index }) => {
//     const isVisible = useFadeIn(index * 50);

//     const cardClass = useMemo(
//       () =>
//         `bg-white rounded-lg p-3 sm:p-4 shadow-sm border transition-all duration-500 ${
//           isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//         }`,
//       [isVisible]
//     );

//     return (
//       <div className={cardClass}>
//         <div className="flex items-center">
//           <div className={`p-1.5 sm:p-2 ${color.bg} rounded-lg flex-shrink-0`}>{icon}</div>
//           <div className="ml-2 sm:ml-3 md:ml-4 min-w-0">
//             <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
//             <p className={`text-lg sm:text-xl md:text-2xl font-bold ${color.text}`}>{value}</p>
//           </div>
//         </div>
//       </div>
//     );
//   },
//   (prevProps, nextProps) => {
//     return (
//       prevProps.value === nextProps.value && prevProps.title === nextProps.title
//     );
//   }
// );
// StatCard.displayName = "StatCard";

// // Responsive Statistics Panel
// const StatisticsPanel = React.memo(
//   ({ statistics }) => {
//     const statsConfig = useMemo(
//       () => [
//         {
//           icon: (
//             <svg
//               className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
//               />
//             </svg>
//           ),
//           title: "Total Due",
//           value: statistics?.total || 0,
//           color: { bg: "bg-blue-100", text: "text-gray-900" },
//         },
//         {
//           icon: (
//             <svg
//               className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
//               />
//             </svg>
//           ),
//           title: "Coming Due",
//           value: statistics?.comingDue || 0,
//           color: { bg: "bg-blue-100", text: "text-blue-600" },
//         },
//         {
//           icon: (
//             <svg
//               className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           ),
//           title: "Due Today",
//           value: statistics?.dueToday || 0,
//           color: { bg: "bg-yellow-100", text: "text-yellow-600" },
//         },
//         {
//           icon: (
//             <svg
//               className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z"
//               />
//             </svg>
//           ),
//           title: "Pending/Overdue",
//           value: statistics?.pending || 0,
//           color: { bg: "bg-orange-100", text: "text-orange-600" },
//         },
//       ],
//       [statistics]
//     );

//     return (
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
//         {statsConfig.map((stat, index) => (
//           <StatCard key={`stat-${index}`} {...stat} index={index} />
//         ))}
//       </div>
//     );
//   },
//   (prevProps, nextProps) => {
//     return (
//       JSON.stringify(prevProps.statistics) ===
//       JSON.stringify(nextProps.statistics)
//     );
//   }
// );
// StatisticsPanel.displayName = "StatisticsPanel";

// // Responsive Error Banner
// const ErrorBanner = React.memo(
//   ({ error, onRefresh }) => {
//     if (!error) return null;

//     const handleRefresh = useCallback(() => {
//       onRefresh();
//     }, [onRefresh]);

//     return (
//       <div
//         className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 animate-in fade-in duration-300"
//         role="alert"
//       >
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
//           <svg
//             className="w-5 h-5 text-red-600 mr-0 sm:mr-2 flex-shrink-0"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
//             />
//           </svg>
//           <p className="text-red-700 flex-1 text-sm sm:text-base">{error}</p>
//           <button
//             onClick={handleRefresh}
//             className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4 bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700 px-3 py-1.5 sm:py-1 rounded-md text-sm transition-colors"
//             aria-label="Retry loading"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   },
//   (prevProps, nextProps) => {
//     return prevProps.error === nextProps.error;
//   }
// );
// ErrorBanner.displayName = "ErrorBanner";

// // Responsive Search Input
// const SearchInput = React.memo(({ searchTerm, onSearchChange }) => {
//   const [localSearch, setLocalSearch] = useState(searchTerm);
//   const debouncedSearch = useDebounce(localSearch, 300);

//   useEffect(() => {
//     onSearchChange(debouncedSearch);
//   }, [debouncedSearch, onSearchChange]);

//   const handleChange = useCallback((e) => {
//     setLocalSearch(e.target.value);
//   }, []);

//   return (
//     <div className="flex-1">
//       <label htmlFor="member-search" className="sr-only">
//         Search members
//       </label>
//       <div className="relative">
//         <input
//           type="text"
//           id="member-search"
//           name="memberSearch"
//           placeholder="Search by name, email, phone..."
//           value={localSearch}
//           onChange={handleChange}
//           className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
//           aria-label="Search members"
//         />
//         <div className="absolute left-2 sm:left-3 top-2 sm:top-2.5 text-gray-400">
//           <SearchIcon />
//         </div>
//       </div>
//     </div>
//   );
// });
// SearchInput.displayName = "SearchInput";

// // Responsive Filter Buttons
// const FilterButtons = React.memo(
//   ({ filterType, onFilterChange }) => {
//     const filters = useMemo(
//       () => ["all", "comingDue", "dueToday", "pending"],
//       []
//     );

//     const filterLabels = useMemo(
//       () => ({
//         all: "All",
//         comingDue: "Coming",
//         dueToday: "Today",
//         pending: "Overdue",
//       }),
//       []
//     );

//     const filterLabelsLong = useMemo(
//       () => ({
//         all: "All",
//         comingDue: "Coming Due",
//         dueToday: "Due Today",
//         pending: "Pending/Overdue",
//       }),
//       []
//     );

//     const handleFilterClick = useCallback(
//       (filter) => {
//         onFilterChange(filter);
//       },
//       [onFilterChange]
//     );

//     const getButtonClass = useCallback(
//       (filter) => {
//         return `px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
//           filterType === filter
//             ? "bg-blue-600 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
//         }`;
//       },
//       [filterType]
//     );

//     return (
//       <div className="flex gap-1.5 sm:gap-2 flex-wrap">
//         {filters.map((filter) => (
//           <button
//             key={filter}
//             onClick={() => handleFilterClick(filter)}
//             className={getButtonClass(filter)}
//             aria-label={`Filter: ${filterLabelsLong[filter]}`}
//             aria-pressed={filterType === filter}
//           >
//             <span className="sm:hidden">{filterLabels[filter]}</span>
//             <span className="hidden sm:inline">{filterLabelsLong[filter]}</span>
//           </button>
//         ))}
//       </div>
//     );
//   },
//   (prevProps, nextProps) => {
//     return prevProps.filterType === nextProps.filterType;
//   }
// );
// FilterButtons.displayName = "FilterButtons";

// // Responsive Search and Filter
// const SearchAndFilter = React.memo(
//   ({ searchTerm, filterType, statistics, onSearchChange, onFilterChange }) => {
//     const filterInfo = useMemo(() => {
//       const parts = [];
//       if (searchTerm) parts.push(`Searching for: "${searchTerm}"`);
//       if (filterType !== "all") {
//         const labels = {
//           comingDue: "Coming Due (Next 4 Days)",
//           dueToday: "Due Today",
//           pending: "Pending/Overdue",
//         };
//         parts.push(`Filter: ${labels[filterType]}`);
//       }
//       return parts.length > 0 ? ` • ${parts.join(" • ")}` : "";
//     }, [searchTerm, filterType]);

//     return (
//       <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 mb-4 sm:mb-6">
//         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//           <SearchInput
//             searchTerm={searchTerm}
//             onSearchChange={onSearchChange}
//           />
//           <FilterButtons
//             filterType={filterType}
//             onFilterChange={onFilterChange}
//           />
//         </div>
//         <div className="mt-2 text-xs sm:text-sm text-gray-500">
//           Showing {statistics?.filtered || 0} of {statistics?.total || 0}{" "}
//           members
//           <span className="text-blue-600 block sm:inline">{filterInfo}</span>
//         </div>
//       </div>
//     );
//   }
// );
// SearchAndFilter.displayName = "SearchAndFilter";

// // Responsive Empty State
// const EmptyState = React.memo(
//   ({ error, searchTerm, filterType, onRefresh }) => {
//     const handleRefresh = useCallback(() => {
//       onRefresh();
//     }, [onRefresh]);

//     const message = useMemo(() => {
//       if (error) return "Unable to load due members data.";
//       if (searchTerm || filterType !== "all") {
//         return "No members match your current search or filter criteria.";
//       }
//       return "All members are up to date with their payments.";
//     }, [error, searchTerm, filterType]);

//     return (
//       <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center">
//         <svg
//           className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           aria-hidden="true"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
//           />
//         </svg>
//         <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
//           No Due Members Found
//         </h3>
//         <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">{message}</p>
//         {error && (
//           <button
//             onClick={handleRefresh}
//             className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
//             aria-label="Try again to load members"
//           >
//             Try Again
//           </button>
//         )}
//       </div>
//     );
//   },
//   (prevProps, nextProps) => {
//     return (
//       prevProps.error === nextProps.error &&
//       prevProps.searchTerm === nextProps.searchTerm &&
//       prevProps.filterType === nextProps.filterType
//     );
//   }
// );
// EmptyState.displayName = "EmptyState";

// // Responsive Member Card (Mobile)
// const MemberCard = React.memo(
//   ({
//     member,
//     index,
//     actionLoading,
//     onMemberAction,
//     formatDate,
//     formatCurrency,
//     getStatusText,
//   }) => {
//     const isVisible = useFadeIn(Math.min(index * 30, 500));

//     const statusClass = useMemo(() => {
//       if (member.isOverdue) return "bg-red-100 text-red-800";
//       if (member.isDueToday) return "bg-yellow-100 text-yellow-800";
//       if (member.isComingDue) return "bg-blue-100 text-blue-800";
//       if (member.paymentStatus === "Pending")
//         return "bg-orange-100 text-orange-800";
//       return "bg-gray-100 text-gray-800";
//     }, [
//       member.isOverdue,
//       member.isDueToday,
//       member.isComingDue,
//       member.paymentStatus,
//     ]);

//     const amount = useMemo(
//       () => member.feesAmount || member.feeAmount || member.amount,
//       [member.feesAmount, member.feeAmount, member.amount]
//     );

//     const memberInitial = useMemo(
//       () => member.name?.charAt(0)?.toUpperCase() || "M",
//       [member.name]
//     );

//     const memberId = useMemo(
//       () => member.memberId || member._id?.slice(-6) || "N/A",
//       [member.memberId, member._id]
//     );

//     const handleAction = useCallback(
//       (action) => {
//         onMemberAction(member._id, action);
//       },
//       [member._id, onMemberAction]
//     );

//     const cardClass = useMemo(
//       () =>
//         `border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50 transition-all duration-300 ${
//           isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//         }`,
//       [isVisible]
//     );

//     const isActionLoading = useCallback(
//       (action) => actionLoading[member._id] === action,
//       [actionLoading, member._id]
//     );

//     return (
//       <div className={cardClass}>
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex items-center min-w-0 flex-1">
//             <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
//               <span className="text-xs sm:text-sm font-medium text-white">
//                 {memberInitial}
//               </span>
//             </div>
//             <div className="ml-2 sm:ml-3 min-w-0 flex-1">
//               <div className="text-sm font-medium text-gray-900 truncate">
//                 {member.name || "N/A"}
//               </div>
//               <div className="text-xs text-gray-500">ID: {memberId}</div>
//             </div>
//           </div>
//           <span
//             className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${statusClass} ml-2 flex-shrink-0`}
//           >
//             {getStatusText(member)}
//           </span>
//         </div>

//         <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
//           <div className="flex justify-between gap-2">
//             <span className="text-gray-500 flex-shrink-0">Email:</span>
//             <span className="text-gray-900 truncate text-right">
//               {member.email || "N/A"}
//             </span>
//           </div>
//           <div className="flex justify-between gap-2">
//             <span className="text-gray-500 flex-shrink-0">Phone:</span>
//             <span className="text-gray-900 text-right">{member.phoneNo || "N/A"}</span>
//           </div>
//           <div className="flex justify-between gap-2">
//             <span className="text-gray-500 flex-shrink-0">Due Date:</span>
//             <span className="text-gray-900 text-right">
//               {formatDate(member.nextDueDate)}
//             </span>
//           </div>
//           <div className="flex justify-between gap-2">
//             <span className="text-gray-500 flex-shrink-0">Amount:</span>
//             <span className="text-gray-900 font-medium text-right">
//               {formatCurrency(amount)}
//             </span>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-4 pt-3 border-t border-gray-200">
//           <button
//             onClick={() => handleAction("sendReminder")}
//             disabled={isActionLoading("sendReminder")}
//             className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 disabled:bg-blue-25 disabled:text-blue-400 py-1.5 sm:py-2 px-3 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center"
//             aria-label="Send reminder"
//           >
//             {isActionLoading("sendReminder") ? (
//               <LoadingSpinner size="h-3 w-3 sm:h-4 sm:w-4" />
//             ) : (
//               "Send Reminder"
//             )}
//           </button>
//           <button
//             onClick={() => handleAction("markPaid")}
//             disabled={isActionLoading("markPaid")}
//             className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200 disabled:bg-green-25 disabled:text-green-400 py-1.5 sm:py-2 px-3 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center"
//             aria-label="Mark as paid"
//           >
//             {isActionLoading("markPaid") ? (
//               <LoadingSpinner size="h-3 w-3 sm:h-4 sm:w-4" color="border-green-600" />
//             ) : (
//               "Mark Paid"
//             )}
//           </button>
//           <button
//             onClick={() => handleAction("viewDetails")}
//             disabled={isActionLoading("viewDetails")}
//             className="sm:flex-none bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-25 disabled:text-gray-400 py-1.5 sm:py-2 px-3 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center"
//             aria-label="View details"
//           >
//             {isActionLoading("viewDetails") ? (
//               <LoadingSpinner size="h-3 w-3 sm:h-4 sm:w-4" color="border-gray-600" />
//             ) : (
//               "Details"
//             )}
//           </button>
//         </div>
//       </div>
//     );
//   },
//   (prevProps, nextProps) => {
//     return (
//       prevProps.member._id === nextProps.member._id &&
//       prevProps.member.name === nextProps.member.name &&
//       prevProps.member.paymentStatus === nextProps.member.paymentStatus &&
//       JSON.stringify(prevProps.actionLoading) ===
//         JSON.stringify(nextProps.actionLoading)
//     );
//   }
// );
// MemberCard.displayName = "MemberCard";

// // Mobile View Component
// const MobileView = React.memo(
//   ({
//     dueMembers,
//     actionLoading,
//     onMemberAction,
//     formatDate,
//     formatCurrency,
//     getStatusText,
//   }) => (
//     <div className="block lg:hidden">
//       <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
//         {dueMembers.map((member, index) => (
//           <MemberCard
//             key={member._id || index}
//             member={member}
//             index={index}
//             actionLoading={actionLoading}
//             onMemberAction={onMemberAction}
//             formatDate={formatDate}
//             formatCurrency={formatCurrency}
//             getStatusText={getStatusText}
//           />
//         ))}
//       </div>
//     </div>
//   )
// );
// MobileView.displayName = "MobileView";

// // Table Row Component
// const MemberTableRow = React.memo(
//   ({
//     member,
//     actionLoading,
//     onMemberAction,
//     formatDate,
//     formatCurrency,
//     getStatusText,
//   }) => {
//     const statusClass = useMemo(() => {
//       if (member.isOverdue) return "bg-red-100 text-red-800";
//       if (member.isDueToday) return "bg-yellow-100 text-yellow-800";
//       if (member.isComingDue) return "bg-blue-100 text-blue-800";
//       if (member.paymentStatus === "Pending")
//         return "bg-orange-100 text-orange-800";
//       return "bg-gray-100 text-gray-800";
//     }, [
//       member.isOverdue,
//       member.isDueToday,
//       member.isComingDue,
//       member.paymentStatus,
//     ]);

//     const amount = useMemo(
//       () => member.feesAmount || member.feeAmount || member.amount,
//       [member.feesAmount, member.feeAmount, member.amount]
//     );

//     const memberInitial = useMemo(
//       () => member.name?.charAt(0)?.toUpperCase() || "M",
//       [member.name]
//     );

//     const memberId = useMemo(
//       () => member.memberId || member._id?.slice(-6) || "N/A",
//       [member.memberId, member._id]
//     );

//     const handleAction = useCallback(
//       (action) => {
//         onMemberAction(member._id, action);
//       },
//       [member._id, onMemberAction]
//     );

//     const isActionLoading = useCallback(
//       (action) => actionLoading[member._id] === action,
//       [actionLoading, member._id]
//     );

//     return (
//       <tr className="hover:bg-gray-50 transition-colors">
//         <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10">
//               <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-blue-500 flex items-center justify-center">
//                 <span className="text-xs lg:text-sm font-medium text-white">
//                   {memberInitial}
//                 </span>
//               </div>
//             </div>
//             <div className="ml-3 lg:ml-4">
//               <div className="text-xs lg:text-sm font-medium text-gray-900">
//                 {member.name || "N/A"}
//               </div>
//               <div className="text-xs lg:text-sm text-gray-500">ID: {memberId}</div>
//             </div>
//           </div>
//         </td>
//         <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
//           <div className="text-xs lg:text-sm text-gray-900 truncate max-w-[150px] lg:max-w-xs">
//             {member.email || "N/A"}
//           </div>
//           <div className="text-xs lg:text-sm text-gray-500">{member.phoneNo || "N/A"}</div>
//         </td>
//         <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
//           <div>{formatDate(member.nextDueDate)}</div>
//           {member.lastPaidOn && (
//             <div className="text-[10px] lg:text-xs text-gray-500">
//               Last paid: {formatDate(member.lastPaidOn)}
//             </div>
//           )}
//         </td>
//         <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
//           <span
//             className={`inline-flex items-center px-2 lg:px-2.5 py-0.5 rounded-full text-[10px] lg:text-xs font-medium ${statusClass}`}
//           >
//             {getStatusText(member)}
//           </span>
//         </td>
//         <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
//           <div className="font-medium">{formatCurrency(amount)}</div>
//           {member.planDuration && (
//             <div className="text-[10px] lg:text-xs text-gray-500">{member.planDuration}</div>
//           )}
//         </td>
//         <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
//           <div className="flex space-x-1 lg:space-x-2">
//             <button
//               onClick={() => handleAction("sendReminder")}
//               disabled={isActionLoading("sendReminder")}
//               className="text-blue-600 hover:text-blue-900 active:text-blue-700 disabled:text-blue-300 transition-colors p-1 rounded"
//               title="Send Reminder"
//               aria-label="Send reminder email"
//             >
//               {isActionLoading("sendReminder") ? (
//                 <LoadingSpinner size="h-4 w-4 lg:h-5 lg:w-5" />
//               ) : (
//                 <MailIcon />
//               )}
//             </button>
//             <button
//               onClick={() => handleAction("markPaid")}
//               disabled={isActionLoading("markPaid")}
//               className="text-green-600 hover:text-green-900 active:text-green-700 disabled:text-green-300 transition-colors p-1 rounded"
//               title="Mark as Paid"
//               aria-label="Mark member as paid"
//             >
//               {isActionLoading("markPaid") ? (
//                 <LoadingSpinner size="h-4 w-4 lg:h-5 lg:w-5" color="border-green-600" />
//               ) : (
//                 <CheckIcon />
//               )}
//             </button>
//             <button
//               onClick={() => handleAction("viewDetails")}
//               disabled={isActionLoading("viewDetails")}
//               className="text-gray-600 hover:text-gray-900 active:text-gray-700 disabled:text-gray-300 transition-colors p-1 rounded"
//               title="View Details"
//               aria-label="View member details"
//             >
//               {isActionLoading("viewDetails") ? (
//                 <LoadingSpinner size="h-4 w-4 lg:h-5 lg:w-5" color="border-gray-600" />
//               ) : (
//                 <EyeIcon />
//               )}
//             </button>
//           </div>
//         </td>
//       </tr>
//     );
//   },
//   (prevProps, nextProps) => {
//     return (
//       prevProps.member._id === nextProps.member._id &&
//       prevProps.member.name === nextProps.member.name &&
//       prevProps.member.paymentStatus === nextProps.member.paymentStatus &&
//       JSON.stringify(prevProps.actionLoading) ===
//         JSON.stringify(nextProps.actionLoading)
//     );
//   }
// );
// MemberTableRow.displayName = "MemberTableRow";

// // Desktop Table View Component
// const DesktopTableView = React.memo(
//   ({
//     dueMembers,
//     actionLoading,
//     onMemberAction,
//     formatDate,
//     formatCurrency,
//     getStatusText,
//   }) => (
//     <div className="hidden lg:block overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th
//               scope="col"
//               className="px-4 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Member
//             </th>
//             <th
//               scope="col"
//               className="px-4 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Contact
//             </th>
//             <th
//               scope="col"
//               className="px-4 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Due Date
//             </th>
//             <th
//               scope="col"
//               className="px-4 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Status
//             </th>
//             <th
//               scope="col"
//               className="px-4 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Amount
//             </th>
//             <th
//               scope="col"
//               className="px-4 lg:px-6 py-2 lg:py-3 text-left text-[10px] lg:text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {dueMembers.map((member, index) => (
//             <MemberTableRow
//               key={member._id || index}
//               member={member}
//               actionLoading={actionLoading}
//               onMemberAction={onMemberAction}
//               formatDate={formatDate}
//               formatCurrency={formatCurrency}
//               getStatusText={getStatusText}
//             />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// );
// DesktopTableView.displayName = "DesktopTableView";

// // Summary Footer Component
// const SummaryFooter = React.memo(
//   ({ dueMembers, statistics, loading, onSendAllReminders, onExportData }) => {
//     const handleSendAll = useCallback(() => {
//       onSendAllReminders();
//     }, [onSendAllReminders]);

//     const handleExport = useCallback(() => {
//       onExportData();
//     }, [onExportData]);

//     const summaryText = useMemo(() => {
//       const total = statistics?.total || 0;
//       const pending = statistics?.pending || 0;
//       return { total, pending };
//     }, [statistics]);

//     const hasMembers = dueMembers && dueMembers.length > 0;

//     if (!dueMembers || dueMembers.length === 0) return null;

//     return (
//       <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow-sm border p-3 sm:p-4">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
//           <div className="text-xs sm:text-sm text-gray-600">
//             <span className="font-medium">Summary:</span> {summaryText.total}{" "}
//             total members with due payments
//             {summaryText.pending > 0 && (
//               <span className="text-orange-600 ml-2 font-medium block sm:inline mt-1 sm:mt-0">
//                 ({summaryText.pending} pending/overdue)
//               </span>
//             )}
//           </div>
//           <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
//             <button
//               onClick={handleSendAll}
//               disabled={loading || !hasMembers}
//               className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
//               aria-label="Send reminders to all members"
//             >
//               {loading ? (
//                 <>
//                   <LoadingSpinner size="h-3 w-3 sm:h-4 sm:w-4" />
//                   <span>Sending...</span>
//                 </>
//               ) : (
//                 <>
//                   <MailIcon />
//                   <span>Send All Reminders</span>
//                 </>
//               )}
//             </button>
//             <button
//               onClick={handleExport}
//               disabled={!hasMembers}
//               className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 active:bg-gray-800 disabled:bg-gray-400 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
//               aria-label="Export member data"
//             >
//               <svg
//                 className="w-3 h-3 sm:w-4 sm:h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//               <span>Export Data</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   },
//   (prevProps, nextProps) => {
//     return (
//       prevProps.loading === nextProps.loading &&
//       prevProps.dueMembers?.length === nextProps.dueMembers?.length &&
//       JSON.stringify(prevProps.statistics) ===
//         JSON.stringify(nextProps.statistics)
//     );
//   }
// );
// SummaryFooter.displayName = "SummaryFooter";

// // ==================== MAIN COMPONENT ====================

// const DueMembersUI = ({
//   dueMembers,
//   loading,
//   error,
//   statistics,
//   searchTerm,
//   filterType,
//   actionLoading,
//   onRefresh,
//   onBackToDashboard,
//   onSearchChange,
//   onFilterChange,
//   onMemberAction,
//   onSendAllReminders,
//   onExportData,
//   formatDate,
//   formatCurrency,
//   getStatusColor,
//   getStatusText,
// }) => {
//   const handleRefresh = useCallback(() => {
//     onRefresh();
//   }, [onRefresh]);

//   const handleBackToDashboard = useCallback(() => {
//     onBackToDashboard();
//   }, [onBackToDashboard]);

//   const handleSearchChange = useCallback(
//     (value) => {
//       onSearchChange(value);
//     },
//     [onSearchChange]
//   );

//   const handleFilterChange = useCallback(
//     (filter) => {
//       onFilterChange(filter);
//     },
//     [onFilterChange]
//   );

//   const handleMemberAction = useCallback(
//     (memberId, action) => {
//       onMemberAction(memberId, action);
//     },
//     [onMemberAction]
//   );

//   const handleSendAllReminders = useCallback(() => {
//     onSendAllReminders();
//   }, [onSendAllReminders]);

//   const handleExportData = useCallback(() => {
//     onExportData();
//   }, [onExportData]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if ((e.ctrlKey || e.metaKey) && e.key === "r" && !loading) {
//         e.preventDefault();
//         handleRefresh();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [loading, handleRefresh]);

//   if (loading) {
//     return <LoadingState />;
//   }

//   const hasMembers = dueMembers && dueMembers.length > 0;

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         <DueMembersHeader
//           onRefresh={handleRefresh}
//           onBackToDashboard={handleBackToDashboard}
//           loading={loading}
//         />
//         <StatisticsPanel statistics={statistics} />
//         <ErrorBanner error={error} onRefresh={handleRefresh} />
//         <SearchAndFilter
//           searchTerm={searchTerm}
//           filterType={filterType}
//           statistics={statistics}
//           onSearchChange={handleSearchChange}
//           onFilterChange={handleFilterChange}
//         />

//         {!hasMembers ? (
//           <EmptyState
//             error={error}
//             searchTerm={searchTerm}
//             filterType={filterType}
//             onRefresh={handleRefresh}
//           />
//         ) : (
//           <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//             <MobileView
//               dueMembers={dueMembers}
//               actionLoading={actionLoading}
//               onMemberAction={handleMemberAction}
//               formatDate={formatDate}
//               formatCurrency={formatCurrency}
//               getStatusText={getStatusText}
//             />
//             <DesktopTableView
//               dueMembers={dueMembers}
//               actionLoading={actionLoading}
//               onMemberAction={handleMemberAction}
//               formatDate={formatDate}
//               formatCurrency={formatCurrency}
//               getStatusText={getStatusText}
//             />
//           </div>
//         )}

//         <SummaryFooter
//           dueMembers={dueMembers}
//           statistics={statistics}
//           loading={loading}
//           onSendAllReminders={handleSendAllReminders}
//           onExportData={handleExportData}
//         />
//       </div>
//     </div>
//   );
// };

// export default React.memo(DueMembersUI, (prevProps, nextProps) => {
//   return (
//     prevProps.loading === nextProps.loading &&
//     prevProps.error === nextProps.error &&
//     prevProps.searchTerm === nextProps.searchTerm &&
//     prevProps.filterType === nextProps.filterType &&
//     prevProps.dueMembers?.length === nextProps.dueMembers?.length &&
//     JSON.stringify(prevProps.statistics) ===
//       JSON.stringify(nextProps.statistics) &&
//     JSON.stringify(prevProps.actionLoading) ===
//       JSON.stringify(nextProps.actionLoading)
//   );
// });

import React, { useMemo, useCallback, useState, useEffect } from "react";

// ==================== CUSTOM HOOKS (APIs unchanged) ====================

const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ==================== RESPONSIVE ICON COMPONENTS ====================

const RefreshIcon = React.memo(() => (
  <svg
    className="w-4 h-4 sm:w-5 sm:h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
));
RefreshIcon.displayName = "RefreshIcon";

const BackIcon = React.memo(() => (
  <svg
    className="w-4 h-4 sm:w-5 sm:h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
));
BackIcon.displayName = "BackIcon";

const SearchIcon = React.memo(() => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
));
SearchIcon.displayName = "SearchIcon";

const MailIcon = React.memo(() => (
  <svg
    className="w-4 h-4 sm:w-5 sm:h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
));
MailIcon.displayName = "MailIcon";

const CheckIcon = React.memo(() => (
  <svg
    className="w-4 h-4 sm:w-5 sm:h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
));
CheckIcon.displayName = "CheckIcon";

const EyeIcon = React.memo(() => (
  <svg
    className="w-4 h-4 sm:w-5 sm:h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
));
EyeIcon.displayName = "EyeIcon";

// ==================== RESPONSIVE COMPONENTS ====================

const LoadingState = React.memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <div
        className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500 mx-auto"
        role="status"
        aria-label="Loading due members"
      />
      <p className="mt-4 text-base text-gray-500 font-medium">
        Loading due members...
      </p>
    </div>
  </div>
));
LoadingState.displayName = "LoadingState";

const LoadingSpinner = React.memo(
  ({ size = "h-4 w-4", color = "border-blue-600" }) => (
    <div
      className={`animate-spin rounded-full border-2 border-transparent border-t-current ${size}`}
      role="status"
      aria-label="Loading"
    />
  )
);
LoadingSpinner.displayName = "LoadingSpinner";

// Responsive Header Component - IMPROVED WITH BETTER COLORS
const DueMembersHeader = React.memo(
  ({ onRefresh, onBackToDashboard, loading }) => {
    const isVisible = useFadeIn(0);

    const handleRefresh = useCallback(() => {
      onRefresh();
    }, [onRefresh]);

    const handleBack = useCallback(() => {
      onBackToDashboard();
    }, [onBackToDashboard]);

    const headerClass = useMemo(
      () =>
        `mb-6 transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`,
      [isVisible]
    );

    return (
      <div className={headerClass}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={handleBack}
              className="flex-shrink-0 bg-white hover:bg-gray-50 text-gray-700 p-2.5 rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200 active:scale-95"
              aria-label="Back to dashboard"
            >
              <BackIcon />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              Due Members
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            aria-label={loading ? "Loading" : "Refresh due members"}
          >
            <RefreshIcon />
          </button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.loading === nextProps.loading;
  }
);
DueMembersHeader.displayName = "DueMembersHeader";

// Responsive Statistic Card - FIXED OVERFLOW WITH LIGHT COLORS
const StatCard = React.memo(
  ({ icon, title, value, iconBg, iconColor, valueColor, index }) => {
    const isVisible = useFadeIn(index * 100);

    const cardClass = useMemo(
      () =>
        `bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`,
      [isVisible]
    );

    return (
      <div className={cardClass}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 ${iconBg} rounded-xl flex-shrink-0`}>
              <div className={iconColor}>{icon}</div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
              {title}
            </p>
          </div>
          <p className={`text-2xl sm:text-3xl font-bold ${valueColor} pl-0.5`}>
            {value}
          </p>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value && prevProps.title === nextProps.title
    );
  }
);
StatCard.displayName = "StatCard";

// Responsive Statistics Panel - FIXED OVERFLOW WITH LIGHT COLORS
const StatisticsPanel = React.memo(
  ({ statistics }) => {
    const statsConfig = useMemo(
      () => [
        {
          icon: (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
          ),
          title: "Total Due",
          value: statistics?.total || 0,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-500",
          valueColor: "text-gray-900",
        },
        {
          icon: (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          ),
          title: "Coming Due",
          value: statistics?.comingDue || 0,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-500",
          valueColor: "text-gray-900",
        },
        {
          icon: (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          title: "Due Today",
          value: statistics?.dueToday || 0,
          iconBg: "bg-yellow-50",
          iconColor: "text-yellow-500",
          valueColor: "text-gray-900",
        },
        {
          icon: (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ),
          title: "Pending/Overdue",
          value: statistics?.pending || 0,
          iconBg: "bg-orange-50",
          iconColor: "text-orange-500",
          valueColor: "text-gray-900",
        },
      ],
      [statistics]
    );

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statsConfig.map((stat, index) => (
          <StatCard key={`stat-${index}`} {...stat} index={index} />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.statistics) ===
      JSON.stringify(nextProps.statistics)
    );
  }
);
StatisticsPanel.displayName = "StatisticsPanel";

// Responsive Error Banner - IMPROVED
const ErrorBanner = React.memo(
  ({ error, onRefresh }) => {
    if (!error) return null;

    const handleRefresh = useCallback(() => {
      onRefresh();
    }, [onRefresh]);

    return (
      <div
        className="bg-red-50 border-l-4 border-red-600 rounded-xl p-4 mb-6 shadow-sm animate-in fade-in duration-300"
        role="alert"
      >
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
            aria-label="Retry loading"
          >
            Retry
          </button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.error === nextProps.error;
  }
);
ErrorBanner.displayName = "ErrorBanner";

// Responsive Search Input - FIXED WITH LIGHT COLORS
const SearchInput = React.memo(({ searchTerm, onSearchChange }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleChange = useCallback((e) => {
    setLocalSearch(e.target.value);
  }, []);

  return (
    <div className="flex-1">
      <label htmlFor="member-search" className="sr-only">
        Search members
      </label>
      <div className="relative">
        <input
          type="text"
          id="member-search"
          name="memberSearch"
          placeholder="Search by name, email, phone..."
          value={localSearch}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-3 text-sm sm:text-base border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white placeholder:text-gray-400"
          aria-label="Search members"
        />
        <div className="absolute left-3 top-3 text-gray-400">
          <SearchIcon />
        </div>
      </div>
    </div>
  );
});
SearchInput.displayName = "SearchInput";

// Responsive Filter Buttons - FIXED WITH LIGHT COLORS
const FilterButtons = React.memo(
  ({ filterType, onFilterChange }) => {
    const filters = useMemo(
      () => [
        { id: "all", label: "All", icon: "👥" },
        { id: "comingDue", label: "Coming", icon: "📅" },
        { id: "dueToday", label: "Today", icon: "⏰" },
        { id: "pending", label: "Overdue", icon: null },
      ],
      []
    );

    const handleFilterClick = useCallback(
      (filter) => {
        onFilterChange(filter);
      },
      [onFilterChange]
    );

    return (
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
              filterType === filter.id
                ? "bg-gray-800 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
            aria-label={`Filter: ${filter.label}`}
            aria-pressed={filterType === filter.id}
          >
            {filter.icon && <span className="mr-1.5">{filter.icon}</span>}
            {filter.label}
          </button>
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.filterType === nextProps.filterType;
  }
);
FilterButtons.displayName = "FilterButtons";

// Responsive Search and Filter - FIXED WITH LIGHT COLORS
const SearchAndFilter = React.memo(
  ({ searchTerm, filterType, statistics, onSearchChange, onFilterChange }) => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col gap-3">
          <SearchInput
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
          <FilterButtons
            filterType={filterType}
            onFilterChange={onFilterChange}
          />
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-blue-500">
              {statistics?.filtered || 0}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-700">
              {statistics?.total || 0}
            </span>{" "}
            members
          </p>
        </div>
      </div>
    );
  }
);
SearchAndFilter.displayName = "SearchAndFilter";

// Responsive Empty State - IMPROVED
const EmptyState = React.memo(
  ({ error, searchTerm, filterType, onRefresh }) => {
    const handleRefresh = useCallback(() => {
      onRefresh();
    }, [onRefresh]);

    const message = useMemo(() => {
      if (error) return "Unable to load due members data.";
      if (searchTerm || filterType !== "all") {
        return "No members match your current search or filter criteria.";
      }
      return "All members are up to date with their payments. Great job! 🎉";
    }, [error, searchTerm, filterType]);

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          No Due Members Found
        </h3>
        <p className="text-base text-gray-500 mb-4 max-w-md mx-auto">
          {message}
        </p>
        {error && (
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
            aria-label="Try again to load members"
          >
            Try Again
          </button>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.error === nextProps.error &&
      prevProps.searchTerm === nextProps.searchTerm &&
      prevProps.filterType === nextProps.filterType
    );
  }
);
EmptyState.displayName = "EmptyState";

// Responsive Member Card (Mobile) - IMPROVED
const MemberCard = React.memo(
  ({
    member,
    index,
    actionLoading,
    onMemberAction,
    formatDate,
    formatCurrency,
    getStatusText,
  }) => {
    const isVisible = useFadeIn(Math.min(index * 50, 500));

    const statusConfig = useMemo(() => {
      if (member.isOverdue) return { bg: "bg-red-500", text: "text-white" };
      if (member.isDueToday) return { bg: "bg-amber-500", text: "text-white" };
      if (member.isComingDue) return { bg: "bg-blue-500", text: "text-white" };
      if (member.paymentStatus === "Pending")
        return { bg: "bg-orange-500", text: "text-white" };
      return { bg: "bg-gray-500", text: "text-white" };
    }, [
      member.isOverdue,
      member.isDueToday,
      member.isComingDue,
      member.paymentStatus,
    ]);

    const amount = useMemo(
      () => member.feesAmount || member.feeAmount || member.amount,
      [member.feesAmount, member.feeAmount, member.amount]
    );

    const memberInitial = useMemo(
      () => member.name?.charAt(0)?.toUpperCase() || "M",
      [member.name]
    );

    const memberId = useMemo(
      () => member.memberId || member._id?.slice(-6) || "N/A",
      [member.memberId, member._id]
    );

    const handleAction = useCallback(
      (action) => {
        onMemberAction(member._id, action);
      },
      [member._id, onMemberAction]
    );

    const cardClass = useMemo(
      () =>
        `bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`,
      [isVisible]
    );

    const isActionLoading = useCallback(
      (action) => actionLoading[member._id] === action,
      [actionLoading, member._id]
    );

    return (
      <div className={cardClass}>
        {/* Header with Avatar and Status */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-lg font-bold text-white">
              {memberInitial}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-800 truncate">
              {member.name || "N/A"}
            </h3>
            <p className="text-xs text-gray-500">ID: {memberId}</p>
          </div>
          <span
            className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.text} shadow-sm`}
          >
            {getStatusText(member)}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-500">Email:</span>
            <span className="text-gray-700 truncate ml-2 max-w-[60%] text-right font-medium">
              {member.email || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-500">Phone:</span>
            <span className="text-gray-700 text-right font-medium">
              {member.phoneNo || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-500">Due Date:</span>
            <span className="text-gray-800 font-semibold text-right">
              {formatDate(member.nextDueDate)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-gray-100">
            <span className="text-gray-500">Amount:</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 text-right">
              {formatCurrency(amount)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleAction("sendReminder")}
            disabled={isActionLoading("sendReminder")}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2.5 rounded-xl font-medium text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center active:scale-95"
            aria-label="Send reminder"
          >
            {isActionLoading("sendReminder") ? (
              <LoadingSpinner size="h-4 w-4" />
            ) : (
              <MailIcon />
            )}
          </button>
          <button
            onClick={() => handleAction("markPaid")}
            disabled={isActionLoading("markPaid")}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-2.5 rounded-xl font-medium text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center active:scale-95"
            aria-label="Mark as paid"
          >
            {isActionLoading("markPaid") ? (
              <LoadingSpinner size="h-4 w-4" />
            ) : (
              <CheckIcon />
            )}
          </button>
          <button
            onClick={() => handleAction("viewDetails")}
            disabled={isActionLoading("viewDetails")}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white py-2.5 rounded-xl font-medium text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center active:scale-95"
            aria-label="View details"
          >
            {isActionLoading("viewDetails") ? (
              <LoadingSpinner size="h-4 w-4" />
            ) : (
              <EyeIcon />
            )}
          </button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.member._id === nextProps.member._id &&
      prevProps.member.name === nextProps.member.name &&
      prevProps.member.paymentStatus === nextProps.member.paymentStatus &&
      JSON.stringify(prevProps.actionLoading) ===
        JSON.stringify(nextProps.actionLoading)
    );
  }
);
MemberCard.displayName = "MemberCard";

// Mobile View Component
const MobileView = React.memo(
  ({
    dueMembers,
    actionLoading,
    onMemberAction,
    formatDate,
    formatCurrency,
    getStatusText,
  }) => (
    <div className="block lg:hidden">
      <div className="space-y-4">
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
  )
);
MobileView.displayName = "MobileView";

// Table Row Component (keeping similar to original for desktop)
const MemberTableRow = React.memo(
  ({
    member,
    actionLoading,
    onMemberAction,
    formatDate,
    formatCurrency,
    getStatusText,
  }) => {
    const statusClass = useMemo(() => {
      if (member.isOverdue) return "bg-red-100 text-red-800";
      if (member.isDueToday) return "bg-yellow-100 text-yellow-800";
      if (member.isComingDue) return "bg-blue-100 text-blue-800";
      if (member.paymentStatus === "Pending")
        return "bg-orange-100 text-orange-800";
      return "bg-gray-100 text-gray-800";
    }, [
      member.isOverdue,
      member.isDueToday,
      member.isComingDue,
      member.paymentStatus,
    ]);

    const amount = useMemo(
      () => member.feesAmount || member.feeAmount || member.amount,
      [member.feesAmount, member.feeAmount, member.amount]
    );

    const memberInitial = useMemo(
      () => member.name?.charAt(0)?.toUpperCase() || "M",
      [member.name]
    );

    const memberId = useMemo(
      () => member.memberId || member._id?.slice(-6) || "N/A",
      [member.memberId, member._id]
    );

    const handleAction = useCallback(
      (action) => {
        onMemberAction(member._id, action);
      },
      [member._id, onMemberAction]
    );

    const isActionLoading = useCallback(
      (action) => actionLoading[member._id] === action,
      [actionLoading, member._id]
    );

    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium text-white">
                  {memberInitial}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {member.name || "N/A"}
              </div>
              <div className="text-sm text-gray-500">ID: {memberId}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900 truncate max-w-xs">
            {member.email || "N/A"}
          </div>
          <div className="text-sm text-gray-500">{member.phoneNo || "N/A"}</div>
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
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
          >
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
              onClick={() => handleAction("sendReminder")}
              disabled={isActionLoading("sendReminder")}
              className="text-blue-600 hover:text-blue-900 disabled:text-blue-300 transition-colors p-1 rounded"
              title="Send Reminder"
              aria-label="Send reminder email"
            >
              {isActionLoading("sendReminder") ? (
                <LoadingSpinner size="h-5 w-5" />
              ) : (
                <MailIcon />
              )}
            </button>
            <button
              onClick={() => handleAction("markPaid")}
              disabled={isActionLoading("markPaid")}
              className="text-green-600 hover:text-green-900 disabled:text-green-300 transition-colors p-1 rounded"
              title="Mark as Paid"
              aria-label="Mark member as paid"
            >
              {isActionLoading("markPaid") ? (
                <LoadingSpinner size="h-5 w-5" color="border-green-600" />
              ) : (
                <CheckIcon />
              )}
            </button>
            <button
              onClick={() => handleAction("viewDetails")}
              disabled={isActionLoading("viewDetails")}
              className="text-gray-600 hover:text-gray-900 disabled:text-gray-300 transition-colors p-1 rounded"
              title="View Details"
              aria-label="View member details"
            >
              {isActionLoading("viewDetails") ? (
                <LoadingSpinner size="h-5 w-5" color="border-gray-600" />
              ) : (
                <EyeIcon />
              )}
            </button>
          </div>
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.member._id === nextProps.member._id &&
      prevProps.member.name === nextProps.member.name &&
      prevProps.member.paymentStatus === nextProps.member.paymentStatus &&
      JSON.stringify(prevProps.actionLoading) ===
        JSON.stringify(nextProps.actionLoading)
    );
  }
);
MemberTableRow.displayName = "MemberTableRow";

// Desktop Table View Component
const DesktopTableView = React.memo(
  ({
    dueMembers,
    actionLoading,
    onMemberAction,
    formatDate,
    formatCurrency,
    getStatusText,
  }) => (
    <div className="hidden lg:block overflow-x-auto rounded-2xl border-2 border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
            >
              Member
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
            >
              Contact
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
            >
              Due Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
            >
              Actions
            </th>
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
  )
);
DesktopTableView.displayName = "DesktopTableView";

// Summary Footer Component - IMPROVED WITH BETTER COLORS
const SummaryFooter = React.memo(
  ({ dueMembers, statistics, loading, onSendAllReminders, onExportData }) => {
    const handleSendAll = useCallback(() => {
      onSendAllReminders();
    }, [onSendAllReminders]);

    const handleExport = useCallback(() => {
      onExportData();
    }, [onExportData]);

    const summaryText = useMemo(() => {
      const total = statistics?.total || 0;
      const pending = statistics?.pending || 0;
      return { total, pending };
    }, [statistics]);

    const hasMembers = dueMembers && dueMembers.length > 0;

    if (!dueMembers || dueMembers.length === 0) return null;

    return (
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-bold text-gray-800">Summary:</span>{" "}
            {summaryText.total} total members
            {summaryText.pending > 0 && (
              <span className="ml-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full inline-block">
                {summaryText.pending} overdue
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={handleSendAll}
              disabled={loading || !hasMembers}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-95"
              aria-label="Send reminders to all members"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="h-4 w-4" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <MailIcon />
                  <span>Send All Reminders</span>
                </>
              )}
            </button>
            <button
              onClick={handleExport}
              disabled={!hasMembers}
              className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-95"
              aria-label="Export member data"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.loading === nextProps.loading &&
      prevProps.dueMembers?.length === nextProps.dueMembers?.length &&
      JSON.stringify(prevProps.statistics) ===
        JSON.stringify(nextProps.statistics)
    );
  }
);
SummaryFooter.displayName = "SummaryFooter";

// ==================== MAIN COMPONENT ====================

const DueMembersUI = ({
  dueMembers,
  loading,
  error,
  statistics,
  searchTerm,
  filterType,
  actionLoading,
  onRefresh,
  onBackToDashboard,
  onSearchChange,
  onFilterChange,
  onMemberAction,
  onSendAllReminders,
  onExportData,
  formatDate,
  formatCurrency,
  getStatusColor,
  getStatusText,
}) => {
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const handleBackToDashboard = useCallback(() => {
    onBackToDashboard();
  }, [onBackToDashboard]);

  const handleSearchChange = useCallback(
    (value) => {
      onSearchChange(value);
    },
    [onSearchChange]
  );

  const handleFilterChange = useCallback(
    (filter) => {
      onFilterChange(filter);
    },
    [onFilterChange]
  );

  const handleMemberAction = useCallback(
    (memberId, action) => {
      onMemberAction(memberId, action);
    },
    [onMemberAction]
  );

  const handleSendAllReminders = useCallback(() => {
    onSendAllReminders();
  }, [onSendAllReminders]);

  const handleExportData = useCallback(() => {
    onExportData();
  }, [onExportData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "r" && !loading) {
        e.preventDefault();
        handleRefresh();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [loading, handleRefresh]);

  if (loading) {
    return <LoadingState />;
  }

  const hasMembers = dueMembers && dueMembers.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <DueMembersHeader
          onRefresh={handleRefresh}
          onBackToDashboard={handleBackToDashboard}
          loading={loading}
        />
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
          <>
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
          </>
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

export default React.memo(DueMembersUI, (prevProps, nextProps) => {
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.error === nextProps.error &&
    prevProps.searchTerm === nextProps.searchTerm &&
    prevProps.filterType === nextProps.filterType &&
    prevProps.dueMembers?.length === nextProps.dueMembers?.length &&
    JSON.stringify(prevProps.statistics) ===
      JSON.stringify(nextProps.statistics) &&
    JSON.stringify(prevProps.actionLoading) ===
      JSON.stringify(nextProps.actionLoading)
  );
});
