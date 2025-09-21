import { useAuthStore } from "@/auth/store/authStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { FaStar } from "react-icons/fa";

function ProductInfoSection({ product, selectedVariant }) {
  const displayName = product?.name || "Product Name";
  const vat = selectedVariant?.vat || "N/A";

  const currentPrice = selectedVariant?.price || "0.00";
  const comparePrice = selectedVariant?.compare_at_price;
  const rating = parseFloat(product?.rating || 0);
  const ratingCount = product?.rating_count || 0;
  const shortDescription =
    product?.short_description || "No description available.";
  const categoryName = product?.category_name || "";
  const subCategoryName = product?.sub_category_name || "";

  const filledStars = Math.floor(rating);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">
        {categoryName} {subCategoryName && `• ${subCategoryName}`}
      </p>

      <h2 className="text-6xl font-bold font-degular">
        {displayName}{" "}
        {selectedVariant.types.map((type) => (
          <span key={type.type_id}>{type.value.name} </span>
        ))}
      </h2>

      <div className="flex items-end gap-2">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`w-4 h-4 ${
                i < filledStars ? "text-yellow-500" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="text-sm leading-none">
          {rating.toFixed(1)} <span className="">({ratingCount} Reviews)</span>
        </div>
      </div>

      {isAuthenticated && (
        <div className="flex items-baseline gap-1">
          <p className="text-4xl font-medium font-degular">
            {formatCurrency(currentPrice)}
          </p>
          {comparePrice && (
            <p className="font-medium line-through text-muted-foreground">
              {formatCurrency(comparePrice)}
            </p>
          )}
        </div>
      )}

      <p className="text-xs font-semibold text-red-600">
        + <span className="tracking-tighter">VAT</span>: {formatCurrency(vat)}
      </p>
      <p className="text-sm leading-snug text-muted-foreground">
        {shortDescription}
      </p>
    </div>
  );
}

export default ProductInfoSection;
