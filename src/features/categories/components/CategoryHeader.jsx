import { Badge } from "@/components/ui/badge";

// features/categories/components/CategoriesHeader.jsx
export function CategoriesHeader() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Explore our wide range of products across different categories
        </p>

        {/* Optional: Quick category filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary">Electronics</Badge>
          <Badge variant="secondary">Candies</Badge>
          <Badge variant="secondary">Fashion</Badge>
          <Badge variant="secondary">Books</Badge>
        </div>
      </div>
    </section>
  );
}
