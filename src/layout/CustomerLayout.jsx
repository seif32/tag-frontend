// src/ui/layouts/Layout.jsx (your current layout - just moved)
import { Outlet, useLocation } from "react-router";
import Footer from "@/ui/Footer";
import Header from "@/ui/Header";

function CustomerLayout() {
  const location = useLocation();
  const isProductsPage = location.pathname.startsWith("/products");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className={`flex-1 py-8 ${
          !isProductsPage ? "container px-8 mx-auto" : ""
        }`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default CustomerLayout;
