import { useAuthStore } from "@/auth/store/authStore";
import { Navigate } from "react-router";

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated && !user?.emailVerified)
    return <Navigate to={"/check-email"} />;

  if (isAuthenticated && user) {
    const redirectPath = user.role === "admin" ? "/admin" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default PublicRoute;
