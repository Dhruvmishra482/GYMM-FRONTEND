// ResetPasswordUI.jsx - For AuthModal Integration (Inline Styles)
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const ResetPasswordUI = memo(
  ({
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    onSubmit,
    onBackToLogin,
    isLoading,
    error,
    success,
    message,
    validationErrors,
  }) => {
    // Password strength calculation
    const getPasswordStrength = useCallback((password) => {
      if (!password) return { strength: 0, text: "", color: "", barColor: "" };

      let strength = 0;
      if (password.length >= 6) strength += 1;
      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;

      if (strength <= 2)
        return {
          strength,
          text: "Weak",
          color: "#dc2626",
          barColor: "#ef4444",
        };
      if (strength <= 4)
        return {
          strength,
          text: "Medium",
          color: "#d97706",
          barColor: "#f59e0b",
        };
      return {
        strength,
        text: "Strong",
        color: "#16a34a",
        barColor: "#10b981",
      };
    }, []);

    const passwordStrength = useMemo(
      () => getPasswordStrength(formData.newPassword),
      [formData.newPassword, getPasswordStrength]
    );

    const passwordsMatch = useMemo(
      () =>
        formData.newPassword === formData.confirmPassword &&
        formData.confirmPassword,
      [formData.newPassword, formData.confirmPassword]
    );

    const handleInputChange = useCallback(
      (field, value) => {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      },
      [setFormData]
    );

    const handleSubmit = useCallback(
      (e) => {
        e.preventDefault();
        onSubmit(e);
      },
      [onSubmit]
    );

    const handleBackToLogin = useCallback(() => {
      onBackToLogin();
    }, [onBackToLogin]);

    // Shared input style (matching AuthModal)
    const inputStyle = useMemo(
      () => ({
        width: "100%",
        padding: "12px 40px 12px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        transition: "all 0.2s ease",
      }),
      []
    );

    const getInputBorderStyle = (field) => {
      if (field === "confirmPassword" && formData.confirmPassword) {
        if (passwordsMatch) {
          return {
            borderColor: "#10b981",
            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
          };
        } else if (formData.newPassword !== formData.confirmPassword) {
          return {
            borderColor: "#ef4444",
            boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
          };
        }
      }
      return {};
    };

    // Success State
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
            Password Reset Successful!
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
              "Your password has been reset successfully. You can now log in with your new password."}
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
              Click below to go back and log in with your new password.
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

    // Form State
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
            Create New Password
          </h3>
          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Choose a strong password to secure your account
          </p>
        </div>

        {/* Error Messages */}
        {(error || (validationErrors && validationErrors.length > 0)) && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "start",
              gap: "12px",
            }}
          >
            <AlertCircle
              style={{
                width: "20px",
                height: "20px",
                color: "#dc2626",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <div style={{ flex: 1 }}>
              {error && (
                <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>
                  {error}
                </p>
              )}
              {validationErrors && validationErrors.length > 0 && (
                <ul
                  style={{
                    margin: "8px 0 0 0",
                    padding: "0 0 0 20px",
                    color: "#dc2626",
                    fontSize: "14px",
                  }}
                >
                  {validationErrors.map((err, index) => (
                    <li key={index}>{err.msg}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* New Password Input */}
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
            <Lock style={{ width: "16px", height: "16px", color: "#10b981" }} />
            New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              style={inputStyle}
              placeholder="Enter new password"
              required
              disabled={isLoading}
              minLength="6"
              autoComplete="new-password"
              onFocus={(e) => {
                e.target.style.borderColor = "#10b981";
                e.stopPropagation();
              }}
              onBlur={(e) => {
                if (!formData.newPassword)
                  e.target.style.borderColor = "#d1d5db";
              }}
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
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {formData.newPassword && passwordStrength.strength > 2 && (
              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "40px",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle
                  style={{ width: "12px", height: "12px", color: "white" }}
                />
              </div>
            )}
          </div>

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div style={{ marginTop: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                  Password strength:
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    color: passwordStrength.color,
                  }}
                >
                  {passwordStrength.text}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    backgroundColor: passwordStrength.barColor,
                    width: `${(passwordStrength.strength / 6) * 100}%`,
                    transition: "all 0.3s ease",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
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
            <CheckCircle
              style={{ width: "16px", height: "16px", color: "#10b981" }}
            />
            Confirm New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              style={{
                ...inputStyle,
                ...getInputBorderStyle("confirmPassword"),
              }}
              placeholder="Confirm new password"
              required
              disabled={isLoading}
              autoComplete="new-password"
              onFocus={(e) => {
                e.target.style.borderColor = "#10b981";
                e.stopPropagation();
              }}
              onBlur={(e) => {
                if (!formData.confirmPassword)
                  e.target.style.borderColor = "#d1d5db";
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {passwordsMatch && (
              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "40px",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle
                  style={{ width: "12px", height: "12px", color: "white" }}
                />
              </div>
            )}
          </div>

          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div style={{ marginTop: "8px" }}>
              {passwordsMatch ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#10b981",
                    fontSize: "14px",
                  }}
                >
                  <CheckCircle
                    style={{
                      width: "16px",
                      height: "16px",
                      marginRight: "6px",
                    }}
                  />
                  Passwords match
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#ef4444",
                    fontSize: "14px",
                  }}
                >
                  <AlertCircle
                    style={{
                      width: "16px",
                      height: "16px",
                      marginRight: "6px",
                    }}
                  />
                  Passwords don't match
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !passwordsMatch}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor:
              isLoading || !passwordsMatch ? "#9ca3af" : "#111827",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isLoading || !passwordsMatch ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            transition: "all 0.2s ease",
            marginBottom: "16px",
          }}
          onMouseEnter={(e) => {
            if (!isLoading && passwordsMatch) {
              e.target.style.backgroundColor = "#000000";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && passwordsMatch) {
              e.target.style.backgroundColor = "#111827";
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
              Resetting Password...
            </>
          ) : (
            <>
              <Shield style={{ width: "20px", height: "20px" }} />
              Reset Password
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
      `}</style>
      </form>
    );
  }
);

ResetPasswordUI.displayName = "ResetPasswordUI";

export default ResetPasswordUI;
