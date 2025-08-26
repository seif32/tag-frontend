// import { useAuthStore } from "@/store/authStore";

import { useAuthStore } from "@/auth/store/authStore";
import { Navigate } from "react-router";

function ProtectedAdminRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
