import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { Package } from "lucide-react";
import { PiPackageThin } from "react-icons/pi";

export default function OrderContainer() {
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <div className="w-full ">
      <div className="mb-6">
        <h2 className="text-xl ">Products</h2>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <PiPackageThin size={16} />
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
      <div className="flex  items-center gap-2">
        <div className="w-15 h-15 bg-gray-100 rounded-md">
          <img src="" alt="" />
        </div>
        <div className="flex flex-col flex-1">
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
      </div>
      <div className="my-4 border border-gray-200 border-dashed"></div>
    </>
  );
}
