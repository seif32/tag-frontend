import CartItem from "../components/CartItem";

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
    <div className="bg-[#F5F5F5] flex rounded-md p-4 gap-2">
      <div className="flex flex-col gap-3 p-3 bg-white border rounded-md flex-2">
        {cartItems.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}{" "}
      </div>
      <div className="flex-1 p-3 bg-white border rounded-md">right</div>
    </div>
  );
}

export default CartPage;
