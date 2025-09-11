import { useParams } from "react-router";
import { TfiPackage } from "react-icons/tfi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { formatDateShort } from "@/utils/dateUtils";
import ShippingAddress from "../components/ShippingAddress";
import OrderReceipt from "../components/OrderReceipt";
import OrderContainer from "../components/OrderContainer";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import IconCard from "@/ui/IconCard";

const address = {
  street_address: "Flat 14B, 25 Baker Street",
  country: "United Kingdom",
  city: "London",
  postalCode: "W1U 8AN",
  phone_number: "+44 7911 123456",
};

function OrderDetailsPage() {
  const { orderId } = useParams();

  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <div className="flex flex-col ">
      <h1 className="mb-5 text-3xl">Order Details</h1>
      <div className="flex flex-col gap-3 p-3 border rounded-3xl ">
        <div className="flex flex-col gap-3 md:flex-row">
          <IconCard
            icon={TfiPackage}
            badge={"delivered"}
            title={`#${orderId}`}
            subtitle={"order id "}
          />
          <IconCard
            icon={LiaShippingFastSolid}
            subtitle={"Estimated Arrival"}
            title={formatDateShort("2025-09-09 14:45:30")}
          />

          <OrderReceipt
            isOrderDetails={false}
            style={"rounded-3xl border border-gray-200"}
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex-1">
            <OrderContainer
              items={cartItems}
              style={"bg-white p-8 rounded-2xl border"}
            />
          </div>
          <div className="flex flex-col gap-3">
            <ShippingAddress
              city={address.city}
              country={address.country}
              postalCode={address.postal_code}
              streetAddress={address.street_address}
              phoneNumber={address.phone_number}
              style={"bg-white p-8 rounded-2xl border"}
            />
            <Button className={"w-full"}>Invoice</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
