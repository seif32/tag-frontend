import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import useProductStore from "@/features/admin/store/productStore";
import { useNavigate } from "react-router";

export default function ProductHeader({
  onSubmit,
  handleSubmit,
  productName,
  isProductActive,
  productSku,
}) {
  const mode = useProductStore((state) => state.mode);
  const setMode = useProductStore((state) => state.setMode);
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <ArrowLeft
            className="cursor-pointer hover:text-accent/70"
            onClick={() => navigate("/admin/products")}
          />
          <h2 className="text-2xl font-bold">
            {isViewMode
              ? productName
              : isEditMode
              ? "Edit Product"
              : "Add Product"}
          </h2>
          {isViewMode && (
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isProductActive ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span className="text-sm text-gray-600">
                {isProductActive ? "Live" : "Draft"}
              </span>
            </div>
          )}
        </div>

        {isViewMode && productSku && (
          <p className="mt-1 text-sm text-gray-500">SKU: {productSku}</p>
        )}
      </div>

      <div className="flex gap-2">
        {!isViewMode && (
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/admin/products")}
            >
              Discard
            </Button>
            <Button onClick={() => handleSubmit(onSubmit)}>Save</Button>
          </>
        )}
      </div>
    </div>
  );
}
