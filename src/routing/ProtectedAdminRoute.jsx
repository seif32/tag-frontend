import { useAuthStore } from "@/auth/store/authStore";
import LoadingState from "@/ui/LoadingState";
import { Navigate } from "react-router";

function ProtectedAdminRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const hasInitialized = useAuthStore((state) => state._hasInitialized); // 🆕

  // ✅ Wait for BOTH loading AND initialization
  if (loading || !hasInitialized) {
    return <LoadingState type="page" />;
  }

  // ✅ Now safe to check auth
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (user && !user.emailVerified) {
    return <Navigate to="/check-email" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
