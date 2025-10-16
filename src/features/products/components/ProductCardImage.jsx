import { Badge } from "@/components/ui/badge";

function ProductCardImage({ image, className = "", variantCount }) {
  return (
    <div
      className={`relative w-full  aspect-square max-h-50 bg-gray-200  group ${className}`}
    >
      <Badge className={"absolute top-2 left-2"}>{variantCount} variants</Badge>

      <img
        src={image || "/src/assets/product2.jpg"}
        alt={"Product"}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}

export default ProductCardImage;
