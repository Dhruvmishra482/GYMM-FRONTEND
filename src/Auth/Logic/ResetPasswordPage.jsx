// ResetPasswordPage.jsx - Opens AuthModal with Reset Password View
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    // Validate token exists
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    // Navigate to home with state to open AuthModal in reset password mode
    navigate("/", {
      replace: true,
      state: {
        openAuthModal: true,
        authMode: "resetPassword",
        resetToken: token,
      },
    });
  }, [token, navigate]);

  // Show loading while redirecting
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #f8fafc, #e0f2fe)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }}
        ></div>
        <p style={{ color: "#6b7280" }}>Loading password reset...</p>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;
