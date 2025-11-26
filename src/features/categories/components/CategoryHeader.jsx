import { Sparkles, Grid3x3, TrendingUp } from "lucide-react";

export function CategoriesHeader() {
  return (
    <div className="text-center space-y-4 pb-8">
      {/* Icon Badge */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg mb-2">
        <Grid3x3 className="w-8 h-8 text-white" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Shop by{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Category
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600">
          Discover thousands of products organized just for you
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            Curated Collections
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Trending Now
          </span>
        </div>
      </div>
    </div>
  );
}
