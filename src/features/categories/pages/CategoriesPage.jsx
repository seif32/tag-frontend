// src/features/categories/pages/CategoriesPage.jsx
import CategoryCard from "../components/CategoryCard";
import { CategoriesHeader } from "../components/CategoryHeader";

// 🎯 Import images properly
import useCategories from "@/hooks/useCategories";
import ErrorMessage from "@/ui/ErrorMessage";
import LoadingState from "@/ui/LoadingState";
import { useNavigate } from "react-router";

function CategoriesPage() {
  const navigate = useNavigate();
  const {
    categories,
    isErrorCategories,
    isLoadingCategories,
    errorCategories,
    refetchCategories,
  } = useCategories.useAll();

  if (isLoadingCategories)
    return <LoadingState type="card" rows={20} columns={3} />;

  if (isErrorCategories)
    return (
      <ErrorMessage
        message={errorCategories.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchCategories()}
      />
    );

  function handleViewSubcategoryProducts(categoryId, subcategoryId) {
    navigate(
      `/categories/${categoryId}/subcategories/${subcategoryId}/products`
    );
  }
  function handleViewCategoryProducts(categoryId) {
    navigate(`/categories/${categoryId}/products`);
  }

  return (
    <>
      <CategoriesHeader />
      <div className="mb-40 space-y-40">
        {categories.map((category) => {
          return (
            category.subcategories.length !== 0 && (
              <div key={category.id} className="">
                <h2
                  className="text-2xl font-bold text-foreground cursor-pointer inline hover:text-accent"
                  onClick={() => handleViewCategoryProducts(category.id)}
                >
                  {category.name}
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Explore our {category.active_product_count} products available
                  in here
                </p>
                {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-y-20 gap-x-6"> */}
                <div className="grid grid-cols-5 gap-y-20 gap-x-6">
                  {category.subcategories
                    // .filter((sub) => sub.active === 1)
                    .map((subcategory) => {
                      return (
                        <CategoryCard
                          key={subcategory.id}
                          name={subcategory.name}
                          storage={subcategory.active_product_count}
                          image={subcategory.image_url}
                          isActive={subcategory.active}
                          onViewSubcategoryProducts={
                            handleViewSubcategoryProducts
                          }
                          subcategoryId={subcategory.id}
                          categoryId={category.id}
                        />
                      );
                    })}
                </div>
              </div>
            )
          );
        })}
      </div>
    </>
  );
}

export default CategoriesPage;
