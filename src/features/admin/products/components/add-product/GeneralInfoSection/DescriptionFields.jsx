import TagFormField from "@/features/admin/ui/TagFormField";

function DescriptionFields() {
  return (
    <>
      <TagFormField
        name={"fullDescription"}
        label={"Full Description"}
        type="textarea"
        rows={5}
        placeholder="Describe your product in detail..."
        required
      />
      <TagFormField
        name={"shortDescription"}
        label={"Short Description"}
        type="textarea"
        rows={2}
        placeholder="Brief product summary..."
        required
      />
    </>
  );
}

export default DescriptionFields;
