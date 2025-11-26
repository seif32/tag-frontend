import { useAuthStore } from "@/auth/store/authStore";
import LoadingState from "@/ui/LoadingState";
import { Navigate, useLocation } from "react-router";

function ProtectedRoute({ children, requireVerified = true }) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const hasInitialized = useAuthStore((state) => state._hasInitialized); // 🆕
  const location = useLocation();

  // ✅ Wait for BOTH loading AND initialization
  if (loading || !hasInitialized) {
    return <LoadingState type="page" />;
  }

  // ✅ Now safe to redirect
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireVerified && user && !user.emailVerified) {
    return <Navigate to="/check-email" replace />;
  }

  return children;
}

export default ProtectedRoute;
