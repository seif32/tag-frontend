import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminRouter from "./AdminRouter";
import CustomerRouter from "./CustomerRouter";
import LoginPage from "@/auth/pages/LoginPage";
import RegistrationPage from "@/auth/pages/RegistrationPage";
import CheckEmailPage from "@/auth/pages/CheckEmailPage";
import VerificationPage from "@/auth/pages/VerificationPage";
import PublicRoute from "./PublicRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Public routes - redirect away if authenticated */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegistrationPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* 📧 Email verification routes - accessible to all */}
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify" element={<VerificationPage />} />

        {/* 👨‍💼 Admin routes - protected */}
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminRouter />
            </ProtectedAdminRoute>
          }
        />

        {/* 🛒 Customer routes - mixed protection */}
        <Route path="/*" element={<CustomerRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
