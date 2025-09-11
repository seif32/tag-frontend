import IconCard from "@/ui/IconCard";
import { formatDateFull } from "@/utils/dateUtils";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { CreditCard, DollarSign, Package, ShoppingBag } from "lucide-react";
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

const orderStats = [
  {
    icon: Package,
    title: "Order Status",
    // subtitle: "Current order progress",
    badge: "pending", // maps to statusMap in IconCard
  },
  {
    icon: CreditCard,
    title: "Payment Status",
    // subtitle: "Latest payment state",
    badge: "paid", // you might extend statusMap for payment
  },
  {
    icon: DollarSign,
    title: "245.99",
    subtitle: "Total Amount",
    badge: null,
  },
  {
    icon: ShoppingBag,
    title: "3 items",
    subtitle: "Items",
    badge: null,
  },
];

const address = {
  street_address: "Flat 14B, 25 Baker Street",
  country: "United Kingdom",
  city: "London",
  postal_code: "W1U 8AN",
  phone_number: "+44 7911 123456",
};

const mockOrderData = {
  order_number: "ORD-123456",
  subtotal: 449.91,
  tax: 36.0,
  shipping: 9.99,
  total: 495.9,
  items_count: 6,
  order_items: [
    {
      id: 1,
      product_name: "Wireless Headphones",
      product_sku: "WH-001",
      category: "Electronics",
      sub_category: "Mobiles",
      quantity: 2,
      unit_price: 99.99,
      total_price: 199.98,
      status: "Shipped",
      product_image_url: "/headphones.jpg",
      variant_attributes: {
        Color: "Black",
        Size: "Medium",
      },
    },
    {
      id: 2,
      product_name: "USB-C Cable",
      product_sku: "USB-002",
      category: "Electronics",
      sub_category: "Cables",
      quantity: 1,
      unit_price: 29.99,
      total_price: 29.99,
      status: "Processing",
      product_image_url: "/cable.jpg",
      variant_attributes: {
        Length: "2m",
        Color: "White",
      },
    },
  ],
};
function AdminOrderPage() {
  const { orderId } = useParams();

  const orderData = mockOrderData;

  return (
    <div className="flex flex-col gap-5">
      <Title orderId={orderId} orderDate={"2025-09-09 14:45:30"} />
      <StatsContainer />
      <div className="flex gap-5">
        <OrderContents order={orderData} />
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

function StatsContainer() {
  return (
    <div className="grid grid-cols-4 w-full">
      {orderStats.map((stat, index) => (
        <IconCard key={index} {...stat} />
      ))}
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
      <h3>Order Items</h3>
      <ItemsTable
        orderItems={order.order_items || []}
        orderNumber={order.order_number}
      />
    </section>
  );
}

function ItemsTable({ orderNumber, orderItems }) {
  const calculateOrderTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total_price, 0);
  };
  return (
    <Table>
      <TableCaption>
        Items in order {orderNumber} - {orderItems.length} item
        {orderItems.length !== 1 ? "s" : ""}
      </TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Product</TableHead>
          <TableHead className="w-[120px]">SKU</TableHead>
          <TableHead className="w-[120px] ">Status</TableHead>
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
                    src={item.product_image_url || "/placeholder.jpg"}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {item.product_name}
                    </span>
                    {item.variant_attributes && (
                      <span className="text-xs text-muted-foreground">
                        {Object.entries(item.variant_attributes)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
                    {item.category || "N/A"}
                  </span>
                  {item.sub_category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                      {item.sub_category}
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <span className="font-mono text-xs text-gray-600">
                  {item.product_sku || "N/A"}
                </span>
              </TableCell>

              <TableCell className="text-center">
                <span className="font-semibold">{item.quantity}</span>
              </TableCell>

              <TableCell className="text-right">
                <span className="font-medium">
                  ${item.unit_price.toFixed(2)}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <span className="font-semibold">
                  ${item.total_price.toFixed(2)}
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
          <TableRow className="bg-gray-50 border-t-2">
            <TableCell colSpan={5} className="text-right font-semibold ">
              Order Total:
            </TableCell>
            <TableCell className="text-right">
              <span className="font-bold text-lg">
                ${calculateOrderTotal().toFixed(2)}
              </span>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
