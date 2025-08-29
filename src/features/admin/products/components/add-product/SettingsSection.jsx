import { Card, CardContent } from "@/components/ui/card";
import TagFormField from "../../../ui/TagFormField";
import useProductStore from "@/features/admin/store/productStore";
import { Controller, useFormContext } from "react-hook-form";
import { BadgeCheck, Check, CircleX, Cross } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={mode === "view"}
                  />
                )}
              />
              <Label htmlFor="featured">Mark as featured product</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={mode === "view"}
                  />
                )}
              />
              <Label htmlFor="active">Product is available for sale</Label>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default SettingsSection;
