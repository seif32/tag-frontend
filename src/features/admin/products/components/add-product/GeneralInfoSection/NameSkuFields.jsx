import { useFormContext } from "react-hook-form";
import useProductStore from "@/features/admin/store/productStore";
import TagFormField from "@/features/admin/ui/TagFormField";

function NameSkuFields({ mode }) {
  const { getValues, control } = useFormContext();

  const setBaseName = useProductStore((state) => state.setBaseName);

  const handleBlur = () => {
    const finalName = getValues("name");
    setBaseName(finalName);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <TagFormField
        control={control}
        name="name"
        label="Product Name"
        placeholder="Enter product name"
        required
        onBlur={handleBlur}
        disabled={mode === "view"}
      />
      <TagFormField
        control={control}
        name="sku"
        label="SKU"
        placeholder="PROD-001"
        required
        disabled={mode === "view"}
      />
    </div>
  );
}

export default NameSkuFields;
