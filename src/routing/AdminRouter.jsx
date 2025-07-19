// src/routing/AdminRouter.jsx
import AdminDashboard from "@/features/admin/dashboard/pages/AdminDashboard";
import AdminLayout from "@/layout/AdminLayout";
import { Routes, Route } from "react-router";

// Import admin pages

function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        {/* <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />  */}
      </Route>
    </Routes>
  );
}

export default AdminRouter;
