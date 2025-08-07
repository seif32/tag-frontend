import { Button } from "@/components/ui/button";

function AddProductsHeader({ onSubmit, handleSubmit }) {
  return (
    <div className="flex justify-between ">
      <h2 className="text-2xl font-bold">Add Product</h2>
      <div className="flex gap-2">
        <Button
          variant={"outline"}
          className={
            "border-red-500 text-red-600 hover:bg-red-600 hover:text-white"
          }
        >
          Discard Changes
        </Button>
        <Button onClick={() => handleSubmit(onSubmit)}>Save</Button>
      </div>
    </div>
  );
}

export default AddProductsHeader;
