import { useParams } from "react-router";
import { TfiPackage } from "react-icons/tfi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { addDays, formatDateShort } from "@/utils/dateUtils";
import ShippingAddress from "../components/ShippingAddress";
import OrderReceipt from "../components/OrderReceipt";
import OrderContainer from "../components/OrderContainer";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import IconCard from "@/ui/IconCard";
import useOrders from "@/hooks/useOrders";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";

const address = {
  street_address: "Flat 14B, 25 Baker Street",
  country: "United Kingdom",
  city: "London",
  postalCode: "W1U 8AN",
  phone_number: "+44 7911 123456",
};

function OrderDetailsPage() {
  const { orderId } = useParams();

  const { order, isLoadingOrder, isErrorOrder, errorOrder, refetchOrder } =
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
    <div className="flex flex-col ">
      <Title />
      <div className="flex flex-col gap-3 p-3 border rounded-3xl ">
        <div className="flex flex-col gap-3 md:flex-row">
          <IconCard
            icon={TfiPackage}
            badge={order.order_status}
            title={`#${orderId}`}
            subtitle={"order id "}
          />
          <IconCard
            icon={LiaShippingFastSolid}
            subtitle={"Estimated Arrival"}
            title={formatDateShort(addDays(order.created_at, 5))}
          />

          <OrderReceipt
            order={order}
            isOrderDetails={false}
            style={"rounded-3xl border border-gray-200"}
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex-2">
            <OrderContainer
              items={order.items}
              style={"bg-white p-8 rounded-2xl border"}
            />
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <ShippingAddress
              city={address.city}
              country={address.country}
              postalCode={address.postal_code}
              streetAddress={address.street_address}
              phoneNumber={address.phone_number}
              style={"bg-white p-5 rounded-2xl border"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;

function Title() {
  return (
    <div className="flex justify-between">
      <h1 className="mb-5 text-3xl">Order Details</h1>
      <Button variant={"outline"}>Invoice</Button>
    </div>
  );
}
