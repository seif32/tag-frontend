import OrderSummary from "./OrderSummary";
import OrderCoupon from "./OrderCoupon";
import OrderActions from "./OrderActions";

function OrderControls({ discount, delivery, tax, total }) {
  return (
    <div className="flex flex-col gap-4">
      <OrderCoupon />
      <OrderSummary
        delivery={delivery}
        discount={discount}
        tax={tax}
        total={total}
      />
      <OrderActions />
    </div>
  );
}

export default OrderControls;
