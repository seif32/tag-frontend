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
  const totalPrice = effectivePrice?.bundlePrice || currentPrice;
  const subtotalPrice = effectivePrice?.bundleSubtotal || currentPrice;
  const quantity = effectivePrice?.quantity || 1;
  const savings = effectivePrice?.savings || 0;
  const vat = effectivePrice?.vat || selectedVariant?.vat || 0;

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">
        {categoryName} {subCategoryName && `• ${subCategoryName}`}
      </p>
      <h2 className="text-6xl font-bold font-degular">
        {displayName}{" "}
        {selectedVariant?.types?.map((type) => (
          <span key={type.type_id}>{type.value.name} </span>
        ))}
      </h2>
      {isAuthenticated && (
        <>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-medium font-degular">
              {formatCurrency(currentPrice)}
            </p>
            {quantity > 1 && (
              <span className="text-lg text-muted-foreground">each</span>
            )}
            {comparePrice && !selectedBundle && (
              <p className="font-medium line-through text-muted-foreground">
                {formatCurrency(comparePrice)}
              </p>
            )}
          </div>

          {quantity > 1 && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    Bundle Price: {quantity} × {formatCurrency(currentPrice)} ={" "}
                    {formatCurrency(subtotalPrice)}
                  </p>
                  {savings > 0 && (
                    <p className="text-green-600 text-sm font-medium">
                      You save {formatCurrency(savings)}!
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    {formatCurrency(totalPrice)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total incl. VAT
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs font-semibold text-red-600">
            + <span className="tracking-tighter">VAT</span>: {vat}%
            {quantity > 1 && (
              <span className="ml-2">
                ({formatCurrency(totalPrice - subtotalPrice)} VAT amount)
              </span>
            )}
          </p>
        </>
      )}
      <p className="text-sm leading-snug text-muted-foreground">
        {shortDescription}
      </p>
    </div>
  );
}

export default ProductInfoSection;
