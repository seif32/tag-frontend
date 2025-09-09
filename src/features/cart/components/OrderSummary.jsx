import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/formatCurrency";

function OrderSummary({ discount, delivery, tax, total }) {
  const totalPrice = useCartStore((state) => state.totalPrice);
  return (
    <div className="flex flex-col gap-4 p-3 py-6 bg-white border rounded-xl w-full">
      <h2 className="font-semibold">Order Summary</h2>
      <div className="border border-gray-100"></div>
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between text-sm">
          <p className="text-muted-foreground">Subtotal: </p>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <p className="text-muted-foreground">Discount: </p>
          <span>{formatCurrency(discount)}</span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <p className="text-muted-foreground">Delivery: </p>
          <span>{formatCurrency(delivery)}</span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <p className="text-muted-foreground">Tax: </p>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="my-4 border border-gray-100"></div>
        <div className="flex items-baseline justify-between text-sm">
          <p className="text-muted-foreground">Total: </p>
          <span className="text-lg font-semibold">
            {formatCurrency(totalPrice + discount + delivery + tax)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
