// pages/MySubscription.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../Auth/Store/AuthStore";
import SubscriptionUI from "../Ui/SubscriptionUi";

import {
  getSubscriptionDetails,
  getPlanComparison,
  calculateUpgradePrice,
  getUsageAnalytics,
  updateNotificationSettings,
} from "../Service/SubscriptionService";
import { initiatePayment } from "../../PaaymentSystem/Service/paymentService";

const MySubscription = () => {
  const navigate = useNavigate();
  const { user, refreshSubscription } = useAuthStore();

  // Main data states
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [planComparison, setPlanComparison] = useState(null);
  const [usageAnalytics, setUsageAnalytics] = useState(null);
  const [upgradeCalc, setUpgradeCalc] = useState(null);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState("monthly");
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);

  // Load all subscription data
  const loadSubscriptionData = async () => {
    try {
      setError(null);

      // Load all data in parallel
      const [detailsRes, plansRes, analyticsRes] = await Promise.all([
        getSubscriptionDetails(),
        getPlanComparison(),
        getUsageAnalytics(),
      ]);

      if (detailsRes.success) {
        setSubscriptionData(detailsRes.data);
      }

      if (plansRes.success) {
        setPlanComparison(plansRes.data);
      }

      if (analyticsRes.success) {
        setUsageAnalytics(analyticsRes.data);
      }
    } catch (err) {
      console.error("Error loading subscription data:", err);
      setError(err.message || "Failed to load subscription data");
    }
  };

  // Initial data load
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await loadSubscriptionData();
      setLoading(false);
    };

    if (user) {
      initializeData();
    }
  }, [user]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSubscriptionData();
    await refreshSubscription();
    setRefreshing(false);
  };

  // Handle plan selection for upgrade
  const handlePlanSelect = async (planId, billing) => {
    if (!planId || planId === subscriptionData?.subscription?.plan) return;

    setSelectedPlan(planId);
    setSelectedBilling(billing);
    setCalculatingPrice(true);
    setUpgradeCalc(null);

    try {
      const calcResponse = await calculateUpgradePrice(planId, billing);
      if (calcResponse.success) {
        setUpgradeCalc(calcResponse.data);
      }
    } catch (err) {
      console.error("Price calculation error:", err);
      setError(err.message);
    } finally {
      setCalculatingPrice(false);
    }
  };

  // Handle upgrade process
  const handleUpgrade = async () => {
    if (!selectedPlan || !upgradeCalc) return;

    setProcessingUpgrade(true);
    setError(null);

    try {
      // Initiate payment with Razorpay
      const paymentData = {
        plan: selectedPlan,
        billing: selectedBilling,
        amount: upgradeCalc.pricing.finalPrice,
        user: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.mobileNumber,
        },
      };

      const paymentResult = await initiatePayment(paymentData);

      if (paymentResult.success) {
        // Refresh data after successful upgrade
        await handleRefresh();
        setSelectedPlan(null);
        setUpgradeCalc(null);

        // Show success message or redirect
        navigate("/subscription/success", {
          state: {
            upgrade: true,
            plan: selectedPlan,
            billing: selectedBilling,
          },
        });
      } else {
        setError(paymentResult.message || "Payment failed");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      setError(err.message || "Upgrade failed");
    } finally {
      setProcessingUpgrade(false);
    }
  };

  // Handle notification settings update
  const handleNotificationUpdate = async (enabled) => {
    try {
      await updateNotificationSettings(enabled);

      // Refresh subscription data to show updated settings
      await loadSubscriptionData();
    } catch (err) {
      console.error("Notification update error:", err);
      setError(err.message);
    }
  };

  // Handle billing cycle change
  const handleBillingChange = (billing) => {
    setSelectedBilling(billing);
    if (selectedPlan) {
      handlePlanSelect(selectedPlan, billing);
    }
  };

  // Get current plan features for display
  const getCurrentPlanFeatures = () => {
    if (!subscriptionData?.plan?.features) return [];
    return subscriptionData.plan.features;
  };

  // Get usage warnings
  const getUsageWarnings = () => {
    if (!usageAnalytics?.warnings) return [];
    return usageAnalytics.warnings;
  };

  // Calculate days until next billing
  const getDaysUntilBilling = () => {
    if (!subscriptionData?.subscription?.expiry) return 0;

    const expiry = new Date(subscriptionData.subscription.expiry);
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(diffDays, 0);
  };

  // Prepare props for UI component
  const uiProps = {
    // Data props
    subscription: subscriptionData?.subscription,
    currentPlan: subscriptionData?.plan,
    usage: subscriptionData?.usage,
    limits: subscriptionData?.limits,
    billing: subscriptionData?.billing,
    plans: planComparison?.plans,
    currentUsage: planComparison?.currentUsage,
    analytics: usageAnalytics,
    upgradeCalculation: upgradeCalc,

    // State props
    loading,
    error,
    refreshing,
    selectedPlan,
    selectedBilling,
    calculatingPrice,
    processingUpgrade,

    // Computed props
    currentPlanFeatures: getCurrentPlanFeatures(),
    usageWarnings: getUsageWarnings(),
    daysUntilBilling: getDaysUntilBilling(),
    hasActiveSubscription: subscriptionData?.subscription?.isActive || false,

    // Event handlers
    onRefresh: handleRefresh,
    onPlanSelect: handlePlanSelect,
    onUpgrade: handleUpgrade,
    onBillingChange: handleBillingChange,
    onNotificationUpdate: handleNotificationUpdate,
    onClearError: () => setError(null),
    onCancelUpgrade: () => {
      setSelectedPlan(null);
      setUpgradeCalc(null);
      setError(null);
    },
  };

  return <SubscriptionUI {...uiProps} />;
};

export default MySubscription;
