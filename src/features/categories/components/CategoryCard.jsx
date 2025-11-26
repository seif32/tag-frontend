import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, Sparkles } from "lucide-react";

function CategoryCard({
  name,
  storage,
  image,
  onViewSubcategoryProducts,
  subcategoryId,
  categoryId,
}) {
  const hasProducts = storage > 0;

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => onViewSubcategoryProducts(categoryId, subcategoryId)}
    >
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-300 group-hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={image || "/placeholder.svg"}
            alt={name}
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Product Count Badge */}
          <div className="absolute top-3 right-3">
            {hasProducts ? (
              <Badge className="bg-blue-600 hover:bg-blue-700 shadow-lg backdrop-blur-sm flex items-center gap-1 px-2.5 py-1">
                <Package className="w-3 h-3" />
                <span className="font-semibold">{storage}</span>
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-gray-100/90 backdrop-blur-sm shadow-lg"
              >
                Coming Soon
              </Badge>
            )}
          </div>

          {/* Trending Indicator (optional - for categories with high product count) */}
          {storage > 20 && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-600 hover:bg-green-700 shadow-lg backdrop-blur-sm flex items-center gap-1 px-2 py-1">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs">Popular</span>
              </Badge>
            </div>
          )}

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-2.5 shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-sm font-semibold text-gray-900">
                Browse Products →
              </span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 bg-white">
          <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3rem] leading-tight">
            {name}
          </h3>

          {/* Product Info Footer */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Explore Now
            </span>
            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <svg
                className="w-3 h-3 text-blue-600 group-hover:text-white transition-colors transform group-hover:translate-x-0.5"
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
      </div>
    </div>
  );
}

export default CategoryCard;
