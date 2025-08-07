import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TagFormField from "../../../ui/TagFormField";
import useCategories from "@/hooks/useCategories";
import LoadingState from "@/ui/LoadingState";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";

function CategoryBrandSection() {
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

  // useEffect(() => {
  //   setValue("subcategoryId", "");
  // }, [selectedCategoryId]);

  if (isLoadingCategories) return <LoadingState />;

  return (
    <Card>
      <CardHeader>Category & Brand</CardHeader>
      <CardContent className={"space-y-4"}>
        <TagFormField
          name={"categoryId"}
          label={"Category"}
          type="select"
          options={mainCategories}
          required
          placeholder="Select a category"
        />
        <TagFormField
          name={"subcategoryId"}
          label={"Sub-category"}
          type="select"
          placeholder={
            selectedCategoryId
              ? "Select a subcategory"
              : "First select a category"
          }
          disabled={isLoadingCategories || !selectedCategoryId}
          options={
            selectedCategoryId
              ? subcategoriesByParent[selectedCategoryId] || []
              : []
          }
        />
        <TagFormField
          name={"brandId"}
          label={"Brand"}
          type="select"
          options={[{ value: 3, label: "Apple" }]}
          required
          placeholder="Apple"
        />
      </CardContent>
    </Card>
  );
}

export default CategoryBrandSection;
