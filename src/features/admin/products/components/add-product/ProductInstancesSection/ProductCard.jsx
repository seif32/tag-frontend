import { Card, CardContent } from "@/components/ui/card";
import ProductHeader from "./ProductHeader";
import ProductDetails from "./ProductDetails";
import NoProducts from "./NoProducts";
import { useFieldArray, useFormContext } from "react-hook-form";

function ProductCard() {
  const { control } = useFormContext();

  const { fields: variantsList } = useFieldArray({
    control,
    name: "variants",
  });

  const isEmpty =
    !variantsList ||
    variantsList.length <= 1 ||
    variantsList.every(
      (variant) => !variant.variant_sku || variant.variant_sku === ""
    );

  return (
    <CardContent className="space-y-4">
      {variantsList.map((product, index) => (
        <Card key={product.id || index}>
          <CardContent>
            <ProductHeader product={product} />
            <ProductDetails product={product} />
          </CardContent>
        </Card>
      ))}

      {isEmpty && <NoProducts />}
    </CardContent>
  );
}

export default ProductCard;
