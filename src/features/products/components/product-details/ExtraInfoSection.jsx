function ExtraInfoSection({ product, selectedVariant }) {
  const brandName = product?.brand_name || "Unknown";
  const variantSku = selectedVariant?.variant_sku || product?.sku || "N/A";
  const tags = product?.tags?.map((tag) => tag.name).join(", ") || "No tags";

  const inStock = selectedVariant.quantity >= 1;

  return (
    <div className="space-y-1">
      {/* 🏷️ Brand info */}
      <div className="flex gap-1 text-sm text-muted-foreground">
        <p className="font-semibold">Brand : </p>
        <p>{brandName}</p>
      </div>

      {/* 📦 SKU - shows variant SKU or product SKU */}
      <div className="flex gap-1 text-sm text-muted-foreground">
        <p className="font-semibold">SKU: </p>
        <p>{variantSku}</p>
      </div>

      {/* 🏷️ Dynamic tags */}
      <div className="flex gap-1 text-sm text-muted-foreground">
        <p className="font-semibold">Tags: </p>
        <p>{tags}</p>
      </div>

      {/* ⚡ Variant-specific info */}
      {selectedVariant && (
        <>
          <div className="flex gap-1 text-sm text-muted-foreground">
            <p className="font-semibold">Stock: </p>
            <p className={inStock ? "text-green-600" : "text-red-600"}>
              {inStock
                ? `${selectedVariant.quantity} available`
                : "Out of stock"}
            </p>
          </div>

          {/* {selectedVariant.has_discount === 1 && (
            <div className="flex gap-1 text-sm text-muted-foreground">
              <p className="font-semibold">Status: </p>
              <p className="font-medium text-red-600">On Sale! 🔥</p>
            </div>
          )} */}
        </>
      )}
    </div>
  );
}

export default ExtraInfoSection;
