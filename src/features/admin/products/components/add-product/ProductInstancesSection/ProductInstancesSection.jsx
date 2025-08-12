import { Card, CardHeader } from "@/components/ui/card";

import ProductCard from "./ProductCard";
import AddProductSheet from "./AddProductSheet";
import useProductStore from "@/features/admin/store/productStore";

function ProductInstancesSection() {
  const mode = useProductStore((state) => state.mode);
  const isViewMode = mode === "view";
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <h2 className="font-semibold text-md">Products</h2>
        {!isViewMode && <AddProductSheet />}
      </CardHeader>
      <ProductCard />
    </Card>
  );
}

export default ProductInstancesSection;
