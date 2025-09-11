import { Button } from "@/components/ui/button";
import EmptyCart from "../assets/illustrations/empty-cart.svg";
import { Link } from "react-router";

function EmptyState() {
  return (
    <section className="flex flex-col items-center gap-4">
      <div>
        <img src={EmptyCart} alt="empty-cart-img" />
      </div>
      <div className="text-center ">
        <h2 className="text-xl">No Orders Created Yet</h2>
        <p className="text-muted-foreground text-sm">
          Start putting in the cart by browsing our products
        </p>
      </div>
      <Link to={"/products"}>
        <Button>Browse Products</Button>
      </Link>
    </section>
  );
}

export default EmptyState;
