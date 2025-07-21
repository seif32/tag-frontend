import { Badge } from "@/components/ui/badge";

// features/categories/components/CategoriesHeader.jsx
export function CategoriesHeader() {
  return (
    <div className="px-4 mx-auto mb-8 text-center bg-gray-50container">
      <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
        Shop by Category
      </h1>
      <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600">
        Explore our wide range of products across different categories
      </p>

      {/* Optional: Quick category filters */}
      <div className="flex flex-wrap justify-center gap-2">
        <Badge variant="secondary">Electronics</Badge>
        <Badge variant="secondary">Candies</Badge>
        <Badge variant="secondary">Fashion</Badge>
        <Badge variant="secondary">Books</Badge>
      </div>
    </div>
  );
}
