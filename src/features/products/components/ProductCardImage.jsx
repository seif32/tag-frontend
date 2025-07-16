import { Badge } from "@/components/ui/badge";
import { CardHeader } from "@/components/ui/card";
import SoldOutBadge from "@/ui/SoldOutBadge";

function ProductCardImage() {
  return (
    <CardHeader className={"p-0"}>
      <div className="relative bg-gray-200 w-full h-48 rounded-t-xl">
        <SoldOutBadge />
      </div>
    </CardHeader>
  );
}

export default ProductCardImage;
