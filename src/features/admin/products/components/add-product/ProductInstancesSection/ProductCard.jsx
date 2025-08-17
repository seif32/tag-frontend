import { Card, CardContent } from "@/components/ui/card";
import ProductHeader from "./ProductHeader";
import ProductDetails from "./ProductDetails";
import NoProducts from "./NoProducts";
import { useFormContext } from "react-hook-form";
import useProductStore from "@/features/admin/store/productStore";

function ProductCard({ variantsList }) {
  const mode = useProductStore((state) => state.mode);

  // Filter out the first variant if mode is 'add' and it's empty
  const filteredVariants =
    mode === "add"
      ? variantsList.filter((variant, index) => {
          // Skip first variant if it's empty (used for input form)
          if (
            index === 0 &&
            (!variant.variant_sku || variant.variant_sku.trim() === "")
          ) {
            return false;
          }
          return true;
        })
      : variantsList;

  const isEmpty =
    !filteredVariants ||
    filteredVariants.length === 0 ||
    filteredVariants.every(
      (variant) => !variant.variant_sku || variant.variant_sku.trim() === ""
    );

  return (
    <CardContent className="space-y-4">
      {filteredVariants.map((product, index) => (
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
