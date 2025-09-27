import { ROUTES } from "@/constants";
import AdminBrandsPage from "@/features/admin/brands/pages/AdminBrandsPage";
import AdminBundlesPage from "@/features/admin/bundles/pages/AdminBundlesPage";
import AdminAddCategoryPage from "@/features/admin/categories/pages/AdminAddCategoryPage";
import AdminCategoriesPage from "@/features/admin/categories/pages/AdminCategoriesPage";
import AdminDashboardPage from "@/features/admin/dashboard/pages/AdminDashboardPage";
import AdminOrderPage from "@/features/admin/orders/pages/AdminOrderPage";
import AdminOrdersPage from "@/features/admin/orders/pages/AdminOrdersPage";
import AdminProductPage from "@/features/admin/products/pages/AdminProductPage";
import AdminProductsPage from "@/features/admin/products/pages/AdminProductsPage";
import AdminPromoCodesPage from "@/features/admin/promo-code/pages/AdminPromoCodesPage";
import AdminShippingPage from "@/features/admin/shipping/pages/AdminShippingPage";
import AdminTagsPage from "@/features/admin/tags/pages/AdminTagsPage";
import AdminVariantsTypesPage from "@/features/admin/variants/pages/AdminVariantsTypesPage";
import AdminVariantsValuesPage from "@/features/admin/variants/pages/AdminVariantsValuesPage";
import AdminLayout from "@/layout/AdminLayout";
import TestPromoPage from "@/ui/TestPromoPage";
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

        <Route path={"variants"} element={<AdminVariantsTypesPage />} />
        <Route
          path={"variants/values/:typeId"}
          element={<AdminVariantsValuesPage />}
        />

        <Route path={"orders"} element={<AdminOrdersPage />} />
        <Route path={"orders/:orderId"} element={<AdminOrderPage />} />

        <Route path={"shipping"} element={<AdminShippingPage />} />

        <Route path={"promo-codes"} element={<AdminPromoCodesPage />} />
        <Route path={"bundles"} element={<AdminBundlesPage />} />
      </Route>
    </Routes>
  );
}

export default AdminRouter;
