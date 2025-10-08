import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { formatDateShort } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatCurrency";

export default function OrderReceipt({ order, isOrderDetails = true, style }) {
  // payment_status ENUM('pending', 'failed', 'paid', 'refunded') DEFAULT 'pending',

  function getPaymentStatus(status) {
    switch (status) {
      case "paid":
        return {
          text: "Payment Success",
          style: "border-green-500  text-green-600 bg-green-100",
        };
      case "paid":
        return {
          text: "Payment Fail",
          style: "border-red-500  text-red-600 bg-red-100",
        };
      case "paid":
        return {
          text: "Payment Pending",
          style: "border-amber-500  text-amber-600 bg-amber-100",
        };
      default:
        return {
          text: "Payment Unknown",
          style: "border-gray-500  text-gray-600 bg-gray-100",
        };
    }
  }
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
        <div className="flex justify-between w-full">
          <p className=" text-primary/70"></p>
          <span
            className={`px-2 py-1 border text-xs rounded-sm ${
              getPaymentStatus(order?.payment_status).style
            }`}
          >
            {getPaymentStatus(order?.payment_status).text}
          </span>
        </div>
      </div>
      <div className="my-4 border border-dashed"></div>
      <div className="flex justify-end w-full gap-14 ">
        <div className="flex flex-col gap-1 text-sm">
          <h4>Subtotal</h4>
          <h4>Delivery</h4>
          <h4>Taxes VAT</h4>
          <h4 className="text-amber-700">Discount</h4>
          <h4 className="font-semibold text-md">Total</h4>
        </div>
        <div className="flex flex-col gap-1 text-sm text-right">
          <p>{formatCurrency(order.subtotal)}</p>
          <p>{formatCurrency(order.shipping_amount)}</p>
          <p>{formatCurrency(order.tax_amount)}</p>
          <p className="text-amber-700">
            -{formatCurrency(order.discount_amount)}
          </p>
          <p className="font-semibold text-md">
            {formatCurrency(order.total_amount)}
          </p>
        </div>
      </div>
    </div>
  );
}
