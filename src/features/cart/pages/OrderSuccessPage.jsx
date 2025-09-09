import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import { useNavigate } from "react-router";
import successAnimation from "../../../animations/success.json";
import OrderContainer from "@/features/order/components/OrderContainer";
import OrderReceipt from "@/features/order/components/OrderReceipt";

function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12  max-w-200 mx-auto ">
      <Title />
      <OrderReceipt delivery={45} tax={22} />
      <OrderContainer />
      <Button
        variant={"outline"}
        onClick={() => navigate("/products")}
        className={"self-end "}
      >
        Return Shopping
      </Button>
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
