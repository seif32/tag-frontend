import IconCard from "@/ui/IconCard";
import { formatDateFull } from "@/utils/dateUtils";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import {
  CreditCard,
  DollarSign,
  LucidePackage2,
  LucidePackageX,
  Package,
  ShoppingBag,
} from "lucide-react";
import { BsTelephone } from "react-icons/bs";
import { Link, useParams } from "react-router";
import { GoPerson } from "react-icons/go";
import { MdOutlineMailOutline } from "react-icons/md";
import { HiOutlineMapPin } from "react-icons/hi2";
import { CiCreditCard1 } from "react-icons/ci";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { IoChatbubblesOutline } from "react-icons/io5";
import useOrders from "@/hooks/useOrders";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { formatCurrency } from "@/utils/formatCurrency";

const address = {
  street_address: "Flat 14B, 25 Baker Street",
  country: "United Kingdom",
  city: "London",
  postal_code: "W1U 8AN",
  phone_number: "+44 7911 123456",
};

function AdminOrderPage() {
  const { orderId } = useParams();
  const { order, isLoadingOrder, errorOrder, isErrorOrder, refetchOrder } =
    useOrders.useById(orderId);

  if (isLoadingOrder) return <LoadingState type="page" />;

  if (isErrorOrder)
    return (
      <ErrorMessage
        message={errorOrder.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchOrder()}
      />
    );

  return (
    <div className="flex flex-col gap-5">
      <Title orderId={orderId} orderDate={order?.created_at} />
      <StatsContainer
        orderStatus={order?.order_status}
        paymentStatus={order?.payment_status}
        totalAmount={order?.total_amount}
        totalItems={order?.items?.length}
      />
      <div className="flex gap-5">
        <OrderContents order={order} />
        <OrderInformation />
      </div>
    </div>
  );
}

export default AdminOrderPage;

function Title({ orderId, orderDate }) {
  return (
    <section className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl">Order #{orderId} </h1>
        <p className="text-muted-foreground">
          Placed on {formatDateFull(orderDate)}
        </p>
      </div>
      <div className="flex gap-2 ">
        <Button size={"sm"} variant={"outline"} className={"text-xs"}>
          Add Tracking Number
        </Button>
        <Button size={"sm"} className={"text-xs"}>
          Change Order Status
        </Button>
      </div>
    </section>
  );
}

function StatsContainer({
  orderStatus,
  paymentStatus,
  totalAmount,
  totalItems,
}) {
  function orderStats(orderStatus, paymentStatus, totalAmount, totalItems) {
    return [
      {
        icon: Package,
        title: "Order Status",
        badge: orderStatus,
      },
      {
        icon: CreditCard,
        title: "Payment Status",
        badge: paymentStatus,
      },
      {
        icon: DollarSign,
        title: totalAmount,
        subtitle: "Total Amount",
        badge: null,
      },
      {
        icon: ShoppingBag,
        title: `${totalItems} items`,
        subtitle: "Items",
        badge: null,
      },
    ];
  }

  return (
    <div className="grid grid-cols-4 w-full">
      {orderStats(orderStatus, paymentStatus, totalAmount, totalItems).map(
        (stat, index) => (
          <IconCard key={index} {...stat} />
        )
      )}
    </div>
  );
}

function OrderInformation() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <CustomerInformation />
      <ShippingAddress />
      <PaymentShipping />
    </div>
  );
}

function CustomerInformation() {
  return (
    <section className="border p-4 rounded-2xl">
      <div className=" flex items-center gap-2 mb-5">
        <GoPerson size={24} />
        <h3 className="font-semibold">Customer Information</h3>
      </div>

      <div className="flex gap-2 items-center  text-sm mb-4">
        <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
        <div>
          <p className="font-medium">Seif Mohamed</p>
          <p className="text-muted-foreground">Customer</p>
        </div>
      </div>
      <div className="justify-between items-end flex">
        <div className="space-y-1.5 text-sm">
          <div className="flex gap-2 items-center">
            <MdOutlineMailOutline className="text-gray-400" />
            <p className="">seif@gmail.com</p>
          </div>
          <div className="flex gap-2 items-center">
            <BsTelephone className="text-gray-400" />
            <p className="">{formatPhoneNumber(1099727988)}</p>
          </div>
        </div>
        <Link
          className={"flex items-center gap-1 text-accent text-sm"}
          variant={"ghost"}
          size={"sm"}
        >
          <IoChatbubblesOutline className="text-accent" />
          Chat{" "}
        </Link>
      </div>
    </section>
  );
}

function ShippingAddress() {
  return (
    <section className="border p-4 rounded-2xl">
      <div className="flex items-center gap-2 mb-5">
        <HiOutlineMapPin size={24} />
        <h3 className="font-semibold">Shipping Address</h3>
      </div>
      <div className="flex flex-col justify-between  whitespace-nowrap gap-0.5 text-sm">
        <span>{address.street_address}</span>
        <span>
          {address.city}, {address.postal_code}
        </span>
        <span>{address.country}</span>
        <span className="">Phone: {address.phone_number}</span>
      </div>{" "}
    </section>
  );
}

function PaymentShipping() {
  return (
    <section className="border p-4 rounded-2xl">
      <div className="flex items-center gap-2 mb-5">
        <CiCreditCard1 size={24} />
        <h3 className="font-semibold">Payment & Shipping</h3>
      </div>
      <div className="space-y-4 text-sm">
        <div>
          <h4>Payment Method</h4>
          <p className="text-muted-foreground">Credit Card (**** 2845)</p>
        </div>
        <div>
          <h4>Shipping Method</h4>
          <p className="text-muted-foreground">Standard Shipping</p>
        </div>
        <div>
          <h4>Tracking Number</h4>
          <p className="text-muted-foreground">OWISVD986DWA8454</p>
        </div>
      </div>
    </section>
  );
}

function OrderContents({ order }) {
  return (
    <div className="flex-2">
      <OrderItems order={order} />
    </div>
  );
}

function OrderItems({ order }) {
  return (
    <section className="border p-4 rounded-2xl">
      <div className="flex gap-1 items-center">
        <LucidePackage2 className="size-5" />
        <h3 className="font-semibold">Order Items</h3>
      </div>
      <ItemsTable
        orderItems={order?.items || []}
        orderNumber={order?.id}
        orderShipping={order?.shipping_amount}
        orderSubtotal={order?.subtotal}
        orderTax={order?.tax_amount}
        orderTotal={order?.total_amount}
        orderDiscount={order?.discount_amount}
      />
    </section>
  );
}

function ItemsTable({
  orderNumber,
  orderItems,
  orderSubtotal,
  orderTax,
  orderShipping,
  orderTotal,
  orderDiscount,
}) {
  return (
    <Table>
      <TableCaption>
        Items in order #{orderNumber} - {orderItems.length} item
        {orderItems.length !== 1 ? "s" : ""}
      </TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Product</TableHead>
          <TableHead className="w-[300px]">Category</TableHead>
          <TableHead className="w-[120px]">SKU</TableHead>
          <TableHead className="w-[80px] text-center">Qty</TableHead>
          <TableHead className="w-[100px] text-right">Unit Price</TableHead>
          <TableHead className="w-[100px] text-right">Total</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orderItems.length > 0 ? (
          orderItems.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      item?.product?.variants[0].images[0] || "/placeholder.jpg"
                    }
                    alt={item?.product?.name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {item?.product?.name}
                    </span>
                    {/* {item.variant_attributes && (
                      <span className="text-xs text-muted-foreground">
                        {Object.entries(item.variant_attributes)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </span>
                    )} */}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
                    {item?.product?.category_name || "N/A"}
                  </span>
                  {item?.product?.sub_category_name && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                      {item?.product?.sub_category_name}
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <span className="font-mono text-xs text-gray-600">
                  {item?.product?.variants[0]?.sku || "N/A"}
                </span>
              </TableCell>

              <TableCell className="text-center">
                <span className="font-semibold">{item?.quantity}</span>
              </TableCell>

              <TableCell className="text-right">
                <span className="font-medium text-xs">
                  {formatCurrency(item?.unit_price)}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <span className="font-semibold text-xs">
                  {formatCurrency(item?.total_price)}
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              className="h-24 text-center text-muted-foreground"
            >
              No items found in this order.
            </TableCell>
          </TableRow>
        )}

        {orderItems.length > 0 && (
          <>
            <TableRow className="bg-gray-50 border-t-2">
              <TableCell colSpan={5} className="text-right">
                <div className="flex flex-col">
                  <span>Subtotal:</span>
                  <span>Shipping:</span>
                  <span>Tax:</span>
                  <span className="text-red-600">Discount:</span>
                </div>
              </TableCell>
              <TableCell className="text-right flex flex-col">
                <div className="flex flex-col">
                  <span className="">{formatCurrency(orderSubtotal)}</span>
                  <span className="">{formatCurrency(orderShipping)}</span>
                  <span className="">{formatCurrency(orderTax)}</span>
                  <span className="text-red-600">
                    -{formatCurrency(orderDiscount)}
                  </span>
                </div>
              </TableCell>
            </TableRow>

            <TableRow className="bg-gray-50 border-t-2">
              <TableCell colSpan={5} className="text-right font-semibold ">
                Total:
              </TableCell>
              <TableCell className="text-right">
                <span className="font-bold text-lg">
                  {formatCurrency(orderTotal)}
                </span>
              </TableCell>
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
}
