import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { XCircle, RefreshCw, ArrowLeft, AlertTriangle, CreditCard, HelpCircle } from "lucide-react";

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Get payment data from navigation state
  const paymentData = location.state || {};
  const { plan, billing, amount, error, user } = paymentData;

  const handleRetryPayment = () => {
    setIsRetrying(true);
    
    // Navigate back to payment page with same parameters
    const params = new URLSearchParams({
      plan: plan || "BASIC",
      billing: billing || "monthly"
    });
    
    // Small delay for UX
    setTimeout(() => {
      navigate(`/payment?${params.toString()}`);
    }, 500);
  };

  const handleGoBack = () => {
    navigate("/pricing");
  };

  const handleContactSupport = () => {
    // You can replace this with your support email or chat system
    window.open("mailto:support@ironthronegym.com?subject=Payment Failed - Need Help&body=Hi, I faced an issue with my payment. Plan: " + (plan || "Basic") + ", Amount: ₹" + (amount || "399"), "_blank");
  };

  const getErrorMessage = (errorMsg) => {
    if (!errorMsg) return "Payment could not be completed due to a technical issue.";
    
    // Common error messages and user-friendly translations
    const errorMappings = {
      "payment_failed": "Your payment could not be processed. Please check your payment method and try again.",
      "insufficient_funds": "Insufficient funds in your account. Please use a different payment method.",
      "card_declined": "Your card was declined. Please contact your bank or try a different card.",
      "network_error": "Network connection issue. Please check your internet and try again.",
      "session_expired": "Your payment session expired. Please try again.",
      "user_cancelled": "Payment was cancelled. You can try again whenever you're ready."
    };
    
    // Check if error message matches any known patterns
    for (const [key, message] of Object.entries(errorMappings)) {
      if (errorMsg.toLowerCase().includes(key)) {
        return message;
      }
    }
    
    return errorMsg;
  };

  const getSupportTips = (errorMsg) => {
    const tips = [];
    
    if (!errorMsg || errorMsg.includes("network") || errorMsg.includes("connection")) {
      tips.push("Check your internet connection");
      tips.push("Try using a different browser");
    }
    
    if (errorMsg?.includes("card") || errorMsg?.includes("declined")) {
      tips.push("Verify your card details are correct");
      tips.push("Ensure your card has sufficient balance");
      tips.push("Contact your bank if the issue persists");
    }
    
    if (errorMsg?.includes("session") || errorMsg?.includes("expired")) {
      tips.push("Start a fresh payment session");
      tips.push("Complete payment within the time limit");
    }
    
    if (tips.length === 0) {
      tips.push("Try a different payment method");
      tips.push("Clear your browser cache and cookies");
      tips.push("Contact our support team for assistance");
    }
    
    return tips;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Error Animation */}
          <div className="text-center mb-8">
            <div className="relative">
              <XCircle className="w-24 h-24 text-red-400 mx-auto animate-pulse" />
              <div className="absolute inset-0 w-24 h-24 mx-auto bg-red-400/20 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-4xl font-bold mt-6 mb-2">Payment Failed</h1>
            <p className="text-red-300 text-lg">
              Don't worry, no charges were made to your account
            </p>
          </div>

          {/* Error Details Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">What Happened?</h2>
            
            {/* Error Message */}
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-400 mb-1">Payment Error</h3>
                  <p className="text-gray-300 text-sm">{getErrorMessage(error)}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                  <span>Plan</span>
                </div>
                <span className="font-semibold">
                  {plan || "Basic"} ({billing || "monthly"})
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                  <span>Amount</span>
                </div>
                <span className="font-semibold text-lg">
                  ₹{amount?.toLocaleString() || "399"}
                </span>
              </div>
            </div>

            {/* Support Tips */}
            <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start mb-3">
                <HelpCircle className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
                <h3 className="font-semibold text-blue-400">Quick Fixes</h3>
              </div>
              <ul className="text-sm text-gray-300 space-y-1 ml-7">
                {getSupportTips(error).map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleRetryPayment}
              disabled={isRetrying}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                       disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg 
                       transition-all duration-200 flex items-center justify-center"
            >
              {isRetrying ? (
                <div className="flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Redirecting...
                </div>
              ) : (
                <div className="flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </div>
              )}
            </button>
            
            <button
              onClick={handleGoBack}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/30 
                       text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Plans
            </button>
          </div>

          {/* Contact Support */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              Still having trouble? Our support team is here to help.
            </p>
            <button
              onClick={handleContactSupport}
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Contact Support
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg text-center">
            <p className="text-gray-400 text-sm">
              🔒 Your payment information is secure. No charges were processed during this failed transaction.
            </p>
          </div>

          {/* Common Solutions */}
          <div className="mt-8 bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Common Solutions</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-300">Payment Issues:</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>• Try a different card or payment method</li>
                  <li>• Ensure international payments are enabled</li>
                  <li>• Check if your bank blocked the transaction</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-300">Technical Issues:</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>• Refresh the page and try again</li>
                  <li>• Use a different browser or device</li>
                  <li>• Disable VPN if you're using one</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;