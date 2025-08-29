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
    <TagFormField
      control={control}
      name="name"
      label="Product Name"
      placeholder="Enter product name"
      onBlur={handleBlur}
      disabled={mode === "view"}
    />
  );
}

export default NameSkuFields;
