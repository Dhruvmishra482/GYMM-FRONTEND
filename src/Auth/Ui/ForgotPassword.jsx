// ForgotPasswordUI.jsx - Enhanced with Lazy Loading + Advanced Memoization + useTransition
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
import { Mail, ArrowLeft, Shield, Crown, Loader2, CheckCircle, AlertCircle, Dumbbell } from 'lucide-react';

// Lazy load sections for better performance
const SuccessSection = lazy(() => Promise.resolve({
  default: memo(({ message }) => (
    <div className="text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Check Your Email
      </h3>
      <p className="text-gray-600 mb-6">
        {message || "We've sent a password reset link to your email address. Please check your inbox and follow the instructions."}
      </p>
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-sm text-gray-600">
          Didn't receive the email? Check your spam folder or try again.
        </p>
      </div>
    </div>
  ))
}));

const FormSection = lazy(() => Promise.resolve({
  default: memo(({ 
    email, 
    setEmail, 
    onSubmit, 
    isLoading, 
    error 
  }) => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Your Password</h3>
        <p className="text-gray-600 text-sm">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 text-orange-500" />
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-400 hover:shadow-sm"
              placeholder="Enter your email address"
              required
              disabled={isLoading}
            />
            {email && (
              <div className="absolute -top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
                <Mail className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3
            ${isLoading
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white hover:shadow-lg hover:scale-105 active:scale-95'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending Reset Link...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              Send Reset Link
            </>
          )}
        </button>
      </form>
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
const FormSkeleton = memo(() => (
  <div className="space-y-6 animate-pulse">
    <div className="text-center mb-6">
      <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
    </div>
    <div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-12 bg-gray-300 rounded"></div>
    </div>
    <div className="h-12 bg-gray-300 rounded"></div>
  </div>
));
FormSkeleton.displayName = 'FormSkeleton';

const SuccessSkeleton = memo(() => (
  <div className="text-center animate-pulse">
    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
    <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
    <div className="h-16 bg-gray-300 rounded mb-6"></div>
    <div className="h-16 bg-gray-300 rounded"></div>
  </div>
));
SuccessSkeleton.displayName = 'SuccessSkeleton';

const ForgotPasswordUI = memo(({ 
  email, 
  setEmail, 
  onSubmit, 
  onBackToLogin,
  isLoading, 
  error, 
  success, 
  message 
}) => {
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Memoized callbacks
  const handleEmailChange = useCallback((e) => {
    startTransition(() => {
      setEmail(e.target.value);
    });
  }, [setEmail]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(e);
  }, [onSubmit]);

  const handleBackToLogin = useCallback(() => {
    startTransition(() => {
      onBackToLogin();
    });
  }, [onBackToLogin]);

  // Memoized styles and classNames
  const containerClassName = useMemo(() => 
    `w-full max-w-md transform transition-all duration-1000 ${
      mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
    } ${isPending ? 'opacity-90' : 'opacity-100'}`
  , [mounted, isPending]);

  const animationStyles = useMemo(() => ({
    ".animation-delay-1000": { animationDelay: "1s" },
    ".animation-delay-2000": { animationDelay: "2s" },
    ".animation-delay-3000": { animationDelay: "3s" }
  }), []);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements - Lazy loaded */}
      <Suspense fallback={null}>
        <BackgroundAnimation />
      </Suspense>

      {/* Main Container */}
      <div className={containerClassName}>
        
        {/* Header Card */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-md border border-blue-100 p-6 mb-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-110 transition-transform duration-300">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Iron Throne Gym
          </h1>
          <p className="text-gray-600 text-sm">Reset your password</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Forgot Password</h2>
                <p className="text-orange-100 text-sm">We'll help you recover your account</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Success State - Lazy loaded */}
            {success ? (
              <Suspense fallback={<SuccessSkeleton />}>
                <SuccessSection message={message} />
              </Suspense>
            ) : (
              /* Form State - Lazy loaded */
              <Suspense fallback={<FormSkeleton />}>
                <FormSection
                  email={email}
                  setEmail={handleEmailChange}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  error={error}
                />
              </Suspense>
            )}

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleBackToLogin}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Login
              </button>
            </div>
          </div>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-gradient-to-r from-white to-purple-50 rounded-lg p-4 border border-purple-100">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-purple-600" />
            Need Help?
          </h4>
          <p className="text-sm text-gray-600">
            Contact our support team if you continue to have issues accessing your account.
          </p>
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
});

// Display name for debugging
ForgotPasswordUI.displayName = 'ForgotPasswordUI';

export default ForgotPasswordUI;