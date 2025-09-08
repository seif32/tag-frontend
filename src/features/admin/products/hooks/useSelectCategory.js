import useCategories from "@/hooks/useCategories";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";

export function useSelectCategory() {
  const { categories, isLoadingCategories } = useCategories.useAll();
  const selectedCategoryId = useWatch({ name: "category_id" });

  const { mainCategories, subcategoriesByParent, hasSubcategories } =
    useMemo(() => {
      if (!categories)
        return {
          mainCategories: [],
          subcategoriesByParent: {},
          hasSubcategories: false,
        };

      const mainCategories = categories.data.map((category) => ({
        value: category.id,
        label: category.name,
      }));

      const subcategoriesByParent = {};
      let hasSubcategories = false;

      categories.data.forEach((mainCategory) => {
        if (
          mainCategory.subcategories &&
          mainCategory.subcategories.length > 0
        ) {
          hasSubcategories = true;
          subcategoriesByParent[mainCategory.id] = [];

          mainCategory.subcategories.forEach((subCategory) => {
            subcategoriesByParent[mainCategory.id].push({
              value: subCategory.id,
              label: subCategory.name,
              parent_id: subCategory.parent_id,
            });

            if (
              subCategory.subcategories &&
              subCategory.subcategories.length > 0
            ) {
              subCategory.subcategories.forEach((subSubCategory) => {
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

      return { mainCategories, subcategoriesByParent, hasSubcategories };
    }, [categories]);

  // 🎯 Check if selected category has subcategories
  const selectedCategoryHasSubcategories = selectedCategoryId
    ? subcategoriesByParent[selectedCategoryId]?.length > 0
    : false;

  return {
    categories,
    isLoadingCategories,
    selectedCategoryId,
    mainCategories,
    subcategoriesByParent,
    hasSubcategories,
    selectedCategoryHasSubcategories,
  };
}
