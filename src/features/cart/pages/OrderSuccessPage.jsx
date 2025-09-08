import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import { Package } from "lucide-react";
import { useNavigate } from "react-router";
import successAnimation from "../../../animations/success.json";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/formatCurrency";

function OrderSuccessPage() {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <div className="flex flex-col items-center gap-8 ">
      <Title />
      <OrderDetails delivery={45} tax={22} />
      <div className="w-full max-w-200 ">
        <div className="mb-4">
          <h2 className="text-xl leading-none">Products</h2>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package size={16} />
            <p>{cartItems.length} items</p>
          </div>
        </div>
        {cartItems.map((item) => (
          <OrderSummary
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            totalPrice={item.price * item.quantity}
            unitPrice={item.price}
            variants={item.types.map((variant) => variant.value.name)}
          />
        ))}
      </div>

      <div className="flex justify-end w-full mt-4 max-w-200">
        <Button variant={"outline"} onClick={() => navigate("/products")}>
          Return Shopping
        </Button>
      </div>
    </div>
  );
}

export default OrderSuccessPage;

function Title() {
  return (
    <div className="flex flex-col items-center">
      <Lottie
        animationData={successAnimation}
        loop={false}
        style={{ width: 100, height: 100 }}
        className="mb-2"
      />
      <h1 className="mb-1 text-2xl leading-none">Thank You</h1>
      <h2 className="mb-2 text-xl leading-none">
        Your order placed successfully
      </h2>
      <p className="text-sm text-muted-foreground">
        You will receive an email with receipt
      </p>
    </div>
  );
}

function OrderDetails({ delivery, tax }) {
  const totalPrice = useCartStore((state) => state.totalPrice);

  return (
    <div className="flex flex-col w-full px-4 py-3 bg-white border border-gray-100 max-w-200">
      <h3 className="mb-2.5 text-xl">Order Details</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between w-full ">
          <p className=" text-primary/70">Order number:</p>
          <p className="">#5965000</p>
        </div>
        <div className="flex justify-between w-full">
          <p className=" text-primary/70">Date:</p>
          <p className="">May 6, 2025</p>
        </div>
        <div className="flex justify-between w-full">
          <p className=" text-primary/70">Payment Method:</p>
          <p className="">Credit Card</p>
        </div>
      </div>
      <div className="my-4 border border-dashed"></div>
      <div className="flex justify-end w-full gap-14 ">
        <div className="flex flex-col gap-1 text-sm">
          <h4>Subtotal</h4>
          <h4>Delivery</h4>
          <h4>Taxes VAT(20%)</h4>
          <h4 className="font-semibold text-md">Total</h4>
        </div>
        <div className="flex flex-col gap-1 text-sm text-right">
          <p>{formatCurrency(totalPrice)}</p>
          <p>{formatCurrency(delivery)}</p>
          <p>{formatCurrency(tax)}</p>
          <p className="font-semibold text-md">
            {formatCurrency(totalPrice + delivery + tax)}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({
  name,
  quantity,
  totalPrice,
  unitPrice,
  variants = [],
}) {
  return (
    <>
      <div className="flex flex-col ">
        <div className="flex items-baseline justify-between">
          <p className="font-bold">{name}</p>
          <p className="text-sm text-muted-foreground">
            <span className="text-xs">{quantity}x </span>
            {formatCurrency(unitPrice)}
          </p>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex gap-1">
            {variants.map((variant, index) => (
              <span key={index} className="text-sm text-gray-400">
                {variant} {index < variants.length - 1 && <span>•</span>}
              </span>
            ))}
          </div>
          <p>{formatCurrency(totalPrice)}</p>
        </div>
      </div>
      <div className="my-4 border border-gray-200 border-dashed"></div>
    </>
  );
}
