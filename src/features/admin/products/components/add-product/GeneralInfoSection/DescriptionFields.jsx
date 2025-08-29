import TagFormField from "@/features/admin/ui/TagFormField";
import { useFormContext } from "react-hook-form";

function DescriptionFields({ mode }) {
  const { control } = useFormContext();
  return (
    <>
      <TagFormField
        control={control}
        name={"description"}
        label={"Full Description"}
        type="textarea"
        rows={5}
        placeholder="Describe your product in detail..."
        disabled={mode === "view"}
      />
      <TagFormField
        control={control}
        name={"short_description"}
        label={"Short Description"}
        type="textarea"
        rows={2}
        placeholder="Brief product summary..."
        disabled={mode === "view"}
      />
    </>
  );
}

export default DescriptionFields;
