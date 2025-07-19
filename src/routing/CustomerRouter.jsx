import { Routes, Route } from "react-router";

// Import your public pages
import HomePage from "@/features/home/pages/HomePage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import ProductDetailPage from "@/features/products/pages/ProductDetailPage";
import CartPage from "@/features/cart/pages/CartPage";
import CustomerLayout from "@/layout/CustomerLayout";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";

function CustomerRouter() {
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        {/* <Route path="checkout" element={<CheckoutPage />} /> */}
        {/* Add more public routes */}
      </Route>
    </Routes>
  );
}

export default CustomerRouter;
