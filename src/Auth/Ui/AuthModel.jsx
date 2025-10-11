// src/components/Auth/AuthModal.jsx - Enhanced with Lazy Loading + Advanced Memoization + useTransition
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
  Suspense,
  lazy,
  useTransition,
  startTransition,
} from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../Store/AuthStore";
import {
  signUpService,
  verifyOTPService,
  resendOTPService,
} from "../Service/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Lazy load heavy form components
const LoginForm = lazy(() =>
  Promise.resolve({
    default: memo(
      ({
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        handleLogin,
        loading,
        onTabChange,
        onClose,
        inputStyle,
      }) => (
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="Enter your email"
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              readOnly={false}
              onFocus={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...inputStyle,
                  paddingRight: "48px",
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                readOnly={false}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#9ca3af" : "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "16px",
            }}
          >
            {loading ? "Signing In..." : "Log In"}
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
              gap: "12px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#e5e7eb",
              }}
            ></div>
            <span
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              or
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#e5e7eb",
              }}
            ></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={() => {
              console.log("Continue with Google clicked");
              toast.info("Google Sign In - Coming Soon!");
            }}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "white",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f9fafb";
              e.target.style.borderColor = "#9ca3af";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.borderColor = "#d1d5db";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                window.location.href = "/forgot-password";
              }}
              style={{
                background: "none",
                border: "none",
                color: "#6b7280",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              Forgot your password?
            </button>
          </div>

          <div style={{ textAlign: "center" }}>
            <span style={{ color: "#6b7280" }}>Don't have an account? </span>
            <button
              type="button"
              onClick={() => onTabChange("signup")}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign up
            </button>
          </div>
        </form>
      )
    ),
  })
);

const SignupForm = lazy(() =>
  Promise.resolve({
    default: memo(
      ({
        firstName,
        setFirstName,
        lastName,
        setLastName,
        mobile,
        setMobile,
        signupEmail,
        setSignupEmail,
        signupPassword,
        setSignupPassword,
        confirmPassword,
        setConfirmPassword,
        emailUpdates,
        setEmailUpdates,
        handleSignup,
        isSubmitting,
        onTabChange,
        inputStyle,
        smallInputStyle,
      }) => (
        <form onSubmit={handleSignup}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={smallInputStyle}
                placeholder="First name"
                autoComplete="given-name"
                readOnly={false}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={smallInputStyle}
                placeholder="Last name"
                autoComplete="family-name"
                readOnly={false}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={smallInputStyle}
              placeholder="Mobile number"
              autoComplete="tel"
              readOnly={false}
              onFocus={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              style={smallInputStyle}
              placeholder="Email address"
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              readOnly={false}
              onFocus={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                style={smallInputStyle}
                placeholder="Password"
                autoComplete="new-password"
                readOnly={false}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                Confirm
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={smallInputStyle}
                placeholder="Confirm"
                autoComplete="new-password"
                readOnly={false}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <input
              type="checkbox"
              id="emailUpdates"
              checked={emailUpdates}
              onChange={(e) => setEmailUpdates(e.target.checked)}
              style={{ width: "16px", height: "16px" }}
            />
            <label
              htmlFor="emailUpdates"
              style={{ fontSize: "12px", color: "#6b7280" }}
            >
              Keep me updated with news
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: isSubmitting ? "#9ca3af" : "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              marginBottom: "16px",
            }}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <div style={{ textAlign: "center" }}>
            <span style={{ color: "#6b7280" }}>Already have an account? </span>
            <button
              type="button"
              onClick={() => onTabChange("login")}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Login
            </button>
          </div>
        </form>
      )
    ),
  })
);

const OTPForm = lazy(() =>
  Promise.resolve({
    default: memo(
      ({
        otp,
        setOtp,
        userData,
        handleOTPVerification,
        isSubmitting,
        onBackToSignup,
      }) => (
        <div style={{ padding: "24px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              Verify Your Email
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              We've sent a verification code to {userData?.email}
            </p>
          </div>

          <form onSubmit={handleOTPVerification}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Enter 6-digit code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "24px",
                  textAlign: "center",
                  fontFamily: "monospace",
                  letterSpacing: "8px",
                  outline: "none",
                  backgroundColor: "white",
                  color: "#111827",
                }}
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
                readOnly={false}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor:
                  isSubmitting || otp.length !== 6 ? "#9ca3af" : "#111827",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor:
                  isSubmitting || otp.length !== 6 ? "not-allowed" : "pointer",
                marginBottom: "16px",
              }}
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>

            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={onBackToSignup}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ← Back to signup
              </button>
            </div>
          </form>
        </div>
      )
    ),
  })
);

// Loading skeletons
const FormSkeleton = memo(() => (
  <div style={{ padding: "24px" }}>
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-12 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-12 bg-gray-300 rounded"></div>
      <div className="h-12 bg-gray-300 rounded"></div>
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
    </div>
  </div>
));
FormSkeleton.displayName = "FormSkeleton";

const AuthModal = memo(({ isOpen, onClose, defaultTab = "login" }) => {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isPending, startTransition] = useTransition();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Signup state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP state
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [userData, setUserData] = useState(null);

  // Memoized styles
  const inputStyle = useMemo(
    () => ({
      width: "100%",
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      backgroundColor: "white",
      color: "#111827",
    }),
    []
  );

  const smallInputStyle = useMemo(
    () => ({
      width: "100%",
      padding: "8px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      outline: "none",
      backgroundColor: "white",
      color: "#111827",
    }),
    []
  );

  const modalStyle = useMemo(
    () => ({
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "16px",
      opacity: isPending ? 0.9 : 1,
      transition: "opacity 0.3s ease",
    }),
    [isPending]
  );

  // Memoized callbacks with useTransition
  const handleTabChange = useCallback((tab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  }, []);

  const handleBackToSignup = useCallback(() => {
    startTransition(() => {
      setStep(1);
    });
  }, []);

  // Update activeTab when defaultTab prop changes
  useEffect(() => {
    if (isOpen) {
      startTransition(() => {
        setActiveTab(defaultTab);
      });
    }
  }, [defaultTab, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Auto-focus first input when modal opens
      setTimeout(() => {
        const firstInput = modalRef.current?.querySelector("input");
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, activeTab, step]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email || !password) {
        toast.error("Please fill all fields");
        return;
      }

      try {
        const success = await login(email, password);
        if (success) {
          toast.success("Login successful!");
          onClose();
          navigate("/dashboard");
        } else {
          toast.error("Invalid email or password!");
        }
      } catch (err) {
        toast.error("Something went wrong!");
      }
    },
    [email, password, login, onClose, navigate]
  );

  const handleSignup = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        !firstName ||
        !lastName ||
        !mobile ||
        !signupEmail ||
        !signupPassword ||
        !confirmPassword
      ) {
        toast.error("Please fill all fields");
        return;
      }
      if (signupPassword !== confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }

      setIsSubmitting(true);
      try {
        const signupData = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          mobileNumber: mobile.trim(),
          email: signupEmail.trim().toLowerCase(),
          password: signupPassword,
          confirmPassword: confirmPassword,
          emailUpdates: emailUpdates,
        };

        const response = await signUpService(signupData);
        if (response && response.success) {
          setUserData(response.userData);
          startTransition(() => {
            setStep(2);
          });
          toast.success("OTP sent to your email!");
        }
      } catch (err) {
        toast.error(err.message || "Something went wrong!");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      firstName,
      lastName,
      mobile,
      signupEmail,
      signupPassword,
      confirmPassword,
      emailUpdates,
    ]
  );

  const handleOTPVerification = useCallback(
    async (e) => {
      e.preventDefault();
      if (!otp || otp.length !== 6) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }

      setIsSubmitting(true);
      try {
        const otpData = {
          otp: otp.toString(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          mobileNumber: userData.mobileNumber,
          email: userData.email.toLowerCase(),
          password: userData.password,
        };

        const response = await verifyOTPService(otpData);
        if (response && response.success) {
          toast.success("Account created successfully!");
          startTransition(() => {
            setStep(1);
            setActiveTab("login");
          });
          // Clear forms
          setFirstName("");
          setLastName("");
          setMobile("");
          setSignupEmail("");
          setSignupPassword("");
          setConfirmPassword("");
          setOtp("");
        }
      } catch (err) {
        toast.error(err.message || "Invalid OTP. Please try again!");
      } finally {
        setIsSubmitting(false);
      }
    },
    [otp, userData]
  );

  if (!isOpen) return null;

  return (
    <div style={modalStyle} onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            color: "#6b7280",
            zIndex: 10,
          }}
        >
          <X size={20} />
        </button>

        {step === 1 ? (
          <>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
              <button
                onClick={() => handleTabChange("login")}
                disabled={isPending}
                style={{
                  flex: 1,
                  padding: "16px",
                  border: "none",
                  background: "none",
                  cursor: isPending ? "not-allowed" : "pointer",
                  fontWeight: activeTab === "login" ? "600" : "400",
                  color: activeTab === "login" ? "#111827" : "#6b7280",
                  borderBottom:
                    activeTab === "login" ? "2px solid #111827" : "none",
                }}
              >
                Login
              </button>
              <button
                onClick={() => handleTabChange("signup")}
                disabled={isPending}
                style={{
                  flex: 1,
                  padding: "16px",
                  border: "none",
                  background: "none",
                  cursor: isPending ? "not-allowed" : "pointer",
                  fontWeight: activeTab === "signup" ? "600" : "400",
                  color: activeTab === "signup" ? "#111827" : "#6b7280",
                  borderBottom:
                    activeTab === "signup" ? "2px solid #111827" : "none",
                }}
              >
                Sign Up
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              {activeTab === "login" ? (
                <Suspense fallback={<FormSkeleton />}>
                  <LoginForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    handleLogin={handleLogin}
                    loading={loading}
                    onTabChange={handleTabChange}
                    onClose={onClose}
                    inputStyle={inputStyle}
                  />
                </Suspense>
              ) : (
                <Suspense fallback={<FormSkeleton />}>
                  <SignupForm
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    mobile={mobile}
                    setMobile={setMobile}
                    signupEmail={signupEmail}
                    setSignupEmail={setSignupEmail}
                    signupPassword={signupPassword}
                    setSignupPassword={setSignupPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    emailUpdates={emailUpdates}
                    setEmailUpdates={setEmailUpdates}
                    handleSignup={handleSignup}
                    isSubmitting={isSubmitting}
                    onTabChange={handleTabChange}
                    inputStyle={inputStyle}
                    smallInputStyle={smallInputStyle}
                  />
                </Suspense>
              )}
            </div>
          </>
        ) : (
          <Suspense fallback={<FormSkeleton />}>
            <OTPForm
              otp={otp}
              setOtp={setOtp}
              userData={userData}
              handleOTPVerification={handleOTPVerification}
              isSubmitting={isSubmitting}
              onBackToSignup={handleBackToSignup}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
});

// Display name for debugging
AuthModal.displayName = "AuthModal";

export default AuthModal;
