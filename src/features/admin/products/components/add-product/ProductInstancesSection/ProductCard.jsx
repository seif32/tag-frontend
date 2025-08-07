import { Card, CardContent } from "@/components/ui/card";
import ProductHeader from "./ProductHeader";
import ProductDetails from "./ProductDetails";
import NoProducts from "./NoProducts";
import { useFormContext, useWatch } from "react-hook-form";

function ProductCard() {
  const { control } = useFormContext();

  const variantsList = useWatch({
    control,
    name: "variants",
    select: (value) => value.length,
  });

  const isEmpty =
    !variantsList ||
    variantsList.length <= 1 ||
    variantsList
      .slice(1)
      .every((variant) => !variant.variantSku || variant.variantSku === "");

  return (
    <CardContent className="space-y-4">
      {variantsList.slice(1).map((product, index) => (
        <Card key={product.id || index}>
          <CardContent className="pt-6">
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
