import { Card, CardContent } from "@/components/ui/card";
import ProductHeader from "./ProductHeader";
import ProductDetails from "./ProductDetails";
import NoProducts from "./NoProducts";
import { Button } from "@/components/ui/button";
import useFilteredVariants from "../../../hooks/useFilteredVariants";

function ProductCard({ variantsList, onEditProduct }) {
  const { filteredVariants, isEmpty } = useFilteredVariants(variantsList);

  return (
    <CardContent className="space-y-4">
      {filteredVariants.map((product, index) => (
        <Card key={product.id || index}>
          <CardContent>
            <div className="flex justify-between">
              <ProductHeader product={product} />
              <Button
                type="button" // Important: prevent parent form submission
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProduct(product); // Use the passed handler
                }}
                size={"sm"}
              >
                Edit
              </Button>
            </div>
            <ProductDetails product={product} />
          </CardContent>
        </Card>
      ))}

      {isEmpty && <NoProducts />}
    </CardContent>
  );
}

export default ProductCard;
