import React, { useState, useEffect } from 'react';
import { Mail, Shield, Clock, RefreshCw, ArrowLeft, Crown, Dumbbell, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VerifyEmailForm = ({
  mounted,
  otp,
  handleOTPChange,
  handleSubmit,
  handleResendOTP,
  isSubmitting,
  isResending,
  timeLeft,
  canResend,
  formatTime,
  email,
  mousePosition
}) => {
  const navigate = useNavigate();
  const [animationMounted, setAnimationMounted] = useState(false);

  useEffect(() => {
    setAnimationMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200/40 rounded-full animate-bounce animation-delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-indigo-200/20 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300/30 rounded-full animate-bounce animation-delay-3000"></div>
      </div>

      {/* Main Container */}
      <div className={`
        w-full max-w-md transform transition-all duration-1000 
        ${animationMounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
      `}>
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/signup")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Sign Up</span>
        </button>

        {/* Header Card */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-md border border-blue-100 p-6 mb-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-110 transition-transform duration-300">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600 text-sm mb-2">
            We've sent a 6-digit code to
          </p>
          <p className="text-blue-600 font-medium">
            {email}
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Email Verification</h2>
                <p className="text-indigo-100 text-sm">Enter the code to verify your account</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4 text-indigo-500" />
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => handleOTPChange(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400 hover:shadow-sm text-center text-lg font-mono tracking-wider"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  {otp.length === 6 && (
                    <div className="absolute -top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Timer */}
              {!canResend && (
                <div className="flex items-center justify-center gap-2 text-gray-600 text-sm bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg">
                  <Clock className="w-4 h-4" />
                  <span>Code expires in {formatTime(timeLeft)}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className={`
                  w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3
                  ${isSubmitting || otp.length !== 6
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Verify Email
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center pt-4 border-t border-gray-200">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
                  >
                    <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
                    <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
                  </button>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Didn't receive the code? You can resend in {formatTime(timeLeft)}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-gradient-to-r from-white to-yellow-50 rounded-lg p-4 border border-yellow-100">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-yellow-600" />
            Need Help?
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Check your spam folder if you don't see the email</p>
            <p>• Make sure you entered the correct email address</p>
            <p>• Contact support if you continue having issues</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmailForm;