import { Card, CardHeader } from "@/components/ui/card";

import ProductCard from "./ProductCard";
import AddProductSheet from "./AddProductSheet";

function ProductInstancesSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <h2 className="font-semibold text-md">Products</h2>
        <AddProductSheet />
      </CardHeader>
      <ProductCard />
    </Card>
  );
}

export default ProductInstancesSection;
