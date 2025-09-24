import { Rocket, Check, ArrowLeft, CreditCard, Shield } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onGoBack}
            className="flex items-center text-purple-300 hover:text-white transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Plan Details Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-3 rounded-lg mr-4">
                  <Rocket className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  <p className="text-purple-300">{plan.tagline}</p>
                </div>
              </div>

              {/* Billing Toggle */}
              <div className="mb-6">
                <div className="flex bg-white/5 rounded-lg p-1">
                  <button
                    onClick={() => onBillingChange("monthly")}
                    className={`flex-1 py-2 px-4 rounded-md transition-all ${
                      selectedBilling === "monthly"
                        ? "bg-purple-600 text-white"
                        : "text-purple-300 hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => onBillingChange("yearly")}
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

              {/* Price Display */}
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

              {/* Features List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold mb-3">What's included:</h3>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Section Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-6">Payment Details</h3>

              {/* User Information */}
              <div className="mb-6 p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold mb-2">Account Information</h4>
                <p className="text-gray-300">{user?.firstName} {user?.lastName}</p>
                <p className="text-gray-300">{user?.email}</p>
              </div>

              {/* Order Summary */}
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

              {/* Security Badge */}
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center text-green-400 mb-2">
                  <Shield className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Secure Payment</span>
                </div>
                <p className="text-sm text-gray-300">
                  Your payment is secured by Razorpay with 256-bit SSL encryption
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={onPayment}
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

              {/* Terms and Conditions */}
              <p className="text-xs text-gray-400 mt-4 text-center">
                By proceeding, you agree to our Terms of Service and Privacy Policy.
                You can cancel your subscription anytime.
              </p>

              {/* Payment Methods Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Accepted Payment Methods</p>
                <div className="flex justify-center space-x-2 opacity-70">
                  <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center">VISA</div>
                  <div className="w-8 h-5 bg-red-600 rounded text-xs flex items-center justify-center">MC</div>
                  <div className="w-8 h-5 bg-purple-600 rounded text-xs flex items-center justify-center">UPI</div>
                  <div className="w-8 h-5 bg-green-600 rounded text-xs flex items-center justify-center">NB</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentUI;