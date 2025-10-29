// ForgotPasswordUI.jsx - Fixed with Visible Input Text
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const ForgotPasswordUI = memo(
  ({
    email,
    setEmail,
    onSubmit,
    onBackToLogin,
    isLoading,
    error,
    success,
    message,
  }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    // Fixed input style with visible text color
    const inputStyle = useMemo(
      () => ({
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.2s ease",
        color: "#111827", // ✅ TEXT COLOR - This was missing!
        backgroundColor: "#ffffff", // ✅ Background color
      }),
      []
    );

    const handleEmailChange = useCallback(
      (e) => {
        setEmail(e.target.value);
      },
      [setEmail]
    );

    const handleSubmit = useCallback(
      (e) => {
        e.preventDefault();
        if (email.trim()) {
          onSubmit(e);
        }
      },
      [email, onSubmit]
    );

    const handleBackToLogin = useCallback(() => {
      onBackToLogin();
    }, [onBackToLogin]);

    if (success) {
      return (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#d1fae5",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircle
              style={{ width: "32px", height: "32px", color: "#10b981" }}
            />
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Check Your Email
          </h3>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "24px",
              lineHeight: "1.5",
              fontSize: "14px",
            }}
          >
            {message ||
              "We've sent a password reset link to your email address. Please check your inbox and follow the instructions."}
          </p>
          <div
            style={{
              backgroundColor: "#f0fdf4",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #d1fae5",
              marginBottom: "24px",
            }}
          >
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
          <button
            onClick={handleBackToLogin}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "#2563eb",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              padding: "8px",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.color = "#2563eb")}
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Reset Your Password
          </h3>
          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <AlertCircle
              style={{
                width: "20px",
                height: "20px",
                color: "#dc2626",
                flexShrink: 0,
              }}
            />
            <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {/* Email Input */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            <Mail style={{ width: "16px", height: "16px", color: "#6b7280" }} />
            Email Address
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="Enter your email"
              autoComplete="email"
              required
              disabled={isLoading}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.stopPropagation();
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
            {email && (
              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "8px",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mail
                  style={{ width: "12px", height: "12px", color: "white" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: isLoading || !email.trim() ? "#9ca3af" : "#111827",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isLoading || !email.trim() ? "not-allowed" : "pointer",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!isLoading && email.trim()) {
              e.target.style.backgroundColor = "#000000";
              e.target.style.transform = "scale(1.02)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && email.trim()) {
              e.target.style.backgroundColor = "#111827";
              e.target.style.transform = "scale(1)";
            }
          }}
        >
          {isLoading ? (
            <>
              <Loader2
                style={{
                  width: "20px",
                  height: "20px",
                  animation: "spin 1s linear infinite",
                }}
              />
              Sending Reset Link...
            </>
          ) : (
            <>
              <Mail style={{ width: "20px", height: "20px" }} />
              Send Reset Link
            </>
          )}
        </button>

        {/* Back to Login */}
        <div
          style={{
            textAlign: "center",
            paddingTop: "16px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            type="button"
            onClick={handleBackToLogin}
            disabled={isLoading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "#2563eb",
              background: "none",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              margin: "0 auto",
              padding: "8px",
              opacity: isLoading ? 0.5 : 1,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.target.style.color = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.target.style.color = "#2563eb";
            }}
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>

        <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: #9ca3af;
          opacity: 1;
        }
        
        input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
      </form>
    );
  }
);

ForgotPasswordUI.displayName = "ForgotPasswordUI";

export default ForgotPasswordUI;
