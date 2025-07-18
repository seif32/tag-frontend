import { Outlet, useLocation } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  const location = useLocation();

  const isProductsPage = location.pathname.startsWith("/products");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main
        className={("flex-1 py-8", !isProductsPage && "container px-8 mx-auto")}
      >
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
