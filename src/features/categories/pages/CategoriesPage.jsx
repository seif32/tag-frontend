import CategoryCard from "../components/CategoryCard";
import { CategoriesHeader } from "../components/CategoryHeader";

import useCategories from "@/hooks/useCategories";
import ErrorMessage from "@/ui/ErrorMessage";
import { IconEmptyState } from "@/ui/IconEmptyState";
import LoadingState from "@/ui/LoadingState";
import { Package } from "lucide-react";
import { useNavigate } from "react-router";

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
    <>
      <div className="space-y-15">
        {categories?.data.length === 0 ? (
          <IconEmptyState
            title="No Categories Found"
            subtitle="It looks like there are no categories available yet."
            height={"py-40"}
          />
        ) : (
          <>
            <CategoriesHeader />
            {categories.data.map((category) => {
              return (
                <div key={category.id}>
                  <h2
                    className="inline  text-xl sm:text-2xl font-bold cursor-pointer text-foreground hover:text-accent"
                    onClick={() =>
                      navigate(`/categories/${category?.id}/products`)
                    }
                  >
                    {category?.name}
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    {category?.active_product_count === 0
                      ? "No products yet"
                      : `Explore our ${category?.active_product_count} products
                  available in here`}
                  </p>
                  <div className="grid md:grid-cols-4 grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-y-12 ">
                    {category.subcategories.length === 0 ? (
                      <div className="font-bold">No subcategories</div>
                    ) : (
                      category.subcategories.map((subcategory) => {
                        return (
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
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

export default CategoriesPage;
