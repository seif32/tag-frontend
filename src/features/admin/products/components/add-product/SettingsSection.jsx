import { Card, CardContent } from "@/components/ui/card";
import TagFormField from "../../../ui/TagFormField";
import useProductStore from "@/features/admin/store/productStore";
import LoadingState from "@/ui/LoadingState";
import { useFormContext } from "react-hook-form";

function SettingsSection() {
  const mode = useProductStore((state) => state.mode);
  const { control } = useFormContext();

  return (
    <Card>
      <CardContent className={"space-y-4"}>
        {mode !== undefined ? (
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
        ) : (
          <LoadingState type="form" />
        )}
      </CardContent>
    </Card>
  );
}

export default SettingsSection;
