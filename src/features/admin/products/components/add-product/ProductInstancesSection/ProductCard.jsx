import { Card, CardContent } from "@/components/ui/card";
import ProductHeader from "./ProductHeader";
import ProductDetails from "./ProductDetails";
import NoProducts from "./NoProducts";
import { useFieldArray, useFormContext } from "react-hook-form";

function ProductCard() {
  const { control } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name: "variants", // <-- watch variants only
  });

  return (
    <CardContent className="space-y-4">
      {fields.map((product, index) => {
        return (
          <Card key={product.id || index}>
            <CardContent className="pt-6">
              <ProductHeader product={product} />
              <ProductDetails product={product} />
            </CardContent>
          </Card>
        );
      })}

      {fields.length === 0 && <NoProducts />}
    </CardContent>
  );
}

export default ProductCard;
