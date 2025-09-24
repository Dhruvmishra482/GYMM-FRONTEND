// src/components/pages/SignupPage.jsx
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../Store/AuthStore";
import { signUpService,verifyOTPService,resendOTPService } from "../Service/authService";
import SignupForm from "../Ui/SignUpForm";
import VerifyEmailForm from "../Ui/VerifyEmail";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { loading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1 = signup form, 2 = OTP verification
  const [otp, setOtp] = useState("");
  const [userData, setUserData] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  // Timer and resend functionality
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Timer countdown effect
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required!";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required!";
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required!";
    if (!formData.email.trim()) newErrors.email = "Email is required!";
    if (!formData.password) newErrors.password = "Password is required!";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required!";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address!";
    }
    
    const phoneRegex = /^[0-9]{10,15}$/;
    if (formData.mobileNumber && !phoneRegex.test(formData.mobileNumber.replace(/\s+/g, ''))) {
      newErrors.mobileNumber = "Please enter a valid mobile number!";
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Submit signup form (sends OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const signupData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        emailUpdates: emailUpdates
      };

      console.log("Sending signup data:", signupData); // Debug log

      const response = await signUpService(signupData);

      if (response && response.success) {
        setUserData(response.userData);
        setStep(2); // Move to OTP verification step
        setTimeLeft(300); // Reset timer to 5 minutes
        setCanResend(false);
        toast.success("OTP sent to your email! Please check and enter the code.");
      }
    } catch (err) {
      console.log("Signup error:", err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (value) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericValue);
  };

  // Step 2: Verify OTP and complete registration
  const handleOTPVerification = async (e) => {
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
        password: userData.password
      };

      console.log("Sending OTP verification data:", otpData); // Debug log

      const response = await verifyOTPService(otpData);

      if (response && response.success) {
        toast.success("Account created successfully! You can now login.");
        navigate("/login");
      }
    } catch (err) {
      console.log("OTP verification error:", err);
      toast.error(err.message || "Invalid OTP. Please try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const response = await resendOTPService(userData.email, userData.firstName);
      
      if (response && response.success) {
        toast.success("New OTP sent to your email!");
        setTimeLeft(300); // Reset timer
        setCanResend(false);
        setOtp(""); // Clear current OTP
      }
    } catch (err) {
      console.log("Resend OTP error:", err);
      toast.error(err.message || "Failed to resend OTP. Please try again!");
    } finally {
      setIsResending(false);
    }
  };

  // If we're on step 2 (OTP verification), show OTP form
  if (step === 2) {
    return (
      <VerifyEmailForm
        mounted={mounted}
        otp={otp}
        handleOTPChange={handleOTPChange}
        handleSubmit={handleOTPVerification}
        handleResendOTP={handleResendOTP}
        isSubmitting={isSubmitting}
        isResending={isResending}
        timeLeft={timeLeft}
        canResend={canResend}
        formatTime={formatTime}
        email={userData?.email || formData.email}
        mousePosition={{ x: 0, y: 0 }} // Add if needed by VerifyEmailForm
      />
    );
  }

  // Step 1: Show normal signup form
  return (
    <SignupForm
      formData={formData}
      errors={errors}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      isSubmitting={isSubmitting}
      focusedField={focusedField}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      togglePassword={() => setShowPassword(!showPassword)}
      toggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      setFocusedField={setFocusedField}
      emailUpdates={emailUpdates}
      setEmailUpdates={setEmailUpdates}
    />
  );
}