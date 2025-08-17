import { Card, CardContent } from "@/components/ui/card";
import TagFormField from "../../../ui/TagFormField";
import useProductStore from "@/features/admin/store/productStore";
import { useFormContext } from "react-hook-form";
import { BadgeCheck, Check, CircleX, Cross } from "lucide-react";

function SettingsSection({ isActive, isFeatured }) {
  const mode = useProductStore((state) => state.mode);
  const { control } = useFormContext();
  const isViewMode = mode === "view";

  return (
    <Card>
      <CardContent className={"space-y-4"}>
        <p className="mb-4 font-bold">Product Settings</p>
        {isViewMode ? (
          <div className="flex flex-wrap gap-3">
            {/* Featured Status Badge */}
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                isFeatured
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {isFeatured ? (
                <>
                  <BadgeCheck size={16} className="text-green-600" />
                  <span>Featured</span>
                </>
              ) : (
                <>
                  <CircleX size={16} className="text-gray-500" />
                  <span>Not Featured</span>
                </>
              )}
            </div>

            {/* Active Status Badge */}
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {isActive ? (
                <>
                  <BadgeCheck size={16} className="text-blue-600" />
                  <span>Active</span>
                </>
              ) : (
                <>
                  <CircleX size={16} className="text-red-600" />
                  <span>Inactive</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <TagFormField
              control={control}
              name="featured"
              type="checkbox"
              label={"Mark as featured product"}
              className="flex flex-row-reverse justify-end gap-8 "
              disabled={mode === "view"}
            />
            <TagFormField
              control={control}
              name="active"
              type="checkbox"
              label={"Product is available for sale"}
              className="flex flex-row-reverse justify-end gap-8"
              disabled={mode === "view"}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default SettingsSection;
