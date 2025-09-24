import { Navigate } from "react-router-dom";
import { useAuthStore } from "../Auth/Store/AuthStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuthStore();

  if (loading) return <div>Checking authentication...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // accountType ke against role check
  if (allowedRoles && !allowedRoles.includes(user.accountType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
