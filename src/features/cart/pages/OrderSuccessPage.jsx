import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import { useNavigate } from "react-router";
import successAnimation from "../../../animations/success.json";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import OrderContainer from "@/features/order/components/OrderContainer";

function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-8 ">
      <Title />
      <OrderDetails delivery={45} tax={22} />
      <OrderContainer />
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
