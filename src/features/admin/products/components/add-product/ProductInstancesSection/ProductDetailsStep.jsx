import { useFormContext, useFieldArray } from "react-hook-form";
import useProductStore from "@/features/admin/store/productStore";
import useVariantStore from "@/features/admin/store/variantStore";
import StepHeader from "@/features/admin/ui/StepHeader";
import TagFormField from "@/features/admin/ui/TagFormField";

function ProductDetailsStep() {
  const { control, getValues, resetField } = useFormContext();
  const { append } = useFieldArray({ control, name: "variants" });

  const baseName = useProductStore((state) => state.baseName);
  const selectedValues = useVariantStore((state) => state.selectedValues);

  const handleVariantSubmit = () => {
    // Grab the current input values from "template" index 0
    const variantData = getValues("variants.0");

    // Merge with Zustand selected values
    const finalVariant = {
      ...variantData,
      types: selectedValues,
    };

    // Add this variant to the field array
    append(finalVariant);

    // ✅ Clear only the first visible input fields
    resetField("variants.0.variantName");
    resetField("variants.0.variantSku");
    resetField("variants.0.quantity");
    resetField("variants.0.price");
    resetField("variants.0.currency");
    resetField("variants.0.compareAtPrice");
    resetField("variants.0.costPrice");
    // Optionally reset selected values
    useVariantStore.getState().resetSelectedValues();
  };

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
              key={value.typeid}
              className="text-xs h-fit bg-white rounded-sm px-4 py-0.5"
            >
              {value.value.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Always keep only ONE input group visible */}
      <TagFormField
        name="variants.0.variantName"
        label="Name"
        placeholder="e.g., Samsung Galaxy red"
      />
      <div className="flex gap-2">
        <TagFormField
          name="variants.0.variantSku"
          label="SKU"
          placeholder="e.g., SMG-RED-128GB"
        />
        <TagFormField
          name="variants.0.quantity"
          label="Quantity"
          placeholder="e.g., 50"
        />
      </div>

      <div className="flex items-end gap-2">
        <TagFormField
          name="variants.0.price"
          label="Price"
          description="Customer will pay this"
          placeholder="e.g., 899.99"
        />
        <TagFormField
          name="variants.0.currency"
          label="Currency"
          placeholder="e.g., USD"
        />
      </div>

      <div className="flex items-end gap-2">
        <TagFormField
          name="variants.0.compareAtPrice"
          label="Compare at Price"
          description="Strikethrough Original price"
          placeholder="e.g., 1099.99"
        />
        <TagFormField
          name="variants.0.costPrice"
          label="Cost Price"
          description="Used for profit analytics."
          placeholder="e.g., 700.00"
        />
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={handleVariantSubmit}
        className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
      >
        Save Variant & Reset
      </button>
    </div>
  );
}

export default ProductDetailsStep;
