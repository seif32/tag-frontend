// src/features/categories/pages/CategoriesPage.jsx
import CategoryCard from "../components/CategoryCard";
import { CategoriesHeader } from "../components/CategoryHeader";

// 🎯 Import images properly
import Image1 from "@/assets/product4.jpg";
import Image2 from "@/assets/product5.jpg";
import Image3 from "@/assets/product6.jpg";
import Image4 from "@/assets/product7.jpg";
import Image5 from "@/assets/product8.jpg";
import Image6 from "@/assets/product9.jpg";
import useCategories from "@/hooks/useCategories";
import ErrorMessage from "@/ui/ErrorMessage";
import LoadingState from "@/ui/LoadingState";
import { consoleObject } from "@/utils/consoleObject";

function CategoriesPage() {
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

  return (
    <>
      <CategoriesHeader />
      <div className="space-y-40 mb-40">
        {categories.map((category) => {
          return (
            category.subcategories.length !== 0 && (
              <div key={category.id} className="">
                <h2 className="text-2xl font-bold text-foreground">
                  {category.name}
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Explore our {category.product_count} products available in
                  here
                </p>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-y-20 gap-x-6">
                  {category.subcategories.map((subcategory) => {
                    return (
                      <CategoryCard
                        key={subcategory.id}
                        name={subcategory.name}
                        storage={458}
                        image={Image1}
                        onClick={() => console.log("Navigate to mobiles")}
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
