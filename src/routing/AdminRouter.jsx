import { ROUTES } from "@/constants";
import AdminBrandsPage from "@/features/admin/brands/pages/AdminBrandsPage";
import AdminBundlesPage from "@/features/admin/bundles/pages/AdminBundlesPage";
import AdminCategoriesPage from "@/features/admin/categories/pages/AdminCategoriesPage";
import AdminChatsLayout from "@/features/admin/chat/components/AdminChatsLayout";
import AdminChatPage from "@/features/admin/chat/pages/AdminChatPage";
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
import EmptyState from "@/ui/EmptyState";
import { Routes, Route } from "react-router";

function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path={"categories"} element={<AdminCategoriesPage />} />
        <Route path={"products"} element={<AdminProductsPage />} />
        <Route
          path={"products/add"}
          element={<AdminProductPage mode="add" />}
        />
        <Route
          path={"products/:id/edit"}
          element={<AdminProductPage mode="edit" />}
        />
        <Route
          path={"products/:id"}
          element={<AdminProductPage mode="view" />}
        />
        <Route path={"brands"} element={<AdminBrandsPage />} />
        <Route path={"tags"} element={<AdminTagsPage />} />

        <Route path={"variants"} element={<AdminVariantsTypesPage />} />
        <Route
          path={"variants/values/:typeId"}
          element={<AdminVariantsValuesPage />}
        />

        <Route path={"orders"} element={<AdminOrdersPage />} />
        <Route path={"orders/:orderId"} element={<AdminOrderPage />} />

        {/*Begin from here ✅✅✅✅ */}
        <Route path={"shipping"} element={<AdminShippingPage />} />

        <Route path={"promo-codes"} element={<AdminPromoCodesPage />} />
        <Route path={"bundles"} element={<AdminBundlesPage />} />

        <Route path={"chat"} element={<AdminChatsLayout />}>
          <Route
            index
            element={
              <EmptyState
                title={"Please select a chat"}
                subtitle={"any of them"}
              />
            }
          />
          <Route path=":chatId" element={<AdminChatPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AdminRouter;
