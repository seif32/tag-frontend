// ProductCardImage.jsx
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

function ProductCardImage({ image, className = "", variantCount }) {
  return (
    <div
      className={`relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden ${className}`}
    >
      {/* Variant Count Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-white/95 backdrop-blur-sm text-gray-900 shadow-lg hover:bg-white border border-gray-200 flex items-center gap-1 px-2.5 py-1">
          <Layers size={12} />
          <span className="text-xs font-semibold">{variantCount}</span>
        </Badge>
      </div>

      {/* Image with Hover Effect */}
      <div className="relative w-full h-full overflow-hidden group">
        <img
          src={image || "/src/assets/product2.jpg"}
          alt="Product"
          className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
          loading="lazy"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Quick View Hint */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Quick View
        </div>
      </div>
    </div>
  );
}

export default ProductCardImage;
