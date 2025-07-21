import { Card } from "@/components/ui/card";
import ProductCardImage from "./ProductCardImage";
import ProductCardInfo from "./ProductCardInfo";
import ProductCardActions from "./ProductCardActions";

function ProductCard({ image, isSoldOut }) {
  return (
    <Card className="pt-0 transition-all cursor-pointer ">
      <ProductCardImage image={image} isSoldOut={isSoldOut} />
      <ProductCardInfo />
      <ProductCardActions />
    </Card>
  );
}

export default ProductCard;
