import { Button } from "@/components/ui/button";
import EmptyCart from "../assets/illustrations/empty-cart.svg";
import { Link } from "react-router";

function EmptyState({ title, subtitle, btn, goTo }) {
  return (
    <section className="flex flex-col items-center gap-4">
      <div>
        <img src={EmptyCart} alt="empty-cart-img" />
      </div>
      <div className="text-center ">
        <h2 className="text-xl">{title}</h2>
        <p className="text-muted-foreground text-sm">{subtitle} </p>
      </div>
      <Link to={goTo}>
        <Button>{btn}</Button>
      </Link>
    </section>
  );
}

export default EmptyState;
