import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hasFeatureAccess } from '../../../../utils/planUtils';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Activity,
  AlertCircle,
  Target,
  Crown,
  ChevronDown,
  Plus,
  Search,
  RefreshCw,
  User,
  LogOut,
  Mail
} from 'lucide-react';

const BasicAnalyticsReports = ({ 
  membersData = {}, 
  userPlan = 'BASIC', 
  onRefresh,
  lastUpdated,
  profileProps,
  user
}) => {
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');

  // Destructure profile props with fallbacks to match DashboardPage structure
  const {
    isProfileOpen = false,
    setIsProfileOpen = () => {},
    getOwnerDisplayName = () => {
      if (!user) return "Owner";
      return (
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.email ||
        "Owner"
      );
    },
    getOwnerInitials = () => {
      const name = getOwnerDisplayName();
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    },
    handleLogout = async () => {
      try {
        // Use the logout from profileProps if available
        if (profileProps?.handleLogout) {
          await profileProps.handleLogout();
        } else {
          console.log('Logout');
        }
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
    handleAddMember = () => navigate('/add-member'),
    subscriptionStatus
  } = profileProps || {};

  // Local state for profile dropdown if profileProps doesn't provide it
  const [localProfileOpen, setLocalProfileOpen] = useState(false);
  
  // Use local state if profileProps doesn't provide the state management
  const profileOpen = profileProps?.isProfileOpen !== undefined ? isProfileOpen : localProfileOpen;
  const setProfileOpen = profileProps?.setIsProfileOpen || setLocalProfileOpen;

  // Get user's subscription plan - match DashboardPage logic
  const userSubscriptionPlan = subscriptionStatus?.plan || user?.subscriptionPlan || userPlan || 'NONE';

  // Get gym details from user object - match DashboardPage structure exactly
  const gymName = user?.gymDetails?.gymName || 'IRON THRONE';
  const gymLogo = user?.gymDetails?.gymLogo;
  const gymTagline = 'Gym Management';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setProfileOpen]);

  // Debug logging
  // console.log('🔧 BasicAnalyticsReports received props:', {
  //   membersData,
  //   userPlan,
  //   userSubscriptionPlan,
  //   lastUpdated,
  //   hasOnRefresh: !!onRefresh,
  //   user,
  //   gymName,
  //   subscriptionStatus
  // });

  // Process analytics data - same logic as before but with better error handling
  const analytics = useMemo(() => {
    // console.log('🔍 Processing membersData:', membersData);
    
    // Check if membersData contains subscription placeholder strings
    if (typeof membersData.totalMembers === 'string' && 
        membersData.totalMembers.includes('Available with subscription')) {
      // console.log('❌ Detected subscription placeholder data');
      return {
        totalMembers: 0,
        activeMembers: 0,
        newMembers: 0,
        totalRevenue: 0,
        dueToday: 0,
        overdue: 0,
        planDistribution: {},
        paymentMethods: {},
        ageGroups: {},
        retentionRate: 0,
        averageRevenue: 0,
        monthlyGrowthData: [],
        monthlyRevenueData: [],
        isPlaceholder: true
      };
    }

    // Check if membersData is an analytics object from backend
    if (typeof membersData.totalMembers === 'number' || 
        (membersData.totalMembers !== undefined && !isNaN(Number(membersData.totalMembers)))) {
      // console.log('✅ Using analytics data directly from backend');
      
      return {
        totalMembers: Number(membersData.totalMembers) || 0,
        activeMembers: Number(membersData.activeMembers) || 0,
        newMembers: selectedTimeRange === '7' ? 
          Number(membersData.newMembersLast7Days) || 0 : 
          Number(membersData.newMembersLast30Days) || 0,
        totalRevenue: Number(membersData.totalRevenue) || Number(membersData.monthlyRevenue) || 0,
        dueToday: Number(membersData.dueToday) || 0,
        overdue: Number(membersData.overdue) || 0,
        planDistribution: membersData.planDistribution || {},
        paymentMethods: membersData.paymentMethods || {},
        ageGroups: membersData.ageGroups || {},
        retentionRate: Number(membersData.retentionRate) || 0,
        averageRevenue: Number(membersData.averageRevenue) || 0,
        monthlyGrowthData: Array.isArray(membersData.monthlyGrowthData) ? membersData.monthlyGrowthData : [],
        monthlyRevenueData: Array.isArray(membersData.monthlyRevenueData) ? membersData.monthlyRevenueData : [],
        isPlaceholder: false
      };
    }

    // Fallback: Calculate from member array (legacy support)
    // console.log('📊 Calculating analytics from member array');
    const memberArray = Array.isArray(membersData) ? membersData : [];
    
    if (memberArray.length === 0) {
      // console.log('⚠️ No member data available');
      return {
        totalMembers: 0,
        activeMembers: 0,
        newMembers: 0,
        totalRevenue: 0,
        dueToday: 0,
        overdue: 0,
        planDistribution: {},
        paymentMethods: {},
        ageGroups: {},
        retentionRate: 0,
        averageRevenue: 0,
        monthlyGrowthData: [],
        monthlyRevenueData: [],
        isPlaceholder: false
      };
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    const totalMembers = memberArray.length;
    const activeMembers = memberArray.filter(m => 
      m.paymentStatus?.toLowerCase() === 'paid' || 
      m.paymentStatus?.toLowerCase() === 'active'
    ).length;

    const cutoffDate = selectedTimeRange === '7' ? sevenDaysAgo : thirtyDaysAgo;
    const newMembers = memberArray.filter(member => {
      const joinDate = new Date(member.joinDate || member.joiningDate);
      return joinDate >= cutoffDate;
    }).length;

    const totalRevenue = memberArray.reduce((sum, member) => {
      const amount = parseFloat(member.feesAmount?.toString().replace(/[^\d.]/g, '') || 0);
      return sum + amount;
    }, 0);

    const today = new Date().toISOString().split('T')[0];
    const dueToday = memberArray.filter(member => {
      const dueDate = member.nextDueDate ? new Date(member.nextDueDate).toISOString().split('T')[0] : null;
      return dueDate === today;
    }).length;

    const overdue = memberArray.filter(member => {
      const dueDate = new Date(member.nextDueDate);
      return dueDate < now && member.paymentStatus?.toLowerCase() !== 'paid';
    }).length;

    const planDistribution = memberArray.reduce((acc, member) => {
      const plan = member.planDuration || 'Unknown';
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {});

    const paymentMethods = memberArray.reduce((acc, member) => {
      const method = member.paymentMethod || 'Cash';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    const ageGroups = memberArray.reduce((acc, member) => {
      const age = parseInt(member.age) || 0;
      let group;
      if (age < 18) group = 'Under 18';
      else if (age < 25) group = '18-25';
      else if (age < 35) group = '26-35';
      else if (age < 45) group = '36-45';
      else group = '45+';
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});

    return {
      totalMembers,
      activeMembers,
      newMembers,
      totalRevenue,
      dueToday,
      overdue,
      planDistribution,
      paymentMethods,
      ageGroups,
      retentionRate: totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0,
      averageRevenue: totalMembers > 0 ? Math.round(totalRevenue / totalMembers) : 0,
      monthlyGrowthData: [],
      monthlyRevenueData: [],
      isPlaceholder: false
    };
  }, [membersData, selectedTimeRange]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefreshAnalytics = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  // Chart data preparation
  const monthlyGrowthData = analytics.monthlyGrowthData.length > 0 ? 
    analytics.monthlyGrowthData : 
    [
      { month: 'Apr', value: 0 },
      { month: 'May', value: 0 },
      { month: 'Jun', value: 0 },
      { month: 'Jul', value: 0 },
      { month: 'Aug', value: 0 },
      { month: 'Sep', value: 0 }
    ];

  const planChartData = Object.entries(analytics.planDistribution).map(([plan, count]) => ({
    name: plan === '3 month' ? '3 months' : 
          plan === '6 month' ? '6 months' : 
          plan === '1 month' ? '1 month' : 
          plan === '12 month' ? '1 year' : plan,
    value: count,
    percentage: analytics.totalMembers > 0 ? Math.round((count / analytics.totalMembers) * 100) : 0
  }));

  // Chart Components
  const LineChart = ({ data }) => (
    <div className="relative h-48 rounded-lg bg-gradient-to-br from-blue-50 to-white">
      <svg className="w-full h-full" viewBox="0 0 500 200">
        {/* Horizontal grid lines */}
        {[0, 1, 2, 3, 4].map((val) => (
          <line 
            key={val}
            x1="50" 
            y1={170 - (val * 35)} 
            x2="450" 
            y2={170 - (val * 35)} 
            stroke="#E5E7EB" 
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((val) => (
          <text 
            key={val}
            x="40" 
            y={175 - (val * 35)} 
            fill="#9CA3AF" 
            fontSize="11" 
            textAnchor="end"
          >
            {val}
          </text>
        ))}
        
        {/* Main line */}
        <polyline
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data.map((_, index) => `${70 + (index * 60)},${170 - (data[index]?.value || 0) * 10}`).join(' ')}
        />
        
        {/* Data points */}
        {data.map((_, index) => (
          <circle
            key={index}
            cx={70 + (index * 60)}
            cy={170 - (data[index]?.value || 0) * 10}
            r="5"
            fill="#10B981"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        ))}
        
        {/* X-axis labels */}
        {data.map((item, index) => (
          <text 
            key={index}
            x={70 + (index * 60)} 
            y="190" 
            fill="#9CA3AF" 
            fontSize="11" 
            textAnchor="middle"
          >
            {item.month}
          </text>
        ))}
      </svg>
    </div>
  );

  const BarChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    
    return (
      <div className="relative h-48 rounded-lg bg-gradient-to-br from-purple-50 to-white">
        <svg className="w-full h-full" viewBox="0 0 500 200">
          {/* Horizontal grid lines */}
          {[0, 0.5, 1, 1.5, 2].map((val) => (
            <line 
              key={val}
              x1="50" 
              y1={170 - (val * 60)} 
              x2="450" 
              y2={170 - (val * 60)} 
              stroke="#E5E7EB" 
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 0.5, 1, 1.5, 2].map((val) => (
            <text 
              key={val}
              x="40" 
              y={175 - (val * 60)} 
              fill="#9CA3AF" 
              fontSize="11" 
              textAnchor="end"
            >
              {val}
            </text>
          ))}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          
          {/* Bars */}
          {data.map((item, index) => {
            const barWidth = 70;
            const barHeight = maxValue > 0 ? (item.value / maxValue) * 120 : 0;
            const x = 80 + (index * 90);
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={170 - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx="6"
                  ry="6"
                />
                <text 
                  x={x + barWidth/2} 
                  y="190" 
                  fill="#9CA3AF" 
                  fontSize="11" 
                  textAnchor="middle"
                >
                  {item.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const DonutChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return (
      <div className="flex items-center justify-center h-48 text-gray-500 rounded-lg bg-gradient-to-br from-gray-50 to-white">
        No data available
      </div>
    );
    
    let currentAngle = 0;
    
    const colors = {
      // Payment method colors
      'Cash': '#F59E0B',      // Yellow/Orange
      'Card': '#10B981',       // Green  
      'UPI': '#8B5CF6',        // Purple
      // Age group colors
      'Under 18': '#8B5CF6',   // Purple
      '18-25': '#6366F1',      // Blue
      '26-35': '#F59E0B',      // Yellow/Orange
      '36-45': '#10B981',      // Green
      '45+': '#EF4444'         // Red
    };

    return (
      <div className="relative flex items-center justify-center h-48 rounded-lg bg-gradient-to-br from-gray-50 to-white">
        <svg width="180" height="180" className="transform -rotate-90">
          <circle
            cx="90"
            cy="90"
            r="60"
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="30"
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const strokeDasharray = `${(angle / 360) * 377} 377`;
            const strokeDashoffset = -currentAngle * (377 / 360);
            currentAngle += angle;
            
            return (
              <circle
                key={index}
                cx="90"
                cy="90"
                r="60"
                fill="none"
                stroke={colors[item.name] || '#8B5CF6'}
                strokeWidth="30"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            );
          })}
        </svg>
        
        {/* Center text */}
        <div className="absolute text-center transform rotate-0">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {data.slice(0, 3).map((item, index) => {
              const percentage = Math.round((item.value / total) * 100);
              return (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: colors[item.name] || '#8B5CF6' }}
                  />
                  <span className="text-gray-600">{item.name} {percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Show placeholder state if subscription is not active (matches MyAnalyticsPage logic)
  if (analytics.isPlaceholder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Unified Header with Gradient - Same as DashboardPage MemberList */}
        <div className="sticky top-0 z-40 border-b border-blue-100 shadow-lg bg-gradient-to-r from-white via-blue-50 to-white">
          <div className="px-6 py-4 mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              {/* Logo with Plan Badge - FIXED VERSION */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 overflow-hidden transition-colors border-2 border-blue-200 rounded-full">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={getOwnerDisplayName()}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  <div
                    className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm ${
                      user?.profileImage ? "hidden" : "flex"
                    }`}
                  >
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    {user?.gymDetails?.gymName || gymName}
                  </h1>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Gym Management</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      userSubscriptionPlan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                      userSubscriptionPlan === 'ADVANCED' ? 'bg-orange-100 text-orange-700' :
                      userSubscriptionPlan === 'BASIC' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {userSubscriptionPlan === 'NONE' ? 'Free' : userSubscriptionPlan.charAt(0) + userSubscriptionPlan.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Analytics Title Bar */}
              <div className="flex-1 max-w-lg mx-8">
                <div className="relative group">
                  <BarChart3 className="absolute w-5 h-5 text-blue-500 transition-colors -translate-y-1/2 left-3 top-1/2 group-hover:text-purple-500" />
                  <div className="w-full py-2 pl-10 pr-4 text-center text-gray-700 transition-all bg-white border border-blue-200 rounded-lg shadow-sm">
                    <span className="font-medium">Analytics Dashboard</span>
                  </div>
                </div>
              </div>

              {/* Actions & Profile */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleRefreshAnalytics}
                  className="p-2 text-gray-600 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-100 hover:scale-105"
                  title="Refresh Analytics"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>

                {/* Profile Dropdown - Simplified for placeholder */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="relative z-50 flex items-center gap-3 p-2 transition-all duration-200 rounded-lg cursor-pointer hover:bg-blue-100 group"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div className="w-8 h-8 overflow-hidden transition-colors border-2 border-blue-200 rounded-full group-hover:border-blue-400">
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={getOwnerDisplayName()}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm ${
                          user?.profileImage ? "hidden" : "flex"
                        }`}
                      >
                        {getOwnerInitials()}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 z-50 w-56 mt-2 overflow-hidden duration-200 bg-white border border-gray-200 rounded-lg shadow-xl top-full animate-in slide-in-from-top-2">
                      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden border-2 border-blue-200 rounded-full">
                            {user?.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={getOwnerDisplayName()}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium ${
                                user?.profileImage ? "hidden" : "flex"
                              }`}
                            >
                              {getOwnerInitials()}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {getOwnerDisplayName()}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              Owner
                              <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                                userSubscriptionPlan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                                userSubscriptionPlan === 'ADVANCED' ? 'bg-orange-100 text-orange-700' :
                                userSubscriptionPlan === 'BASIC' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {userSubscriptionPlan === 'NONE' ? 'Free' : userSubscriptionPlan.charAt(0) + userSubscriptionPlan.slice(1).toLowerCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                        >
                          <Users className="w-4 h-4" />
                          Members Dashboard
                        </Link>
                        <Link
                          to="/my-profile"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          to="/my-subscription"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                        >
                          <Crown className="w-4 h-4" />
                          My Subscription
                        </Link>
                        <button
                          onClick={() => navigate("/contact")}
                          className="flex items-center w-full gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                        >
                          <Mail className="w-4 h-4" />
                          Contact Us
                        </button>
                        <div className="my-2 border-t border-gray-100"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full gap-3 px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md text-center">
              <div className="p-8 border border-blue-100 rounded-lg shadow-md bg-gradient-to-br from-white to-blue-50">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="mb-2 text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
                <p className="mb-6 text-gray-600">
                  Active subscription required to access your analytics dashboard
                </p>
                
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">What you'll get with analytics:</h3>
                  <ul className="space-y-1 text-sm text-left text-gray-600">
                    <li>• Real-time member growth tracking</li>
                    <li>• Revenue analytics and trends</li>
                    <li>• Member retention insights</li>
                    <li>• Plan performance analysis</li>
                    <li>• Age group demographics</li>
                    <li>• Payment method preferences</li>
                  </ul>
                </div>
                
                <button 
                  onClick={() => navigate('/my-subscription')}
                  className="w-full px-4 py-2 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard Content - Success State (matches DashboardPage structure)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Unified Header - Same as DashboardPage MemberList */}
      <div className="sticky top-0 z-40 border-b border-blue-100 shadow-lg bg-gradient-to-r from-white via-blue-50 to-white">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo with Plan Badge - EXACT SAME AS MEMBERLIST */}
            <div className="flex items-center gap-3">
              <div className="rounded-lg">
                {gymLogo ? (
                  <img 
                    src={gymLogo} 
                    alt="Gym Logo" 
                    className="object-cover w-10 h-10 rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <Crown className={`w-6 h-6 text-white ${gymLogo ? 'hidden' : ''}`} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  {gymName}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">Gym Management</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    userSubscriptionPlan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                    userSubscriptionPlan === 'ADVANCED' ? 'bg-orange-100 text-orange-700' :
                    userSubscriptionPlan === 'BASIC' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {userSubscriptionPlan === 'NONE' ? 'Free' : userSubscriptionPlan.charAt(0) + userSubscriptionPlan.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Analytics Title Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative group">
                <BarChart3 className="absolute w-5 h-5 text-blue-500 transition-colors -translate-y-1/2 left-3 top-1/2 group-hover:text-purple-500" />
                <div className="w-full py-2 pl-10 pr-4 text-center text-gray-700 transition-all bg-white border border-blue-200 rounded-lg shadow-sm">
                  <span className="font-medium">Analytics Dashboard</span>
                </div>
              </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefreshAnalytics}
                className="p-2 text-gray-600 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-100 hover:scale-105"
                title="Refresh Analytics"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Add Member Button - same as DashboardPage */}
              <button
                onClick={handleAddMember}
                className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>

              {/* Profile Dropdown - FIXED Z-INDEX AND POSITIONING */}
              <div className="relative z-50" ref={profileRef}>
                <button
                  onClick={() => {
                    console.log('Profile button clicked, current state:', profileOpen);
                    setProfileOpen(!profileOpen);
                  }}
                  className="flex items-center gap-3 p-2 transition-all duration-200 rounded-lg hover:bg-blue-100 group"
                >
                  <div className="w-8 h-8 overflow-hidden transition-colors border-2 border-blue-200 rounded-full group-hover:border-blue-400">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={getOwnerDisplayName()}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : gymLogo ? (
                      <img
                        src={gymLogo}
                        alt="Gym Logo"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm ${
                        user?.profileImage || gymLogo ? "hidden" : "flex"
                      }`}
                    >
                      {getOwnerInitials()}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 z-50 w-56 mt-2 overflow-hidden duration-200 bg-white border border-gray-200 rounded-lg shadow-xl top-full animate-in slide-in-from-top-2">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden border-2 border-blue-200 rounded-full">
                          {user?.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={getOwnerDisplayName()}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : gymLogo ? (
                            <img
                              src={gymLogo}
                              alt="Gym Logo"
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium ${
                              user?.profileImage || gymLogo ? "hidden" : "flex"
                            }`}
                          >
                            {getOwnerInitials()}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {getOwnerDisplayName()}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            Owner of {gymName}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                              userSubscriptionPlan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                              userSubscriptionPlan === 'ADVANCED' ? 'bg-orange-100 text-orange-700' :
                              userSubscriptionPlan === 'BASIC' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {userSubscriptionPlan === 'NONE' ? 'Free' : userSubscriptionPlan.charAt(0) + userSubscriptionPlan.slice(1).toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                      >
                        <Users className="w-4 h-4" />
                        Members Dashboard
                      </Link>
                      <Link
                        to="/my-profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      
                      {hasFeatureAccess(userSubscriptionPlan, 'dueMembers') && (
                        <Link
                          to="/due-members"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                        >
                          <Users className="w-4 h-4" />
                          Due Members
                        </Link>
                      )}

                      <Link
                        to="/my-subscription"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                      >
                        <Crown className="w-4 h-4" />
                        My Subscription
                      </Link>
                      
                      <Link
                        to="/my-analytics"
                        className="flex items-center gap-3 px-4 py-2 text-blue-600 transition-colors border-r-2 border-blue-500 bg-blue-50"
                      >
                        <BarChart3 className="w-4 h-4" />
                        My Analytics (Current)
                      </Link>
                      
                      <button
                        onClick={() => navigate("/contact")}
                        className="flex items-center w-full gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                      >
                        <Mail className="w-4 h-4" />
                        Contact Us
                      </button>
                      <div className="my-2 border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full gap-3 px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-gray-600">Real-time insights for {gymName}</p>
              <div className="flex items-center mt-3 space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-600">Live Data</span>
                </div>
                <span className="text-gray-500">
                  Updated {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : currentTime}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-4 py-2 text-sm transition-shadow bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                </select>
              </div>
              <button 
                onClick={handleRefreshAnalytics}
                className="flex items-center px-4 py-2 space-x-2 font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards Section - Light Theme with proper gradients */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {/* Total Members Card */}
          <div className="relative p-6 transition-all duration-300 border border-blue-100 shadow-md rounded-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-lg hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-600">Total Members</h3>
              </div>
              <div className="p-3 shadow-md rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mb-3">
              <div className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">{analytics.totalMembers}</div>
              <div className="text-sm font-medium text-green-600">+12% from last month</div>
            </div>
            
            <div className="text-sm text-gray-500">All registered members</div>
          </div>

          {/* Active Members Card */}
          <div className="relative p-6 transition-all duration-300 border border-purple-100 shadow-md rounded-xl bg-gradient-to-br from-white to-purple-50 hover:shadow-lg hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-600">Active Members</h3>
              </div>
              <div className="p-3 shadow-md rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mb-3">
              <div className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">{analytics.activeMembers}</div>
              <div className="text-sm font-medium text-green-600">+8% from last month</div>
            </div>
            
            <div className="text-sm text-gray-500">Currently active subscriptions</div>
          </div>

          {/* Monthly Revenue Card */}
          <div className="relative p-6 transition-all duration-300 border border-green-100 shadow-md rounded-xl bg-gradient-to-br from-white to-green-50 hover:shadow-lg hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-600">Monthly Revenue</h3>
              </div>
              <div className="p-3 shadow-md rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mb-3">
              <div className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">₹{analytics.totalRevenue.toLocaleString('en-IN')}</div>
              <div className="text-sm font-medium text-green-600">+15% from last month</div>
            </div>
            
            <div className="text-sm text-gray-500">This month's earnings</div>
          </div>

          {/* Overdue Payments Card */}
          <div className="relative p-6 transition-all duration-300 border border-orange-100 shadow-md rounded-xl bg-gradient-to-br from-white to-orange-50 hover:shadow-lg hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-600">Overdue Payments</h3>
              </div>
              <div className="p-3 shadow-md rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mb-3">
              <div className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">{analytics.overdue}</div>
              <div className="text-sm font-medium text-red-600">-5% from last month</div>
            </div>
            
            <div className="text-sm text-gray-500">Members with pending dues</div>
          </div>
        </div>

        {/* Second Row - 3 Additional Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="relative p-6 transition-all duration-300 border shadow-md border-cyan-100 rounded-xl bg-gradient-to-br from-white to-cyan-50 hover:shadow-lg hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-600">Due Today</h3>
              </div>
              <div className="p-3 shadow-md rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mb-3">
              <div className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text">{analytics.dueToday}</div>
            </div>
            
            <div className="text-sm text-gray-500">Payments due today</div>
          </div>

          <div className="relative p-6 transition-all duration-300 border shadow-md border-emerald-100 rounded-xl bg-gradient-to-br from-white to-emerald-50 hover:shadow-lg hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-600">Retention Rate</h3>
              </div>
              <div className="p-3 shadow-md rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mb-3">
              <div className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text">{analytics.retentionRate}%</div>
              <div className="text-sm font-medium text-green-600">+2.3% from last month</div>
            </div>
            
            <div className="text-sm text-gray-500">Member retention percentage</div>
          </div>

          <div className="relative p-6 transition-all duration-300 border shadow-md border-violet-100 rounded-xl bg-gradient-to-br from-white to-violet-50 hover:shadow-lg hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-600">Avg Revenue/Member</h3>
              </div>
              <div className="p-3 shadow-md rounded-xl bg-gradient-to-br from-violet-500 to-violet-600">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mb-3">
              <div className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text">₹{analytics.averageRevenue}</div>
              <div className="text-sm font-medium text-green-600">+5% from last month</div>
            </div>
            
            <div className="text-sm text-gray-500">Average revenue per member</div>
          </div>
        </div>

        {/* Charts Section - 2x2 Grid with Light Theme */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Member Growth Trend */}
          <div className="p-6 border border-blue-100 shadow-md rounded-xl bg-gradient-to-br from-white to-blue-50">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Member Growth Trend</h3>
            <p className="mb-6 text-sm text-gray-600">Monthly new member registrations</p>
            <LineChart data={monthlyGrowthData} />
          </div>

          {/* Membership Plan Distribution */}
          <div className="p-6 border border-purple-100 shadow-md rounded-xl bg-gradient-to-br from-white to-purple-50">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Membership Plan Distribution</h3>
            <p className="mb-6 text-sm text-gray-600">Popular subscription plans</p>
            <BarChart data={planChartData} />
          </div>

          {/* Age Group Distribution */}
          <div className="p-6 border border-green-100 shadow-md rounded-xl bg-gradient-to-br from-white to-green-50">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Age Group Distribution</h3>
            <p className="mb-6 text-sm text-gray-600">Member demographics by age</p>
            <DonutChart 
              data={Object.entries(analytics.ageGroups).map(([group, count]) => ({ name: group, value: count }))} 
              title="Age Groups"
            />
          </div>

          {/* Payment Method Distribution */}
          <div className="p-6 border border-orange-100 shadow-md rounded-xl bg-gradient-to-br from-white to-orange-50">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Payment Method Distribution</h3>
            <p className="mb-6 text-sm text-gray-600">Preferred payment methods</p>
            <DonutChart 
              data={Object.entries(analytics.paymentMethods).map(([method, count]) => ({ name: method, value: count }))} 
              title="Payment Methods"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center border border-blue-100 shadow-md rounded-xl bg-gradient-to-r from-blue-50 via-white to-purple-50">
          <div className="flex items-center justify-center mb-2 space-x-2">
            <Crown className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard for {gymName}</h3>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <span>Last updated: {new Date().toLocaleDateString('en-GB')} at {currentTime}</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-green-600">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicAnalyticsReports;