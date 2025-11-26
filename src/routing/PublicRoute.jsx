import { useAuthStore } from "@/auth/store/authStore";
import LoadingState from "@/ui/LoadingState";
import { Navigate } from "react-router";

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const hasInitialized = useAuthStore((state) => state._hasInitialized);

  if (loading || !hasInitialized) {
    return <LoadingState type="page" />;
  }

  // ✅ Only redirect if truly authenticated
  if (isAuthenticated && user) {
    if (!user.emailVerified) {
      return <Navigate to="/check-email" replace />;
    }
    const redirectPath = user.role === "admin" ? "/admin/products" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children; // ✅ Show login page with error
}

export default PublicRoute;
