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
import CreateVariantModal from "./CreateVariantModal";
import useVariants from "@/hooks/useVariants";

function AddVariantDialog() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("select");
  const [currentSelectedType, setCurrentSelectedType] = useState(null);
  const [customTypeName, setCustomTypeName] = useState("");

  const addSelectedType = useVariantStore((state) => state.addSelectedType);

  const { createVariantType, isPendingVariantTypes } =
    useVariants.useCreateType();

  function handleAddVariantType() {
    let typeToAdd = null;

    if (dialogMode === "select" && currentSelectedType) {
      typeToAdd = currentSelectedType;
    } else if (dialogMode === "create" && customTypeName.trim()) {
      typeToAdd = { name: customTypeName.trim() };
      createVariantType(typeToAdd);
    }

    if (typeToAdd) {
      addSelectedType(typeToAdd);

      setCurrentSelectedType(null);
      setCustomTypeName("");
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
          {dialogMode === "create" && (
            <CreateVariantModal
              customTypeName={customTypeName}
              setCustomTypeName={setCustomTypeName}
              setDialogMode={setDialogMode}
            />
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={handleAddVariantType}
              disabled={
                (dialogMode === "select" && !currentSelectedType) ||
                (dialogMode === "create" &&
                  !customTypeName.trim() &&
                  isPendingVariantTypes)
              }
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
