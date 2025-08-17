import { Card } from "@/components/ui/card";
import ProductCardImage from "./ProductCardImage";
import ProductCardInfo from "./ProductCardInfo";
import ProductCardActions from "./ProductCardActions";

function ProductCard({ image, category, name, variantCount, brand }) {
  return (
    <Card className="flex justify-between pt-0 transition-all cursor-pointer">
      <ProductCardImage image={image} variantCount={variantCount} />
      <ProductCardInfo
        category={category}
        name={name}
        variantCount={variantCount}
        brand={brand}
      />

      <ProductCardActions />
    </Card>
  );
}

export default ProductCard;
