import { Button } from "@/components/ui/button";

function AddProductsHeader({ onSubmit, handleSubmit }) {
  return (
    <div className="flex justify-between ">
      <h2 className="text-2xl font-bold">Add Product</h2>
      <Button onClick={() => handleSubmit(onSubmit)}>Save</Button>
    </div>
  );
}

export default AddProductsHeader;
