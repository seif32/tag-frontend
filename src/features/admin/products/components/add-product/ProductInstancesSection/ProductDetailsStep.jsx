import useProductStore from "@/features/admin/store/productStore";
import StepHeader from "@/features/admin/ui/StepHeader";
import TagFormField from "@/features/admin/ui/TagFormField";

function ProductDetailsStep() {
  const baseName = useProductStore((state) => state.baseName);
  return (
    <div className="space-y-4">
      <StepHeader step={2} title={"Tell Us About Your Product"} />
      <div className="flex items-center bg-black rounded-lg ">
        <h3 className="px-3 py-4 text-xl text-white font-degular">
          {baseName}
        </h3>
        <div className="flex flex-wrap gap-1">
          <span className=" text-xs h-fit bg-white rounded-sm px-4 py-0.5  ">
            Red
          </span>
        </div>
      </div>
      <TagFormField
        name={"variants.variantName"}
        label={"Name"}
        placeholder="e.g., Samsung Galaxy red"
      />
      <div className="flex gap-2">
        <TagFormField
          name={"variants.variantSku"}
          label={"SKU"}
          placeholder="e.g., SMG-RED-128GB"
        />
        <TagFormField
          name={"variants.quantity"}
          label={"Quantity"}
          placeholder="e.g., 50"
        />
      </div>

      <div className="flex items-end gap-2">
        <TagFormField
          name={"variants.price"}
          label={"Price"}
          description="Customer will pay this"
          placeholder="e.g., 899.99"
        />
        <TagFormField
          name={"variants.currency"}
          label={"Currency"}
          placeholder="e.g., USD"
        />
      </div>

      <div className="flex items-end gap-2">
        <TagFormField
          name={"variants.compareAtPrice"}
          label={"Compare at Price"}
          description="Strikethrough Original price"
          placeholder="e.g., 1099.99"
        />
        <TagFormField
          name={"variants.costPrice"}
          label={"Cost Price"}
          description="Used for profit analytics."
          placeholder="e.g., 700.00"
        />
      </div>
    </div>
  );
}

export default ProductDetailsStep;
