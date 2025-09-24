
import axiosInstance from "../../../../axios.config";

// Get subscription plans
export const getSubscriptionPlans = async () => {
  try {
    const response = await axiosInstance.get("/payment/plans");
    return response.data;
  } catch (error) {
    console.error("Get plans error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to fetch plans");
  }
};

// Get user's subscription status - FIXED to match your backend response
export const getSubscriptionStatus = async () => {
  try {
    const response = await axiosInstance.get("/payment/status");
    return response.data;
  } catch (error) {
    console.error("Get subscription status error:", error.response?.data);
    
    // Handle specific error cases from your backend
    if (error.response?.status === 401) {
      throw new Error("Authentication required");
    }
    
    // Return a safe fallback for subscription errors
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch subscription status",
      data: {
        subscription: {
          isActive: false,
          plan: "NONE",
          expiry: null,
          needsSubscription: true,
          daysLeft: 0
        }
      }
    };
  }
};

// Initiate payment process
export const initiatePayment = async (plan, billing = "monthly") => {
  try {
    const response = await axiosInstance.post("/payment/initiate", {
      plan,
      billing
    });
    return response.data;
  } catch (error) {
    console.error("Payment initiation error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to initiate payment");
  }
};

// Verify payment after Razorpay success
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post("/payment/verify", paymentData);
    return response.data;
  } catch (error) {
    console.error("Payment verification error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Payment verification failed");
  }
};

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Handle Razorpay payment - FIXED error handling
export const processRazorpayPayment = async (orderData, onSuccess, onFailure) => {
  try {
    // Load Razorpay script if not already loaded
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      throw new Error("Failed to load Razorpay script");
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount * 100, // Amount in paise
      currency: orderData.currency,
      name: "Iron Throne Gym",
      description: `${orderData.planName} - ${orderData.billing} subscription`,
      order_id: orderData.orderId,
      prefill: {
        name: orderData.user.name,
        email: orderData.user.email,
        contact: orderData.user.contact,
      },
      theme: {
        color: "#667eea",
      },
      handler: async (response) => {
        try {
          // Verify payment with backend
          const verificationResult = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (onSuccess) {
            onSuccess(verificationResult);
          }
        } catch (error) {
          console.error("Payment verification failed:", error);
          if (onFailure) {
            onFailure(error);
          }
        }
      },
      modal: {
        ondismiss: () => {
          console.log("Payment modal dismissed");
          if (onFailure) {
            onFailure(new Error("Payment cancelled by user"));
          }
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Razorpay payment error:", error);
    if (onFailure) {
      onFailure(error);
    }
  }
};