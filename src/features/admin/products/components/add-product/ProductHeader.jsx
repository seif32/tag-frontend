import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Share2, Copy, MoreHorizontal } from "lucide-react";
import useProductStore from "@/features/admin/store/productStore";

export default function ProductHeader({
  onSubmit,
  handleSubmit,
  productName,
  product,
}) {
  const mode = useProductStore((state) => state.mode);
  const setMode = useProductStore((state) => state.setMode);
  const isViewMode = mode === "view";

  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">
            {isViewMode ? productName : "Add Product"}
          </h2>

          {/* Quick status indicator */}
          {isViewMode && (
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  product?.active ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span className="text-sm text-gray-600">
                {product?.active ? "Live" : "Draft"}
              </span>
            </div>
          )}
        </div>

        {/* Product SKU or ID for reference */}
        {isViewMode && product?.sku && (
          <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
        )}
      </div>

      <div className="flex gap-2">
        {isViewMode ? (
          <Button onClick={() => setMode("edit")}>
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
        ) : (
          <>
            <Button variant="outline">Discard</Button>
            <Button onClick={() => handleSubmit(onSubmit)}>Save</Button>
          </>
        )}
      </div>
    </div>
  );
}
