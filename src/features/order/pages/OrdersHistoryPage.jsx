import { useAuthStore } from "@/auth/store/authStore";
import { Button } from "@/components/ui/button";
import { getStatusColor } from "@/features/admin/services/utils";
import useOrders from "@/hooks/useOrders";
import LoadingState from "@/ui/LoadingState";
import Pagination from "@/ui/Pagination";
import { formatDateFull } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatCurrency";
import { PiPackageThin } from "react-icons/pi";
import { useNavigate, useSearchParams } from "react-router";

function OrdersHistoryPage() {
  const user = useAuthStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const { userOrders, isLoadingUserOrders, isFetchingUserOrders } =
    useOrders.useByUserId(user.id, {
      page: currentPage,
      limit,
    });

  if (isLoadingUserOrders) return <LoadingState type="page" />;

  return (
    <div className="w-full mx-auto max-w-250 flex flex-col">
      <Title limit={userOrders.limit} total={userOrders.total} />
      <OrderHistoryCardContainer orders={userOrders?.data} />
      <Pagination
        setSearchParams={setSearchParams}
        currentPage={currentPage}
        data={userOrders}
        isFetching={isFetchingUserOrders}
        totalPages={userOrders.totalPages}
      />
    </div>
  );
}

export default OrdersHistoryPage;

function Title({ limit, total }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl">Orders History</h1>
      <p className="text-muted-foreground">
        Showing {limit} orders out of {total} total
      </p>
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
            products={order?.items}
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
  totalPrice,
}) {
  const navigate = useNavigate();
  return (
    <div className="p-4 bg-white border rounded-md">
      <div className="">
        <h3 className="text-xl font-degular">
          Order <span className="text-xs">#</span>
          {orderId}
        </h3>
        <div className="flex items-end justify-between ">
          <p className="text-sm text-muted-foreground">
            {/* {formatDateFull(orderDate)} */}
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
              <div key={product?.id} className="flex flex-col gap-0.5">
                <div className="w-20 h-20 bg-gray-200 rounded-md">
                  <img />
                </div>
                <h4 className="truncate max-w-[10ch] text-xs">
                  {product?.product?.name}
                </h4>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <PiPackageThin />
                  <p className="text-xs">x{product?.quantity}</p>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="mx-5 border"></div> */}
        <div className="flex flex-col justify-between gap-8">
          {/* <ShippingAddress
            city={address.city}
            country={address.city}
            postalCode={address.postal_code}
            streetAddress={address.street_address}
            phoneNumber={phoneNumber}
          /> */}
          <div className="flex flex-col items-end self-end justify-between h-full gap-1 ">
            <div>
              <p className="text-xs text-muted-foreground">Total Price</p>
              <p className="font-medium ">{formatCurrency(totalPrice)}</p>
              {/* <p className="text-xs text-muted-foreground">
                {totalItems} items{" "}
              </p> */}
            </div>
            <Button
              // variant={"outline"}
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
