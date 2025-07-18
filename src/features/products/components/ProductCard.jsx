import { Card } from "@/components/ui/card";
import ProductCardImage from "./ProductCardImage";
import ProductCardInfo from "./ProductCardInfo";
import ProductCardActions from "./ProductCardActions";

function ProductCard() {
  return (
    <Card className="pt-0 ">
      <ProductCardImage />
      <ProductCardInfo />
      <ProductCardActions />
    </Card>
  );
}

export default ProductCard;
