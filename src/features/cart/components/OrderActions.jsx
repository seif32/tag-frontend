import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

function OrderActions() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 p-3 py-6 bg-white border rounded-xl">
      <h2 className="font-semibold">Actions</h2>

      <div className="border border-gray-100"></div>

      <div className="flex gap-2">
        <Button variant={"outline"} className={"flex-1"}>
          Cancel Order
        </Button>
        <Button className={"flex-2"} onClick={() => navigate("/checkout")}>
          Checkout
        </Button>
      </div>
    </div>
  );
}

export default OrderActions;
