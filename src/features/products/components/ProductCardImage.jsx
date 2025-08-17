import { Badge } from "@/components/ui/badge";
import { CardHeader } from "@/components/ui/card";
import SoldOutBadge from "@/ui/SoldOutBadge";

function ProductCardImage({ image, className = "", variantCount }) {
  return (
    <CardHeader className="p-0">
      <div
        className={`relative w-full sm:aspect-square  bg-gray-200 rounded-t-xl overflow-hidden group ${className}`}
      >
        <Badge className={"absolute top-2 left-2"}>
          {variantCount} variants
        </Badge>

        <img
          src={image || "/src/assets/test.jpg"}
          alt={"Product"}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    </CardHeader>
  );
}

export default ProductCardImage;
