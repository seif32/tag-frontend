import { Button } from "@/components/ui/button";
import { formatDateShort } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatCurrency";
import { PiPackageThin } from "react-icons/pi";
import { useNavigate } from "react-router";
import ShippingAddress from "../components/ShippingAddress";

const orders = [
  {
    id: 1,
    date: "2025-09-09 14:45:30",
    status: "delivered",
    phone_number: "+44 7911 123456",
    total_price: 475,
    total_items: 24,
    address: {
      street_address: "Flat 14B, 25 Baker Street",
      country: "United Kingdom",
      city: "London",
      postalCode: "W1U 8AN",
    },
    products: [
      {
        name: "Iphone 11",
        quantity: 42,
      },
      {
        name: "Samsung Galaxy",
        quantity: 14,
      },
      {
        name: "Black Suit",
        quantity: 9,
      },
      {
        name: "LG Television",
        quantity: 12,
      },
      {
        name: "Tablet 5s",
        quantity: 77,
      },
    ],
  },
  {
    id: 2,
    date: "2025-09-09 14:45:30",
    status: "delivered",
    phone_number: "+44 7911 123456",
    total_price: 475,
    total_items: 24,
    address: {
      street_address: "Flat 14B, 25 Baker Street",
      country: "United Kingdom",
      city: "London",
      postalCode: "W1U 8AN",
    },
    products: [
      {
        name: "Iphone 11",
        quantity: 42,
      },
      {
        name: "Samsung Galaxy",
        quantity: 14,
      },
      {
        name: "Black Suit",
        quantity: 9,
      },
      {
        name: "LG Television",
        quantity: 12,
      },
      {
        name: "Tablet 5s",
        quantity: 77,
      },
    ],
  },
];

function OrdersHistoryPage() {
  return (
    <div className="w-full mx-auto max-w-250">
      <Title />
      <OrderHistoryCardContainer />
    </div>
  );
}

export default OrdersHistoryPage;

function Title() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl">Orders History</h1>
      <p className="text-muted-foreground">
        Check all your orders history in here!
      </p>
    </div>
  );
}

function OrderHistoryCardContainer() {
  return (
    <div className="flex flex-col gap-2">
      {orders?.map((order) => (
        <OrderHistoryCard
          key={order?.id}
          orderId={order?.id}
          orderDate={order?.date}
          orderStatus={order?.status}
          products={order?.products}
          address={order?.address}
          phoneNumber={order?.phone_number}
          totalPrice={order?.total_price}
          totalItems={order?.total_items}
        />
      ))}
    </div>
  );
}

function OrderHistoryCard({
  orderId,
  orderDate,
  orderStatus,
  products = [],
  address,
  phoneNumber,
  totalPrice,
  totalItems,
}) {
  const navigate = useNavigate();
  return (
    <div className="p-4 bg-white border rounded-md">
      <div className="">
        <h3 className="text-lg ">Order #{orderId}</h3>
        <div className="flex items-end justify-between ">
          <p className="text-sm text-muted-foreground">
            {/* {formatDateFull(orderDate)} */}
            {formatDateShort(orderDate)}
          </p>
          <div className="px-4 py-2 text-xs bg-gray-200 border rounded-md">
            <p>{orderStatus}</p>
          </div>
        </div>
      </div>
      <div className="my-5 border"></div>
      <div className="flex flex-col justify-between gap-8 sm:flex-row sm:gap-2 ">
        <div className="flex flex-wrap gap-x-2">
          {products?.map((product) => {
            return (
              <div key={product?.id} className="flex flex-col">
                <div className="w-20 h-20 bg-gray-200 rounded-md">
                  <img />
                </div>
                <h4 className="truncate max-w-[10ch] text-xs">
                  {product?.name}
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
              <p className="font-medium leading-none">
                {formatCurrency(totalPrice)}
              </p>
              {/* <p className="text-xs text-muted-foreground">
                {totalItems} items{" "}
              </p> */}
            </div>
            <Button
              variant={"outline"}
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
