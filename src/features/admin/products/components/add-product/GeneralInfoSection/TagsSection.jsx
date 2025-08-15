import { Card, CardContent } from "@/components/ui/card";
import useProductStore from "@/features/admin/store/productStore";
import TagFormField from "@/features/admin/ui/TagFormField";
import useTags from "@/hooks/useTags";
import LoadingState from "@/ui/LoadingState";
import { useFormContext, useWatch } from "react-hook-form";

export function TagsSection() {
  const selectedCategoryId = useWatch({ name: "category_id" });
  const { categoryTags, isLoadingCategoryTags } =
    useTags.useByCategoryId(selectedCategoryId);
  const mode = useProductStore((state) => state.mode);
  const { control } = useFormContext();

  const isViewMode = mode === "view";

  if (isLoadingCategoryTags) return <LoadingState type="form" rows={2} />;

  const tags =
    categoryTags?.map((tag) => ({
      value: tag.id,
      label: tag.name,
    })) || [];

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <label className="text-sm">Tags</label>
          </div>

          <div className="border border-gray-200 p-3 rounded-lg flex flex-wrap gap-2 min-h-[60px] mt-2 items-center justify-start">
            <TagFormField
              control={control}
              name="tags"
              type="toggle-group"
              toggleType="multiple"
              toggleSize="sm"
              options={tags}
              emptyMessage="No tags available for this category"
              triggerClassName="gap-2 "
              toggleItemClassName="px-4 py-2 text-sm font-medium rounded-md border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 data-[state=on]:border-blue-500 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 transition-all duration-200 text-xs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TagsSection;
