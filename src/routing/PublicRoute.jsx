import { useAuthStore } from "@/auth/store/authStore";
import { Navigate } from "react-router";

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  // Show loading while checking auth
  if (loading) {
    return <div>Loading...</div>; // Replace with your LoadingState component
  }

  // Redirect authenticated users to appropriate dashboard
  if (isAuthenticated && user) {
    const redirectPath = user.role === "admin" ? "/admin" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default PublicRoute;
