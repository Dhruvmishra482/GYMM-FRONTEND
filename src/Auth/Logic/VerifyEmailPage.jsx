import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyOTPService, resendOTPService } from "../Service/authService";
import VerifyEmailForm from "../Ui/VerifyEmail";

const VerifyEmailPage = () => {
  const [mounted, setMounted] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
  const [canResend, setCanResend] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from navigation state
  const { userData, email, firstName } = location.state || {};

  useEffect(() => {
    // Redirect if no user data
    if (!userData || !email) {
      toast.error("Please complete signup first");
      navigate("/signup");
      return;
    }

    setMounted(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [userData, email, navigate]);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const validateOTP = () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return false;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be exactly 6 digits");
      return false;
    }

    if (!/^\d+$/.test(otp)) {
      toast.error("OTP must contain only numbers");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (isSubmitting) return;

    if (!validateOTP()) return;

    setIsSubmitting(true);

    try {
      const otpData = {
        otp: otp.trim(),
        ...userData,
      };

      console.log("Verifying OTP with data:", otpData);
      const result = await verifyOTPService(otpData);

      toast.success("Email verified successfully! Account created.");
      console.log("OTP verification successful:", result);

      // Navigate to login or dashboard
      navigate("/login");
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (isResending) return;

    setIsResending(true);

    try {
      await resendOTPService(email, firstName);

      toast.success("New OTP sent to your email!");

      // Reset timer
      setTimeLeft(600);
      setCanResend(false);
    } catch (error) {
      console.error("Resend OTP failed:", error);
      toast.error(error.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleOTPChange = (value) => {
    // Only allow numeric input and limit to 6 digits
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  return (
    <VerifyEmailForm
      mounted={mounted}
      otp={otp}
      handleOTPChange={handleOTPChange}
      handleSubmit={handleSubmit}
      handleResendOTP={handleResendOTP}
      isSubmitting={isSubmitting}
      isResending={isResending}
      timeLeft={timeLeft}
      canResend={canResend}
      formatTime={formatTime}
      email={email}
      mousePosition={mousePosition}
    />
  );
};

export default VerifyEmailPage;
