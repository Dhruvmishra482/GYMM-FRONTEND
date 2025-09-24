import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePasswordResetStore } from '../Store/AuthStore';
import ResetPasswordUI from '../Ui/ResetPassword';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const {
    resetPassword,
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
    
    // Check if token exists
    if (!token) {
      navigate('/login');
      return;
    }

    return () => resetState(); // Cleanup on unmount
  }, [resetState, token, navigate]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && (formData.newPassword || formData.confirmPassword)) {
      clearError();
      setValidationErrors([]);
    }
  }, [formData.newPassword, formData.confirmPassword, error, clearError]);

  // Redirect to login on successful password reset
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password reset successful. Please log in with your new password.' }
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Client-side validation
  const validateForm = () => {
    const errors = [];
    
    if (!formData.newPassword) {
      errors.push({ msg: 'New password is required' });
    } else if (formData.newPassword.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters long' });
    }

    if (!formData.confirmPassword) {
      errors.push({ msg: 'Confirm password is required' });
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.push({ msg: 'Passwords do not match' });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors([]);
    
    if (!validateForm()) {
      return;
    }

    if (!token) {
      console.error('No token provided');
      navigate('/login');
      return;
    }

    try {
      const result = await resetPassword(
        token,
        formData.newPassword,
        formData.confirmPassword
      );
      
      if (!result.success) {
        // Check if the error response contains validation errors
        if (result.errors) {
          setValidationErrors(result.errors);
        }
        console.log('Failed to reset password:', result.message);
      }
      // Success state is handled by the useEffect above
    } catch (err) {
      console.error('Error during password reset:', err);
      setValidationErrors([{ msg: 'An unexpected error occurred. Please try again.' }]);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login', { 
      state: { message: 'Please log in with your new password.' }
    });
  };

  return (
    <ResetPasswordUI
      formData={formData}
      setFormData={setFormData}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      onSubmit={handleSubmit}
      onGoToLogin={handleGoToLogin}
      isLoading={isLoading}
      error={error}
      success={success}
      message={message}
      validationErrors={validationErrors}
    />
  );
};

export default ResetPasswordPage;