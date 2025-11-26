import CategoryCard from "../components/CategoryCard";
import { CategoriesHeader } from "../components/CategoryHeader";
import useCategories from "@/hooks/useCategories";
import ErrorMessage from "@/ui/ErrorMessage";
import { IconEmptyState } from "@/ui/IconEmptyState";
import LoadingState from "@/ui/LoadingState";
import { ChevronRight, Package, Layers } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

function CategoriesPage() {
  const navigate = useNavigate();
  const {
    categories,
    isErrorCategories,
    isLoadingCategories,
    errorCategories,
    refetchCategories,
  } = useCategories.useAll({ limit: 99999 });

  if (isLoadingCategories) return <LoadingState type="page" />;

  if (isErrorCategories)
    return (
      <ErrorMessage
        message={errorCategories?.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchCategories()}
      />
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-12">
        {categories?.data.length === 0 ? (
          <IconEmptyState
            title="No Categories Found"
            subtitle="It looks like there are no categories available yet."
            height="py-40"
          />
        ) : (
          <>
            <CategoriesHeader />

            {categories.data.map((category, idx) => (
              <CategorySection
                key={category.id}
                category={category}
                navigate={navigate}
                isFirst={idx === 0}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;

// 🆕 Category Section Component
function CategorySection({ category, navigate, isFirst }) {
  return (
    <section className={`${isFirst ? "" : "pt-8 border-t border-gray-200"}`}>
      {/* Category Header */}
      <div className="flex items-center justify-between mb-6 group">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-2"
              onClick={() => navigate(`/categories/${category?.id}/products`)}
            >
              {category?.name}
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              {category?.active_product_count === 0
                ? "No products available yet"
                : `${category?.active_product_count} product${
                    category?.active_product_count !== 1 ? "s" : ""
                  } available`}
            </p>
          </div>
        </div>

        {/* View All Button */}
        {category?.active_product_count > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => navigate(`/categories/${category?.id}/products`)}
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Subcategories Grid */}
      {category.subcategories.length === 0 ? (
        <div className="flex items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No subcategories yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Check back later for new additions
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {category.subcategories.map((subcategory) => (
            <CategoryCard
              key={subcategory.id}
              name={subcategory.name}
              storage={subcategory.active_product_count}
              image={subcategory.image_url}
              onViewSubcategoryProducts={() =>
                navigate(
                  `/categories/${category?.id}/subcategories/${subcategory?.id}/products`
                )
              }
              subcategoryId={subcategory.id}
              categoryId={category.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
