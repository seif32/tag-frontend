import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatCurrency";

function OrderSummary({ discount, delivery, tax, total }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-3 py-6 bg-white border rounded-xl">
        <h2 className="font-semibold">Coupon Code</h2>
        <div className="border border-gray-100"></div>
        <Input />
        <Button variant={"outline"}>Apply Your Coupon</Button>
      </div>

      <div className="flex flex-col gap-4 p-3 py-6 bg-white border rounded-xl">
        <h2 className="font-semibold">Order Summary</h2>
        <div className="border border-gray-100"></div>
        <div className="flex flex-col">
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
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-3 py-6 bg-white border rounded-xl">
        <h2 className="font-semibold">Actions</h2>

        <div className="border border-gray-100"></div>

        <div className="flex gap-2">
          <Button variant={"outline"} className={"flex-1"}>
            Cancel Order
          </Button>
          <Button className={"flex-2"}>Checkout</Button>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
