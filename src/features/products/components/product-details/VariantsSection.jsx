import { cn } from "@/lib/utils";

function VariantsSection({ variantBlocks = [], onVariantChange }) {
  if (variantBlocks.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <p className="text-sm font-medium">Available Variants:</p>
        <p className="text-sm text-muted-foreground">
          {variantBlocks.length} option{variantBlocks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* 🎯 Variant blocks grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {variantBlocks.map((block) => (
          <VariantBlock
            key={block.id}
            block={block}
            onClick={() => onVariantChange(block)}
          />
        ))}
      </div>
    </div>
  );
}

function VariantBlock({ block, onClick }) {
  const hasDiscount = block.comparePrice && block.comparePrice > block.price;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md",
        {
          "border-black bg-black/5": block.isSelected,
          "border-gray-200 hover:border-gray-300":
            !block.isSelected && block.isAvailable,
          "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60":
            !block.isAvailable,
        }
      )}
      disabled={!block.isAvailable}
    >
      {/* ✅ Selected indicator */}
      {block.isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* 🏷️ Combination name */}
      <div className="font-medium text-sm mb-2">{block.name}</div>

      {/* 💰 Price section */}
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-bold",
            block.isSelected ? "text-black" : "text-gray-900"
          )}
        >
          ${parseFloat(block.price).toFixed(2)}
        </span>

        {hasDiscount && (
          <span className="text-sm text-gray-500 line-through">
            ${parseFloat(block.comparePrice).toFixed(2)}
          </span>
        )}
      </div>

      {/* 📦 Availability indicator */}
      <div className="mt-2">
        {block.isAvailable ? (
          <span className="text-xs text-green-600 font-medium">✓ In Stock</span>
        ) : (
          <span className="text-xs text-red-500 font-medium">
            ✗ Out of Stock
          </span>
        )}
      </div>

      {/* 💾 Discount badge */}
      {hasDiscount && (
        <div className="absolute -top-4 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Save ${(block.comparePrice - block.price).toFixed(2)}
        </div>
      )}
    </div>
  );
}

export default VariantsSection;
