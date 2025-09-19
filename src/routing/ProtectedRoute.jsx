import { useAuthStore } from "@/auth/store/authStore";
import { Navigate } from "react-router";

function ProtectedRoute({ children, requireVerified = true }) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // if (requireVerified && user && !user.emailVerified) {
  //   return <Navigate to="/check-email" replace />;
  // }

  return children;
}

export default ProtectedRoute;
