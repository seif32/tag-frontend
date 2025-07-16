import { BrowserRouter, Routes, Route } from "react-router";
import { ROUTES } from "@/constants";
import Layout from "@/ui/Layout";
import HomePage from "@/features/home/pages/HomePage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import ProductDetailPage from "@/features/products/pages/ProductDetailPage";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import CartPage from "@/features/cart/pages/CartPage";
import ProfilePage from "@/features/user/pages/ProfilePage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
          <Route
            path={`${ROUTES.PRODUCTS}/:id`}
            element={<ProductDetailPage />}
          />
          <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
          <Route
            path={`${ROUTES.CATEGORIES}/:id`}
            element={<CategoriesPage />}
          />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
