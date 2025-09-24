import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../../../Auth/Store/AuthStore";
import { initiatePayment,processRazorpayPayment } from "../Service/paymentService";
import PaymentUI from "../Ui/PaymentUi";
const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, refreshUser } = useAuthStore();
  
  // Get plan from URL params
  const planFromUrl = searchParams.get("plan") || "BASIC";
  const billingFromUrl = searchParams.get("billing") || "monthly";
  
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState(billingFromUrl);
  const [error, setError] = useState(null);

  // Plan configuration
  const planConfig = {
    BASIC: {
      name: "Basic",
      tagline: "Start Your Gym Journey",
      monthlyPrice: 399,
      yearlyPrice: 3990,
      yearlyDiscount: "Save ₹798",
      features: [
        "Up to 150 members",
        "AI-powered member insights",
        "Smart payment reminders (WhatsApp)",
        "Member dashboard with profiles",
        "24/7 chat & email support",
        "Search active members",
        "Add new members manually",
        "Basic analytics reports",
        "Due notifications to owner",
        "Single location support"
      ]
    }
  };

  const currentPlan = planConfig[planFromUrl];
  const currentPrice = selectedBilling === "yearly" ? currentPlan?.yearlyPrice : currentPlan?.monthlyPrice;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle billing change
  const handleBillingChange = (billing) => {
    setSelectedBilling(billing);
    setError(null);
  };

  // Enhanced error handling function
  const getErrorCode = (error) => {
    const errorMessage = error.message || error.toString().toLowerCase();
    
    if (errorMessage.includes("insufficient") || errorMessage.includes("balance")) {
      return "insufficient_funds";
    }
    if (errorMessage.includes("declined") || errorMessage.includes("card")) {
      return "card_declined";
    }
    if (errorMessage.includes("network") || errorMessage.includes("connection")) {
      return "network_error";
    }
    if (errorMessage.includes("session") || errorMessage.includes("expired")) {
      return "session_expired";
    }
    if (errorMessage.includes("cancelled") || errorMessage.includes("dismissed")) {
      return "user_cancelled";
    }
    
    return "payment_failed";
  };

  // Handle payment process
  const handlePayment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Initiate payment with backend
      const orderData = await initiatePayment(planFromUrl, selectedBilling);
      
      if (!orderData.success) {
        throw new Error(orderData.message);
      }

      // Process payment with Razorpay
      await processRazorpayPayment(
        orderData.data,
        (verificationResult) => {
          // Payment successful
          console.log("Payment successful:", verificationResult);
          // Refresh user data to get updated subscription
          refreshUser();
          // Redirect to success page
          navigate("/payment/success", {
            state: {
              plan: planFromUrl,
              billing: selectedBilling,
              amount: currentPrice,
              user: user,
              ...verificationResult.data
            }
          });
        },
        (error) => {
          // Payment failed - Enhanced error handling
          console.error("Payment failed:", error);
          
          const errorCode = getErrorCode(error);
          const errorMessage = error.message || "Payment could not be completed";
          
          navigate("/payment/failed", {
            state: {
              plan: planFromUrl,
              billing: selectedBilling,
              amount: currentPrice,
              user: user,
              error: errorMessage,
              errorCode: errorCode,
              timestamp: new Date().toISOString(),
              // Additional context for debugging
              context: {
                planPrice: currentPrice,
                userEmail: user.email,
                attemptedAt: new Date().toLocaleString()
              }
            }
          });
        }
      );
    } catch (error) {
      console.error("Payment initiation failed:", error);
      
      // Handle initiation errors
      const errorCode = getErrorCode(error);
      
      // For initiation errors, also redirect to failed page
      navigate("/payment/failed", {
        state: {
          plan: planFromUrl,
          billing: selectedBilling,
          amount: currentPrice,
          user: user,
          error: error.message || "Failed to initialize payment",
          errorCode: errorCode,
          timestamp: new Date().toISOString(),
          initiationError: true, // Flag to indicate this was an initiation error
          context: {
            planPrice: currentPrice,
            userEmail: user.email,
            attemptedAt: new Date().toLocaleString()
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // If plan not found
  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Invalid plan selected</div>
      </div>
    );
  }

  // Pass all data and handlers to UI component
  const paymentUIProps = {
    // Plan data
    plan: currentPlan,
    planId: planFromUrl,
    selectedBilling,
    currentPrice,
    
    // User data
    user,
    
    // States
    isLoading,
    error,
    
    // Handlers
    onBillingChange: handleBillingChange,
    onPayment: handlePayment,
    onGoBack: handleGoBack
  };

  return <PaymentUI {...paymentUIProps} />;
};

export default PaymentPage;