import React, { useState, useEffect } from 'react';
import { Mail, Shield, Clock, RefreshCw, ArrowLeft, CheckCircle } from "lucide-react";

const VerifyEmailForm = () => {
  const [mounted, setMounted] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const email = "user@example.com";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOTPChange = (value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        alert('Email verified successfully!');
      }, 2000);
    }
  };

  const handleResendOTP = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setTimeLeft(300);
      setCanResend(false);
      setOtp('');
      alert('New code sent!');
    }, 1500);
  };

  const handleBackToSignup = () => {
    alert('Going back to signup...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-500/10 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse blur-xl" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-indigo-500/10 rounded-full animate-pulse blur-xl" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-cyan-400/10 rounded-full animate-pulse blur-xl" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Main Container */}
      <div className={`
        w-full max-w-md transform transition-all duration-1000 relative z-10
        ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
      `}>
        
        {/* Back Button */}
        <button
          onClick={handleBackToSignup}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium tracking-wide">Back to Sign Up</span>
        </button>

        {/* Single Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-2xl border border-white/15 overflow-hidden hover:shadow-cyan-500/30 transition-all duration-300">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
            
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-wide uppercase mb-2">Verify Your Email</h2>
              <p className="text-indigo-100 text-sm mb-2">
                We've sent a 6-digit code to
              </p>
              <p className="text-cyan-300 font-medium tracking-wide">
                {email}
              </p>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-8">
            <div className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3 uppercase tracking-wide">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => handleOTPChange(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10 text-center text-lg font-mono tracking-wider"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  {otp.length === 6 && (
                    <div className="absolute -top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300 shadow-lg shadow-green-500/50">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Timer */}
              {!canResend && (
                <div className="flex items-center justify-center gap-2 text-slate-300 text-sm bg-slate-900/50 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Code expires in {formatTime(timeLeft)}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || otp.length !== 6}
                className={`
                  w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider
                  ${isSubmitting || otp.length !== 6
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105 active:scale-95'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
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
              <div className="text-center pt-4 border-t border-white/10">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors group"
                  >
                    <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
                    <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
                  </button>
                ) : (
                  <p className="text-slate-400 text-sm">
                    Didn't receive the code? You can resend in {formatTime(timeLeft)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-slate-800/40 backdrop-blur-lg rounded-lg p-4 border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
          <h4 className="font-semibold text-cyan-100 mb-3 flex items-center gap-2 uppercase tracking-wide text-sm">
            <Shield className="w-4 h-4 text-cyan-400" />
            Need Help?
          </h4>
          <div className="text-sm text-slate-400 space-y-1.5">
            <p>• Check your spam folder if you don't see the email</p>
            <p>• Make sure you entered the correct email address</p>
            <p>• Contact support if you continue having issues</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm;