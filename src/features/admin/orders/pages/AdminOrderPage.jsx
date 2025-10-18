import IconCard from "@/ui/IconCard";
import { formatDateFull } from "@/utils/dateUtils";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  LucidePackage2,
  Package,
  ShoppingBag,
} from "lucide-react";
import { BsTelephone } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router";
import { GoPerson } from "react-icons/go";
import { MdOutlineMailOutline } from "react-icons/md";
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

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { IoChatbubblesOutline } from "react-icons/io5";
import useOrders from "@/hooks/useOrders";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { formatCurrency } from "@/utils/formatCurrency";
import ShippingAddress from "@/features/order/components/ShippingAddress";
import { useEffect, useState } from "react";

function AdminOrderPage() {
  const { orderId } = useParams();
  const { order, isLoadingOrder, errorOrder, isErrorOrder, refetchOrder } =
    useOrders.useById(orderId);

  if (isLoadingOrder) return <LoadingState type="page" />;

  if (isErrorOrder)
    return (
      <ErrorMessage
        message={errorOrder?.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchOrder()}
      />
    );

  const totalUnits =
    order?.items?.reduce((acc, item) => acc + item?.quantity, 0) +
    order?.bundles?.reduce(
      (acc, bundle) => acc + bundle?.bundle_quantity * bundle?.times_applied,
      0
    );

  return (
    <div className="flex flex-col gap-5 p-6">
      <Title
        orderId={orderId}
        orderDate={order?.created_at}
        currentOrderStatus={order?.order_status}
      />{" "}
      <StatsContainer
        orderStatus={order?.order_status}
        paymentStatus={order?.payment_status}
        totalAmount={order?.total_amount}
        totalUnits={totalUnits}
      />
      <div className="flex gap-5">
        <OrderContents order={order} totalUnits={totalUnits} />
        <OrderInformation user={order?.user} address={order?.address} />
      </div>
    </div>
  );
}

export default AdminOrderPage;
function Title({ orderId, orderDate, currentOrderStatus }) {
  const [orderStatus, setOrderStatus] = useState(currentOrderStatus);
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const navigate = useNavigate();
  const { updateOrder, isPendingOrders } = useOrders.useUpdate();

  useEffect(() => {
    setOrderStatus(currentOrderStatus);
  }, [currentOrderStatus]);

  const handleStatusChange = (newStatus) => {
    setOrderStatus(newStatus);
    setPopoverOpen(false);

    updateOrder(
      { id: orderId, data: { order_status: newStatus } },
      {
        onError: () => {
          setOrderStatus(currentOrderStatus);
        },
        onSuccess: (data) => {
          setOrderStatus(data?.order_status || newStatus);
        },
      }
    );
  };

  return (
    <section className="flex justify-between items-center">
      <div>
        <div className="flex gap-1 items-center">
          <ArrowLeft
            className="hover:text-accent cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-3xl font-bold">Order #{orderId}</h1>
        </div>
        <p className="text-muted-foreground">
          Placed on {formatDateFull(orderDate)}
        </p>
      </div>

      <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button size="sm" className="text-xs">
            Change Order Status
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="left"
          className="w-fit flex flex-col gap-3 p-3"
        >
          <p className="text-sm font-medium mb-2">Select a new status:</p>
          {["pending", "shipped", "delivered", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={orderStatus === status ? "default" : "outline"}
              className="capitalize"
              size="sm"
              onClick={() => handleStatusChange(status)}
              disabled={isPendingOrders} // ✅ Disable during update
            >
              {status}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </section>
  );
}

function StatsContainer({
  orderStatus,
  paymentStatus,
  totalAmount,
  totalUnits,
}) {
  function orderStats(orderStatus, paymentStatus, totalAmount, totalUnits) {
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
        title: formatCurrency(totalAmount),
        subtitle: "Total Amount",
        badge: null,
      },
      {
        icon: ShoppingBag,
        title: `${totalUnits} units`,
        subtitle: "Units",
        badge: null,
      },
    ];
  }

  return (
    <div className="grid grid-cols-4 gap-2 w-full">
      {orderStats(orderStatus, paymentStatus, totalAmount, totalUnits).map(
        (stat, index) => (
          <IconCard key={index} {...stat} />
        )
      )}
    </div>
  );
}

function OrderInformation({ user, address }) {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <CustomerInformation customer={user} />
      <ShippingAddress
        apartmentNumber={address?.apartment_number}
        buildingNumber={address?.building_number}
        city={address?.city_name}
        country={address?.country}
        description={address?.description}
        phoneNumber={user?.phone_number}
        postalCode={address?.postal_code}
        streetAddress={address?.street_name}
      />
      {/* <PaymentShipping /> */}
    </div>
  );
}

function CustomerInformation({ customer }) {
  return (
    <section className="border p-4 rounded-2xl">
      <div className=" flex items-center gap-2 mb-5">
        <GoPerson size={24} />
        <h3 className="font-semibold">Customer Information</h3>
      </div>

      <div className="flex gap-2 items-center  text-sm mb-4">
        <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
        <div>
          <p className="font-medium">
            {customer?.first_name} {customer?.last_name}
          </p>
          <p className="text-muted-foreground">Customer</p>
        </div>
      </div>
      <div className="justify-between items-end flex">
        <div className="space-y-1.5 text-sm">
          <div className="flex gap-2 items-center">
            <MdOutlineMailOutline className="text-gray-400" />
            <p className="">{customer?.email}</p>
          </div>
          <div className="flex gap-2 items-center">
            <BsTelephone className="text-gray-400" />
            <p className="">{formatPhoneNumber(customer?.phone_number)}</p>
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

function OrderContents({ order, totalUnits }) {
  return (
    <div className="flex-2">
      <OrderItems order={order} totalUnits={totalUnits} />
    </div>
  );
}

function OrderItems({ order, totalUnits }) {
  return (
    <section className="border p-4 rounded-2xl">
      <div className="flex gap-1 items-center">
        <LucidePackage2 className="size-5" />
        <h3 className="font-semibold">Order Items</h3>
      </div>
      <ItemsTable
        orderItems={order?.items || []}
        orderBundles={order?.bundles || []}
        orderNumber={order?.id}
        orderShipping={order?.shipping_amount}
        orderSubtotal={order?.subtotal}
        orderTax={order?.tax_amount}
        orderTotal={order?.total_amount}
        orderDiscount={order?.discount_amount}
        totalUnits={totalUnits}
      />
    </section>
  );
}

function ItemsTable({
  orderNumber,
  orderItems = [],
  orderBundles = [],
  orderSubtotal,
  orderTax,
  orderShipping,
  orderTotal,
  orderDiscount,
  totalUnits,
}) {
  return (
    <Table>
      <TableCaption>
        Items in order #{orderNumber} - {totalUnits} unit
        {totalUnits !== 1 ? "s" : ""}
      </TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Product</TableHead>
          <TableHead className="w-[300px]">Category</TableHead>
          <TableHead className="w-[120px]">SKU</TableHead>
          <TableHead className="w-[80px] text-center">Qty</TableHead>
          <TableHead className="w-[100px] text-right">Unit Price</TableHead>
          <TableHead className="w-[100px] text-right">Subtotal</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orderItems.map((item) => (
          <TableRow key={`item-${item.id}`} className="hover:bg-gray-50">
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
                  {item?.product?.variants[0]?.types?.map((type) => (
                    <div
                      key={type?.type_id}
                      className="text-xs text-muted-foreground"
                    >
                      <span>{type?.type_name}: </span>
                      <span>{type?.value?.name}</span>
                    </div>
                  ))}
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
                {item?.product?.variants[0]?.variant_sku || "N/A"}
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
                {formatCurrency(Number(item?.unit_price) * item?.quantity)}
              </span>
            </TableCell>
          </TableRow>
        ))}

        {orderBundles.map((bundle) => {
          return (
            <TableRow
              key={`bundle-${bundle.id}`}
              className="hover:bg-blue-50 bg-blue-50/30"
            >
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded border border-blue-200 flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {bundle?.product?.name}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Bundle
                      </span>
                    </div>
                    {bundle?.product?.variants[0]?.types?.map((type) => (
                      <div
                        key={type?.type_id}
                        className="text-xs text-muted-foreground"
                      >
                        <span>{type?.type_name}: </span>
                        <span>{type?.value?.name}</span>
                      </div>
                    ))}
                    <div className="text-xs text-blue-600 mt-0.5">
                      {bundle.required_quantity} items × {bundle.times_applied}{" "}
                      bundle{bundle.times_applied > 1 ? "s" : ""} ={" "}
                      {bundle.bundle_quantity * bundle.times_applied} total
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
                    {bundle?.product?.category_name || "N/A"}
                  </span>
                  {bundle?.product?.sub_category_name && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                      {bundle?.product?.sub_category_name}
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <span className="font-mono text-xs text-gray-600">
                  {bundle?.product?.variants[0]?.variant_sku || "N/A"}
                </span>
              </TableCell>

              <TableCell className="text-center">
                <span className="font-semibold">
                  {bundle.bundle_quantity * bundle.times_applied}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium text-xs">
                    {formatCurrency(
                      bundle.bundle_subtotal / bundle.required_quantity
                    )}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-xs">
                    {formatCurrency(bundle?.subtotal)}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}

        {/* Empty State */}
        {orderItems.length === 0 && orderBundles.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={6}
              className="h-24 text-center text-muted-foreground"
            >
              No items found in this order.
            </TableCell>
          </TableRow>
        )}

        {/* Totals Section */}
        {(orderItems.length > 0 || orderBundles.length > 0) && (
          <>
            <TableRow className="bg-gray-50 border-t-2">
              <TableCell colSpan={5} className="text-right">
                <div className="flex flex-col gap-1 text-sm">
                  <span>Subtotal:</span>
                  <span>Shipping:</span>
                  <span>Tax:</span>
                  {parseFloat(orderDiscount) > 0 && (
                    <span className="text-red-600">Discount:</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col gap-1 text-sm">
                  <span>{formatCurrency(orderSubtotal)}</span>
                  <span>{formatCurrency(orderShipping)}</span>
                  <span>{formatCurrency(orderTax)}</span>
                  {parseFloat(orderDiscount) > 0 && (
                    <span className="text-red-600">
                      -{formatCurrency(orderDiscount)}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>

            <TableRow className="bg-gray-50 border-t-2">
              <TableCell colSpan={5} className="text-right font-semibold">
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
