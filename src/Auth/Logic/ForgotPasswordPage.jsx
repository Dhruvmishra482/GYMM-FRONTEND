import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePasswordResetStore } from '../Store/AuthStore';
import ForgotPasswordUI from '../Ui/ForgotPassword';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const { 
    forgotPassword, 
    isLoading, 
    error, 
    success, 
    message, 
    resetState, 
    clearError 
  } = usePasswordResetStore();

  // Reset state when component mounts
  useEffect(() => {
    resetState();
    return () => resetState(); // Cleanup on unmount
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
        // Error is handled by the store
        console.log('Failed to send reset link:', result.message);
      }
      // Success state is handled by the store and UI will update accordingly
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleBackToLogin = () => {
    resetState();
    navigate('/login');
  };

  const handleResendEmail = async () => {
    if (email) {
      await forgotPassword(email.trim());
    }
  };

  return (
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
  );
};

export default ForgotPasswordPage;