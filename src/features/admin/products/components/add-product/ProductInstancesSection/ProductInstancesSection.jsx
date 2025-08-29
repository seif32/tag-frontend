import { Card, CardHeader } from "@/components/ui/card";

import ProductCard from "./ProductCard";
import AddProductSheet from "./AddProductSheet";
import useProductStore from "@/features/admin/store/productStore";

function ProductInstancesSection({ variantsList, append }) {
  const mode = useProductStore((state) => state.mode);
  const isAddMode = mode === "add";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <h2 className="font-semibold text-md">Products</h2>
        {isAddMode && (
          <AddProductSheet append={append} variantsList={variantsList} />
        )}
      </CardHeader>
      <ProductCard variantsList={variantsList} />
    </Card>
  );
}

export default ProductInstancesSection;
