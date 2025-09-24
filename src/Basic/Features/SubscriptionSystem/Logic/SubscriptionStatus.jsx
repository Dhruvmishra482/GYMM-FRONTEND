import { useEffect } from "react";
import { Crown, Calendar, ArrowUpRight, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../../../../Auth/Store/AuthStore";

const SubscriptionStatus = ({ user }) => {
  const { 
    subscription, 
    subscriptionLoading, 
    fetchSubscriptionStatus 
  } = useAuthStore();

  // Fetch subscription if not available and user exists
  useEffect(() => {
    if (user && !subscription && !subscriptionLoading) {
      fetchSubscriptionStatus();
    }
  }, [user, subscription, subscriptionLoading, fetchSubscriptionStatus]);

  if (subscriptionLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-white/20 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const isActive = subscription?.isActive;
  const plan = subscription?.plan || "NONE";
  const daysLeft = subscription?.daysLeft || 0;
  const expiry = subscription?.expiry;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPlanColor = (planType) => {
    switch (planType) {
      case "BASIC":
        return "from-cyan-400 to-blue-500";
      case "ADVANCED":
        return "from-orange-400 to-red-500";
      case "ENTERPRISE":
        return "from-purple-400 to-pink-500";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getPlanName = (planType) => {
    switch (planType) {
      case "BASIC":
        return "Basic";
      case "ADVANCED":
        return "Advanced";
      case "ENTERPRISE":
        return "Enterprise";
      default:
        return "No Subscription";
    }
  };

  if (plan === "NONE" || !isActive) {
    return (
      <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
            <div>
              <h3 className="font-semibold text-red-400">No Active Subscription</h3>
              <p className="text-sm text-gray-300">Upgrade to access all features</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/payment?plan=BASIC&billing=monthly'}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                     px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
          >
            Upgrade Now
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r ${getPlanColor(plan)}/10 border border-white/20 rounded-xl p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`bg-gradient-to-r ${getPlanColor(plan)} p-2 rounded-lg mr-3`}>
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold text-white mr-2">{getPlanName(plan)} Plan</h3>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Calendar className="w-4 h-4 mr-1" />
              {daysLeft > 0 ? (
                <span>
                  {daysLeft} days left • Expires {formatDate(expiry)}
                </span>
              ) : (
                <span className="text-red-400">Expired</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {daysLeft <= 7 && daysLeft > 0 && (
            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
              Expires Soon
            </span>
          )}
          
          <button 
            onClick={() => window.location.href = '/payment?plan=BASIC&billing=yearly'}
            className="bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded-lg 
                     text-sm font-medium transition-all duration-200 flex items-center"
          >
            Upgrade
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      
      {/* Progress Bar for days left */}
      {daysLeft > 0 && (
        <div className="mt-3">
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${getPlanColor(plan)} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${Math.min((daysLeft / 30) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {Math.round((daysLeft / 30) * 100)}% of subscription period remaining
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;