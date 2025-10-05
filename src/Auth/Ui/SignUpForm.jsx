// SignupForm.jsx - Enhanced with Lazy Loading + Advanced Memoization + useTransition
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
} from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

// Lazy load heavy form sections
const SocialSignupButtons = lazy(() => Promise.resolve({
  default: memo(({ onSocialSignup }) => (
    <div className="space-y-3">
      {/* Google */}
      <button
        type="button"
        onClick={() => onSocialSignup('google')}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      {/* Apple */}
      <button
        type="button"
        onClick={() => onSocialSignup('apple')}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        Continue with Apple
      </button>
    </div>
  ))
}));

const FormFields = lazy(() => Promise.resolve({
  default: memo(({ 
    formData, 
    errors, 
    showPassword, 
    showConfirmPassword,
    onInputChange,
    onFocusChange,
    onTogglePassword,
    onToggleConfirmPassword
  }) => (
    <div className="space-y-4">
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name *
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={onInputChange}
          onFocus={() => onFocusChange("firstName")}
          onBlur={() => onFocusChange("")}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            ${errors.firstName 
              ? 'border-red-500 ring-1 ring-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }
            focus:outline-none
          `}
          placeholder="Enter your first name"
        />
        {errors.firstName && (
          <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name *
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={onInputChange}
          onFocus={() => onFocusChange("lastName")}
          onBlur={() => onFocusChange("")}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            ${errors.lastName 
              ? 'border-red-500 ring-1 ring-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }
            focus:outline-none
          `}
          placeholder="Enter your last name"
        />
        {errors.lastName && (
          <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
        )}
      </div>

      {/* Mobile Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Number *
        </label>
        <input
          type="tel"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={onInputChange}
          onFocus={() => onFocusChange("mobileNumber")}
          onBlur={() => onFocusChange("")}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            ${errors.mobileNumber 
              ? 'border-red-500 ring-1 ring-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }
            focus:outline-none
          `}
          placeholder="Enter your mobile number"
        />
        {errors.mobileNumber && (
          <p className="mt-2 text-sm text-red-600">{errors.mobileNumber}</p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          onFocus={() => onFocusChange("email")}
          onBlur={() => onFocusChange("")}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            ${errors.email 
              ? 'border-red-500 ring-1 ring-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }
            focus:outline-none
          `}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onInputChange}
            onFocus={() => onFocusChange("password")}
            onBlur={() => onFocusChange("")}
            className={`
              w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200
              ${errors.password 
                ? 'border-red-500 ring-1 ring-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }
              focus:outline-none
            `}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onInputChange}
            onFocus={() => onFocusChange("confirmPassword")}
            onBlur={() => onFocusChange("")}
            className={`
              w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200
              ${errors.confirmPassword 
                ? 'border-red-500 ring-1 ring-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }
              focus:outline-none
            `}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>
    </div>
  ))
}));

// Loading skeletons
const SocialButtonsSkeleton = memo(() => (
  <div className="space-y-3 animate-pulse">
    <div className="h-12 bg-gray-300 rounded-lg"></div>
    <div className="h-12 bg-gray-300 rounded-lg"></div>
  </div>
));
SocialButtonsSkeleton.displayName = 'SocialButtonsSkeleton';

const FormFieldsSkeleton = memo(() => (
  <div className="space-y-4 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i}>
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>
    ))}
  </div>
));
FormFieldsSkeleton.displayName = 'FormFieldsSkeleton';

const SignupForm = memo(({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  isSubmitting,
  focusedField,
  handleInputChange,
  handleSubmit,
  togglePassword,
  toggleConfirmPassword,
  setFocusedField,
  emailUpdates,
  setEmailUpdates,
}) => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Memoized callbacks with useTransition
  const handleNavigateToLogin = useCallback(() => {
    startTransition(() => {
      navigate("/login");
    });
  }, [navigate]);

  const handleInputChangeWithTransition = useCallback((e) => {
    // Keep immediate UI response for typing
    handleInputChange(e);
  }, [handleInputChange]);

  const handleFocusChange = useCallback((field) => {
    startTransition(() => {
      setFocusedField(field);
    });
  }, [setFocusedField]);

  const handleSocialSignup = useCallback((provider) => {
    startTransition(() => {
      console.log(`Signup with ${provider}`);
      // Placeholder for social signup implementation
    });
  }, []);

  const handleSubmitWithTransition = useCallback((e) => {
    e.preventDefault();
    handleSubmit(e);
  }, [handleSubmit]);

  const handleEmailUpdatesChange = useCallback((e) => {
    startTransition(() => {
      setEmailUpdates(e.target.checked);
    });
  }, [setEmailUpdates]);

  // Memoized container className
  const containerClassName = useMemo(() => 
    `w-full max-w-md transform transition-all duration-1000 ${
      mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
    } ${isPending ? 'opacity-90' : 'opacity-100'}`
  , [mounted, isPending]);

  // Memoized button className
  const submitButtonClassName = useMemo(() => 
    `w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
      isSubmitting
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-gray-900 hover:bg-gray-800 active:bg-gray-900'
    }`
  , [isSubmitting]);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-32">
      <div className={containerClassName}>
        
        {/* Main Signup Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Header with Login/Sign Up tabs */}
          <div className="flex border-b border-gray-100">
            <button 
              onClick={handleNavigateToLogin}
              disabled={isPending}
              className="flex-1 py-4 px-6 text-center font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Login
            </button>
            <button 
              className="flex-1 py-4 px-6 text-center font-medium text-gray-900 border-b-2 border-gray-900 bg-white"
              disabled={isPending}
            >
              Sign Up
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmitWithTransition}>
              <div className="space-y-6">
                
                {/* Social Signup Buttons - Lazy loaded */}
                <Suspense fallback={<SocialButtonsSkeleton />}>
                  <SocialSignupButtons onSocialSignup={handleSocialSignup} />
                </Suspense>

                {/* OR Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Form Fields - Lazy loaded */}
                <Suspense fallback={<FormFieldsSkeleton />}>
                  <FormFields
                    formData={formData}
                    errors={errors}
                    showPassword={showPassword}
                    showConfirmPassword={showConfirmPassword}
                    onInputChange={handleInputChangeWithTransition}
                    onFocusChange={handleFocusChange}
                    onTogglePassword={togglePassword}
                    onToggleConfirmPassword={toggleConfirmPassword}
                  />
                </Suspense>

                {/* Email Updates Checkbox */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5">
                    <input
                      id="emailUpdates"
                      type="checkbox"
                      checked={emailUpdates}
                      onChange={handleEmailUpdatesChange}
                      disabled={isPending}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-70"
                    />
                  </div>
                  <label htmlFor="emailUpdates" className="text-sm text-gray-600 leading-5">
                    Please keep me updated by email with the latest news, research findings, reward programs, event updates.
                  </label>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isPending}
                  className={submitButtonClassName}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create an account'
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <span className="text-gray-600">Already have an account? </span>
                  <button
                    type="button"
                    onClick={handleNavigateToLogin}
                    disabled={isPending}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

// Display name for debugging
SignupForm.displayName = 'SignupForm';

export default SignupForm;