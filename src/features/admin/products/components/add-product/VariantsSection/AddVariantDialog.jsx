import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddVariantModal from "./AddVariantModal";
import { useState } from "react";
import useVariantStore from "@/features/admin/store/variantStore";

function AddVariantDialog() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("select");
  const [currentSelectedType, setCurrentSelectedType] = useState(null);

  const addSelectedType = useVariantStore((state) => state.addSelectedType);

  function handleAddVariantType() {
    if (currentSelectedType) {
      addSelectedType(currentSelectedType);

      setCurrentSelectedType(null);
      setIsAddDialogOpen(false);
      setDialogMode("select");
    }
  }

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} className="gap-2 bg-accent text-xs">
          Add Variant
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dialogMode === "select" ? "Add New Variant" : "Create Custom Type"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {dialogMode === "select" && (
            <AddVariantModal
              setDialogMode={setDialogMode}
              onTypeSelected={setCurrentSelectedType}
            />
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={handleAddVariantType}
              disabled={!currentSelectedType}
              className="min-w-24"
            >
              Add Variant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddVariantDialog;
