import useProductStore from "@/features/admin/store/productStore";
import useVariantStore from "@/features/admin/store/variantStore";
import StepHeader from "@/features/admin/ui/StepHeader";
import TagFormField from "@/features/admin/ui/TagFormField";
import { useFormContext } from "react-hook-form";

function ProductDetailsStep() {
  const baseName = useProductStore((state) => state.baseName);
  const selectedValues = useVariantStore((state) => state.selectedValues);
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <StepHeader step={2} title="Tell Us About Your Product" />

      <div className="flex items-center bg-black rounded-lg ">
        <h3 className="px-3 py-4 text-xl text-white font-degular">
          {baseName}
        </h3>
        <div className="flex flex-wrap gap-1">
          {selectedValues.map((value) => (
            <span
              key={value.type_id}
              className="text-xs h-fit bg-white rounded-sm px-4 py-0.5"
            >
              {value.value.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <TagFormField
        control={control}
        name="variants.0.variant_name"
        label="Name"
        placeholder="e.g., Samsung Galaxy red"
        required
      />
      <div className="flex gap-2">
        <TagFormField
          control={control}
          name="variants.0.variant_sku"
          label="SKU"
          placeholder="e.g., SMG-RED-128GB"
          required
        />
        <TagFormField
          control={control}
          name="variants.0.quantity"
          label="Quantity"
          placeholder="e.g., 50"
          required
        />
      </div>

      <div className="flex items-end gap-2">
        <TagFormField
          control={control}
          name="variants.0.price"
          label="Price"
          placeholder="e.g., 899.99"
          required
        />
        <TagFormField
          control={control}
          name="variants.0.currency"
          label="Currency"
          placeholder="e.g., USD"
          required
        />
      </div>

      <div className="flex items-end gap-2">
        <TagFormField
          control={control}
          name="variants.0.compare_at_price"
          label="Compare at Price"
          placeholder="e.g., 1099.99"
          required
        />
        <TagFormField
          control={control}
          name="variants.0.cost_price"
          label="Cost Price"
          placeholder="e.g., 700.00"
          required
        />
      </div>
    </div>
  );
}

export default ProductDetailsStep;
