import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

function ActionButtons() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-4">
        <Button className="p-2 bg-transparent border border-black group hover:bg-primary">
          <Minus className="text-black group-hover:text-white" />
        </Button>
        <span>58</span>
        <Button className="p-2 bg-transparent border border-black group hover:bg-primary">
          <Plus className="text-black group-hover:text-white" />
        </Button>
      </div>
      <Button className="w-40 text-accent" variant={"outline"}>
        Add to Cart
      </Button>
      <Button className="w-40 ">Buy Now</Button>
    </div>
  );
}

export default ActionButtons;
