import { Package } from "lucide-react";
import OrderControls from "../components/OrderControls";
import { useCartStore } from "@/store/cartStore";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import { BsTrash3 } from "react-icons/bs";
import EmptyState from "@/ui/EmptyState";

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
            <EmptyState />
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={Number(item.price)}
                quantity={item.quantity}
                variants={item.types.map((t) => t.value.name)}
                stock={item.stock}
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

function CartItem({ id, name, variants = [], quantity, price, stock }) {
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex flex-col justify-between gap-5 p-3 border rounded-md md:flex-row">
      <div className="flex gap-2 ">
        <div className="w-16 h-16 bg-gray-100 rounded-md ">
          <img />
        </div>
        <div>
          <h3 className="font-semibold max-w-[24ch]">{name} </h3>
          <div className="flex items-center gap-1 gap-y-0 max-w-[24ch] flex-wrap ">
            {variants.map((variant, index) => (
              <span key={index} className="text-sm text-gray-400">
                {variant} {index < variants.length - 1 && <span>•</span>}
              </span>
            ))}
          </div>
          <span className="text-xs ">
            unit price: <span>{formatCurrency(price)}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-1 justify-evenly ">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-primary"
            onClick={() => decrement(id)}
          >
            -
          </Button>

          <span className="text-sm font-semibold">{quantity}</span>
          <Button
            size="sm"
            className="bg-primary"
            onClick={() => increment(id)}
            // disabled={quantity >= stock}
          >
            +
          </Button>
        </div>

        <p className="self-center font-semibold">
          <p>{formatCurrency(quantity * price)}</p>
        </p>
      </div>
      <BsTrash3
        className="self-end text-gray-500 cursor-pointer md:self-center hover:text-red-500"
        onClick={() => removeItem(id)}
      />
    </div>
  );
}
