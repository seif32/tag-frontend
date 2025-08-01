import StepHeader from "@/features/admin/ui/StepHeader";
import TagFormField from "@/features/admin/ui/TagFormField";

function ProductDetailsStep() {
  return (
    <div className="space-y-4">
      <StepHeader step={2} title={"Tell Us About Your Product"} />
      <div className="bg-black rounded-lg flex items-center ">
        <h3 className="font-degular text-xl text-white px-3 py-4">
          Samsung Galaxy
        </h3>
        <div className="flex flex-wrap gap-1">
          <span className=" text-xs h-fit bg-white rounded-sm px-4 py-0.5  ">
            Red
          </span>
        </div>
      </div>
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

      <div className="flex gap-2  items-end">
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

      <div className="flex gap-2 items-end">
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
