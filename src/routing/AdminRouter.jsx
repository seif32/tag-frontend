import { ROUTES } from "@/constants";
import AdminBrandsPage from "@/features/admin/brands/pages/AdminBrandsPage";
import AdminAddCategoryPage from "@/features/admin/categories/pages/AdminAddCategoryPage";
import AdminCategoriesPage from "@/features/admin/categories/pages/AdminCategoriesPage";
import AdminDashboardPage from "@/features/admin/dashboard/pages/AdminDashboardPage";
import AdminOrderPage from "@/features/admin/orders/pages/AdminOrderPage";
import AdminOrdersPage from "@/features/admin/orders/pages/AdminOrdersPage";
import AdminProductPage from "@/features/admin/products/pages/AdminProductPage";
import AdminProductsPage from "@/features/admin/products/pages/AdminProductsPage";
import AdminTagsPage from "@/features/admin/tags/pages/AdminTagsPage";
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
        <Route path={ROUTES.ADMIN.BRANDS} element={<AdminBrandsPage />} />
        <Route path={ROUTES.ADMIN.TAGS} element={<AdminTagsPage />} />

        <Route path={"orders"} element={<AdminOrdersPage />} />
        <Route path={"orders/:orderId"} element={<AdminOrderPage />} />
      </Route>
    </Routes>
  );
}

export default AdminRouter;
