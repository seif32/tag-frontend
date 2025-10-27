import { useAuthStore } from "@/auth/store/authStore";
import LoadingState from "@/ui/LoadingState";
import { Navigate, useLocation } from "react-router";

function ProtectedRoute({ children, requireVerified = true }) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading); // ✅ ADD THIS
  const location = useLocation(); // ✅ ADD THIS

  // ✅ Show loading while checking auth
  if (loading) {
    return <LoadingState type="page" />; // Replace with your LoadingState component
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Uncomment if you want email verification
  if (requireVerified && user && !user.emailVerified) {
    return <Navigate to="/check-email" replace />;
  }

  return children;
}

export default ProtectedRoute;
