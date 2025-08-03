// src/routing/AdminRouter.jsx
import { ROUTES } from "@/constants";
import AdminAddCategoryPage from "@/features/admin/categories/pages/AdminAddCategoryPage";
import AdminCategoriesPage from "@/features/admin/categories/pages/AdminCategoriesPage";
import AdminDashboardPage from "@/features/admin/dashboard/pages/AdminDashboardPage";
import AdminAddProductPage from "@/features/admin/products/pages/AdminAddProductPage";
import AdminLayout from "@/layout/AdminLayout";
import { Routes, Route } from "react-router";

// Import admin pages

function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route
          path={ROUTES.ADMIN.ADD_PRODUCT}
          element={<AdminAddProductPage />}
        />
        <Route
          path={ROUTES.ADMIN.CATEGORIES}
          element={<AdminCategoriesPage />}
        />
        <Route
          path={ROUTES.ADMIN.ADD_CATEGORY}
          element={<AdminAddCategoryPage />}
        />
        {/* <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />  */}
      </Route>
    </Routes>
  );
}

export default AdminRouter;
