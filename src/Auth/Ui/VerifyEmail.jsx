// VerifyEmailForm.jsx - Enhanced with Lazy Loading + Advanced Memoization + useTransition
import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  memo, 
  Suspense, 
  lazy, 
  useTransition, 
  startTransition 
} from 'react';
import { Mail, Shield, Clock, RefreshCw, ArrowLeft, Crown, Dumbbell, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Lazy load complex form sections
const OTPInputSection = lazy(() => Promise.resolve({
  default: memo(({ 
    otp, 
    onOTPChange, 
    onSubmit, 
    isSubmitting 
  }) => (
    <form onSubmit={onSubmit} className="space-y-6">
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
            onChange={(e) => onOTPChange(e.target.value)}
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
    </form>
  ))
}));

const TimerSection = lazy(() => Promise.resolve({
  default: memo(({ 
    canResend, 
    timeLeft, 
    formatTime, 
    onResendOTP, 
    isResending 
  }) => (
    <div className="text-center pt-4 border-t border-gray-200">
      {!canResend && (
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg mb-4">
          <Clock className="w-4 h-4" />
          <span>Code expires in {formatTime(timeLeft)}</span>
        </div>
      )}
      
      {canResend ? (
        <button
          type="button"
          onClick={onResendOTP}
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
  ))
}));

const BackgroundAnimation = lazy(() => Promise.resolve({
  default: memo(() => (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200/40 rounded-full animate-bounce animation-delay-1000"></div>
      <div className="absolute bottom-32 left-40 w-40 h-40 bg-indigo-200/20 rounded-full animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300/30 rounded-full animate-bounce animation-delay-3000"></div>
    </div>
  ))
}));

// Loading skeletons
const OTPInputSkeleton = memo(() => (
  <div className="space-y-6 animate-pulse">
    <div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-16 bg-gray-300 rounded"></div>
    </div>
    <div className="h-12 bg-gray-300 rounded"></div>
  </div>
));
OTPInputSkeleton.displayName = 'OTPInputSkeleton';

const TimerSkeleton = memo(() => (
  <div className="text-center pt-4 border-t border-gray-200 animate-pulse">
    <div className="h-12 bg-gray-300 rounded mb-4"></div>
    <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
  </div>
));
TimerSkeleton.displayName = 'TimerSkeleton';

const VerifyEmailForm = memo(({
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
  const [isPending, startTransition] = useTransition();

  // Memoized callbacks with useTransition
  const  handleBackToSignup= useCallback(() => {
    startTransition(() => {
      navigate("/signup");
    });
  }, [navigate]);

  const handleOTPChangeWithTransition = useCallback((value) => {
    // Keep immediate UI response for typing
    handleOTPChange(value);
  }, [handleOTPChange]);

  const handleSubmitWithTransition = useCallback((e) => {
    e.preventDefault();
    handleSubmit(e);
  }, [handleSubmit]);

  const handleResendOTPWithTransition = useCallback(() => {
    startTransition(() => {
      handleResendOTP();
    });
  }, [handleResendOTP]);

  // Memoized container className
  const containerClassName = useMemo(() => 
    `w-full max-w-md transform transition-all duration-1000 ${
      animationMounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
    } ${isPending ? 'opacity-90' : 'opacity-100'}`
  , [animationMounted, isPending]);

  // Memoized email display
  const emailDisplay = useMemo(() => {
    if (!email) return '';
    // Mask email for privacy: show first 2 chars, *** middle, last part
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 4) return email;
    return `${localPart.slice(0, 2)}***${localPart.slice(-1)}@${domain}`;
  }, [email]);

  // Memoized help content
  const helpContent = useMemo(() => [
    "Check your spam folder if you don't see the email",
    "Make sure you entered the correct email address", 
    "Contact support if you continue having issues"
  ], []);

  useEffect(() => {
    startTransition(() => {
      setAnimationMounted(true);
    });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements - Lazy loaded */}
      <Suspense fallback={null}>
        <BackgroundAnimation />
      </Suspense>

      {/* Main Container */}
      <div className={containerClassName}>
        
        {/* Back Button */}
        <button
          onClick={handleBackToSignup}
          disabled={isPending}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-all duration-200 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium tracking-wide">Back to Sign Up</span>
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
            {emailDisplay || email}
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
            {/* OTP Input Section - Lazy loaded */}
            <Suspense fallback={<OTPInputSkeleton />}>
              <OTPInputSection
                otp={otp}
                onOTPChange={handleOTPChangeWithTransition}
                onSubmit={handleSubmitWithTransition}
                isSubmitting={isSubmitting}
              />
            </Suspense>

            {/* Timer Section - Lazy loaded */}
            <Suspense fallback={<TimerSkeleton />}>
              <TimerSection
                canResend={canResend}
                timeLeft={timeLeft}
                formatTime={formatTime}
                onResendOTP={handleResendOTPWithTransition}
                isResending={isResending}
              />
            </Suspense>
          </div>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-slate-800/40 backdrop-blur-lg rounded-lg p-4 border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
          <h4 className="font-semibold text-cyan-100 mb-3 flex items-center gap-2 uppercase tracking-wide text-sm">
            <Shield className="w-4 h-4 text-cyan-400" />
            Need Help?
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            {helpContent.map((item, index) => (
              <p key={index}>• {item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// Display name for debugging
VerifyEmailForm.displayName = 'VerifyEmailForm';

export default VerifyEmailForm;