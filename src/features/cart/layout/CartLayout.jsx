import { Outlet, useLocation } from "react-router";
import ProgressSteps from "../components/ProgressSteps";

function CartLayout() {
  const location = useLocation();

  const getCurrentStep = () => {
    if (location.pathname === "/cart") return 1;
    if (location.pathname.includes("/checkout")) return 2;
    if (location.pathname.includes("/success")) return 3;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="shopping-layout">
      <ProgressSteps currentStep={currentStep} />

      <Outlet />
    </div>
  );
}

export default CartLayout;
