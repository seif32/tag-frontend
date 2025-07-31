import { Card, CardContent } from "@/components/ui/card";
import TagFormField from "../../../ui/TagFormField";

function SettingsSection() {
  return (
    <Card>
      <CardContent className={"space-y-4"}>
        <TagFormField
          name="featured"
          type="checkbox"
          label={"Mark as featured product"}
          className="flex flex-row-reverse justify-end gap-8 "
        />
        <TagFormField
          name="isAvailable"
          type="checkbox"
          label={"Product is available for sale"}
          className="flex flex-row-reverse justify-end gap-8"
        />
      </CardContent>
    </Card>
  );
}

export default SettingsSection;
