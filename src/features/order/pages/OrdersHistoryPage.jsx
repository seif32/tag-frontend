import { useAuthStore } from "@/auth/store/authStore";
import { Button } from "@/components/ui/button";
import { getStatusColor } from "@/features/admin/services/utils";
import useOrders from "@/hooks/useOrders";
import EmptyState from "@/ui/EmptyState";
import ErrorMessage from "@/ui/ErrorMessage";
import LoadingState from "@/ui/LoadingState";
import { formatDateFull } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatCurrency";
import { PiPackageThin } from "react-icons/pi";
import { Package } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import PaginationControlsBar from "@/features/admin/ui/PaginationControlsBar";

function OrdersHistoryPage() {
  const user = useAuthStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const {
    userOrders,
    isLoadingUserOrders,
    errorUserOrders,
    isErrorUserOrders,
    refetchUserOrders,
  } = useOrders.useByUserId(user.id, {
    page: currentPage,
    limit,
  });

  if (isLoadingUserOrders) return <LoadingState type="page" />;

  if (isErrorUserOrders)
    return (
      <ErrorMessage
        message={errorUserOrders?.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchUserOrders()}
      />
    );
  console.log(userOrders);

  return (
    <div className="w-full mx-auto max-w-250 flex flex-col space-y-7">
      <Title limit={userOrders?.limit} total={userOrders?.total} />
      {userOrders?.total > 0 ? (
        <OrderHistoryCardContainer orders={userOrders?.data} />
      ) : (
        <EmptyState
          title={"Ready to place your first order?"}
          subtitle={"Discover amazing products and start shopping today!"}
          goTo={"/products"}
          btn={"Browse products"}
        />
      )}
      {userOrders?.totalPages && (
        <PaginationControlsBar
          dataName={"orders"}
          isLoading={isLoadingUserOrders}
          pageCount={userOrders?.totalPages}
          totalCount={userOrders?.total}
        />
      )}
    </div>
  );
}

export default OrdersHistoryPage;

function Title({ limit, total }) {
  return (
    <div className="mb-8 ">
      <h1 className="text-2xl sm:text-4xl font-bold">Orders History</h1>
      {total !== 0 && (
        <p className="text-muted-foreground text-xs sm:text-lg">
          {total > limit
            ? ` Showing  ${limit} orders out of ${total} total`
            : `Showing ${total} orders`}{" "}
        </p>
      )}
    </div>
  );
}

function OrderHistoryCardContainer({ orders }) {
  return (
    <div className="flex flex-col gap-2">
      {orders?.map((order) => {
        return (
          <OrderHistoryCard
            key={order?.id}
            orderId={order?.id}
            orderDate={order?.created_at}
            orderStatus={order?.order_status}
            products={order?.items || []}
            bundles={order?.bundles || []}
            totalPrice={order?.total_amount}
          />
        );
      })}
    </div>
  );
}

function OrderHistoryCard({
  orderId,
  orderDate,
  orderStatus,
  products = [],
  bundles = [], // 🚀 NEW: Accept bundles
  totalPrice,
}) {
  const navigate = useNavigate();

  // Calculate total items including bundles
  const regularItemsCount = products.reduce(
    (total, product) => total + product?.quantity,
    0
  );
  const bundleItemsCount = bundles.reduce(
    (total, bundle) => total + bundle.required_quantity * bundle.times_applied,
    0
  );
  const totalItemsCount = regularItemsCount + bundleItemsCount;
  const totalProductCount = products.length + bundles.length;

  return (
    <div className="p-4 bg-white border rounded-md">
      <div className="">
        <h3 className="text-xl ">
          Order <span className="text-xs">#</span>
          {orderId}
        </h3>
        <div className="flex items-end justify-between ">
          <p className="text-sm text-muted-foreground">
            {formatDateFull(orderDate)}
          </p>
          <div
            className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
              orderStatus,
              "order"
            )}`}
          >
            <p>{orderStatus}</p>
          </div>
        </div>
      </div>
      <div className="my-3 border border-gray-50"></div>
      <div className="flex flex-col justify-between gap-8 sm:flex-row sm:gap-2 ">
        <div className="flex flex-wrap gap-x-2">
          {products?.map((product) => {
            return (
              <ProductItem key={`product-${product?.id}`} product={product} />
            );
          })}

          {/* 🚀 Bundle Products */}
          {bundles?.map((bundle) => {
            return <BundleItem key={`bundle-${bundle?.id}`} bundle={bundle} />;
          })}
        </div>

        <div className="flex flex-col justify-between gap-8">
          <div className="flex flex-col items-end self-end justify-between h-full gap-1 ">
            <div>
              <p className="text-xs text-muted-foreground">Total Price</p>
              <p className="font-medium ">{formatCurrency(totalPrice)}</p>
              <p className="text-xs text-muted-foreground">
                {totalItemsCount} items • {totalProductCount} products
              </p>
            </div>
            <Button
              size={"sm"}
              className={"text-xs w-full"}
              onClick={() => navigate(`/orders/${orderId}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductItem({ product }) {
  // 🎯 Extract image from nested variant structure
  const imageUrl =
    product?.product?.variants
      .find((v) => v.id === product.variant_id)
      ?.images?.find((img) => img.is_primary === 1)?.image_url ||
    product?.product?.variants.find((v) => v.id === product.variant_id)
      ?.images?.[0]?.image_url ||
    null;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product?.product?.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PiPackageThin className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      <h4 className="truncate max-w-[10ch] text-xs font-medium">
        {product?.product?.name}
      </h4>
      <div className="flex items-center gap-1 text-muted-foreground">
        <PiPackageThin className="w-3 h-3" />
        <p className="text-xs">×{product?.quantity}</p>
      </div>
    </div>
  );
}

function BundleItem({ bundle }) {
  const totalItems = bundle.required_quantity * bundle.times_applied;

  // 🎯 Extract image from bundle's product variant
  const imageUrl =
    bundle?.product?.variants
      .find((v) => v.id === bundle.variant_id)
      ?.images?.find((img) => img.is_primary === 1)?.image_url ||
    bundle?.product?.variants.find((v) => v.id === bundle.variant_id)
      ?.images?.[0]?.image_url ||
    null;
  return (
    <div className="flex flex-col gap-0.5">
      <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden border-2 border-blue-300">
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
            {/* Bundle Badge Overlay */}
            <div className="absolute inset-0 bg-blue-500/20" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        )}

        {/* Bundle Indicator Badge */}
        <div className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
          BUNDLE
        </div>

        {/* Quantity Badge */}
        <div className="absolute bottom-1 left-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
          ×{bundle.required_quantity}
        </div>
      </div>

      <h4 className="truncate max-w-[10ch] text-xs font-medium">
        {bundle?.product?.name || "Bundle"}
      </h4>

      <div className="flex flex-col text-muted-foreground">
        <div className="flex items-center gap-1">
          <Package className="w-3 h-3" />
          <p className="text-xs">
            ×{bundle.times_applied} bundle{bundle.times_applied > 1 ? "s" : ""}
          </p>
        </div>
        <p className="text-xs text-green-600 font-medium">
          {totalItems} items total
        </p>
      </div>
    </div>
  );
}
