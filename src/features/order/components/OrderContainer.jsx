import { formatCurrency } from "@/utils/formatCurrency";
import { Package } from "lucide-react";

const { useCartStore } = require("@/store/cartStore");

export default function OrderContainer() {
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <div className="w-full max-w-200 ">
      <div className="mb-4">
        <h2 className="text-xl leading-none">Products</h2>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Package size={16} />
          <p>{cartItems.length} items</p>
        </div>
      </div>
      {cartItems.map((item) => (
        <OrderItem
          key={item.id}
          name={item.name}
          quantity={item.quantity}
          totalPrice={item.price * item.quantity}
          unitPrice={item.price}
          variants={item.types.map((variant) => variant.value.name)}
        />
      ))}
    </div>
  );
}

function OrderItem({ name, quantity, totalPrice, unitPrice, variants = [] }) {
  return (
    <>
      <div className="flex flex-col ">
        <div className="flex items-baseline justify-between">
          <p className="font-bold">{name}</p>
          <p className="text-sm text-muted-foreground">
            <span className="text-xs">{quantity}x </span>
            {formatCurrency(unitPrice)}
          </p>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex gap-1">
            {variants.map((variant, index) => (
              <span key={index} className="text-sm text-gray-400">
                {variant} {index < variants.length - 1 && <span>•</span>}
              </span>
            ))}
          </div>
          <p>{formatCurrency(totalPrice)}</p>
        </div>
      </div>
      <div className="my-4 border border-gray-200 border-dashed"></div>
    </>
  );
}
