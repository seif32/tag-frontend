// ProductCardInfo.jsx
import { Badge } from "@/components/ui/badge";
import { Box, Tag, Layers } from "lucide-react";

function ProductCardInfo({ category, name, brand, variants }) {
  return (
    <div className="flex flex-col p-4 gap-3 bg-gradient-to-b from-white to-gray-50">
      {/* Category Tag */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md">
          <Box size={12} className="text-blue-600" />
          <span className="text-[10px] font-medium text-blue-700 uppercase tracking-wide">
            {category}
          </span>
        </div>
      </div>

      {/* Product Name */}
      <h3 className="font-bold leading-tight text-base md:text-lg text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
        {name}
      </h3>

      {/* Variants */}
      {variants && variants.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Layers size={14} className="text-gray-400 flex-shrink-0" />
          <div className="flex gap-1 flex-wrap">
            {variants.slice(0, 3).map((variant, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {variant}
              </Badge>
            ))}
            {variants.length > 3 && (
              <Badge
                variant="secondary"
                className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-700"
              >
                +{variants.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Brand */}
      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <Tag size={14} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-600 truncate">
            {brand}
          </span>
        </div>

        {/* View Details Arrow */}
        <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ProductCardInfo;
