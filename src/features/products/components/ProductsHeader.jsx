import { Button } from "@/components/ui/button";
import { Filter, SortAsc } from "lucide-react";

export function ProductsHeader({ category, productCount }) {
  return (
    <section className="bg-white border-b py-4">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 ">
              {category ? `${category} Products` : "All Products"}
            </h1>
            <p className="text-gray-600">{productCount} products found</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
