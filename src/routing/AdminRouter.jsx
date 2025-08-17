import { ROUTES } from "@/constants";
import AdminAddCategoryPage from "@/features/admin/categories/pages/AdminAddCategoryPage";
import AdminCategoriesPage from "@/features/admin/categories/pages/AdminCategoriesPage";
import AdminDashboardPage from "@/features/admin/dashboard/pages/AdminDashboardPage";
import AdminProductPage from "@/features/admin/products/pages/AdminProductPage";
import AdminProductsPage from "@/features/admin/products/pages/AdminProductsPage";
import AdminLayout from "@/layout/AdminLayout";
import { Routes, Route } from "react-router";

function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route
          path={ROUTES.ADMIN.CATEGORIES}
          element={<AdminCategoriesPage />}
        />
        <Route
          path={ROUTES.ADMIN.ADD_CATEGORY}
          element={<AdminAddCategoryPage />}
        />
        <Route path={ROUTES.ADMIN.PRODUCTS} element={<AdminProductsPage />} />
        <Route
          path={ROUTES.ADMIN.ADD_PRODUCT}
          element={<AdminProductPage mode="add" />}
        />
        <Route
          path={ROUTES.ADMIN.EDIT_PRODUCT}
          element={<AdminProductPage mode="edit" />}
        />
        <Route
          path={ROUTES.ADMIN.VIEW_PRODUCT}
          element={<AdminProductPage mode="view" />}
        />
      </Route>
    </Routes>
  );
}

export default AdminRouter;
