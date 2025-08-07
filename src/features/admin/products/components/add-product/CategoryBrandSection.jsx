import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TagFormField from "../../../ui/TagFormField";
import LoadingState from "@/ui/LoadingState";
import { useSelectCategory } from "../../hooks/useSelectCategory";
import { useSelectBrand } from "../../hooks/useSelectBrand";

function CategoryBrandSection() {
  const {
    isLoadingCategories,
    mainCategories,
    selectedCategoryId,
    subcategoriesByParent,
  } = useSelectCategory();

  const { allBrands, isLoadingBrands } = useSelectBrand();

  if (isLoadingCategories || isLoadingBrands) return <LoadingState />;

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
          options={allBrands}
          required
          placeholder="Select a brand"
        />
      </CardContent>
    </Card>
  );
}

export default CategoryBrandSection;
