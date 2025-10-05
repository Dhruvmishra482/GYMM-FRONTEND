import React, { useMemo, useCallback } from "react";
import { Rocket, Check, ArrowLeft, CreditCard, Shield } from "lucide-react";

// Custom animation hook
const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// Memoized Header Component
const PaymentHeader = React.memo(({ onGoBack }) => {
  const isVisible = useFadeIn(0);

  const handleGoBack = useCallback(() => {
    onGoBack();
  }, [onGoBack]);

  return (
    <div className={`flex items-center mb-8 transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <button
        onClick={handleGoBack}
        className="flex items-center text-purple-300 hover:text-white transition-colors mr-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
    </div>
  );
});

PaymentHeader.displayName = 'PaymentHeader';

// Memoized Plan Header Component
const PlanHeader = React.memo(({ plan }) => (
  <div className="flex items-center mb-4">
    <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-3 rounded-lg mr-4">
      <Rocket className="w-8 h-8" />
    </div>
    <div>
      <h2 className="text-2xl font-bold">{plan.name}</h2>
      <p className="text-purple-300">{plan.tagline}</p>
    </div>
  </div>
));

PlanHeader.displayName = 'PlanHeader';

// Memoized Billing Toggle Component
const BillingToggle = React.memo(({ selectedBilling, onBillingChange }) => {
  const handleMonthly = useCallback(() => {
    onBillingChange("monthly");
  }, [onBillingChange]);

  const handleYearly = useCallback(() => {
    onBillingChange("yearly");
  }, [onBillingChange]);

  return (
    <div className="mb-6">
      <div className="flex bg-white/5 rounded-lg p-1">
        <button
          onClick={handleMonthly}
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            selectedBilling === "monthly"
              ? "bg-purple-600 text-white"
              : "text-purple-300 hover:text-white"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={handleYearly}
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
  );
});

BillingToggle.displayName = 'BillingToggle';

// Memoized Price Display Component
const PriceDisplay = React.memo(({ currentPrice, selectedBilling, plan }) => (
  <div className="mb-6">
    <div className="text-4xl font-bold mb-2">
      ₹{currentPrice?.toLocaleString()}
      <span className="text-lg text-purple-300">
        /{selectedBilling === "yearly" ? "year" : "month"}
      </span>
    </div>
    {selectedBilling === "yearly" && (
      <p className="text-green-400 text-sm">{plan.yearlyDiscount}</p>
    )}
  </div>
));

PriceDisplay.displayName = 'PriceDisplay';

// Memoized Feature Item Component
const FeatureItem = React.memo(({ feature, index }) => {
  const isVisible = useFadeIn(index * 50);

  return (
    <div className={`flex items-center transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
    }`}>
      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
      <span className="text-gray-300">{feature}</span>
    </div>
  );
});

FeatureItem.displayName = 'FeatureItem';

// Memoized Features List Component
const FeaturesList = React.memo(({ features }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold mb-3">What's included:</h3>
    {features.map((feature, index) => (
      <FeatureItem key={index} feature={feature} index={index} />
    ))}
  </div>
));

FeaturesList.displayName = 'FeaturesList';

// Memoized User Info Component
const UserInfo = React.memo(({ user }) => (
  <div className="mb-6 p-4 bg-white/5 rounded-lg">
    <h4 className="font-semibold mb-2">Account Information</h4>
    <p className="text-gray-300">{user?.firstName} {user?.lastName}</p>
    <p className="text-gray-300">{user?.email}</p>
  </div>
));

UserInfo.displayName = 'UserInfo';

// Memoized Order Summary Component
const OrderSummary = React.memo(({ plan, selectedBilling, currentPrice }) => (
  <div className="mb-6 p-4 bg-white/5 rounded-lg">
    <h4 className="font-semibold mb-3">Order Summary</h4>
    <div className="flex justify-between items-center mb-2">
      <span>{plan.name} Plan ({selectedBilling})</span>
      <span>₹{currentPrice?.toLocaleString()}</span>
    </div>
    <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-white/20">
      <span>Total</span>
      <span>₹{currentPrice?.toLocaleString()}</span>
    </div>
  </div>
));

OrderSummary.displayName = 'OrderSummary';

// Memoized Security Badge Component
const SecurityBadge = React.memo(() => (
  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
    <div className="flex items-center text-green-400 mb-2">
      <Shield className="w-5 h-5 mr-2" />
      <span className="font-semibold">Secure Payment</span>
    </div>
    <p className="text-sm text-gray-300">
      Your payment is secured by Razorpay with 256-bit SSL encryption
    </p>
  </div>
));

SecurityBadge.displayName = 'SecurityBadge';

// Memoized Error Display Component
const ErrorDisplay = React.memo(({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 animate-fadeIn">
      {error}
    </div>
  );
});

ErrorDisplay.displayName = 'ErrorDisplay';

// Memoized Payment Button Component
const PaymentButton = React.memo(({ isLoading, currentPrice, onPayment }) => {
  const handlePayment = useCallback(() => {
    onPayment();
  }, [onPayment]);

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
               disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg 
               transition-all duration-200 flex items-center justify-center"
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
          Processing...
        </div>
      ) : (
        <div className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Pay ₹{currentPrice?.toLocaleString()} Securely
        </div>
      )}
    </button>
  );
});

PaymentButton.displayName = 'PaymentButton';

// Memoized Payment Methods Component
const PaymentMethods = React.memo(() => (
  <div className="mt-4 text-center">
    <p className="text-xs text-gray-500 mb-2">Accepted Payment Methods</p>
    <div className="flex justify-center space-x-2 opacity-70">
      <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center">VISA</div>
      <div className="w-8 h-5 bg-red-600 rounded text-xs flex items-center justify-center">MC</div>
      <div className="w-8 h-5 bg-purple-600 rounded text-xs flex items-center justify-center">UPI</div>
      <div className="w-8 h-5 bg-green-600 rounded text-xs flex items-center justify-center">NB</div>
    </div>
  </div>
));

PaymentMethods.displayName = 'PaymentMethods';

// Memoized Plan Details Card Component
const PlanDetailsCard = React.memo(({ 
  plan, 
  selectedBilling, 
  currentPrice, 
  onBillingChange 
}) => {
  const isVisible = useFadeIn(100);

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <PlanHeader plan={plan} />
      <BillingToggle selectedBilling={selectedBilling} onBillingChange={onBillingChange} />
      <PriceDisplay currentPrice={currentPrice} selectedBilling={selectedBilling} plan={plan} />
      <FeaturesList features={plan.features} />
    </div>
  );
});

PlanDetailsCard.displayName = 'PlanDetailsCard';

// Memoized Payment Section Card Component
const PaymentSectionCard = React.memo(({ 
  user, 
  plan, 
  selectedBilling, 
  currentPrice, 
  error, 
  isLoading, 
  onPayment 
}) => {
  const isVisible = useFadeIn(200);

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <h3 className="text-xl font-bold mb-6">Payment Details</h3>
      <UserInfo user={user} />
      <OrderSummary plan={plan} selectedBilling={selectedBilling} currentPrice={currentPrice} />
      <SecurityBadge />
      <ErrorDisplay error={error} />
      <PaymentButton isLoading={isLoading} currentPrice={currentPrice} onPayment={onPayment} />
      
      <p className="text-xs text-gray-400 mt-4 text-center">
        By proceeding, you agree to our Terms of Service and Privacy Policy.
        You can cancel your subscription anytime.
      </p>
      
      <PaymentMethods />
    </div>
  );
});

PaymentSectionCard.displayName = 'PaymentSectionCard';

const PaymentUI = ({
  plan,
  planId,
  selectedBilling,
  currentPrice,
  user,
  isLoading,
  error,
  onBillingChange,
  onPayment,
  onGoBack
}) => {
  // Memoize handlers
  const handleBillingChange = useCallback((billing) => {
    onBillingChange(billing);
  }, [onBillingChange]);

  const handlePayment = useCallback(() => {
    onPayment();
  }, [onPayment]);

  const handleGoBack = useCallback(() => {
    onGoBack();
  }, [onGoBack]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <PaymentHeader onGoBack={handleGoBack} />

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <PlanDetailsCard
              plan={plan}
              selectedBilling={selectedBilling}
              currentPrice={currentPrice}
              onBillingChange={handleBillingChange}
            />

            <PaymentSectionCard
              user={user}
              plan={plan}
              selectedBilling={selectedBilling}
              currentPrice={currentPrice}
              error={error}
              isLoading={isLoading}
              onPayment={handlePayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PaymentUI);