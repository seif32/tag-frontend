import { useAuthStore } from "@/auth/store/authStore";
import { formatCurrency } from "@/utils/formatCurrency";

function ProductInfoSection({
  product,
  selectedVariant,
  effectivePrice,
  selectedBundle,
}) {
  const displayName = product?.name || "Product Name";
  const shortDescription =
    product?.short_description || "No description available.";
  const categoryName = product?.category_name || "";
  const subCategoryName = product?.sub_category_name || "";

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const currentPrice = effectivePrice?.unitPrice || selectedVariant?.price || 0;
  const comparePrice = selectedVariant?.compare_at_price;
  const quantity = effectivePrice?.quantity || 1;
  const savings = effectivePrice?.savings || 0;
  const vat = effectivePrice?.vat || selectedVariant?.vat || 0;

  // ✅ FIXED: Calculate prices correctly
  const subtotalBeforeVat = effectivePrice?.bundleSubtotal || currentPrice;
  const vatAmount = subtotalBeforeVat * (vat / 100);
  const totalWithVat = subtotalBeforeVat + vatAmount;

  const isBundle = quantity > 1;

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">
        {categoryName} {subCategoryName && `• ${subCategoryName}`}
      </p>

      <h2 className="text-3xl sm:text-6xl font-bold">
        {displayName}{" "}
        {selectedVariant?.types?.map((type) => (
          <span key={type.type_id}>{type.value.name} </span>
        ))}
      </h2>

      {isAuthenticated && (
        <>
          {/* Unit price */}
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-medium">
              {formatCurrency(currentPrice)}
            </p>
            {isBundle && (
              <span className="text-lg text-muted-foreground">each</span>
            )}
            {Boolean(comparePrice) && !selectedBundle && (
              <p className="font-medium line-through text-muted-foreground">
                {formatCurrency(comparePrice)}
              </p>
            )}
          </div>

          {/* ✅ FIXED: Bundle breakdown */}
          {isBundle && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  Bundle: {quantity} × {formatCurrency(currentPrice)} ={" "}
                  {formatCurrency(subtotalBeforeVat)}
                </p>
                <p className="text-xs text-gray-600">
                  VAT ({vat}%): {formatCurrency(vatAmount)}
                </p>
              </div>

              {savings > 0 && (
                <div className="pt-2 border-t border-blue-200">
                  <p className="text-green-600 text-sm font-semibold">
                    You save {formatCurrency(savings)}!
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-blue-200 flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">
                  Total (incl. VAT):
                </p>
                <p className="font-bold text-xl text-blue-600">
                  {formatCurrency(totalWithVat)}
                </p>
              </div>
            </div>
          )}

          {/* ✅ FIXED: Single item VAT */}
          {!isBundle && (
            <div className="flex items-baseline gap-2">
              <p className="text-sm text-gray-600">
                + VAT ({vat}%): {formatCurrency(vatAmount)}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                = {formatCurrency(totalWithVat)} total
              </p>
            </div>
          )}
        </>
      )}

      <p className="text-sm leading-snug text-muted-foreground pt-2">
        {shortDescription}
      </p>
    </div>
  );
}

export default ProductInfoSection;
