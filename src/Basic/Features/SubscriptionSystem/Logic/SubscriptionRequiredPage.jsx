import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { Crown, Rocket, Check, ArrowRight, Star } from "lucide-react";

const SubscriptionRequired = ({ user, subscriptionStatus, onSubscriptionUpdate }) => {
  const navigate = useNavigate();
  const [selectedBilling, setSelectedBilling] = useState("monthly");

  const planConfig = {
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
  };

  const currentPrice = selectedBilling === "yearly" ? planConfig.yearlyPrice : planConfig.monthlyPrice;

  const handleBuyNow = () => {
    const params = new URLSearchParams({
      plan: "BASIC",
      billing: selectedBilling
    });
    navigate(`/payment?${params.toString()}`);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Crown className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-2xl font-bold">Iron Throne Gym</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-purple-300">Welcome, {user?.firstName}</span>
            <button
              onClick={handleLogout}
              className="text-purple-300 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full">
                <Rocket className="w-16 h-16" />
              </div>
            </div>
            
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Transform Your Gym?
            </h2>
            
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              You're just one step away from accessing powerful gym management features. 
              Subscribe now to unlock your complete dashboard and start managing your members efficiently.
            </p>

            {/* Current Status */}
            <div className="inline-flex items-center bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2 mb-8">
              <Star className="w-5 h-5 text-orange-400 mr-2" />
              <span className="text-orange-300">
                Current Plan: {subscriptionStatus?.plan || "No Active Subscription"}
              </span>
            </div>
          </div>

          {/* Plan Card */}
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{planConfig.name}</h3>
              <p className="text-purple-300">{planConfig.tagline}</p>
            </div>

            {/* Billing Toggle */}
            <div className="mb-6">
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setSelectedBilling("monthly")}
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${
                    selectedBilling === "monthly"
                      ? "bg-purple-600 text-white"
                      : "text-purple-300 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedBilling("yearly")}
                  className={`flex-1 py-2 px-4 rounded-md transition-all relative ${
                    selectedBilling === "yearly"
                      ? "bg-purple-600 text-white"
                      : "text-purple-300 hover:text-white"
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-500 text-xs px-2 py-1 rounded-full">
                    Save
                  </span>
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-4xl font-bold mb-2">
                ₹{currentPrice.toLocaleString()}
                <span className="text-lg text-purple-300">
                  /{selectedBilling === "yearly" ? "year" : "month"}
                </span>
              </div>
              {selectedBilling === "yearly" && (
                <p className="text-green-400 text-sm">{planConfig.yearlyDiscount}</p>
              )}
            </div>

            {/* Features */}
            <div className="text-left mb-8">
              <h4 className="text-lg font-semibold mb-4 text-center">Everything you need:</h4>
              <div className="space-y-3">
                {planConfig.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Button */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                       text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center group"
            >
              <span>Start Your Journey - ₹{currentPrice.toLocaleString()}</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-xs text-gray-400 mt-4">
              Cancel anytime • Secure payment • Instant activation
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Instant Setup</h3>
              <p className="text-sm text-gray-400">
                Get started immediately after payment. No waiting, no setup fees.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 text-center">
              <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Proven Results</h3>
              <p className="text-sm text-gray-400">
                Join hundreds of gym owners who've streamlined their operations.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 text-center">
              <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Premium Support</h3>
              <p className="text-sm text-gray-400">
                24/7 chat and email support to help you succeed.
              </p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-12 max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm">
              🔒 Your payment is secured with bank-level encryption. 
              We use Razorpay's secure payment gateway trusted by millions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRequired;