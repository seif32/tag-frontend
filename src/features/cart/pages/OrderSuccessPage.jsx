import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import { CheckCircle, Package } from "lucide-react";
import { useNavigate } from "react-router";
import successAnimation from "../../../animations/success.json";

function OrderSuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-8 ">
      <Title />
      <OrderDetails />
      <OrderSummary />
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
      {/* <CheckCircle size={40} className="mb-4 text-green-600" /> */}
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

function OrderDetails() {
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
          <p>$89.25</p>
          <p>$98.25</p>
          <p>$17.22</p>
          <p className="font-semibold text-md">$250.99</p>
        </div>
      </div>
    </div>
  );
}

function OrderSummary() {
  return (
    <div className="w-full max-w-200">
      <div className="mb-5">
        <h2 className="text-xl leading-none">Products</h2>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Package size={16} />
          <p>5 items</p>
        </div>
      </div>

      <div className="flex flex-col ">
        <div className="flex items-baseline justify-between">
          <p className="font-bold">Iphone 11</p>
          <p className="text-sm text-muted-foreground">
            <span className="text-xs">2x </span>
            $45.58
          </p>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-primary/70">Red • 128GB • Aliminum</p>
          <p>$850.99 </p>
        </div>
      </div>
      <div className="my-4 border border-gray-200 border-dashed"></div>
      <div className="flex flex-col ">
        <div className="flex justify-between">
          <p className="font-bold">Iphone 11</p>
          <p className="text-sm text-muted-foreground">
            <span className="text-xs">2x </span>
            $45.58
          </p>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-primary/70">Red • 128GB • Aliminum</p>
          <p>$850.99 </p>
        </div>
      </div>
    </div>
  );
}
