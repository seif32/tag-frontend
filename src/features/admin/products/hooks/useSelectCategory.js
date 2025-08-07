import useCategories from "@/hooks/useCategories";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";

export function useSelectCategory() {
  const { categories, isLoadingCategories } = useCategories.useAll();
  const selectedCategoryId = useWatch({ name: "categoryId" });

  const { mainCategories, subcategoriesByParent } = useMemo(() => {
    if (!categories) return { mainCategories: [], subcategoriesByParent: {} };

    // Main categories (top level)
    const mainCategories = categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));

    // Group subcategories by their main category ID
    const subcategoriesByParent = {};

    categories.forEach((mainCategory) => {
      if (mainCategory.children && mainCategory.children.length > 0) {
        // Create array for this main category's subcategories
        subcategoriesByParent[mainCategory.id] = [];

        mainCategory.children.forEach((subCategory) => {
          subcategoriesByParent[mainCategory.id].push({
            value: subCategory.id,
            label: subCategory.name,
            parent_id: subCategory.parent_id,
          });

          // Handle sub-subcategories if they exist
          if (subCategory.children && subCategory.children.length > 0) {
            subCategory.children.forEach((subSubCategory) => {
              subcategoriesByParent[mainCategory.id].push({
                value: subSubCategory.id,
                label: subSubCategory.name,
                parent_id: subSubCategory.parent_id,
              });
            });
          }
        });
      }
    });

    return { mainCategories, subcategoriesByParent };
  }, [categories]);

  return {
    categories,
    isLoadingCategories,
    selectedCategoryId,
    mainCategories,
    subcategoriesByParent,
  };
}
