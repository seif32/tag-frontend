import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import CreateVariantModal from "./CreateVariantModal";
import AddVariantModal from "./AddVariantModal";
import useVariantStore from "@/features/admin/store/variantStore";

function AddVariantDialog() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("select");
  const [newVariantType, setNewVariantType] = useState("");
  const [customTypeName, setCustomTypeName] = useState("");

  const addVariant = useVariantStore((state) => state.addVariant);

  function handleAddVariant() {
    const typeToAdd =
      dialogMode === "create" ? customTypeName.toLowerCase() : newVariantType;

    if (!typeToAdd.trim()) return;

    const newVariant = {
      id: Date.now().toString(),
      type: typeToAdd,
      values: [],
    };

    addVariant(newVariant);

    resetDialog();
  }

  function resetDialog() {
    setNewVariantType("");
    setCustomTypeName("");
    setDialogMode("select");
    setIsAddDialogOpen(false);
  }

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="gap-2">
          <IoAddOutline size={16} />
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
              newVariantType={newVariantType}
              setDialogMode={setDialogMode}
              setNewVariantType={setNewVariantType}
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
            <Button variant="outline" onClick={resetDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleAddVariant}
              disabled={
                dialogMode === "select"
                  ? !newVariantType
                  : !customTypeName.trim()
              }
              className="min-w-24"
            >
              {dialogMode === "create" ? "Create & Add" : "Add Variant"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddVariantDialog;
