import { Card, CardContent } from "@/components/ui/card";
import ProductHeader from "./ProductHeader";
import ProductDetails from "./ProductDetails";
import NoProducts from "./NoProducts";

function ProductCard({
  setEditingProductId,
  setFormData,
  setIsAddDialogOpen,
  setProducts,
  products,
}) {
  return (
    <CardContent className="space-y-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardContent className="pt-6">
            <ProductHeader
              product={product}
              setEditingProductId={setEditingProductId}
              setFormData={setFormData}
              setIsAddDialogOpen={setIsAddDialogOpen}
              setProducts={setProducts}
            />

            <ProductDetails product={product} />
          </CardContent>
        </Card>
      ))}

      {products.length === 0 && <NoProducts />}
    </CardContent>
  );
}

export default ProductCard;
