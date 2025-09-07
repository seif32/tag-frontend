import { Package } from "lucide-react";
import CartItem from "../components/CartItem";
import OrderControls from "../components/OrderControls";
import { useCartStore } from "@/store/cartStore";

function CartPage() {
  const cartItems = useCartStore((state) => state.cartItems);
  return (
    <div className="flex flex-col gap-2 rounded-md md:flex-row">
      <div className="flex flex-col gap-4 p-3 bg-white border rounded-md flex-2">
        <div>
          <h2 className="text-lg font-semibold ">Shopping Cart</h2>
          <div className="flex items-center gap-1">
            <Package className=" text-muted-foreground" size={16} />
            <p className="text-sm text-muted-foreground">
              {cartItems.length} items
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {cartItems.length === 0 ? (
            <div className="grid place-items-center">No items Placed yet</div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={Number(item.price)}
                quantity={item.quantity}
                variants={item.types.map((t) => t.value.name)}
              />
            ))
          )}
        </div>
      </div>
      <div className="flex-1 ">
        <OrderControls delivery={45} discount={32} tax={0} total={1500} />
      </div>
    </div>
  );
}

export default CartPage;
