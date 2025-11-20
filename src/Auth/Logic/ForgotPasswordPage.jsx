// ForgotPasswordPage.jsx - COMPLETE VERSION
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePasswordResetStore } from "../Store/AuthStore";
import ForgotPasswordUI from "../Ui/ForgotPassword";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const {
    forgotPassword,
    isLoading,
    error,
    success,
    message,
    resetState,
    clearError,
  } = usePasswordResetStore();

  // Reset state when component mounts
  useEffect(() => {
    resetState();
    return () => resetState();
  }, [resetState]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && email) {
      clearError();
    }
  }, [email, error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    try {
      const result = await forgotPassword(email.trim());

      if (!result.success) {
        console.log("Failed to send reset link:", result.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleBackToLogin = () => {
    resetState();
    navigate("/");
  };

  const handleResendEmail = async () => {
    if (email) {
      await forgotPassword(email.trim());
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #f8fafc, #e0f2fe)",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <ForgotPasswordUI
          email={email}
          setEmail={setEmail}
          onSubmit={handleSubmit}
          onBackToLogin={handleBackToLogin}
          onResendEmail={handleResendEmail}
          isLoading={isLoading}
          error={error}
          success={success}
          message={message}
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
