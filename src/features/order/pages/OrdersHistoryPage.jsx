import { Button } from "@/components/ui/button";
import { formatDateShort } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatCurrency";
import { PiPackageThin } from "react-icons/pi";

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
    <div className="w-full max-w-250 mx-auto">
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
  return (
    <div className="bg-white border p-8 rounded-md">
      <div className="">
        <h3 className="text-lg ">Order #{orderId}</h3>
        <div className="flex justify-between items-end ">
          <p className="text-muted-foreground text-sm">
            {/* {formatDateFull(orderDate)} */}
            {formatDateShort(orderDate)}
          </p>
          <div className="py-2 px-4 border bg-gray-200 rounded-md text-xs">
            <p>{orderStatus}</p>
          </div>
        </div>
      </div>
      <div className="border my-5"></div>
      <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-2 ">
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
                <div className="flex text-muted-foreground items-center gap-1">
                  <PiPackageThin />
                  <p className="text-xs">x{product?.quantity}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border mx-5"></div>
        <div className="flex flex-col justify-between gap-8">
          <div className="gap-2 flex flex-col">
            <h4 className="font-bold w-full">Shipping Address</h4>
            <div className="flex flex-col gap-1 text-sm whitespace-nowrap">
              <span>{address?.street_address}</span>
              <span>
                {address?.city}, {address?.postal_code}
              </span>
              <span>{address?.country}</span>
              <span className="">Phone: {phoneNumber}</span>
            </div>
          </div>
          <div className="self-end flex flex-col items-end gap-1">
            <div>
              <p className="font-bold leading-none">
                {formatCurrency(totalPrice)}
              </p>
              <p className="text-sm text-muted-foreground">
                {totalItems} items{" "}
              </p>
            </div>
            <Button variant={"outline"} size={"sm"} className={"text-xs"}>
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
