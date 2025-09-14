import { useAuthStore } from "@/auth/store/authStore";
import { Navigate } from "react-router";

function ProtectedRoute({ children }) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
