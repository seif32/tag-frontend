import { Outlet, useLocation } from "react-router";
import Footer from "@/ui/Footer";
import Header from "@/ui/Header";
import ProgressSteps from "@/features/cart/components/ProgressSteps";

function CustomerLayout() {
  const location = useLocation();
  const isProductsPage = location.pathname.startsWith("/productsss");

  const isCartFlow =
    ["/cart", "/checkout"].some((path) => location.pathname.includes(path)) ||
    location.pathname.includes("/success");

  const getCurrentStep = () => {
    if (location.pathname === "/cart") return 1;
    if (location.pathname.includes("/checkout")) return 2;
    if (location.pathname.includes("/success")) return 3;
    return 1;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {isCartFlow && <ProgressSteps currentStep={getCurrentStep()} />}

      <main
        className={`flex-1 py-8 ${
          !isProductsPage ? "container px-8 mx-auto" : ""
        }`}
      >
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default CustomerLayout;
