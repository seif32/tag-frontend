import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import { useNavigate } from "react-router";
import successAnimation from "../../../animations/success.json";
import OrderContainer from "@/features/order/components/OrderContainer";
import OrderReceipt from "@/features/order/components/OrderReceipt";
import { useOrderStore } from "@/store/orderStore";
import EmptyState from "@/ui/EmptyState";

function OrderSuccessPage() {
  const navigate = useNavigate();

  const order = useOrderStore((state) => state.order);
  const orderItems = useOrderStore((state) => state.orderItems);

  console.log("order", order);

  if (!order)
    return (
      <div className="grid place-items-center  min-h-screen ">
        <EmptyState
          title={"Ready to place your first order?"}
          subtitle={"Discover amazing products and start shopping today!"}
          goTo={"/products"}
          btn={"Browse products"}
        />
      </div>
    );

  return (
    <div className="flex flex-col gap-12 mx-auto max-w-200 ">
      <Title />
      <OrderReceipt order={order} />
      <OrderContainer items={orderItems} />
      <div className="self-end flex gap-2">
        <Button variant={"outline"} onClick={() => navigate("/orders")}>
          Go to Orders History
        </Button>
        <Button onClick={() => navigate("/products")}>Return Shopping</Button>
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
