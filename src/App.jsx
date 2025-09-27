// // ========================================
// // IMPORTS SECTION
// // ========================================

// // React Router Imports
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// // Core Components
// import Navigation from "./Components/Hero/UI/Navigation";
// import ProtectedRoute from "./ProtectedRoutes/ProtectedRoutes";

// // Hero/Landing Page Components
// import HeroMain from "./Components/Hero/UI/HeroMain";
// import Features from "./Components/Hero/UI/Features";
// import PricingPage from "./Components/Hero/UI/PricePage";

// // Authentication Components
// import ForgotPasswordPage from "./Auth/Logic/ForgotPasswordPage";
// import VerifyEmailPage from "./Auth/Logic/VerifyEmailPage";
// import ResetPasswordPage from "./Auth/Logic/ResetPasswordPage";

// // Member Management Components
// import DashboardPage from "./Basic/Features/MemberCrud/Logic/DashBoardPage";
// import AddMemberPage from "./Basic/Features/MemberCrud/Logic/AddMemberPage";
// import EditMemberForm from "./Basic/Features/MemberCrud/Ui/EditMemberForm";
// import EditMemberBySearch from "./Basic/Features/MemberCrud/Logic/EditMemberBySearch";
// import BasicAnalyticsReports from "./Basic/Features/MemberCrud/Ui/BasicAnalyticsReports";
// import MyAnalyticsPage from "./Basic/Features/MemberCrud/Logic/AnalyticsPage";

// // Profile & User Management Components
// import DueMembersPage from "./Basic/Features/ProfileDropDown/Logic/DueMemberPage";
// import MyProfile from "./Basic/Features/ProfileDropDown/Logic/MyProfilePage";

// // Payment System Components
// import PaymentPage from "./Basic/Features/PaaymentSystem/Logic/PaymentPage";
// import PaymentSuccessPage from "./Basic/Features/PaaymentSystem/Logic/PaymentSuccessPage";
// import PaymentFailedPage from "./Basic/Features/PaaymentSystem/Logic/PaymentFailedPage";

// // Subscription System Components
// import MySubscription from "./Basic/Features/SubscriptionSystem/Logic/MySubscription";
// import SlotBookingPage from "./Basic/Features/CrowdManagement/Logic/SlotBookingPage";
// // Other Features
// import ContactUs from "./Basic/Features/ContactUs/ContactUs";

// // Store & Hooks
// import { useAuthStore } from "./Auth/Store/AuthStore";
// import { useEffect } from "react";

// // External Libraries
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // ========================================
// // MAIN APP COMPONENT
// // ========================================

// const App = () => {
//   // ========================================
//   // STATE & HOOKS
//   // ========================================
//   const { user, loading, checkAuth, isInitialized } = useAuthStore();
//   const location = useLocation();

//   // ========================================
//   // EFFECTS
//   // ========================================
//   useEffect(() => {
//     if (!isInitialized) {
//       const { initializeAuth } = useAuthStore.getState();
//       initializeAuth();
//     }
//     const timeout = setTimeout(() => {
//       if (!isInitialized) {
//         checkAuth();
//       }
//     }, 100);
//     return () => clearTimeout(timeout);
//   }, [checkAuth, isInitialized]);

//   // ========================================
//   // LOADING STATE
//   // ========================================
//   if (loading && !isInitialized) {
//     return (
//       <div className="flex items-center justify-center h-screen text-xl">
//         Checking authentication...
//       </div>
//     );
//   }

//   // ========================================
//   // NAVIGATION VISIBILITY LOGIC
//   // ========================================
//   // Paths where Navigation should be hidden
//   const hideNavPaths = [
//     "/dashboard",
//     "/search-member",
//     "/add-member",
//     "/due-members",
//     "/my-profile",
//     "/payment",
//     "/payment/success",
//     "/payment/failed",
//     "/my-subscription",
//     "/my-analytics",
//   ];

//   const isEditMemberPath = location.pathname.startsWith("/edit-member");
//   const isPaymentPath = location.pathname.startsWith("/payment");

//   const shouldHideNav =
//     hideNavPaths.includes(location.pathname) ||
//     isEditMemberPath ||
//     isPaymentPath;

//   // ========================================
//   // RENDER
//   // ========================================
//   return (
//     <>
//       {!shouldHideNav && <Navigation />}
//       <ToastContainer />
      
//       <Routes>
//         {/* ========================================
//             PUBLIC ROUTES (Landing Pages)
//             ======================================== */}
//         <Route
//           path="/"
//           element={user ? <Navigate to="/dashboard" replace /> : <HeroMain />}
//         />
//         <Route path="/home" element={<HeroMain />} />
//         <Route path="/features" element={<Features />} />
//         <Route path="/pricing" element={<PricingPage />} />
//         <Route path="/contact" element={<ContactUs />} />
//         <Route path="/book-slot" element={<SlotBookingPage />} />

//         {/* ========================================
//             AUTHENTICATION ROUTES
//             ======================================== */}
//         <Route path="/verify-email" element={<VerifyEmailPage />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//         <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        
//         {/* Redirect old auth routes to home - AuthModal will handle login/signup */}
//         <Route path="/login" element={<Navigate to="/" replace />} />
//         <Route path="/signup" element={<Navigate to="/" replace />} />

//         {/* ========================================
//             DASHBOARD & MEMBER MANAGEMENT ROUTES
//             ======================================== */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <DashboardPage />
//             </ProtectedRoute>
//           }
//         />
        
//         <Route
//           path="/add-member"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <AddMemberPage />
//             </ProtectedRoute>
//           }
//         />
        
//         <Route
//           path="/edit-member/:phoneNumber"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <EditMemberForm />
//             </ProtectedRoute>
//           }
//         />
        
//         <Route
//           path="/search-member"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <ContactUs />
//             </ProtectedRoute>
//           }
//         />
        
//         <Route
//           path="/due-members"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <DueMembersPage dueMembersData={location.state?.dueMembersData} />
//             </ProtectedRoute>
//           }
//         />

//         {/* ========================================
//             ANALYTICS & REPORTING ROUTES
//             ======================================== */}
//         <Route
//           path="/my-analytics"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <MyAnalyticsPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* ========================================
//             CROWD MANAGEMENT ROUTES
//             ======================================== */}
//         <Route
//           path="/crowd-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <CrowdManagementPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* ========================================
//             PROFILE MANAGEMENT ROUTES
//             ======================================== */}
//         <Route
//           path="/my-profile"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <MyProfile />
//             </ProtectedRoute>
//           }
//         />

//         {/* ========================================
//             PAYMENT SYSTEM ROUTES
//             ======================================== */}
//         <Route
//           path="/payment"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <PaymentPage />
//             </ProtectedRoute>
//           }
//         />
        
//         <Route
//           path="/payment/success"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <PaymentSuccessPage />
//             </ProtectedRoute>
//           }
//         />
        
//         <Route
//           path="/payment/failed"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <PaymentFailedPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* ========================================
//             SUBSCRIPTION SYSTEM ROUTES
//             ======================================== */}
//         <Route
//           path="/my-subscription"
//           element={
//             <ProtectedRoute allowedRoles={["owner"]}>
//               <MySubscription />
//             </ProtectedRoute>
//           }
//         />

//         {/* ========================================
//             ERROR & FALLBACK ROUTES
//             ======================================== */}
//         <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </>
//   );
// };

// export default App;
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navigation from "./Components/Hero/UI/Navigation";

import DashboardPage from "./Basic/Features/MemberCrud/Logic/DashBoardPage";

import HeroMain from "./Components/Hero/UI/HeroMain";

import Features from "./Components/Hero/UI/Features";

import PricingPage from "./Components/Hero/UI/PricePage";

import AddMemberPage from "./Basic/Features/MemberCrud/Logic/AddMemberPage";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoutes";
import { useAuthStore } from "./Auth/Store/AuthStore";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPasswordPage from "./Auth/Logic/ForgotPasswordPage";
import VerifyEmailPage from "./Auth/Logic/VerifyEmailPage";
import ResetPasswordPage from "./Auth/Logic/ResetPasswordPage";
import EditMemberForm from "./Basic/Features/MemberCrud/Ui/EditMemberForm";
import EditMemberBySearch from "./Basic/Features/MemberCrud/Logic/EditMemberBySearch";
import DueMembersPage from "./Basic/Features/ProfileDropDown/Logic/DueMemberPage";

import MyProfile from "./Basic/Features/ProfileDropDown/Logic/MyProfilePage";
import ContactUs from "./Basic/Features/ContactUs/ContactUs";

// Payment related imports

import PaymentPage from "./Basic/Features/PaaymentSystem/Logic/PaymentPage";

import PaymentSuccessPage from "./Basic/Features/PaaymentSystem/Logic/PaymentSuccessPage";

import PaymentFailedPage from "./Basic/Features/PaaymentSystem/Logic/PaymentFailedPage";

import MySubscription from "./Basic/Features/SubscriptionSystem/Logic/MySubscription";
import BasicAnalyticsReports from "./Basic/Features/MemberCrud/Ui/BasicAnalyticsReports";
import MyAnalyticsPage from "./Basic/Features/MemberCrud/Logic/AnalyticsPage";
import SlotBookingPage from "./Basic/Features/CrowdManagement/Logic/SlotBookingPage";
import CrowdManagementPage from "./Basic/Features/CrowdManagement/Logic/CrowdManagementPage";

const App = () => {
  const { user, loading, checkAuth, isInitialized } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
   
    const initializeAuth = async () => {
      if (!isInitialized) {
        console.log('🚀 Initializing authentication...');
        await checkAuth();
      }
    };

    initializeAuth();
  }, []); 


  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // बाकी आपका existing code same रखें...
  // Paths where Navigation should be hidden
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
  ];

  const isEditMemberPath = location.pathname.startsWith("/edit-member");
  const isPaymentPath = location.pathname.startsWith("/payment");

  const shouldHideNav =
    hideNavPaths.includes(location.pathname) ||
    isEditMemberPath ||
    isPaymentPath;

  return (
    <>
      {!shouldHideNav && <Navigation />}
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <HeroMain />}
        />
        <Route path="/home" element={<HeroMain />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/book-slot" element={<SlotBookingPage />} />

        {/* Protected routes */}
        <Route
          path="/edit-member/:phoneNumber"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <EditMemberForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crowd-dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <CrowdManagementPage />
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

        <Route
          path="/my-profile"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-analytics"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <MyAnalyticsPage />
            </ProtectedRoute>
          }
        />

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

        {/* Payment routes - All require authentication */}
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
        <Route
          path="/my-subscription"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <MySubscription />
            </ProtectedRoute>
          }
        />

        {/* Keep these auth routes for direct URL access and password reset functionality */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Redirect old auth routes to home - AuthModal will handle login/signup */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />

        {/* Fallback routes */}
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;