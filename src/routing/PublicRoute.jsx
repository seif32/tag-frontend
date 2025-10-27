import { useAuthStore } from "@/auth/store/authStore";
import LoadingState from "@/ui/LoadingState";
import { Navigate } from "react-router";

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <LoadingState type="page" />;
  }

  // if (isAuthenticated && !user?.emailVerified)
  //   return <Navigate to={"/check-email"} />;

  if (isAuthenticated && user) {
    const redirectPath = user.role === "admin" ? "/admin/products" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default PublicRoute;
