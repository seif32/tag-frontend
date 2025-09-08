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

        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order/success/:orderId" element={<OrderSuccessPage />} />

        <Route path="orders" element={<OrdersHistoryPage />} />
      </Route>
    </Routes>
  );
}

export default CustomerRouter;
