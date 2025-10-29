// ========================================
// IMPORTS SECTION
// ========================================

// React Core
import { useEffect, useState } from "react";

// React Router Imports
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Core Components
import Navigation from "./Components/Hero/UI/Navigation";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoutes";
import AuthModal from "./Auth/Ui/AuthModel";

// Hero/Landing Page Components
import HeroMain from "./Components/Hero/UI/HeroMain";
import Features from "./Components/Hero/UI/Features";
import PricingPage from "./Components/Hero/UI/PricePage";

// Authentication Components
import ForgotPasswordPage from "./Auth/Logic/ForgotPasswordPage";
import VerifyEmailPage from "./Auth/Logic/VerifyEmailPage";
import ResetPasswordPage from "./Auth/Logic/ResetPasswordPage";

// Member Management Components
import DashboardPage from "./Basic/Features/MemberCrud/Logic/DashBoardPage";
import AddMemberPage from "./Basic/Features/MemberCrud/Logic/AddMemberPage";
import EditMemberForm from "./Basic/Features/MemberCrud/Ui/EditMemberForm";
import EditMemberBySearch from "./Basic/Features/MemberCrud/Logic/EditMemberBySearch";
import BasicAnalyticsReports from "./Basic/Features/MemberCrud/Ui/BasicAnalyticsReports";
import MyAnalyticsPage from "./Basic/Features/MemberCrud/Logic/AnalyticsPage";

// Profile & User Management Components
import DueMembersPage from "./Basic/Features/ProfileDropDown/Logic/DueMemberPage";
import MyProfile from "./Basic/Features/ProfileDropDown/Logic/MyProfilePage";

// Payment System Components
import PaymentPage from "./Basic/Features/PaaymentSystem/Logic/PaymentPage";
import PaymentSuccessPage from "./Basic/Features/PaaymentSystem/Logic/PaymentSuccessPage";
import PaymentFailedPage from "./Basic/Features/PaaymentSystem/Logic/PaymentFailedPage";

// Subscription System Components
import MySubscription from "./Basic/Features/SubscriptionSystem/Logic/MySubscription";
import SlotBookingPage from "./Basic/Features/CrowdManagement/Logic/SlotBookingPage";
import CrowdManagementPage from "./Basic/Features/CrowdManagement/Logic/CrowdManagementPage";

// Other Features
import ContactUs from "./Basic/Features/ContactUs/ContactUs";

// Modals (if you have these)
import ProfileModal from "./Basic/Features/ProfileDropDown/Ui/ProfileModal";
import EditMemberModal from "./Basic/Features/MemberCrud/Ui/EditMemberModal";

// Store & Hooks
import { useAuthStore } from "./Auth/Store/AuthStore";

// External Libraries
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ========================================
// MAIN APP COMPONENT
// ========================================

const App = () => {
  // ========================================
  // STATE & HOOKS
  // ========================================
  const { user, loading, checkAuth, isInitialized } = useAuthStore();
  const location = useLocation();

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [resetToken, setResetToken] = useState(null);

  // Signup Plan State (for pricing page)
  const [selectedPlan, setSelectedPlan] = useState(null);

  // ========================================
  // EFFECTS
  // ========================================

  // Initialize auth
  useEffect(() => {
    if (!isInitialized) {
      const { initializeAuth } = useAuthStore.getState();
      initializeAuth();
    }
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        checkAuth();
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [checkAuth, isInitialized]);

  // Handle Reset Password from URL (NEW)
  useEffect(() => {
    if (location.state?.openAuthModal) {
      setShowAuthModal(true);

      if (location.state.authMode) {
        setAuthMode(location.state.authMode);
      }

      if (location.state.resetToken) {
        setResetToken(location.state.resetToken);
      }

      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // ========================================
  // LOADING STATE
  // ========================================
  if (loading && !isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontSize: "20px",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  // ========================================
  // NAVIGATION VISIBILITY LOGIC
  // ========================================
  const hideNavPaths = [
    "/dashboard",
    "/search-member",
    "/add-member",
    "/due-members",
    "/my-profile",
    "/payment",
    "/payment/success",
    "/payment/failed",
    "/my-subscription",
    "/my-analytics",
    "/contact",
    "/pricing",
    "/forgot-password",
  ];

  const isEditMemberPath = location.pathname.startsWith("/edit-member");
  const isPaymentPath = location.pathname.startsWith("/payment");

  const shouldHideNav =
    hideNavPaths.includes(location.pathname) ||
    isEditMemberPath ||
    isPaymentPath;

  // Modal routing support using background locations
  const state = location.state && location.state;

  // ========================================
  // RENDER
  // ========================================
  return (
    <>
      {!shouldHideNav && <Navigation />}
      <ToastContainer />

      <Routes location={state?.background || location}>
        {/* ========================================
            PUBLIC ROUTES (Landing Pages)
            ======================================== */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <HeroMain />}
        />
        <Route path="/home" element={<HeroMain />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/book-slot" element={<SlotBookingPage />} />

        {/* Signup redirects with plans */}
        <Route
          path="/signup/basic"
          element={
            <SignUpRedirect
              plan="Basic"
              setShowAuthModal={setShowAuthModal}
              setAuthMode={setAuthMode}
              setSelectedPlan={setSelectedPlan}
            />
          }
        />

        <Route
          path="/signup/advanced"
          element={
            <SignUpRedirect
              plan="Advanced"
              setShowAuthModal={setShowAuthModal}
              setAuthMode={setAuthMode}
              setSelectedPlan={setSelectedPlan}
            />
          }
        />

        <Route
          path="/signup/enterprise"
          element={
            <SignUpRedirect
              plan="Enterprise"
              setShowAuthModal={setShowAuthModal}
              setAuthMode={setAuthMode}
              setSelectedPlan={setSelectedPlan}
            />
          }
        />

        {/* ========================================
            AUTHENTICATION ROUTES
            ======================================== */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Redirect old auth routes to home - AuthModal will handle login/signup */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />

        {/* ========================================
            DASHBOARD & MEMBER MANAGEMENT ROUTES
            ======================================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-member"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <AddMemberPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-member/:phoneNumber"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <EditMemberForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search-member"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <ContactUs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/due-members"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <DueMembersPage dueMembersData={location.state?.dueMembersData} />
            </ProtectedRoute>
          }
        />

        {/* ========================================
            ANALYTICS & REPORTING ROUTES
            ======================================== */}
        <Route
          path="/my-analytics"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <MyAnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* ========================================
            CROWD MANAGEMENT ROUTES
            ======================================== */}
        <Route
          path="/crowd-dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <CrowdManagementPage />
            </ProtectedRoute>
          }
        />

        {/* ========================================
            PROFILE MANAGEMENT ROUTES
            ======================================== */}
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        {/* ========================================
            PAYMENT SYSTEM ROUTES
            ======================================== */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/success"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/failed"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <PaymentFailedPage />
            </ProtectedRoute>
          }
        />

        {/* ========================================
            SUBSCRIPTION ROUTES
            ======================================== */}
        <Route
          path="/my-subscription"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <MySubscription />
            </ProtectedRoute>
          }
        />

        {/* ========================================
            FALLBACK ROUTES
            ======================================== */}
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Modal Routes (if using background locations) */}
      {state?.background && (
        <Routes>
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <ProfileModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-member/:phoneNumber"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <EditMemberModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}

      {/* ========================================
          AUTH MODAL (NEW)
          ======================================== */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setAuthMode("login");
          setResetToken(null);
        }}
        initialMode={authMode}
        resetToken={resetToken}
        selectedPlan={selectedPlan}
      />
    </>
  );
};

// ========================================
// HELPER COMPONENTS
// ========================================

function SignUpRedirect({
  plan,
  setShowAuthModal,
  setAuthMode,
  setSelectedPlan,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedPlan(plan);
    setAuthMode("signup");
    setShowAuthModal(true);
    navigate("/", { replace: true });
  }, [plan, navigate, setShowAuthModal, setAuthMode, setSelectedPlan]);

  return null;
}

export default App;
