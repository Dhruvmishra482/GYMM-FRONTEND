import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
  lazy,
  Suspense,
} from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { hasFeatureAccess } from "../../../../utils/planUtils";
import ModalContainer from "../../../../Components/Modal/ModalContainer";
import MyProfile from "../../ProfileDropDown/Logic/MyProfilePage";

import {
  Eye,
  Plus,
  X,
  Crown,
  Users,
  Search,
  Edit,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  RefreshCw,
  Lock,
  AlertTriangle,
  Calendar,
  Phone,
  CreditCard,
  User,
  Mail,
  MapPin,
  Shield,
} from "lucide-react";

// Memoized sub-components for better performance
const StatCard = memo(
  ({ icon: Icon, title, value, gradient, iconGradient }) => (
    <div
      className={`p-6 transition-all duration-300 border ${gradient} rounded-lg shadow-md hover:shadow-lg hover:scale-105`}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg shadow-md ${iconGradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
);

const MemberCard = memo(
  ({
    member,
    isDueToday,
    getFallbackImage,
    formatDate,
    onViewClick,
    onEditClick,
  }) => (
    <div
      onClick={() => onViewClick(member)}
      className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-xl shadow-lg border border-gray-200/50 p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden backdrop-blur-sm"
    >
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 group-hover:opacity-100"></div>

      {isDueToday && (
        <div className="absolute w-3 h-3 rounded-full shadow-lg top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"></div>
      )}

      <div className="relative z-10 flex items-center gap-4 mb-4">
        <div className="w-16 h-16 overflow-hidden transition-all border-blue-400 rounded-full shadow-lg border-3 group-hover:border-blue-500">
          <img
            src={member.photoUrl || getFallbackImage(member.name)}
            alt={member.name}
            loading="lazy"
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = getFallbackImage(member.name);
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate transition-colors group-hover:text-blue-600">
            {member.name}
          </h3>
          <p className="text-sm text-gray-500">
            {member.gender}, {member.age} years
          </p>
        </div>
      </div>

      <div className="relative z-10 mb-4 space-y-2">
        <div className="flex items-center gap-2 p-2 text-sm text-gray-600 rounded-lg bg-blue-50/50">
          <Phone className="w-4 h-4 text-blue-500" />
          <span className="truncate">{member.phoneNo}</span>
        </div>
        <div className="flex items-center gap-2 p-2 text-sm text-gray-600 rounded-lg bg-green-50/50">
          <Mail className="w-4 h-4 text-green-500" />
          <span className="truncate">{member.email || "Not provided"}</span>
        </div>
        {member.emergencyContact && member.emergencyContact.trim() && (
          <div className="flex items-center gap-2 p-2 text-sm text-gray-600 rounded-lg bg-orange-50/50">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="truncate">{member.emergencyContact}</span>
          </div>
        )}
      </div>

      <div className="relative z-10 p-4 space-y-3 border bg-gradient-to-r from-gray-50/80 via-blue-50/80 to-purple-50/80 rounded-xl backdrop-blur-sm border-white/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Plan</span>
          <span className="px-2 py-1 text-sm font-semibold text-gray-900 rounded-lg bg-white/60">
            {member.planDuration}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Amount</span>
          <span className="text-sm font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
            ₹{member.feesAmount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Payment</span>
          <span className="px-2 py-1 text-xs font-medium text-gray-700 rounded-lg bg-white/60">
            {member.paymentMethod || "Cash"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Due Date</span>
          <span
            className={`text-sm font-medium px-2 py-1 rounded-lg ${
              isDueToday
                ? "text-red-600 bg-red-100"
                : "text-gray-900 bg-white/60"
            }`}
          >
            {formatDate(member.nextDueDate)}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex gap-2 pt-3 mt-4 border-t border-gray-200/50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewClick(member);
          }}
          className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm font-medium text-blue-600 transition-all duration-200 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditClick(member);
          }}
          className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 hover:border-gray-300"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  )
);

const MemberList = ({
  members,
  stats,
  searchTerm,
  setSearchTerm,
  selectedMember,
  setSelectedMember,
  isModalOpen,
  setIsModalOpen,
  profileProps = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const ITEMS_PER_PAGE = 30;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const {
    user,
    isProfileOpen,
    setIsProfileOpen,
    getOwnerDisplayName,
    getOwnerInitials,
    handleLogout,
    handleAddMember,
  } = profileProps;

  const userPlan = user?.subscriptionPlan || "NONE";
  const gymName = user?.gymDetails?.gymName || "FitTracker";
  const gymLogo = user?.gymDetails?.gymLogo;

  // Memoized utility functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const isDateToday = useCallback((dateString) => {
    if (!dateString) return false;
    const today = new Date().toISOString().split("T")[0];
    const memberDate = new Date(dateString).toISOString().split("T")[0];
    return memberDate === today;
  }, []);

  const getFallbackImage = useCallback((name) => {
    const colors = [
      "3b82f6",
      "8b5cf6",
      "06b6d4",
      "10b981",
      "f59e0b",
      "ef4444",
      "ec4899",
    ];
    const colorIndex = name ? name.length % colors.length : 0;
    const bgColor = colors[colorIndex];

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "Member"
    )}&background=${bgColor}&color=fff&size=200&rounded=true&bold=true`;
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, planFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsProfileOpen]);

  // Optimized filter with useMemo - prevents unnecessary recalculations
  const filteredAndSortedMembers = useMemo(() => {
    if (!members || !Array.isArray(members)) return [];

    return members.filter((member) => {
      const searchMatch =
        !searchTerm ||
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phoneNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase());

      let statusMatch = true;
      if (
        hasFeatureAccess(userPlan, "statusFiltering") &&
        statusFilter !== "all"
      ) {
        const memberStatus = member.paymentStatus?.toLowerCase();
        if (statusFilter === "paid") {
          statusMatch = memberStatus === "paid" || memberStatus === "active";
        } else if (statusFilter === "pending") {
          statusMatch = memberStatus === "pending";
        } else if (statusFilter === "overdue") {
          statusMatch =
            memberStatus === "overdue" || memberStatus === "expired";
        }
      }

      let planMatch = true;
      if (planFilter !== "all") {
        const memberPlan = member.planDuration?.toLowerCase();
        if (planFilter === "1 month") {
          planMatch =
            memberPlan?.includes("1") && memberPlan?.includes("month");
        } else if (planFilter === "3 months") {
          planMatch =
            memberPlan?.includes("3") && memberPlan?.includes("month");
        } else if (planFilter === "6 months") {
          planMatch =
            memberPlan?.includes("6") && memberPlan?.includes("month");
        } else if (planFilter === "12 months") {
          planMatch =
            (memberPlan?.includes("12") && memberPlan?.includes("month")) ||
            (memberPlan?.includes("1") && memberPlan?.includes("year"));
        }
      }

      return searchMatch && statusMatch && planMatch;
    });
  }, [members, searchTerm, statusFilter, planFilter, userPlan]);

  // Pagination calculations with useMemo
  const { totalPages, startIndex, paginatedMembers } = useMemo(() => {
    const total = Math.ceil(filteredAndSortedMembers.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filteredAndSortedMembers.slice(
      start,
      start + ITEMS_PER_PAGE
    );

    return {
      totalPages: total,
      startIndex: start,
      paginatedMembers: paginated,
    };
  }, [filteredAndSortedMembers, currentPage, ITEMS_PER_PAGE]);

  // Memoized event handlers
  const handleEditMember = useCallback(
    (member) => {
      console.log("Edit member:", member);
      setIsModalOpen(false);
      navigate(`/edit-member/${member.phoneNo}`, {
        state: { background: location },
      });
    },
    [navigate, setIsModalOpen]
  );

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const handleViewMember = useCallback(
    (member) => {
      setSelectedMember(member);
      setIsModalOpen(true);
    },
    [setSelectedMember, setIsModalOpen]
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setPlanFilter("all");
    setCurrentPage(1);
  }, [setSearchTerm]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchTerm(value);
        }, 300);
      };
    })(),
    [setSearchTerm]
  );

  // console.log("MemberList render - user data:", {
  //   user: user,
  //   gymName: user?.gymDetails?.gymName,
  //   gymLogo: user?.gymDetails?.gymLogo,
  //   isOnboardingComplete: user?.gymDetails?.isOnboardingComplete,
  // });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Gradient */}
      <div className="sticky top-0 z-40 border-b border-blue-100 shadow-lg bg-gradient-to-r from-white via-blue-50 to-white">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo with Plan Badge */}
            <div className="flex items-center gap-3">
              <div className="rounded-lg">
                {gymLogo ? (
                  <img
                    src={gymLogo}
                    alt="Gym Logo"
                    className="object-cover w-10 h-10 rounded"
                    loading="eager"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                ) : null}
                <Crown
                  className={`w-6 h-6 text-white ${gymLogo ? "hidden" : ""}`}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  {gymName}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">Gym Management</p>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      userPlan === "ENTERPRISE"
                        ? "bg-purple-100 text-purple-700"
                        : userPlan === "ADVANCED"
                        ? "bg-orange-100 text-orange-700"
                        : userPlan === "BASIC"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {userPlan === "NONE"
                      ? "Free"
                      : userPlan.charAt(0) + userPlan.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Search Bar with Debouncing */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative group">
                <Search className="absolute w-5 h-5 text-gray-400 transition-colors -translate-y-1/2 left-3 top-1/2 group-hover:text-blue-500" />
                <input
                  type="text"
                  placeholder="Search members by name, phone, email..."
                  defaultValue={searchTerm}
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 hover:shadow-sm"
                />
              </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-100 hover:scale-105"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={handleAddMember}
                className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-2 transition-all duration-200 rounded-lg hover:bg-blue-100 group"
                >
                  <div className="w-8 h-8 overflow-hidden transition-colors border-2 border-blue-200 rounded-full group-hover:border-blue-400">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={getOwnerDisplayName()}
                        className="object-cover w-full h-full"
                        loading="eager"
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
                        loading="eager"
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
                              loading="eager"
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
                              loading="eager"
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
                            <span
                              className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                                userPlan === "ENTERPRISE"
                                  ? "bg-purple-100 text-purple-700"
                                  : userPlan === "ADVANCED"
                                  ? "bg-orange-100 text-orange-700"
                                  : userPlan === "BASIC"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {userPlan === "NONE"
                                ? "Free"
                                : userPlan.charAt(0) +
                                  userPlan.slice(1).toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="flex items-center w-full gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </button>

                      {hasFeatureAccess(userPlan, "dueMembers") && (
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
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                      >
                        <Shield className="w-4 h-4" />
                        My Analytics
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

      {/* Stats Cards - Using Memoized Component */}
      <div className="px-6 py-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <StatCard
            icon={Users}
            title="Total Members"
            value={stats.totalMembers}
            gradient="border-blue-100 bg-gradient-to-br from-white to-blue-50"
            iconGradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Calendar}
            title="Due Today"
            value={stats.dueToday}
            gradient="border-red-100 bg-gradient-to-br from-white to-red-50"
            iconGradient="bg-gradient-to-br from-red-500 to-red-600"
          />
          <StatCard
            icon={CreditCard}
            title="Monthly Revenue"
            value={`₹${stats.monthlyRevenue}`}
            gradient="border-green-100 bg-gradient-to-br from-white to-green-50"
            iconGradient="bg-gradient-to-br from-green-500 to-green-600"
          />
        </div>

        {/* Page Title and Filters */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text">
                Members
              </h2>
              <p className="text-gray-600">
                Manage your gym members
                {filteredAndSortedMembers.length !== stats.totalMembers && (
                  <span className="font-medium text-blue-600">
                    ({filteredAndSortedMembers.length} of {stats.totalMembers}{" "}
                    shown)
                  </span>
                )}
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {hasFeatureAccess(userPlan, "statusFiltering") ? (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 text-sm transition-shadow bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid/Active</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue/Expired</option>
                </select>
              ) : (
                <div className="relative">
                  <select
                    disabled
                    className="px-4 py-2 text-sm text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed opacity-60"
                  >
                    <option>All Status (Premium)</option>
                  </select>
                  <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-8 top-1/2" />
                </div>
              )}

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-4 py-2 text-sm transition-shadow bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md"
              >
                <option value="all">All Plans</option>
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
                <option value="12 months">12 Months</option>
              </select>

              {((hasFeatureAccess(userPlan, "statusFiltering") &&
                statusFilter !== "all") ||
                planFilter !== "all") && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded-lg shadow-sm hover:bg-red-600 hover:shadow-md"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Members Cards Grid */}
        {!members || members.length === 0 ? (
          <div className="p-8 text-center border border-blue-100 rounded-lg shadow-md bg-gradient-to-br from-white to-blue-50">
            <Users className="w-16 h-16 mx-auto mb-4 text-blue-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No Members Found
            </h3>
            <p className="mb-4 text-gray-500">
              Get started by adding your first member to {gymName}.
            </p>
            <button
              onClick={handleAddMember}
              className="px-6 py-2 text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
            >
              Add Member
            </button>
          </div>
        ) : filteredAndSortedMembers.length === 0 ? (
          <div className="p-8 text-center border border-blue-100 rounded-lg shadow-md bg-gradient-to-br from-white to-blue-50">
            <Search className="w-16 h-16 mx-auto mb-4 text-blue-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No Members Found
            </h3>
            <p className="mb-4 text-gray-500">
              No members match your search criteria or filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
              {paginatedMembers.map((member, index) => (
                <MemberCard
                  key={member._id || member.id || `member-${index}`}
                  member={member}
                  isDueToday={isDateToday(member.nextDueDate)}
                  getFallbackImage={getFallbackImage}
                  formatDate={formatDate}
                  onViewClick={handleViewMember}
                  onEditClick={handleEditMember}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border border-blue-100 rounded-lg shadow-md bg-gradient-to-r from-white via-blue-50 to-white">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Showing</span>
                  <span className="font-medium text-blue-600">
                    {startIndex + 1} -{" "}
                    {Math.min(
                      startIndex + ITEMS_PER_PAGE,
                      filteredAndSortedMembers.length
                    )}
                  </span>
                  <span>of</span>
                  <span className="font-medium text-blue-600">
                    {filteredAndSortedMembers.length}
                  </span>
                  <span>members</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        const showEllipsis =
                          index > 0 && page - array[index - 1] > 1;

                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="px-3 py-2 text-gray-400">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                currentPage === page
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-100"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Member Detail Modal */}
      {isModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative p-6 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute p-2 transition-colors rounded-lg top-4 right-4 hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 overflow-hidden border-4 rounded-full shadow-lg border-white/30">
                  <img
                    src={
                      selectedMember.photoUrl ||
                      getFallbackImage(selectedMember.name)
                    }
                    alt={selectedMember.name}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = getFallbackImage(selectedMember.name);
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
                  <p className="text-blue-100">
                    {selectedMember.gender}, {selectedMember.age} years
                  </p>
                  <span
                    className={`inline-block px-3 py-1 mt-2 text-sm font-medium rounded-full ${
                      selectedMember.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedMember.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                  <User className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-3 bg-white border border-blue-100 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedMember.phoneNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium truncate">
                        {selectedMember.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-orange-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Emergency Contact</p>
                      <p className="font-medium">
                        {selectedMember.emergencyContact || "Not provided"}
                      </p>
                    </div>
                  </div>
                  {selectedMember.address && (
                    <div className="flex items-start gap-3 p-3 bg-white border border-blue-100 rounded-lg md:col-span-2">
                      <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{selectedMember.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Membership Details */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Membership Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-3 bg-white border border-green-100 rounded-lg">
                    <p className="text-sm text-gray-600">Plan Duration</p>
                    <p className="text-lg font-bold text-green-600">
                      {selectedMember.planDuration}
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-green-100 rounded-lg">
                    <p className="text-sm text-gray-600">Fees Amount</p>
                    <p className="text-lg font-bold text-green-600">
                      ₹{selectedMember.feesAmount}
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-green-100 rounded-lg">
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">
                      {selectedMember.paymentMethod || "Cash"}
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-green-100 rounded-lg">
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p
                      className={`font-medium ${
                        selectedMember.paymentStatus === "Paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedMember.paymentStatus}
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-green-100 rounded-lg">
                    <p className="text-sm text-gray-600">Join Date</p>
                    <p className="font-medium">
                      {formatDate(
                        selectedMember.joinDate || selectedMember.joiningDate
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-green-100 rounded-lg">
                    <p className="text-sm text-gray-600">Next Due Date</p>
                    <p
                      className={`font-medium ${
                        isDateToday(selectedMember.nextDueDate)
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {formatDate(selectedMember.nextDueDate)}
                      {isDateToday(selectedMember.nextDueDate) && (
                        <span className="px-2 py-1 ml-2 text-xs text-red-600 bg-red-100 rounded-full">
                          Due Today
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditMember(selectedMember)}
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-3 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
                >
                  <Edit className="w-5 h-5" />
                  Edit Member
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-3 font-medium text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal (local, no routing) */}
      {isProfileModalOpen && (
        <ModalContainer
          onClose={() => setIsProfileModalOpen(false)}
          maxWidth={720}
          padding={0}
          backdropBlur={8}
          backdropOpacity={0.65}
          borderRadius={16}
        >
          <MyProfile />
        </ModalContainer>
      )}
    </div>
  );
};

export default MemberList;
