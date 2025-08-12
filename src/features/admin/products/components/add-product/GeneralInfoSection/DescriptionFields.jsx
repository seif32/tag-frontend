import TagFormField from "@/features/admin/ui/TagFormField";

function DescriptionFields({ mode }) {
  return (
    <>
      <TagFormField
        name={"description"}
        label={"Full Description"}
        type="textarea"
        rows={5}
        placeholder="Describe your product in detail..."
        required
        disabled={mode === "view"}
      />
      <TagFormField
        name={"short_description"}
        label={"Short Description"}
        type="textarea"
        rows={2}
        placeholder="Brief product summary..."
        required
        disabled={mode === "view"}
      />
    </>
  );
}

export default DescriptionFields;
