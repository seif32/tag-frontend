import TagFormField from "@/features/admin/ui/TagFormField";

function NameSkuFields() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TagFormField
        name={"name"}
        label={"Product Name"}
        placeholder="Enter product name"
        required
      />

      <TagFormField
        name={"sku"}
        label={"SKU"}
        placeholder="PROD-001"
        required
      />
    </div>
  );
}

export default NameSkuFields;
