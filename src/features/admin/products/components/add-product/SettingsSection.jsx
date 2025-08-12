import { Card, CardContent } from "@/components/ui/card";
import TagFormField from "../../../ui/TagFormField";
import useProductStore from "@/features/admin/store/productStore";
import LoadingState from "@/ui/LoadingState";

function SettingsSection() {
  const mode = useProductStore((state) => state.mode);

  return (
    <Card>
      <CardContent className={"space-y-4"}>
        {mode !== undefined ? (
          <>
            <TagFormField
              name="featured"
              type="checkbox"
              label={"Mark as featured product"}
              className="flex flex-row-reverse justify-end gap-8 "
              disabled={mode === "view"}
            />
            <TagFormField
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
