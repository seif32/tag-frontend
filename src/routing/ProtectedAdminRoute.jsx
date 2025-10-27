import { useAuthStore } from "@/auth/store/authStore";
import LoadingState from "@/ui/LoadingState";
import { Navigate } from "react-router";

function ProtectedAdminRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  // ✅ Show loading while checking auth
  if (loading) {
    return <LoadingState type="page" />; // Replace with your LoadingState component
  }

  // Check if user is logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  // if (user && user.role !== "admin") {
  //   return <Navigate to="/" replace />; // Redirect to customer area
  // }

  // Check if email is verified first (uncomment if needed)
  // if (user && !user.emailVerified) {
  //   return <Navigate to="/check-email" replace />;
  // }

  return children;
}

export default ProtectedAdminRoute;
