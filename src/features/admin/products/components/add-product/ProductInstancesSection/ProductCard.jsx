import { Card, CardContent } from "@/components/ui/card";
import ProductHeader from "./ProductHeader";
import ProductDetails from "./ProductDetails";
import NoProducts from "./NoProducts";
import useProductStore from "@/features/admin/store/productStore";

function ProductCard({ variantsList }) {
  const mode = useProductStore((state) => state.mode);

  const filteredVariants =
    mode === "add"
      ? variantsList.filter((variant, index) => {
          if (index === 0 && !variant.quantity) {
            return false;
          }
          return true;
        })
      : variantsList;

  const isEmpty =
    !filteredVariants ||
    filteredVariants.length === 0 ||
    filteredVariants.every((variant) => !variant.quantity);

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
