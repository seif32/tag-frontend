import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useProductStore from "@/features/admin/store/productStore";
import TagFormField from "@/features/admin/ui/TagFormField";
import useTags from "@/hooks/useTags";
import LoadingState from "@/ui/LoadingState";
import { useFormContext, useWatch } from "react-hook-form";

export function TagsSection({ productTags }) {
  const selectedCategoryId = useWatch({ name: "category_id" });
  const { categoryTags, isLoadingCategoryTags } =
    useTags.useByCategoryId(selectedCategoryId);
  const mode = useProductStore((state) => state.mode);
  const { control } = useFormContext();

  const isViewMode = mode === "view";

  if (isLoadingCategoryTags) return <LoadingState type="form" rows={2} />;

  const tags =
    categoryTags?.results.map((tag) => ({
      value: tag.id,
      label: tag.name,
    })) || [];

  return (
    <Card>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-6">
            <label className="font-bold ">Tags</label>
            {isViewMode && productTags?.length > 0 && (
              <span className="text-xs text-gray-500">
                ({productTags.length})
              </span>
            )}
          </div>

          {isViewMode ? (
            <ViewModeTags tags={productTags} />
          ) : (
            <EditModeTags control={control} tags={tags} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const ViewModeTags = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return <div className="py-2 text-sm text-gray-500">No tags assigned</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Badge
          key={tag.id || index}
          variant="secondary"
          className="px-3 py-1 text-sm text-gray-700 bg-gray-100 "
        >
          {tag.name || tag.label}
        </Badge>
      ))}
    </div>
  );
};

const EditModeTags = ({ control, tags }) => (
  <div className="border border-gray-200 p-3 rounded-lg flex flex-wrap gap-2 min-h-[60px] items-center">
    <TagFormField
      control={control}
      name="tags"
      type="toggle-group"
      toggleType="multiple"
      toggleSize="sm"
      options={tags}
      emptyMessage="No tags available for this category"
      triggerClassName="gap-2"
      toggleItemClassName="px-4 py-2 text-sm font-medium rounded-md border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 data-[state=on]:border-blue-500 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 transition-all duration-200 text-xs"
    />
  </div>
);

export default TagsSection;
