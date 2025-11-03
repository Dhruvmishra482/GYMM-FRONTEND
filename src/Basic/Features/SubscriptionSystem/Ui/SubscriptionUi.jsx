import React, { useState, useMemo, useCallback } from "react";
import {
  ArrowLeft,
  Check,
  Crown,
  Rocket,
  Sparkles,
  Zap,
  Users,
  TrendingUp,
  X,
  ChevronRight,
  BarChart3,
  MessageSquare,
  Dumbbell,
  RefreshCw,
  Lock,
  Info,
  Clock,
} from "lucide-react";

// Responsive Loading State
const LoadingState = React.memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center">
      <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-gray-200 border-t-blue-600 mx-auto mb-3" />
      <p className="text-gray-600 text-xs sm:text-sm">Loading subscription details...</p>
    </div>
  </div>
));

LoadingState.displayName = "LoadingState";

// Responsive Header
const SubscriptionHeader = React.memo(
  ({ onBack, refreshing, onRefresh, gymName }) => (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
            <button
              onClick={onBack}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="min-w-0 flex-1 sm:flex-none">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Subscription
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                Real-time plan insights for {gymName || "Your Gym"}
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
          >
            <RefreshCw
              className={`w-3 h-3 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="font-medium">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  )
);

SubscriptionHeader.displayName = "SubscriptionHeader";

// Responsive Status Badge
const StatusBadge = React.memo(({ isActive, daysLeft }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
    <div className="flex items-center">
      <div
        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
          isActive ? "bg-green-500" : "bg-red-500"
        } mr-1.5 sm:mr-2`}
      />
      <span className="text-xs sm:text-sm font-medium text-gray-700">
        {isActive ? "Live Data" : "Inactive"}
      </span>
    </div>
    {daysLeft > 0 && (
      <span className="text-xs sm:text-sm text-gray-500">• {daysLeft} days remaining</span>
    )}
  </div>
));

StatusBadge.displayName = "StatusBadge";

// Responsive Stat Card
const StatCard = React.memo(
  ({
    title,
    value,
    subtitle,
    icon: Icon,
    gradient,
    trend,
    trendValue,
    locked,
    comingSoon,
  }) => (
    <div
      className={`bg-white rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow relative ${
        locked || comingSoon ? "overflow-hidden" : ""
      }`}
    >
      {comingSoon && (
        <>
          <div className="absolute inset-0 backdrop-blur-md bg-white/70 z-10 flex items-center justify-center cursor-not-allowed">
            <div className="text-center px-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <p className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 sm:mb-1">
                Coming Soon
              </p>
              <p className="text-[10px] sm:text-xs text-gray-600">
                This feature will be available shortly
              </p>
            </div>
          </div>
          <div className="filter blur-sm pointer-events-none select-none">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <h3 className="text-gray-600 text-xs sm:text-sm font-medium">{title}</h3>
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}
              >
                <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900">{value}</div>
              {trendValue && (
                <div
                  className={`text-xs sm:text-sm font-medium ${
                    trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trendValue}
                </div>
              )}
              <div className="text-xs sm:text-sm text-gray-500">{subtitle}</div>
            </div>
          </div>
        </>
      )}
      {locked && !comingSoon && (
        <>
          <div className="absolute inset-0 backdrop-blur-md bg-white/60 z-10 flex items-center justify-center cursor-not-allowed">
            <div className="text-center px-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                <Lock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <p className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 sm:mb-1">
                Upgrade to Advanced
              </p>
              <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">
                Unlock WhatsApp Reminders
              </p>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] sm:text-xs font-bold rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-md">
                Upgrade Now
              </button>
            </div>
          </div>
          <div className="filter blur-md pointer-events-none select-none">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <h3 className="text-gray-600 text-xs sm:text-sm font-medium">{title}</h3>
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}
              >
                <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900">{value}</div>
              {trendValue && (
                <div
                  className={`text-xs sm:text-sm font-medium ${
                    trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trendValue}
                </div>
              )}
              <div className="text-xs sm:text-sm text-gray-500">{subtitle}</div>
            </div>
          </div>
        </>
      )}
      {!locked && !comingSoon && (
        <>
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium">{title}</h3>
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm flex-shrink-0`}
            >
              <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <div className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900">{value}</div>
            {trendValue && (
              <div
                className={`text-xs sm:text-sm font-medium ${
                  trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trendValue}
              </div>
            )}
            <div className="text-xs sm:text-sm text-gray-500">{subtitle}</div>
          </div>
        </>
      )}
    </div>
  )
);

StatCard.displayName = "StatCard";

// Responsive Current Plan Overview
const CurrentPlanOverview = React.memo(
  ({ subscription, currentPlan, hasActiveSubscription, daysUntilBilling }) => {
    const getPlanGradient = (planName) => {
      if (planName?.includes("BASIC")) return "from-blue-500 to-blue-600";
      if (planName?.includes("ADVANCED")) return "from-orange-500 to-red-600";
      if (planName?.includes("ENTERPRISE"))
        return "from-purple-500 to-pink-600";
      return "from-gray-500 to-gray-600";
    };

    const getPlanIcon = (planName) => {
      if (planName?.includes("BASIC")) return Rocket;
      if (planName?.includes("ADVANCED")) return Crown;
      if (planName?.includes("ENTERPRISE")) return Sparkles;
      return Zap;
    };

    const planName = currentPlan?.name || subscription?.planName || "No Plan";
    const PlanIcon = getPlanIcon(planName);

    return (
      <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 mb-4 sm:mb-6 hover:shadow-lg transition-shadow">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-tr from-orange-50 to-pink-50 rounded-full translate-y-16 sm:translate-y-24 -translate-x-16 sm:-translate-x-24 opacity-50" />

        <div className="relative p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full sm:w-auto">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${getPlanGradient(
                  planName
                )} flex items-center justify-center shadow-xl relative group flex-shrink-0`}
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <PlanIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white relative z-10" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                    {planName} Plan
                  </h2>
                  {hasActiveSubscription && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                      Active
                    </span>
                  )}
                </div>
                <StatusBadge
                  isActive={hasActiveSubscription}
                  daysLeft={daysUntilBilling}
                />
              </div>
            </div>

            {daysUntilBilling > 0 && (
              <div className="text-left sm:text-right w-full sm:w-auto">
                <div className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Days Remaining</div>
                <div className="text-3xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {daysUntilBilling}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CurrentPlanOverview.displayName = "CurrentPlanOverview";

// Responsive Usage Stats Grid
const UsageStatsGrid = React.memo(({ usage, currentPlan }) => {
  if (!usage) return null;

  const isBasicPlan = currentPlan?.id === "BASIC";

  const stats = [
    {
      title: "Total Members",
      value: usage.members?.current || 0,
      subtitle: `Limit: ${
        usage.members?.limit === -1 ? "Unlimited" : usage.members?.limit
      }`,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      trendValue:
        usage.members?.remaining !== "Unlimited"
          ? `${usage.members?.remaining} slots left`
          : "Unlimited",
      trend: "neutral",
      locked: false,
      comingSoon: false,
    },
    {
      title: "WhatsApp Reminders",
      value: usage.whatsappReminders?.current || 0,
      subtitle: `Limit: ${
        usage.whatsappReminders?.limit === -1
          ? "Unlimited"
          : usage.whatsappReminders?.limit
      }`,
      icon: MessageSquare,
      gradient: "from-green-500 to-green-600",
      trendValue:
        usage.whatsappReminders?.remaining !== "Unlimited"
          ? `${usage.whatsappReminders?.remaining} remaining`
          : "Unlimited",
      trend: "neutral",
      locked: isBasicPlan,
      comingSoon: true,
    },
    {
      title: "Analytics Views",
      value: usage.analyticsViews?.current || 0,
      subtitle: `Limit: ${
        usage.analyticsViews?.limit === -1
          ? "Unlimited"
          : usage.analyticsViews?.limit
      }`,
      icon: BarChart3,
      gradient: "from-purple-500 to-purple-600",
      trendValue:
        usage.analyticsViews?.remaining !== "Unlimited"
          ? `${usage.analyticsViews?.remaining} remaining`
          : "Unlimited",
      trend: "neutral",
      locked: false,
      comingSoon: false,
    },
    {
      title: "Member Capacity",
      value: `${Math.round(usage.members?.percentage || 0)}%`,
      subtitle: "Current usage",
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600",
      trendValue:
        usage.members?.percentage > 80 ? "Consider upgrading" : "Healthy usage",
      trend: usage.members?.percentage > 80 ? "down" : "up",
      locked: false,
      comingSoon: false,
    },
  ];

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Usage Analytics</h2>
        <span className="text-xs sm:text-sm text-gray-500">Real-time data</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>
    </div>
  );
});

UsageStatsGrid.displayName = "UsageStatsGrid";

// Responsive Features Modal
const FeaturesModal = React.memo(({ plan, onClose }) => {
  if (!plan) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-5 md:p-6 z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                <span className="truncate">{plan.name} Plan Features</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">{plan.tagline}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {plan.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                  {feature.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs sm:text-sm text-blue-900">
              <strong>Total Features:</strong> {plan.features.length} premium
              features included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

FeaturesModal.displayName = "FeaturesModal";

// Responsive Plan Card
const PlanCard = React.memo(
  ({
    plan,
    isCurrent,
    onSelect,
    selectedBilling,
    onShowFeatures,
    comingSoon,
  }) => {
    const getPlanGradient = () => {
      if (plan.name === "Basic") return "from-blue-500 to-blue-600";
      if (plan.name === "Advanced") return "from-orange-500 to-red-600";
      if (plan.name === "Enterprise") return "from-purple-500 to-pink-600";
      return "from-gray-500 to-gray-600";
    };

    const getPlanIcon = () => {
      if (plan.name === "Basic")
        return <Rocket className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />;
      if (plan.name === "Advanced")
        return <Crown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />;
      if (plan.name === "Enterprise")
        return <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />;
      return <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />;
    };

    const getBillingKey = () => {
      switch (selectedBilling) {
        case "monthly":
          return "monthly";
        case "quarterly":
          return "quarterly";
        case "halfYearly":
          return "halfYearly";
        case "yearly":
          return "yearly";
        default:
          return "monthly";
      }
    };

    const billingKey = getBillingKey();
    const price = plan.prices[billingKey];
    const savings =
      selectedBilling !== "monthly" ? plan.savings[billingKey] : null;

    const getBillingPeriod = () => {
      switch (selectedBilling) {
        case "quarterly":
          return "3 months";
        case "halfYearly":
          return "6 months";
        case "yearly":
          return "year";
        default:
          return "month";
      }
    };

    return (
      <div
        className={`relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
          isCurrent
            ? "border-2 border-blue-500 shadow-lg"
            : "border border-gray-200"
        } ${plan.popular ? "shadow-xl" : ""} ${
          comingSoon ? "pointer-events-none" : ""
        }`}
      >
        {comingSoon && (
          <div className="absolute inset-0 backdrop-blur-sm bg-white/70 z-20 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl">
                <Clock className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                Coming Soon
              </p>
              <p className="text-xs sm:text-sm text-gray-600 px-2">
                This plan will be available shortly
              </p>
            </div>
          </div>
        )}

        <div className={comingSoon ? "filter blur-sm" : ""}>
          {plan.popular && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg z-10">
              POPULAR
            </div>
          )}

          {isCurrent && (
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-green-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg z-10">
              CURRENT
            </div>
          )}

          <div
            className={`bg-gradient-to-br ${getPlanGradient()} p-5 sm:p-6 md:p-8 text-white relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12" />

            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4 backdrop-blur-sm">
                {getPlanIcon()}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{plan.name}</h3>
              <p className="text-white/90 text-xs sm:text-sm mb-4 sm:mb-6">{plan.tagline}</p>
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  ₹{price?.toLocaleString()}
                </span>
                <span className="text-white/80 text-base sm:text-lg">
                  /{getBillingPeriod()}
                </span>
              </div>
              {savings && (
                <div className="mt-2 sm:mt-3 inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
                  <span className="text-xs sm:text-sm font-semibold">{savings}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5 md:p-6">
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 min-h-[2.5rem] sm:min-h-[3rem]">
              {plan.description}
            </p>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {plan.features.slice(0, 6).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">
                    {feature.name}
                  </span>
                </div>
              ))}
              {plan.features.length > 6 && (
                <button
                  onClick={() => onShowFeatures(plan)}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 ml-6 sm:ml-8 group hover:bg-blue-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all"
                >
                  <span>+{plan.features.length - 6} more features</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            {isCurrent ? (
              <div className="w-full py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg text-center font-semibold text-sm sm:text-base">
                Current Plan
              </div>
            ) : (
              <button
                onClick={() => onSelect(plan)}
                className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-sm sm:text-base ${
                  plan.name === "Basic"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    : plan.name === "Advanced"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                    : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                }`}
              >
                {plan.buttonText || "Select Plan"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PlanCard.displayName = "PlanCard";

// Responsive Upgrade Modal
const UpgradeModal = React.memo(
  ({
    plan,
    upgradeCalculation,
    onConfirm,
    onCancel,
    processing,
    selectedBilling,
  }) => {
    if (!plan) return null;

    const getBillingKey = () => {
      switch (selectedBilling) {
        case "monthly":
          return "monthly";
        case "quarterly":
          return "quarterly";
        case "halfYearly":
          return "halfYearly";
        case "yearly":
          return "yearly";
        default:
          return "monthly";
      }
    };

    const billingKey = getBillingKey();
    const planPrice = plan.prices[billingKey] || 0;

    const finalPrice = upgradeCalculation?.pricing?.finalPrice || planPrice;
    const originalPrice =
      upgradeCalculation?.pricing?.originalPrice || planPrice;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
        <div className="bg-white rounded-xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                Upgrade to {plan.name}
              </h3>
              <button
                onClick={onCancel}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">{plan.tagline}</p>
          </div>

          <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 sm:p-5 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                Pricing Breakdown
              </h4>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600">Plan Price</span>
                  <span className="font-semibold text-gray-900 text-base sm:text-lg">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 pt-2.5 sm:pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base sm:text-lg">
                    Total Amount
                  </span>
                  <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{finalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2.5 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                What You'll Get:
              </h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {plan.features.slice(0, 5).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={onConfirm}
              disabled={processing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                `Upgrade Now - ₹${finalPrice.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

UpgradeModal.displayName = "UpgradeModal";

// Main Responsive SubscriptionUI Component
const SubscriptionUI = ({
  subscription,
  currentPlan,
  usage,
  plans,
  upgradeCalculation,
  loading,
  error,
  refreshing,
  selectedPlan,
  selectedBilling,
  processingUpgrade,
  hasActiveSubscription,
  daysUntilBilling,
  onRefresh,
  onPlanSelect,
  onUpgrade,
  onBillingChange,
  onCancelUpgrade,
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState(null);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [featuresModalPlan, setFeaturesModalPlan] = useState(null);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handlePlanSelect = useCallback(
    (plan) => {
      setSelectedPlanForUpgrade(plan);
      onPlanSelect(plan.id, selectedBilling);
      setShowUpgradeModal(true);
    },
    [selectedBilling, onPlanSelect]
  );

  const handleConfirmUpgrade = useCallback(() => {
    onUpgrade();
  }, [onUpgrade]);

  const handleCancelUpgrade = useCallback(() => {
    setShowUpgradeModal(false);
    setSelectedPlanForUpgrade(null);
    onCancelUpgrade();
  }, [onCancelUpgrade]);

  const handleShowFeatures = useCallback((plan) => {
    setFeaturesModalPlan(plan);
    setShowFeaturesModal(true);
  }, []);

  const handleCloseFeaturesModal = useCallback(() => {
    setShowFeaturesModal(false);
    setFeaturesModalPlan(null);
  }, []);

  const availablePlans = useMemo(() => {
    const allPlans = [
      {
        id: "BASIC",
        name: "Basic",
        tagline: "Start Your Gym Journey",
        description:
          "Perfect for small gyms and personal trainers looking to digitize operations.",
        prices: {
          monthly: 399,
          quarterly: 1097,
          halfYearly: 2095,
          yearly: 3990,
        },
        savings: {
          quarterly: "Save ₹100",
          halfYearly: "Save ₹299",
          yearly: "Save ₹798",
        },
        features: [
          { name: "Up to 150 members", included: true },
          { name: "Member dashboard & profiles", included: true },
          { name: "Due notifications", included: true },
          { name: "Basic fee tracking", included: true },
          { name: "Emergency contacts", included: true },
          { name: "Basic analytics", included: true },
          { name: "Data backup & security", included: true },
          { name: "24/7 support", included: true },
        ],
        buttonText: "Start Your Journey",
        popular: false,
        current: currentPlan?.id === "BASIC",
        comingSoon: false,
      },
      {
        id: "ADVANCED",
        name: "Advanced",
        tagline: "Scale Your Fitness Business",
        description:
          "Growing gyms with automation, smart reminders, and advanced analytics.",
        prices: {
          monthly: 699,
          quarterly: 1897,
          halfYearly: 3595,
          yearly: 6990,
        },
        savings: {
          quarterly: "Save ₹200",
          halfYearly: "Save ₹599",
          yearly: "Save ₹1398",
        },
        features: [
          { name: "Up to 400 members", included: true },
          { name: "All Basic features", included: true },
          { name: "WhatsApp notifications", included: true },
          { name: "Predictive fee tracking", included: true },
          { name: "Inactive member alerts", included: true },
          { name: "Advanced analytics", included: true },
          { name: "AI Diet Plans", included: true },
          { name: "AI workout recommendations", included: true },
          { name: "Bulk messaging", included: true },
          { name: "Equipment reminders", included: true },
          { name: "Priority support", included: true },
        ],
        buttonText: "Unleash Your Potential",
        popular: true,
        current: currentPlan?.id === "ADVANCED",
        comingSoon: true,
      },
      {
        id: "ENTERPRISE",
        name: "Enterprise",
        tagline: "For Fitness Empires",
        description:
          "Most powerful tools for multiple gyms and maximum member engagement.",
        prices: {
          monthly: 999,
          quarterly: 2697,
          halfYearly: 5095,
          yearly: 9990,
        },
        savings: {
          quarterly: "Save ₹300",
          halfYearly: "Save ₹899",
          yearly: "Save ₹1998",
        },
        features: [
          { name: "Unlimited members", included: true },
          { name: "All Advanced features", included: true },
          { name: "Multiple branches", included: true },
          { name: "Daily WhatsApp reports", included: true },
          { name: "Smart reminders + QR", included: true },
          { name: "AI crowd prediction", included: true },
          { name: "Birthday alerts", included: true },
          { name: "Advanced AI workouts", included: true },
          { name: "Nutrition tracking", included: true },
          { name: "Re-activation campaigns", included: true },
          { name: "Expense tracking", included: true },
          { name: "Class scheduling", included: true },
          { name: "Success manager", included: true },
          { name: "Early access features", included: true },
        ],
        buttonText: "Claim Your Throne",
        popular: false,
        current: currentPlan?.id === "ENTERPRISE",
        comingSoon: true,
      },
    ];

    return allPlans;
  }, [currentPlan]);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gray-50">
      <SubscriptionHeader
        onBack={handleBack}
        refreshing={refreshing}
        onRefresh={onRefresh}
        gymName="Warriors"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <p className="text-red-800 text-xs sm:text-sm font-medium">{error}</p>
          </div>
        )}

        <CurrentPlanOverview
          subscription={subscription}
          currentPlan={currentPlan}
          hasActiveSubscription={hasActiveSubscription}
          daysUntilBilling={daysUntilBilling}
        />

        <UsageStatsGrid usage={usage} currentPlan={currentPlan} />

        <div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Available Plans
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                Choose the perfect plan for your gym's growth
              </p>
            </div>
            <div className="w-full lg:w-auto overflow-x-auto">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl p-0.5 sm:p-1 flex gap-0.5 sm:gap-1 shadow-lg min-w-max">
                <button
                  onClick={() => onBillingChange("monthly")}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                    selectedBilling === "monthly"
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => onBillingChange("quarterly")}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                    selectedBilling === "quarterly"
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  3 Months
                  {selectedBilling === "quarterly" && (
                    <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-green-500 text-white text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
                      SAVE
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onBillingChange("halfYearly")}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                    selectedBilling === "halfYearly"
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  6 Months
                  {selectedBilling === "halfYearly" && (
                    <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-green-500 text-white text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
                      SAVE
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onBillingChange("yearly")}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                    selectedBilling === "yearly"
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  1 Year
                  {selectedBilling === "yearly" && (
                    <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-green-500 text-white text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
                      SAVE
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {availablePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrent={plan.current}
                onSelect={handlePlanSelect}
                onShowFeatures={handleShowFeatures}
                selectedBilling={selectedBilling}
                comingSoon={plan.comingSoon}
              />
            ))}
          </div>
        </div>
      </div>

      {showUpgradeModal && selectedPlanForUpgrade && (
        <UpgradeModal
          plan={selectedPlanForUpgrade}
          upgradeCalculation={upgradeCalculation}
          onConfirm={handleConfirmUpgrade}
          onCancel={handleCancelUpgrade}
          processing={processingUpgrade}
          selectedBilling={selectedBilling}
        />
      )}

      {showFeaturesModal && featuresModalPlan && (
        <FeaturesModal
          plan={featuresModalPlan}
          onClose={handleCloseFeaturesModal}
        />
      )}
    </div>
  );
};

export default React.memo(SubscriptionUI);