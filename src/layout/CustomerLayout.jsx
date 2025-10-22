import { Outlet, useLocation } from "react-router";
import Header from "@/ui/Header";
import ProgressSteps from "@/features/cart/components/ProgressSteps";
import { useEffect, useState } from "react";
import AgeVerificationModal from "@/ui/AgeVerificationModal";
import Footer from "@/ui/Footer";

function CustomerLayout() {
  const location = useLocation();

  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const verified = localStorage.getItem("isAgeVerified");
    if (verified === "true") {
      setIsAgeVerified(true);
    }
    setIsInitializing(false);
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("isAgeVerified", "true");
    setIsAgeVerified(true);
  };

  const isCartFlow = ["/cart", "/checkout"].some((path) =>
    location.pathname.includes(path)
  );

  const getCurrentStep = () => {
    if (location.pathname === "/cart") return 1;
    if (location.pathname.includes("/checkout")) return 2;
    if (location.pathname.includes("/success")) return 3;
    return 1;
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <Header />

      {isCartFlow && <ProgressSteps currentStep={getCurrentStep()} />}

      <main className={` flex-1 py-8 container px-8 mx-auto `}>
        <Outlet />
      </main>
      {!isInitializing && !isAgeVerified && (
        <AgeVerificationModal onConfirm={handleConfirm} />
      )}

      <Footer />
    </div>
  );
}

export default CustomerLayout;
