import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { formatDateShort } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatCurrency";

export default function OrderReceipt({ order, isOrderDetails = true, style }) {
  return (
    <div
      className={`flex flex-col w-full px-4 py-3 bg-white border border-gray-100 ${style}`}
    >
      {isOrderDetails && <h3 className="mb-2.5 text-xl">Order Details</h3>}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between w-full ">
          <p className=" text-primary/70">Order number:</p>
          <p className="">#{order.id}</p>
        </div>
        <div className="flex justify-between w-full">
          <p className=" text-primary/70">Date:</p>
          <p className="">{formatDateShort(order.created_at)}</p>
        </div>
        <div className="flex justify-between w-full">
          <p className=" text-primary/70">Payment Method:</p>
          <p className="">Credit Card</p>
        </div>
      </div>
      <div className="my-4 border border-dashed"></div>
      <div className="flex justify-end w-full gap-14 ">
        <div className="flex flex-col gap-1 text-sm">
          <h4>Subtotal</h4>
          <h4>Delivery</h4>
          <h4>Taxes VAT</h4>
          <h4>Discount</h4>
          <h4 className="font-semibold text-md">Total</h4>
        </div>
        <div className="flex flex-col gap-1 text-sm text-right">
          <p>{formatCurrency(order.subtotal)}</p>
          <p>{formatCurrency(order.shipping_amount)}</p>
          <p>{formatCurrency(order.tax_amount)}</p>
          <p>-{formatCurrency(order.discount_amount)}</p>
          <p className="font-semibold text-md">
            {formatCurrency(order.total_amount)}
          </p>
        </div>
      </div>
    </div>
  );
}
