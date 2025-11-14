// AuthModal.jsx - COMPLETE VERSION with Login, Signup, OTP & Forgot Password
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
import { useAuthStore, usePasswordResetStore } from "../Store/AuthStore";
import {
  signUpService,
  verifyOTPService,
  resendOTPService,
} from "../Service/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ForgotPasswordUI from "./ForgotPassword";
import ResetPasswordUI from "./Resetpasswordui";

// ========================================
// LAZY LOADED FORM COMPONENTS
// ========================================

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
        onForgotPassword,
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
              // readOnly={false}
              // onFocus={(e) => e.stopPropagation()}
              // onClick={(e) => e.stopPropagation()}
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
              onClick={onForgotPassword}
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
              Sign Up
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
        showSignupPassword,
        setShowSignupPassword,
        showSignupConfirmPassword,
        setShowSignupConfirmPassword,
      }) => (
        <form onSubmit={handleSignup}>
          {/* Name Fields */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
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
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
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
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
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
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={inputStyle}
              placeholder="Enter your mobile number"
              required
            />
          </div>

          {/* Email */}
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
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              style={inputStyle}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
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
                type={showSignupPassword ? "text" : "password"}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                style={{
                  ...inputStyle,
                  paddingRight: "48px",
                }}
                placeholder="Create a password"
                required
              />

              <button
                type="button"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
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
                {showSignupPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
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
              Confirm Password
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={showSignupConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  ...inputStyle,
                  paddingRight: "48px",
                }}
                placeholder="Confirm your password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowSignupConfirmPassword(!showSignupConfirmPassword)
                }
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
                {showSignupConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Email Updates Checkbox */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <input
              type="checkbox"
              id="emailUpdates"
              checked={emailUpdates}
              onChange={(e) => setEmailUpdates(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            <label
              htmlFor="emailUpdates"
              style={{ fontSize: "14px", color: "#6b7280" }}
            >
              Send me email updates and offers
            </label>
          </div>

          {/* Submit Button */}
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
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Login Link */}
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
              Log In
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
        onResendOTP,
      }) => {
        const [countdown, setCountdown] = useState(60);
        const [canResend, setCanResend] = useState(false);

        useEffect(() => {
          if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
          } else {
            setCanResend(true);
          }
        }, [countdown]);

        const handleResend = async () => {
          if (canResend && userData) {
            try {
              await resendOTPService(userData.email, userData.firstName);
              toast.success("OTP resent successfully!");
              setCountdown(60);
              setCanResend(false);
            } catch (err) {
              toast.error(err.message || "Failed to resend OTP");
            }
          }
        };

        return (
          <div style={{ padding: "24px" }}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#111827",
                marginBottom: "8px",
                textAlign: "center",
              }}
            >
              Verify Your Email
            </h3>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              We've sent a 6-digit code to <strong>{userData?.email}</strong>
            </p>

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
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 6) {
                      setOtp(value);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "24px",
                    textAlign: "center",
                    letterSpacing: "8px",
                    outline: "none",
                  }}
                  placeholder="000000"
                  maxLength={6}
                  required
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
                    isSubmitting || otp.length !== 6
                      ? "not-allowed"
                      : "pointer",
                  marginBottom: "16px",
                }}
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>

              {/* Resend OTP */}
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2563eb",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "14px",
                    }}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span style={{ color: "#6b7280", fontSize: "14px" }}>
                    Resend OTP in {countdown}s
                  </span>
                )}
              </div>

              {/* Back to Signup */}
              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={onBackToSignup}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6b7280",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "14px",
                  }}
                >
                  Back to Sign Up
                </button>
              </div>
            </form>
          </div>
        );
      }
    ),
  })
);

// ========================================
// LOADING SKELETON
// ========================================

const FormSkeleton = memo(() => (
  <div style={{ padding: "24px" }}>
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          height: "14px",
          backgroundColor: "#e5e7eb",
          borderRadius: "4px",
          marginBottom: "8px",
          width: "30%",
        }}
      ></div>
      <div
        style={{
          height: "44px",
          backgroundColor: "#e5e7eb",
          borderRadius: "8px",
        }}
      ></div>
    </div>
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          height: "14px",
          backgroundColor: "#e5e7eb",
          borderRadius: "4px",
          marginBottom: "8px",
          width: "30%",
        }}
      ></div>
      <div
        style={{
          height: "44px",
          backgroundColor: "#e5e7eb",
          borderRadius: "8px",
        }}
      ></div>
    </div>
    <div
      style={{
        height: "44px",
        backgroundColor: "#e5e7eb",
        borderRadius: "8px",
      }}
    ></div>
  </div>
));
FormSkeleton.displayName = "FormSkeleton";

// ========================================
// MAIN AUTH MODAL COMPONENT
// ========================================

const AuthModal = memo(
  ({ isOpen, onClose, initialMode = "login", resetToken: propResetToken }) => {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const [isPending, startTransition] = useTransition();

    // Step state: 1 = login/signup, 2 = OTP, 3 = forgot password
    const [activeTab, setActiveTab] = useState("login");
    const [step, setStep] = useState(1);

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
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
      useState(false);

    // OTP state
    const [otp, setOtp] = useState("");
    const [userData, setUserData] = useState(null);

    // Forgot Password state
    const [forgotEmail, setForgotEmail] = useState("");

    // Loading states
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Reset Password state
    const [resetToken, setResetToken] = useState(propResetToken || null);
    const [resetFormData, setResetFormData] = useState({
      newPassword: "",
      confirmPassword: "",
    });
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showResetConfirmPassword, setShowResetConfirmPassword] =
      useState(false);
    //                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Correct!
    const [resetValidationErrors, setResetValidationErrors] = useState([]);

    // Store hooks
    const { login, loading } = useAuthStore();
    const {
      forgotPassword,
      isLoading: forgotLoading,
      error: forgotError,
      success: forgotSuccess,
      message: forgotMessage,
      resetState: resetForgotState,
      clearError: clearForgotError,
    } = usePasswordResetStore();

    // Password Reset Store
    const {
      resetPassword,
      isLoading: resetLoading,
      error: resetError,
      success: resetSuccess,
      message: resetMessage,
      resetState: resetPasswordState,
      clearError: clearResetError,
    } = usePasswordResetStore();
    // ========================================
    // MEMOIZED STYLES
    // ========================================

    const modalStyle = useMemo(
      () => ({
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }),
      []
    );

    const inputStyle = useMemo(
      () => ({
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.2s ease",
        color: "#111827", // ADD THIS
        backgroundColor: "#ffffff", // ADD THIS
        WebkitTextFillColor: "#111827", // ADD THIS
        WebkitBoxShadow: "0 0 0 1000px white inset",
      }),
      []
    );

    const smallInputStyle = useMemo(
      () => ({
        ...inputStyle,
        width: "100%",
      }),
      [inputStyle]
    );

    // ========================================
    // EVENT HANDLERS
    // ========================================

    const handleBackdropClick = useCallback(
      (e) => {
        // Only close if clicking the backdrop itself, not children
        if (e.target === e.currentTarget) {
          onClose();
        }
      },
      [onClose]
    );

    const handleTabChange = useCallback((tab) => {
      startTransition(() => {
        setActiveTab(tab);
      });
    }, []);

    const handleBackToSignup = useCallback(() => {
      startTransition(() => {
        setStep(1);
        setActiveTab("signup");
      });
    }, []);

    const handleForgotPassword = useCallback(() => {
      startTransition(() => {
        setStep(3);
        setForgotEmail(email);
        resetForgotState();
      });
    }, [email, resetForgotState]);

    const handleBackToLogin = useCallback(() => {
      startTransition(() => {
        setStep(1);
        setActiveTab("login");
        resetForgotState();
      });
    }, [resetForgotState]);

    const handleForgotPasswordSubmit = useCallback(
      async (e) => {
        e.preventDefault();

        if (!forgotEmail.trim()) {
          return;
        }

        try {
          const result = await forgotPassword(forgotEmail.trim());

          if (!result.success) {
            console.log("Failed to send reset link:", result.message);
          }
        } catch (err) {
          console.error("Unexpected error:", err);
        }
      },
      [forgotEmail, forgotPassword]
    );

    const handleLogin = useCallback(
      async (e) => {
        e.preventDefault();
        try {
          const success = await login(email, password);
          if (success) {
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

    // Validation function for reset password
    const validateResetForm = useCallback(() => {
      const errors = [];

      if (!resetFormData.newPassword) {
        errors.push({ msg: "New password is required" });
      } else if (resetFormData.newPassword.length < 6) {
        errors.push({ msg: "Password must be at least 6 characters long" });
      }

      if (!resetFormData.confirmPassword) {
        errors.push({ msg: "Confirm password is required" });
      } else if (resetFormData.newPassword !== resetFormData.confirmPassword) {
        errors.push({ msg: "Passwords do not match" });
      }

      setResetValidationErrors(errors);
      return errors.length === 0;
    }, [resetFormData]);

    // Handle reset password submit
    const handleResetPasswordSubmit = useCallback(
      async (e) => {
        e.preventDefault();

        setResetValidationErrors([]);

        if (!validateResetForm()) {
          return;
        }

        if (!resetToken) {
          console.error("No reset token provided");
          return;
        }

        try {
          const result = await resetPassword(
            resetToken,
            resetFormData.newPassword,
            resetFormData.confirmPassword
          );

          if (!result.success) {
            if (result.errors) {
              setResetValidationErrors(result.errors);
            }
            console.log("Failed to reset password:", result.message);
          }
        } catch (err) {
          console.error("Error during password reset:", err);
          setResetValidationErrors([
            { msg: "An unexpected error occurred. Please try again." },
          ]);
        }
      },
      [resetToken, resetFormData, resetPassword, validateResetForm]
    );

    // Handle back to login from reset password
    const handleBackToLoginFromReset = useCallback(() => {
      startTransition(() => {
        setStep(1);
        setActiveTab("login");
        setResetToken(null);
        setResetFormData({ newPassword: "", confirmPassword: "" });
        setResetValidationErrors([]);
        resetPasswordState();
      });
    }, [resetPasswordState]);

    // Clear error when typing in forgot password
    useEffect(() => {
      if (forgotError && forgotEmail) {
        clearForgotError();
      }
    }, [forgotEmail, forgotError, clearForgotError]);

    // Handle initial mode from props
    useEffect(() => {
      if (isOpen && initialMode === "resetPassword" && propResetToken) {
        setStep(4);
        setResetToken(propResetToken);
        resetPasswordState();
      } else if (isOpen && initialMode) {
        if (initialMode === "signup") {
          setActiveTab("signup");
        } else if (initialMode === "forgotPassword") {
          setStep(3);
        }
      }
    }, [isOpen, initialMode, propResetToken, resetPasswordState]);

    // Update reset token when prop changes
    useEffect(() => {
      if (propResetToken) {
        setResetToken(propResetToken);
      }
    }, [propResetToken]);

    // Clear error when typing
    useEffect(() => {
      if (
        resetError &&
        (resetFormData.newPassword || resetFormData.confirmPassword)
      ) {
        clearResetError();
        setResetValidationErrors([]);
      }
    }, [
      resetFormData.newPassword,
      resetFormData.confirmPassword,
      resetError,
      clearResetError,
    ]);

    if (!isOpen) return null;

    // ========================================
    // RENDER
    // ========================================

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
          {step === 4 ? (
            /* ========================================
             RESET PASSWORD VIEW
             ======================================== */
            <div style={{ padding: "24px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: "24px",
                  textAlign: "center",
                }}
              >
                Reset Password
              </h2>
              <Suspense fallback={<FormSkeleton />}>
                <ResetPasswordUI
                  formData={resetFormData}
                  setFormData={setResetFormData}
                  showPassword={showResetPassword}
                  setShowPassword={setShowResetPassword}
                  showConfirmPassword={showResetConfirmPassword}
                  setShowConfirmPassword={setShowResetConfirmPassword}
                  onSubmit={handleResetPasswordSubmit}
                  onBackToLogin={handleBackToLoginFromReset}
                  isLoading={resetLoading}
                  error={resetError}
                  success={resetSuccess}
                  message={resetMessage}
                  validationErrors={resetValidationErrors}
                />
              </Suspense>
            </div>
          ) : step === 3 ? (
            /* ========================================
             FORGOT PASSWORD VIEW
             ======================================== */
            <div style={{ padding: "24px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: "24px",
                  textAlign: "center",
                }}
              >
                Forgot Password
              </h2>
              <Suspense fallback={<FormSkeleton />}>
                <ForgotPasswordUI
                  email={forgotEmail}
                  setEmail={setForgotEmail}
                  onSubmit={handleForgotPasswordSubmit}
                  onBackToLogin={handleBackToLogin}
                  isLoading={forgotLoading}
                  error={forgotError}
                  success={forgotSuccess}
                  message={forgotMessage}
                />
              </Suspense>
            </div>
          ) : step === 1 ? (
            /* ========================================
             LOGIN/SIGNUP TABS VIEW
             ======================================== */
            <>
              {/* Tabs */}
              <div
                style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}
              >
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
                      onForgotPassword={handleForgotPassword}
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
                      showSignupPassword={showSignupPassword}
                      setShowSignupPassword={setShowSignupPassword}
                      showSignupConfirmPassword={showSignupConfirmPassword}
                      setShowSignupConfirmPassword={
                        setShowSignupConfirmPassword
                      }
                    />
                  </Suspense>
                )}
              </div>
            </>
          ) : (
            /* ========================================
             OTP VERIFICATION VIEW
             ======================================== */
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
  }
);

// Display name for debugging
AuthModal.displayName = "AuthModal";

export default AuthModal;
