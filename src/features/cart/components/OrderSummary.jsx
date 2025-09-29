import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/formatCurrency";

function OrderSummary() {
  const subtotal = useCartStore((state) => state.subtotal);
  const discountAmount = useCartStore((state) => state.discountAmount);
  const shippingAmount = useCartStore((state) => state.shippingAmount);
  const finalTotal = useCartStore((state) => state.finalTotal);
  const totalVat = useCartStore((state) => state.totalVat);

  return (
    <div className="flex flex-col gap-4 p-3 py-6 bg-white border rounded-xl w-full">
      <h2 className="font-semibold">Order Summary</h2>
      <div className="border border-gray-100"></div>
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between text-sm">
          <p className="text-muted-foreground">Subtotal: </p>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <p className="text-muted-foreground">Shipping: </p>
          <span>{formatCurrency(shippingAmount)}</span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <p className="text-muted-foreground">Tax: </p>
          <span>{formatCurrency(totalVat)}</span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <p className="text-muted-foreground">Discount: </p>
          <span>-{formatCurrency(discountAmount)}</span>
        </div>
        <div className="my-4 border border-gray-100"></div>
        <div className="flex items-baseline justify-between text-sm">
          <p className="text-muted-foreground">Total: </p>
          <span className="text-lg font-semibold">
            {formatCurrency(finalTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
