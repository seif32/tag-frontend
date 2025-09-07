import { Package } from "lucide-react";
import CartItem from "../components/CartItem";
import OrderControls from "../components/OrderControls";

const cartItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    variants: ["Black", "Bluetooth 5.0"],
    quantity: 2,
    price: 59.99,
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    variants: ["RGB", "Blue Switches"],
    quantity: 1,
    price: 89.99,
  },
  {
    id: 3,
    name: "Gaming Mouse",
    variants: ["Wired", "12,000 DPI"],
    quantity: 3,
    price: 29.99,
  },
  {
    id: 4,
    name: "Laptop Stand",
    variants: ["Aluminum", "Adjustable"],
    quantity: 1,
    price: 39.99,
  },
  {
    id: 5,
    name: "USB-C Hub",
    variants: ["7-in-1", "Space Gray"],
    quantity: 2,
    price: 49.99,
  },
];

function CartPage() {
  return (
    <div className="flex flex-col gap-2 rounded-md md:flex-row">
      <div className="flex flex-col gap-4 p-3 bg-white border rounded-md flex-2">
        <div>
          <h2 className="text-lg font-semibold ">Shopping Cart</h2>
          <div className="flex items-center gap-1">
            <Package className=" text-muted-foreground" size={16} />
            <p className="text-sm text-muted-foreground">
              {cartItems.length} items
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {cartItems.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
        </div>
      </div>
      <div className="flex-1 ">
        <OrderControls delivery={45} discount={32} tax={0} total={1500} />
      </div>
    </div>
  );
}

export default CartPage;
