import { Button } from "@/components/ui/button";
import EmptyCart from "../assets/illustrations/empty-cart.svg";
import { Link } from "react-router";

function EmptyState({ title, subtitle, btn, goTo, showBtn = true }) {
  return (
    <section className="flex flex-col items-center gap-4">
      <div>
        <img src={EmptyCart} alt="empty-cart-img" />
      </div>
      <div className="text-center ">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm">{subtitle} </p>
      </div>
      {showBtn && (
        <Link to={goTo}>
          <Button>{btn}</Button>
        </Link>
      )}
    </section>
  );
}

export default EmptyState;
