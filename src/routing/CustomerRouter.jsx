import { Routes, Route } from "react-router";
import HomePage from "@/features/home/pages/HomePage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import ProductDetailPage from "@/features/products/pages/ProductDetailPage";
import CartPage from "@/features/cart/pages/CartPage";
import CustomerLayout from "@/layout/CustomerLayout";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import CheckoutPage from "@/features/cart/pages/CheckoutPage";
import OrderSuccessPage from "@/features/cart/pages/OrderSuccessPage";
import OrdersHistoryPage from "@/features/order/pages/OrdersHistoryPage";
import OrderDetailsPage from "@/features/order/pages/OrderDetailsPage";
import ProtectedRoute from "./ProtectedRoute";
import ChatPage from "@/features/chat/pages/ChatPage";
import OrderFailPage from "@/features/cart/pages/OrderFailPage";

function CustomerRouter() {
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route
          path="categories/:categoryId/products"
          element={<ProductsPage />}
        />
        <Route
          path="categories/:categoryId/subcategories/:subcategoryId/products"
          element={<ProductsPage />}
        />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:categoryId" element={<CategoriesPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="order/success/:orderId"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="order/fail/:orderId"
          element={
            <ProtectedRoute>
              <OrderFailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrdersHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default CustomerRouter;
