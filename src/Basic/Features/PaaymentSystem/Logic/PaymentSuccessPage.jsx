import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowRight, Calendar, CreditCard, User } from "lucide-react";
import { useAuthStore } from "../../../../Auth/Store/AuthStore";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshSubscription } = useAuthStore();
  
  // Get payment data from navigation state
  const paymentData = location.state || {};
  const { plan, billing, amount, user, subscription } = paymentData;

  // Refresh subscription immediately after payment success
  useEffect(() => {
    const syncSubscription = async () => {
      try {
        // Force refresh subscription data to ensure sync
        await refreshSubscription();
      } catch (error) {
        console.error("Failed to refresh subscription after payment:", error);
      }
    };

    syncSubscription();
  }, [refreshSubscription]);

  // Redirect to dashboard after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="relative">
              <CheckCircle className="w-24 h-24 text-green-400 mx-auto animate-bounce" />
              <div className="absolute inset-0 w-24 h-24 mx-auto bg-green-400/20 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-4xl font-bold mt-6 mb-2">Payment Successful!</h1>
            <p className="text-green-300 text-lg">
              Welcome to your new subscription journey
            </p>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Payment Summary</h2>
            
            <div className="space-y-4">
              {/* Plan Info */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-green-400 mr-3" />
                  <span>Plan</span>
                </div>
                <span className="font-semibold">
                  {plan || "Basic"} ({billing || "monthly"})
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-green-400 mr-3" />
                  <span>Amount Paid</span>
                </div>
                <span className="font-semibold text-lg">
                  ₹{amount?.toLocaleString() || "399"}
                </span>
              </div>

              {/* Subscription Period */}
              {subscription?.expiry && (
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-green-400 mr-3" />
                    <span>Valid Until</span>
                  </div>
                  <span className="font-semibold">
                    {formatDate(subscription.expiry)}
                  </span>
                </div>
              )}
            </div>

            {/* What's Next */}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
              <h3 className="font-semibold text-green-400 mb-2">What's Next?</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Access your complete dashboard</li>
                <li>• Add and manage up to 150 members</li>
                <li>• Get AI-powered insights</li>
                <li>• Send WhatsApp payment reminders</li>
                <li>• Track due payments and analytics</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGoToDashboard}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
                       text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            
            <button
              onClick={() => navigate("/pricing")}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/30 
                       text-white font-bold py-4 px-6 rounded-lg transition-all duration-200"
            >
              View All Plans
            </button>
          </div>

          {/* Auto Redirect Message */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              You'll be automatically redirected to your dashboard in 5 seconds
            </p>
          </div>

          {/* Thank You Message */}
          <div className="text-center mt-8 p-6 bg-white/5 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Thank You for Choosing Us!</h3>
            <p className="text-gray-300">
              We're excited to help you manage your gym efficiently. 
              If you need any assistance, our support team is here to help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;