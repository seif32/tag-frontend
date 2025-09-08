import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function OrderCoupon() {
  return (
    <div className="flex flex-col gap-4 p-3 py-6 bg-white border rounded-xl">
      <h2 className="font-semibold">Coupon Code</h2>
      <div className="border border-gray-100"></div>
      <Input />
      <Button variant={"outline"}>Apply Your Coupon</Button>
    </div>
  );
}

export default OrderCoupon;
