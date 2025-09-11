import useProductStore from "@/features/admin/store/productStore";

function ProductHeader({ product, productName }) {
  const mode = useProductStore((state) => state.mode);

  const notAddMode = mode !== "add";

  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        {notAddMode && (
          <h3 className="text-muted-foreground font-semibold text-sm">
            {productName}
          </h3>
        )}
        <h3 className="text-xs text-muted-foreground mb-2">
          {product.variant_sku}
        </h3>
        <div className="flex gap-2">
          {product?.types?.map((type) => (
            <span
              key={type.typeid}
              className="px-2 text-xs text-white bg-black border border-black rounded-md"
            >
              {notAddMode ? type?.value?.name : type?.selectedValue?.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductHeader;
