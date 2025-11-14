// src/components/BasicAnalyticsReports.jsx - Fully Responsive Version
import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hasFeatureAccess } from '../../../../utils/planUtils';
import { 
  BarChart3, Users, TrendingUp, DollarSign, Calendar, Activity,
  AlertCircle, Target, Crown, ChevronDown, Plus, Search,
  RefreshCw, User, LogOut, Mail
} from 'lucide-react';

// ============================================
// CUSTOM HOOKS (APIs unchanged)
// ============================================

const useAnalyticsWorker = () => {
  const workerRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const workerCode = `
      self.addEventListener('message', (e) => {
        const { type, data } = e.data;
        
        if (type === 'CALCULATE_ANALYTICS') {
          try {
            const { memberArray, selectedTimeRange } = data;
            
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
              const amount = parseFloat(member.feesAmount?.toString().replace(/[^\\d.]/g, '') || 0);
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
            
            self.postMessage({
              type: 'ANALYTICS_CALCULATED',
              data: {
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
                isPlaceholder: false
              }
            });
          } catch (error) {
            self.postMessage({
              type: 'ANALYTICS_ERROR',
              error: error.message
            });
          }
        }
      });
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const calculateAnalytics = useCallback((memberArray, selectedTimeRange) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setIsProcessing(true);

      const handleMessage = (e) => {
        if (e.data.type === 'ANALYTICS_CALCULATED') {
          setIsProcessing(false);
          workerRef.current.removeEventListener('message', handleMessage);
          resolve(e.data.data);
        } else if (e.data.type === 'ANALYTICS_ERROR') {
          setIsProcessing(false);
          workerRef.current.removeEventListener('message', handleMessage);
          reject(new Error(e.data.error));
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage({
        type: 'CALCULATE_ANALYTICS',
        data: { memberArray, selectedTimeRange }
      });
    });
  }, []);

  return { calculateAnalytics, isProcessing };
};

const useProfileManagement = (user, profileProps, navigate) => {
  const profileRef = useRef(null);
  const [localProfileOpen, setLocalProfileOpen] = useState(false);

  const getOwnerDisplayName = useCallback(() => {
    if (!user) return "Owner";
    return (
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email ||
      "Owner"
    );
  }, [user]);

  const getOwnerInitials = useCallback(() => {
    const name = getOwnerDisplayName();
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [getOwnerDisplayName]);

  const handleLogout = useCallback(async () => {
    try {
      if (profileProps?.handleLogout) {
        await profileProps.handleLogout();
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [profileProps, navigate]);

  const handleAddMember = useCallback(() => {
    navigate('/add-member');
  }, [navigate]);

  const profileOpen = profileProps?.isProfileOpen !== undefined 
    ? profileProps.isProfileOpen 
    : localProfileOpen;
  
  const setProfileOpen = profileProps?.setIsProfileOpen || setLocalProfileOpen;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setProfileOpen]);

  return {
    profileRef,
    profileOpen,
    setProfileOpen,
    getOwnerDisplayName,
    getOwnerInitials,
    handleLogout,
    handleAddMember
  };
};

const useCurrentTime = () => {
  const getCurrentTime = useCallback(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }, []);

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [getCurrentTime]);

  return currentTime;
};

// ============================================
// RESPONSIVE CHART COMPONENTS
// ============================================

const LineChart = memo(({ data }) => (
  <div className="relative h-32 sm:h-40 md:h-48 rounded-lg bg-gradient-to-br from-blue-50 to-white">
    <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet">
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
      
      <polyline
        fill="none"
        stroke="#10B981"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={data.map((_, index) => `${70 + (index * 60)},${170 - (data[index]?.value || 0) * 10}`).join(' ')}
      />
      
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
      
      {data.map((item, index) => (
        <text 
          key={index}
          x={70 + (index * 60)} 
          y="190" 
          fill="#9CA3AF" 
          fontSize="10" 
          textAnchor="middle"
        >
          {item.month}
        </text>
      ))}
    </svg>
  </div>
));

LineChart.displayName = 'LineChart';

const BarChart = memo(({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="relative h-32 sm:h-40 md:h-48 rounded-lg bg-gradient-to-br from-purple-50 to-white">
      <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet">
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
        
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        
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
                fontSize="10" 
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
});

BarChart.displayName = 'BarChart';

const DonutChart = memo(({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-56 md:h-64 text-sm sm:text-base text-gray-500 rounded-lg bg-gradient-to-br from-gray-50 to-white">
        No data available
      </div>
    );
  }
  
  let currentAngle = 0;
  
  const colors = {
    'Cash': '#F59E0B', 'Card': '#10B981', 'UPI': '#8B5CF6',
    'Under 18': '#8B5CF6', '18-25': '#6366F1', '26-35': '#F59E0B',
    '36-45': '#10B981', '45+': '#EF4444'
  };

  // Responsive SVG sizes
  const svgSize = {
    mobile: { size: 160, cx: 80, cy: 80, r: 60, strokeWidth: 28 },
    tablet: { size: 180, cx: 90, cy: 90, r: 68, strokeWidth: 30 },
    desktop: { size: 200, cx: 100, cy: 100, r: 75, strokeWidth: 32 }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-48 sm:h-56 md:h-64 rounded-lg bg-gradient-to-br from-gray-50 to-white py-4 sm:py-6">
      {/* Donut Chart SVG - Mobile */}
      <div className="relative flex items-center justify-center mb-3 sm:mb-4 md:hidden">
        <svg width={svgSize.mobile.size} height={svgSize.mobile.size} className="transform -rotate-90">
          <circle 
            cx={svgSize.mobile.cx} 
            cy={svgSize.mobile.cy} 
            r={svgSize.mobile.r} 
            fill="none" 
            stroke="#F3F4F6" 
            strokeWidth={svgSize.mobile.strokeWidth} 
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const circumference = 2 * Math.PI * svgSize.mobile.r;
            const strokeDasharray = `${(angle / 360) * circumference} ${circumference}`;
            const strokeDashoffset = -currentAngle * (circumference / 360);
            currentAngle += angle;
            
            return (
              <circle
                key={index}
                cx={svgSize.mobile.cx}
                cy={svgSize.mobile.cy}
                r={svgSize.mobile.r}
                fill="none"
                stroke={colors[item.name] || '#8B5CF6'}
                strokeWidth={svgSize.mobile.strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            );
          })}
        </svg>
        <div className="absolute text-center">
          <div className="text-3xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>

      {/* Donut Chart SVG - Tablet */}
      <div className="relative items-center justify-center mb-4 hidden md:flex lg:hidden">
        <svg width={svgSize.tablet.size} height={svgSize.tablet.size} className="transform -rotate-90">
          <circle 
            cx={svgSize.tablet.cx} 
            cy={svgSize.tablet.cy} 
            r={svgSize.tablet.r} 
            fill="none" 
            stroke="#F3F4F6" 
            strokeWidth={svgSize.tablet.strokeWidth} 
          />
          {(() => {
            let angle = 0;
            return data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const segmentAngle = (percentage / 100) * 360;
              const circumference = 2 * Math.PI * svgSize.tablet.r;
              const strokeDasharray = `${(segmentAngle / 360) * circumference} ${circumference}`;
              const strokeDashoffset = -angle * (circumference / 360);
              angle += segmentAngle;
              
              return (
                <circle
                  key={index}
                  cx={svgSize.tablet.cx}
                  cy={svgSize.tablet.cy}
                  r={svgSize.tablet.r}
                  fill="none"
                  stroke={colors[item.name] || '#8B5CF6'}
                  strokeWidth={svgSize.tablet.strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000"
                />
              );
            });
          })()}
        </svg>
        <div className="absolute text-center">
          <div className="text-4xl font-bold text-gray-900">{total}</div>
          <div className="text-base text-gray-500">Total</div>
        </div>
      </div>

      {/* Donut Chart SVG - Desktop */}
      <div className="relative items-center justify-center mb-4 hidden lg:flex">
        <svg width={svgSize.desktop.size} height={svgSize.desktop.size} className="transform -rotate-90">
          <circle 
            cx={svgSize.desktop.cx} 
            cy={svgSize.desktop.cy} 
            r={svgSize.desktop.r} 
            fill="none" 
            stroke="#F3F4F6" 
            strokeWidth={svgSize.desktop.strokeWidth} 
          />
          {(() => {
            let angle = 0;
            return data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const segmentAngle = (percentage / 100) * 360;
              const circumference = 2 * Math.PI * svgSize.desktop.r;
              const strokeDasharray = `${(segmentAngle / 360) * circumference} ${circumference}`;
              const strokeDashoffset = -angle * (circumference / 360);
              angle += segmentAngle;
              
              return (
                <circle
                  key={index}
                  cx={svgSize.desktop.cx}
                  cy={svgSize.desktop.cy}
                  r={svgSize.desktop.r}
                  fill="none"
                  stroke={colors[item.name] || '#8B5CF6'}
                  strokeWidth={svgSize.desktop.strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000"
                />
              );
            });
          })()}
        </svg>
        <div className="absolute text-center">
          <div className="text-5xl font-bold text-gray-900">{total}</div>
          <div className="text-base text-gray-500">Total</div>
        </div>
      </div>
      
      {/* Legend - Below Chart */}
      <div className="w-full px-2 sm:px-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          {data.map((item, index) => {
            const percentage = Math.round((item.value / total) * 100);
            return (
              <div key={index} className="flex items-center gap-1.5 sm:gap-2">
                <div 
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: colors[item.name] || '#8B5CF6' }}
                />
                <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium whitespace-nowrap">
                  {item.name} {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

DonutChart.displayName = 'DonutChart';

// ============================================
// RESPONSIVE STAT CARD
// ============================================

const StatCard = memo(({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  subtitle, 
  gradient,
  iconGradient 
}) => (
  <div className={`relative p-3 sm:p-4 md:p-6 transition-all duration-300 border shadow-md rounded-xl bg-gradient-to-br ${gradient} hover:shadow-lg hover:scale-105`}>
    <div className="flex items-start justify-between mb-2 sm:mb-4">
      <div>
        <h3 className="mb-1 text-xs sm:text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <div className={`p-2 sm:p-3 shadow-md rounded-xl bg-gradient-to-br ${iconGradient}`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
      </div>
    </div>
    
    <div className="mb-2 sm:mb-3">
      <div className={`mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r ${iconGradient.replace('to-br', 'to-r')} bg-clip-text`}>
        {value}
      </div>
      {trend && (
        <div className={`text-xs sm:text-sm font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </div>
      )}
    </div>
    
    <div className="text-xs sm:text-sm text-gray-500">{subtitle}</div>
  </div>
));

StatCard.displayName = 'StatCard';

// ============================================
// RESPONSIVE HEADER COMPONENTS
// ============================================

const ProfileDropdown = memo(({ 
  profileOpen, 
  setProfileOpen, 
  profileRef,
  user,
  gymLogo,
  gymName,
  userSubscriptionPlan,
  getOwnerDisplayName,
  getOwnerInitials,
  handleLogout,
  navigate 
}) => (
  <div className="relative z-50" ref={profileRef}>
    <button
      onClick={() => setProfileOpen(!profileOpen)}
      className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 transition-all duration-200 rounded-lg hover:bg-blue-100 group"
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 overflow-hidden transition-colors border-2 border-blue-200 rounded-full group-hover:border-blue-400">
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
          className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-xs sm:text-sm ${
            user?.profileImage || gymLogo ? "hidden" : "flex"
          }`}
        >
          {getOwnerInitials()}
        </div>
      </div>
      <ChevronDown
        className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-600 transition-transform ${
          profileOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {profileOpen && (
      <div className="absolute right-0 z-50 w-48 sm:w-56 mt-2 overflow-hidden duration-200 bg-white border border-gray-200 rounded-lg shadow-xl top-full animate-in slide-in-from-top-2">
        <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 overflow-hidden border-2 border-blue-200 rounded-full">
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
            <div className="overflow-hidden">
              <div className="text-sm font-medium text-gray-900 truncate">
                {getOwnerDisplayName()}
              </div>
              <div className="text-xs text-gray-500 truncate">
                Owner of {gymName}
              </div>
              <div className="flex items-center gap-1 sm:gap-2 mt-1">
                <span className={`px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs font-medium rounded ${
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

        <div className="py-1 sm:py-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 transition-colors hover:bg-blue-50"
          >
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            Members Dashboard
          </Link>
          <Link
            to="/my-profile"
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 transition-colors hover:bg-blue-50"
          >
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
            My Profile
          </Link>
          
          {hasFeatureAccess(userSubscriptionPlan, 'dueMembers') && (
            <Link
              to="/due-members"
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 transition-colors hover:bg-blue-50"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              Due Members
            </Link>
          )}

          <Link
            to="/my-subscription"
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 transition-colors hover:bg-blue-50"
          >
            <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
            My Subscription
          </Link>
          
          <Link
            to="/my-analytics"
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 transition-colors border-r-2 border-blue-500 bg-blue-50"
          >
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            My Analytics (Current)
          </Link>
          
          <button
            onClick={() => navigate("/contact")}
            className="flex items-center w-full gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 transition-colors hover:bg-blue-50"
          >
            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
            Contact Us
          </button>
          <div className="my-1 sm:my-2 border-t border-gray-100"></div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            Logout
          </button>
        </div>
      </div>
    )}
  </div>
));

ProfileDropdown.displayName = 'ProfileDropdown';

const DashboardHeader = memo(({ 
  gymLogo,
  gymName, 
  userSubscriptionPlan,
  handleRefreshAnalytics,
  handleAddMember,
  profileProps,
  user,
  navigate
}) => (
  <div className="sticky top-0 z-40 border-b border-blue-100 shadow-lg bg-gradient-to-r from-white via-blue-50 to-white">
    <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 mx-auto max-w-7xl">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo Section - Responsive */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          <div className="rounded-lg flex-shrink-0">
            {gymLogo ? (
              <img 
                src={gymLogo} 
                alt="Gym Logo" 
                className="object-cover w-8 h-8 sm:w-10 sm:h-10 rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <Crown className={`w-5 h-5 sm:w-6 sm:h-6 text-white ${gymLogo ? 'hidden' : ''}`} />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text truncate">
              {gymName}
            </h1>
            <div className="flex items-center gap-1 sm:gap-2">
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 hidden sm:block">Gym Management</p>
              <span className={`px-1 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] md:text-xs font-medium rounded-full ${
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

        {/* Center Title - Hidden on mobile, visible on tablet+ */}
        <div className="flex-1 hidden md:flex max-w-xs lg:max-w-lg mx-2 lg:mx-8">
          <div className="relative group w-full">
            <BarChart3 className="absolute w-4 h-4 lg:w-5 lg:h-5 text-blue-500 transition-colors -translate-y-1/2 left-2 lg:left-3 top-1/2 group-hover:text-purple-500" />
            <div className="w-full py-1.5 lg:py-2 pl-8 lg:pl-10 pr-2 lg:pr-4 text-center text-xs lg:text-sm text-gray-700 transition-all bg-white border border-blue-200 rounded-lg shadow-sm">
              <span className="font-medium">Analytics Dashboard</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Responsive */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <button
            onClick={handleRefreshAnalytics}
            className="p-1.5 sm:p-2 text-gray-600 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-100 hover:scale-105"
            title="Refresh Analytics"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleAddMember}
            className="hidden sm:flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
          >
            <Plus className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden lg:inline">Add Member</span>
            <span className="lg:hidden">Add</span>
          </button>

          {/* Mobile Add Button */}
          <button
            onClick={handleAddMember}
            className="sm:hidden p-1.5 text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4" />
          </button>

          <ProfileDropdown 
            {...profileProps} 
            user={user}
            gymLogo={gymLogo}
            gymName={gymName}
            userSubscriptionPlan={userSubscriptionPlan}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  </div>
));

DashboardHeader.displayName = 'DashboardHeader';

// ============================================
// RESPONSIVE PLACEHOLDER STATE
// ============================================

const PlaceholderState = memo(({ navigate, ...headerProps }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <DashboardHeader {...headerProps} navigate={navigate} />
    
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md text-center px-4">
          <div className="p-4 sm:p-6 md:p-8 border border-blue-100 rounded-lg shadow-md bg-gradient-to-br from-white to-blue-50">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            
            <h2 className="mb-2 text-lg sm:text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600">
              Active subscription required to access your analytics dashboard
            </p>
            
            <div className="mb-4 sm:mb-6">
              <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-gray-700">What you'll get with analytics:</h3>
              <ul className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-left text-gray-600">
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
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
));

PlaceholderState.displayName = 'PlaceholderState';

// ============================================
// MAIN COMPONENT - FULLY RESPONSIVE
// ============================================

const BasicAnalyticsReports = ({ 
  membersData = {}, 
  userPlan = 'BASIC', 
  onRefresh,
  lastUpdated,
  profileProps,
  user
}) => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  
  // Custom hooks
  const { calculateAnalytics, isProcessing } = useAnalyticsWorker();
  const currentTime = useCurrentTime();
  const profileManagement = useProfileManagement(user, profileProps, navigate);

  // Memoized values
  const userSubscriptionPlan = useMemo(() => 
    profileProps?.subscriptionStatus?.plan || user?.subscriptionPlan || userPlan || 'NONE',
    [profileProps, user, userPlan]
  );

  const gymName = useMemo(() => 
    user?.gymDetails?.gymName || 'IRON THRONE',
    [user]
  );

  const gymLogo = useMemo(() => 
    user?.gymDetails?.gymLogo,
    [user]
  );

  // Process analytics data with Web Worker
  const analytics = useMemo(() => {
    if (typeof membersData.totalMembers === 'string' && 
        membersData.totalMembers.includes('Available with subscription')) {
      return {
        totalMembers: 0, activeMembers: 0, newMembers: 0,
        totalRevenue: 0, dueToday: 0, overdue: 0,
        planDistribution: {}, paymentMethods: {}, ageGroups: {},
        retentionRate: 0, averageRevenue: 0,
        monthlyGrowthData: [], monthlyRevenueData: [],
        isPlaceholder: true
      };
    }

    if (typeof membersData.totalMembers === 'number' || 
        (membersData.totalMembers !== undefined && !isNaN(Number(membersData.totalMembers)))) {
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

    const memberArray = Array.isArray(membersData) ? membersData : [];
    if (memberArray.length === 0) {
      return {
        totalMembers: 0, activeMembers: 0, newMembers: 0,
        totalRevenue: 0, dueToday: 0, overdue: 0,
        planDistribution: {}, paymentMethods: {}, ageGroups: {},
        retentionRate: 0, averageRevenue: 0,
        monthlyGrowthData: [], monthlyRevenueData: [],
        isPlaceholder: false
      };
    }

    return {
      totalMembers: memberArray.length,
      activeMembers: memberArray.filter(m => m.paymentStatus?.toLowerCase() === 'paid').length,
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
  }, [membersData, selectedTimeRange]);

  const handleRefreshAnalytics = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  }, [onRefresh]);

  // Memoized chart data
  const monthlyGrowthData = useMemo(() => 
    analytics.monthlyGrowthData.length > 0 ? analytics.monthlyGrowthData : [
      { month: 'Apr', value: 0 }, { month: 'May', value: 0 },
      { month: 'Jun', value: 0 }, { month: 'Jul', value: 0 },
      { month: 'Aug', value: 0 }, { month: 'Sep', value: 0 }
    ],
    [analytics.monthlyGrowthData]
  );

  const planChartData = useMemo(() => 
    Object.entries(analytics.planDistribution).map(([plan, count]) => ({
      name: plan === '3 month' ? '3 months' : 
            plan === '6 month' ? '6 months' : 
            plan === '1 month' ? '1 month' : 
            plan === '12 month' ? '1 year' : plan,
      value: count,
      percentage: analytics.totalMembers > 0 ? Math.round((count / analytics.totalMembers) * 100) : 0
    })),
    [analytics.planDistribution, analytics.totalMembers]
  );

  const ageGroupData = useMemo(() => 
    Object.entries(analytics.ageGroups).map(([group, count]) => ({ name: group, value: count })),
    [analytics.ageGroups]
  );

  const paymentMethodData = useMemo(() => 
    Object.entries(analytics.paymentMethods).map(([method, count]) => ({ name: method, value: count })),
    [analytics.paymentMethods]
  );

  // Memoized stat cards data
  const statCardsData = useMemo(() => [
    {
      title: "Total Members",
      value: analytics.totalMembers,
      icon: Users,
      trend: "+12% from last month",
      subtitle: "All registered members",
      gradient: "from-white to-blue-50 border-blue-100",
      iconGradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Members",
      value: analytics.activeMembers,
      icon: Activity,
      trend: "+8% from last month",
      subtitle: "Currently active subscriptions",
      gradient: "from-white to-purple-50 border-purple-100",
      iconGradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Monthly Revenue",
      value: `₹${analytics.totalRevenue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      trend: "+15% from last month",
      subtitle: "This month's earnings",
      gradient: "from-white to-green-50 border-green-100",
      iconGradient: "from-green-500 to-green-600"
    },
    {
      title: "Overdue Payments",
      value: analytics.overdue,
      icon: AlertCircle,
      trend: "-5% from last month",
      subtitle: "Members with pending dues",
      gradient: "from-white to-orange-50 border-orange-100",
      iconGradient: "from-orange-500 to-orange-600"
    }
  ], [analytics]);

  const secondaryStatsData = useMemo(() => [
    {
      title: "Due Today",
      value: analytics.dueToday,
      icon: Calendar,
      subtitle: "Payments due today",
      gradient: "from-white to-cyan-50 border-cyan-100",
      iconGradient: "from-cyan-500 to-cyan-600"
    },
    {
      title: "Retention Rate",
      value: `${analytics.retentionRate}%`,
      icon: TrendingUp,
      trend: "+2.3% from last month",
      subtitle: "Member retention percentage",
      gradient: "from-white to-emerald-50 border-emerald-100",
      iconGradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Avg Revenue/Member",
      value: `₹${analytics.averageRevenue}`,
      icon: Target,
      trend: "+5% from last month",
      subtitle: "Average revenue per member",
      gradient: "from-white to-violet-50 border-violet-100",
      iconGradient: "from-violet-500 to-violet-600"
    }
  ], [analytics]);

  if (analytics.isPlaceholder) {
    return (
      <PlaceholderState
        navigate={navigate}
        gymLogo={gymLogo}
        gymName={gymName}
        userSubscriptionPlan={userSubscriptionPlan}
        handleRefreshAnalytics={handleRefreshAnalytics}
        profileProps={{
          ...profileManagement,
          user,
          userSubscriptionPlan
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DashboardHeader
        gymLogo={gymLogo}
        gymName={gymName}
        userSubscriptionPlan={userSubscriptionPlan}
        handleRefreshAnalytics={handleRefreshAnalytics}
        handleAddMember={profileManagement.handleAddMember}
        profileProps={{
          ...profileManagement,
          user,
          userSubscriptionPlan
        }}
        user={user}
        navigate={navigate}
      />

      <div className="p-3 sm:p-4 md:p-6">
        {/* Title Section - Responsive */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text">
                Analytics Dashboard
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">Real-time insights for {gymName}</p>
              <div className="flex items-center mt-2 sm:mt-3 space-x-2 sm:space-x-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-600">Live Data</span>
                </div>
                <span className="text-gray-500">
                  Updated {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : currentTime}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-shadow bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
              </select>
              <button 
                onClick={handleRefreshAnalytics}
                className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          {statCardsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Secondary Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          {secondaryStatsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="p-4 sm:p-5 md:p-6 border border-blue-100 shadow-md rounded-xl bg-gradient-to-br from-white to-blue-50">
            <h3 className="mb-1 text-sm sm:text-base md:text-lg font-semibold text-gray-900">Member Growth Trend</h3>
            <p className="mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm text-gray-600">Monthly new member registrations</p>
            <LineChart data={monthlyGrowthData} />
          </div>

          <div className="p-4 sm:p-5 md:p-6 border border-purple-100 shadow-md rounded-xl bg-gradient-to-br from-white to-purple-50">
            <h3 className="mb-1 text-sm sm:text-base md:text-lg font-semibold text-gray-900">Membership Plan Distribution</h3>
            <p className="mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm text-gray-600">Popular subscription plans</p>
            <BarChart data={planChartData} />
          </div>

          <div className="p-4 sm:p-5 md:p-6 border border-green-100 shadow-md rounded-xl bg-gradient-to-br from-white to-green-50">
            <h3 className="mb-1 text-sm sm:text-base md:text-lg font-semibold text-gray-900">Age Group Distribution</h3>
            <p className="mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm text-gray-600">Member demographics by age</p>
            <DonutChart data={ageGroupData} title="Age Groups" />
          </div>

          <div className="p-4 sm:p-5 md:p-6 border border-orange-100 shadow-md rounded-xl bg-gradient-to-br from-white to-orange-50">
            <h3 className="mb-1 text-sm sm:text-base md:text-lg font-semibold text-gray-900">Payment Method Distribution</h3>
            <p className="mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm text-gray-600">Preferred payment methods</p>
            <DonutChart data={paymentMethodData} title="Payment Methods" />
          </div>
        </div>

        {/* Footer - Responsive */}
        <div className="p-4 sm:p-5 md:p-6 text-center border border-blue-100 shadow-md rounded-xl bg-gradient-to-r from-blue-50 via-white to-purple-50">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2 space-y-1 sm:space-y-0 sm:space-x-2">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Analytics Dashboard for {gymName}</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
            <span>Last updated: {new Date().toLocaleDateString('en-GB')} at {currentTime}</span>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-green-600">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(BasicAnalyticsReports);