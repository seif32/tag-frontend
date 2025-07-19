// import { useAuthStore } from "@/store/authStore";

function ProtectedAdminRoute({ children }) {
  // const { user, isAuthenticated } = useAuthStore();

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (user?.role !== "admin") {
  //   return <Navigate to="/" replace />;
  // }

  return children;
}

export default ProtectedAdminRoute;
