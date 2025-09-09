import { useParams } from "react-router";
import { TfiPackage } from "react-icons/tfi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { formatDateShort } from "@/utils/dateUtils";
import ShippingAddress from "../components/ShippingAddress";
import OrderReceipt from "../components/OrderReceipt";
import OrderContainer from "../components/OrderContainer";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";

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

function IconCard({ icon: Icon, title, subtitle, badge }) {
  const statusMap = {
    pending: { text: "Pending", className: "bg-yellow-100 text-yellow-800" },
    delivered: { text: "Delivered", className: "bg-green-100 text-green-600" },
    cancelled: { text: "Cancelled", className: "bg-red-100 text-red-800" },
  };
  const status = badge ? statusMap[badge] : null;
  return (
    <div className="flex flex-col justify-between w-full p-5 bg-white border min-h-40 rounded-3xl md:max-w-70 ">
      <div className="flex items-center justify-between">
        <Icon size={22} />
        {status && (
          <span
            className={`ml-auto px-2 py-1 text-xs rounded-full font-medium ${status.className}`}
          >
            {status.text}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-sm text-gray-400">{subtitle}</p>
        <p className="font-medium ">{title}</p>
      </div>
    </div>
  );
}
