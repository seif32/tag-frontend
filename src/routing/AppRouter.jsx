import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminRouter from "./AdminRouter";
import CustomerRouter from "./CustomerRouter";
import LoginPage from "@/auth/pages/LoginPage";
import RegistrationPage from "@/auth/pages/RegistrationPage";
import CheckEmailPage from "@/auth/pages/CheckEmailPage";
import VerificationPage from "@/auth/pages/VerificationPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify" element={<VerificationPage />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminRouter />
            </ProtectedAdminRoute>
          }
        />

        <Route path="/*" element={<CustomerRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
