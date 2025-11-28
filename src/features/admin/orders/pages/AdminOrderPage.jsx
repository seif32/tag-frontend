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
    // 🆕 Responsive padding and gap
    <div className="flex flex-col gap-4 sm:gap-5 p-3 sm:p-4 lg:p-6">
      <Title
        orderId={orderId}
        orderDate={order?.created_at}
        currentOrderStatus={order?.order_status}
      />
      <StatsContainer
        orderStatus={order?.order_status}
        paymentStatus={order?.payment_status}
        totalAmount={order?.total_amount}
        totalUnits={totalUnits}
      />
      {/* 🆕 Responsive layout: stack on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
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
    // 🆕 Responsive title section
    <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 items-center">
          <ArrowLeft
            className="hover:text-accent cursor-pointer flex-shrink-0"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
            Order #{orderId}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Placed on {formatDateFull(orderDate)}
        </p>
      </div>

      <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          {/* 🆕 Full width on mobile */}
          <Button size="sm" className="text-xs w-full sm:w-auto">
            Change Order Status
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          side="bottom"
          className="w-[200px] flex flex-col gap-2 p-3"
        >
          <p className="text-sm font-medium mb-1">Select a new status:</p>
          {["pending", "shipped", "delivered", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={orderStatus === status ? "default" : "outline"}
              className="capitalize"
              size="sm"
              onClick={() => handleStatusChange(status)}
              disabled={isPendingOrders}
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
    // 🆕 Responsive grid: 1 col mobile, 2 tablet, 4 desktop
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full">
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
    // 🆕 Responsive width: full on mobile, 1/3 on desktop
    <div className="flex flex-col gap-4 sm:gap-5 w-full lg:w-1/3 lg:flex-shrink-0">
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
    </div>
  );
}

function CustomerInformation({ customer }) {
  return (
    <section className="border p-3 sm:p-4 rounded-lg sm:rounded-2xl">
      <div className="flex items-center gap-2 mb-4 sm:mb-5">
        <GoPerson size={20} className="sm:w-6 sm:h-6" />
        <h3 className="font-semibold text-sm sm:text-base">
          Customer Information
        </h3>
      </div>

      <div className="flex gap-2 sm:gap-3 items-center text-sm mb-3 sm:mb-4">
        <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
          <GoPerson className="text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">
            {customer?.first_name} {customer?.last_name}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">Customer</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div className="space-y-1.5 text-xs sm:text-sm min-w-0 flex-1">
          <div className="flex gap-2 items-center">
            <MdOutlineMailOutline className="text-gray-400 flex-shrink-0" />
            <p className="truncate">{customer?.email}</p>
          </div>
          <div className="flex gap-2 items-center">
            <BsTelephone className="text-gray-400 flex-shrink-0" />
            <p className="truncate">
              {formatPhoneNumber(customer?.phone_number)}
            </p>
          </div>
        </div>

        <Link
          to={`/admin/chat/${customer?.chat_id}`}
          className="flex items-center gap-1 text-accent text-xs sm:text-sm hover:underline flex-shrink-0"
        >
          <IoChatbubblesOutline className="text-accent" />
          Chat
        </Link>
      </div>
    </section>
  );
}

function OrderContents({ order, totalUnits }) {
  return (
    // 🆕 Responsive width: full on mobile, 2/3 on desktop
    <div className="w-full lg:w-2/3">
      <OrderItems order={order} totalUnits={totalUnits} />
    </div>
  );
}

function OrderItems({ order, totalUnits }) {
  return (
    <section className="border p-3 sm:p-4 rounded-lg sm:rounded-2xl">
      <div className="flex gap-2 items-center mb-3 sm:mb-4">
        <LucidePackage2 className="w-5 h-5" />
        <h3 className="font-semibold text-sm sm:text-base">Order Items</h3>
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
  // 🆕 Mobile card view for small screens
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <MobileItemsView
        orderItems={orderItems}
        orderBundles={orderBundles}
        orderNumber={orderNumber}
        orderSubtotal={orderSubtotal}
        orderTax={orderTax}
        orderShipping={orderShipping}
        orderTotal={orderTotal}
        orderDiscount={orderDiscount}
        totalUnits={totalUnits}
      />
    );
  }

  return (
    // 🆕 Horizontal scroll wrapper for table on tablet
    <div className="overflow-x-auto -mx-3 sm:-mx-4">
      <div className="inline-block min-w-full align-middle">
        <Table>
          <TableCaption className="text-xs sm:text-sm">
            Items in order #{orderNumber} - {totalUnits} unit
            {totalUnits !== 1 ? "s" : ""}
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px] sm:w-[300px]">
                Product
              </TableHead>
              <TableHead className="min-w-[120px] sm:w-[200px]">
                Category
              </TableHead>
              <TableHead className="min-w-[100px] sm:w-[120px]">SKU</TableHead>
              <TableHead className="w-[60px] sm:w-[80px] text-center">
                Qty
              </TableHead>
              <TableHead className="w-[80px] sm:w-[100px] text-right">
                Unit Price
              </TableHead>
              <TableHead className="w-[80px] sm:w-[100px] text-right">
                Subtotal
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Regular Items */}
            {orderItems.map((item) => {
              const variant = item?.product?.variants?.find(
                (v) => v.id === item.variant_id
              );
              const imageUrl =
                variant?.images?.find((img) => img.is_primary === 1)
                  ?.image_url ||
                variant?.images?.[0]?.image_url ||
                null;

              return (
                <TableRow key={`item-${item.id}`} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item?.product?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-xs sm:text-sm truncate">
                          {item?.product?.name}
                        </span>
                        {variant?.types?.map((type) => (
                          <div
                            key={type?.type_id}
                            className="text-[10px] sm:text-xs text-muted-foreground truncate"
                          >
                            <span>{type?.type_name}: </span>
                            <span className="font-medium">
                              {type?.value?.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs bg-slate-100 text-slate-700">
                        {item?.product?.category_name || "N/A"}
                      </span>
                      {item?.product?.sub_category_name && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs bg-blue-50 text-blue-700">
                          {item?.product?.sub_category_name}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-[10px] sm:text-xs text-gray-600">
                      {variant?.variant_sku || "N/A"}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="font-semibold text-xs sm:text-sm">
                      {item?.quantity}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <span className="font-medium text-[10px] sm:text-xs">
                      {formatCurrency(item?.unit_price)}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <span className="font-semibold text-[10px] sm:text-xs">
                      {formatCurrency(
                        Number(item?.unit_price) * item?.quantity
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Bundle Items */}
            {orderBundles.map((bundle) => {
              const variant = bundle?.product?.variants?.find(
                (v) => v.id === bundle.variant_id
              );
              const imageUrl =
                variant?.images?.find((img) => img.is_primary === 1)
                  ?.image_url ||
                variant?.images?.[0]?.image_url ||
                null;

              return (
                <TableRow
                  key={`bundle-${bundle.id}`}
                  className="hover:bg-blue-50 bg-blue-50/30"
                >
                  <TableCell>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded border-2 border-blue-300 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex-shrink-0">
                        {imageUrl ? (
                          <>
                            <img
                              src={imageUrl}
                              alt={bundle?.product?.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                            <div className="absolute inset-0 bg-blue-500/20" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                          </div>
                        )}

                        <div className="absolute top-0.5 right-0.5 bg-green-600 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                          B
                        </div>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          <span className="font-medium text-xs sm:text-sm truncate">
                            {bundle?.product?.name}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800 flex-shrink-0">
                            Bundle
                          </span>
                        </div>
                        {variant?.types?.map((type) => (
                          <div
                            key={type?.type_id}
                            className="text-[10px] sm:text-xs text-muted-foreground truncate"
                          >
                            <span>{type?.type_name}: </span>
                            <span className="font-medium">
                              {type?.value?.name}
                            </span>
                          </div>
                        ))}
                        <div className="text-[10px] sm:text-xs text-blue-600 font-medium mt-0.5">
                          {bundle.required_quantity} items ×{" "}
                          {bundle.times_applied} bundle
                          {bundle.times_applied > 1 ? "s" : ""} ={" "}
                          <span className="font-semibold">
                            {bundle.bundle_quantity * bundle.times_applied}{" "}
                            total
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs bg-slate-100 text-slate-700">
                        {bundle?.product?.category_name || "N/A"}
                      </span>
                      {bundle?.product?.sub_category_name && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs bg-blue-50 text-blue-700">
                          {bundle?.product?.sub_category_name}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-[10px] sm:text-xs text-gray-600">
                      {variant?.variant_sku || "N/A"}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="font-semibold text-xs sm:text-sm">
                      {bundle.bundle_quantity * bundle.times_applied}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-medium text-[10px] sm:text-xs">
                        {formatCurrency(
                          bundle.bundle_subtotal / bundle.required_quantity
                        )}
                      </span>
                      <span className="text-[8px] sm:text-[10px] text-muted-foreground">
                        per item
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <span className="font-semibold text-[10px] sm:text-xs">
                      {formatCurrency(bundle?.subtotal)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Empty State */}
            {orderItems.length === 0 && orderBundles.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground text-xs sm:text-sm"
                >
                  No items found in this order.
                </TableCell>
              </TableRow>
            )}

            {/* Totals Section */}
            {(orderItems.length > 0 || orderBundles.length > 0) && (
              <>
                <TableRow className="bg-gray-50 border-t-2">
                  <TableCell
                    colSpan={5}
                    className="text-right text-xs sm:text-sm"
                  >
                    <div className="flex flex-col gap-1">
                      <span>Subtotal:</span>
                      <span>Shipping:</span>
                      <span>Tax:</span>
                      {parseFloat(orderDiscount) > 0 && (
                        <span className="text-red-600">Discount:</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">
                    <div className="flex flex-col gap-1">
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
                  <TableCell
                    colSpan={5}
                    className="text-right font-semibold text-sm sm:text-base"
                  >
                    Total:
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold text-base sm:text-lg">
                      {formatCurrency(orderTotal)}
                    </span>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// 🆕 Mobile Card View Component
function MobileItemsView({
  orderItems,
  orderBundles,
  orderNumber,
  orderSubtotal,
  orderTax,
  orderShipping,
  orderTotal,
  orderDiscount,
  totalUnits,
}) {
  const allItems = [...orderItems, ...orderBundles];

  return (
    <div className="space-y-3">
      <p className="text-xs text-center text-muted-foreground mb-3">
        Items in order #{orderNumber} - {totalUnits} unit
        {totalUnits !== 1 ? "s" : ""}
      </p>

      {/* Items as Cards */}
      {allItems.map((item) => {
        const isBundle = item.hasOwnProperty("bundle_quantity");
        const variant = item?.product?.variants?.find(
          (v) => v.id === item.variant_id
        );
        const imageUrl =
          variant?.images?.find((img) => img.is_primary === 1)?.image_url ||
          variant?.images?.[0]?.image_url ||
          null;

        const quantity = isBundle
          ? item.bundle_quantity * item.times_applied
          : item.quantity;
        const unitPrice = isBundle
          ? item.bundle_subtotal / item.required_quantity
          : item.unit_price;
        const subtotal = isBundle
          ? item.subtotal
          : item.unit_price * item.quantity;

        return (
          <div
            key={isBundle ? `bundle-${item.id}` : `item-${item.id}`}
            className={`border rounded-lg p-3 ${
              isBundle ? "bg-blue-50/30 border-blue-200" : "bg-white"
            }`}
          >
            {/* Product Info */}
            <div className="flex gap-3 mb-3">
              <div
                className={`w-16 h-16 rounded border overflow-hidden flex-shrink-0 ${
                  isBundle
                    ? "border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={item?.product?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                    {isBundle && (
                      <div className="absolute inset-0 bg-blue-500/20" />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package
                      className={`w-8 h-8 ${
                        isBundle ? "text-blue-400" : "text-gray-300"
                      }`}
                    />
                  </div>
                )}
                {isBundle && (
                  <div className="absolute top-1 right-1 bg-green-600 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                    B
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <h4 className="font-medium text-sm flex-1 min-w-0">
                    {item?.product?.name}
                  </h4>
                  {isBundle && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800 flex-shrink-0">
                      Bundle
                    </span>
                  )}
                </div>

                {/* Variant Types */}
                {variant?.types?.map((type) => (
                  <div
                    key={type?.type_id}
                    className="text-xs text-muted-foreground"
                  >
                    <span>{type?.type_name}: </span>
                    <span className="font-medium">{type?.value?.name}</span>
                  </div>
                ))}

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
                    {item?.product?.category_name || "N/A"}
                  </span>
                </div>

                {/* Bundle Info */}
                {isBundle && (
                  <div className="text-[10px] text-blue-600 font-medium mt-1">
                    {item.required_quantity} items × {item.times_applied} bundle
                    {item.times_applied > 1 ? "s" : ""} ={" "}
                    <span className="font-semibold">{quantity} total</span>
                  </div>
                )}
              </div>
            </div>

            {/* SKU */}
            <div className="text-xs text-muted-foreground mb-3">
              SKU:{" "}
              <span className="font-mono">{variant?.variant_sku || "N/A"}</span>
            </div>

            {/* Price Details */}
            <div className="flex justify-between items-center text-sm border-t pt-2">
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Qty</p>
                  <p className="font-semibold">{quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {isBundle ? "Per Item" : "Unit Price"}
                  </p>
                  <p className="font-medium">{formatCurrency(unitPrice)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Subtotal</p>
                <p className="font-bold text-base">
                  {formatCurrency(subtotal)}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {allItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No items found in this order.
        </div>
      )}

      {/* Totals */}
      {allItems.length > 0 && (
        <div className="border-t-2 pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(orderSubtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{formatCurrency(orderShipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatCurrency(orderTax)}</span>
          </div>
          {parseFloat(orderDiscount) > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Discount:</span>
              <span>-{formatCurrency(orderDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t-2 pt-2">
            <span>Total:</span>
            <span>{formatCurrency(orderTotal)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
