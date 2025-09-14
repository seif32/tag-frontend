import { Package } from "lucide-react";
import { BsTrash3 } from "react-icons/bs";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import EmptyState from "@/ui/EmptyState";
import OrderCoupon from "../components/OrderCoupon";
import OrderSummary from "../components/OrderSummary";

function CartPage() {
  const cartItems = useCartStore((state) => state.cartItems);
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="flex flex-col gap-2 rounded-md md:flex-row">
      <div
        className={`flex flex-col gap-4 p-5 bg-white border rounded-md flex-2 ${
          isCartEmpty && "py-32"
        }`}
      >
        {!isCartEmpty && (
          <div>
            <h2 className="text-lg font-semibold "> Cart</h2>
            <div className="flex items-center gap-1">
              <Package className=" text-muted-foreground" size={16} />
              <p className="text-sm text-muted-foreground">
                {cartItems.length} items
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {isCartEmpty ? (
            <EmptyState
              title={"Ready to place your first order?"}
              subtitle={"Discover amazing products and start shopping today!"}
              goTo={"/products"}
              btn={"Browse products"}
            />
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
      {!isCartEmpty && (
        <div className="flex-1 ">
          <OrderControls />
        </div>
      )}
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
              <span key={index} className="text-xs text-gray-400">
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

          <span className="text-sm font-base">{quantity}</span>
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

function OrderControls() {
  return (
    <div className="flex flex-col gap-4">
      <OrderCoupon />
      <OrderSummary />
      <OrderActions />
    </div>
  );
}

function OrderActions() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 p-3 py-6 bg-white border rounded-xl">
      <h2 className="font-semibold">Actions</h2>

      <div className="border border-gray-100"></div>

      <div className="flex gap-2">
        <Button variant={"outline"} className={"flex-1"}>
          Cancel Order
        </Button>
        <Button className={"flex-2"} onClick={() => navigate("/checkout")}>
          Checkout
        </Button>
      </div>
    </div>
  );
}
