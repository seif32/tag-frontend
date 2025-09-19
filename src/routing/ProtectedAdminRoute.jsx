import { useAuthStore } from "@/auth/store/authStore";
import { Navigate } from "react-router";

function ProtectedAdminRoute({ children }) {
  // const { isAuthenticated, user } = useAuthStore((state) => ({
  //   isAuthenticated: state.isAuthenticated,
  //   user: state.user,
  // }));

  // // Check if user is logged in
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  // // Check if email is verified first
  // if (user && !user.emailVerified) {
  //   return <Navigate to="/check-email" replace />;
  // }

  // // Check if user is admin
  // if (user && user.role !== "admin") {
  //   return <Navigate to="/" replace />; // Redirect to customer area
  // }

  return children;
}

export default ProtectedAdminRoute;
