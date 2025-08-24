import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TagFormField from "../../../ui/TagFormField";
import LoadingState from "@/ui/LoadingState";
import { useSelectCategory } from "../../hooks/useSelectCategory";
import { useSelectBrand } from "../../hooks/useSelectBrand";
import useProductStore from "@/features/admin/store/productStore";
import { useFormContext } from "react-hook-form";

function CategoryBrandSection() {
  const mode = useProductStore((state) => state.mode);
  const isViewMode = mode === "view";
  const { control } = useFormContext();

  const {
    isLoadingCategories,
    mainCategories,
    selectedCategoryId,
    subcategoriesByParent,
    selectedCategoryHasSubcategories,
  } = useSelectCategory(mode);
  const { allBrands, isLoadingBrands } = useSelectBrand(mode);

  if (isLoadingCategories || isLoadingBrands) return <LoadingState />;

  return (
    <Card>
      <CardHeader className={"font-bold"}>Category & Brand</CardHeader>
      <CardContent className={"space-y-4"}>
        <TagFormField
          control={control}
          name={"category_id"}
          label={"Category"}
          type="select"
          options={mainCategories}
          required
          placeholder="Select a category"
          disabled={isViewMode}
        />
        <TagFormField
          control={control}
          name={"subcategory_id"}
          label={"Sub-category"}
          type="select"
          placeholder={
            selectedCategoryId
              ? selectedCategoryHasSubcategories
                ? "Select a subcategory"
                : "No subcategories available"
              : "First select a category"
          }
          disabled={isViewMode || isLoadingCategories || !selectedCategoryId}
          options={
            selectedCategoryId
              ? subcategoriesByParent[selectedCategoryId] || []
              : []
          }
          emptyMessage={
            selectedCategoryId && !selectedCategoryHasSubcategories
              ? "🏷️ This category has no subcategories available"
              : null
          }
        />
        <TagFormField
          control={control}
          name={"brand_id"}
          label={"Brand"}
          type="combobox"
          options={allBrands}
          required
          placeholder="Select a brand"
          disabled={isViewMode}
        />
      </CardContent>
    </Card>
  );
}

export default CategoryBrandSection;
