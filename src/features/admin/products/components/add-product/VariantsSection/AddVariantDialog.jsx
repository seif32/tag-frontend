import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateVariantModal from "./CreateVariantModal";
import AddVariantModal from "./AddVariantModal";
import { useSelectVariantType } from "../../../hooks/useSelectVariantType";

function AddVariantDialog() {
  const {
    dialogMode,
    isAddDialogOpen,
    isLoadingVariantTypes,
    newVariantTypeId,
    setDialogMode,
    setIsAddDialogOpen,
    setNewVariantTypeId,
    customTypeName,
    handleAddVariant,
    isPendingVariantTypes,
    resetDialog,
    setCustomTypeName,
  } = useSelectVariantType();

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
          {isLoadingVariantTypes ? (
            <div className="flex justify-center py-4">
              <div className="text-sm text-gray-500">
                Loading variant types... 🔄
              </div>
            </div>
          ) : (
            <>
              {dialogMode === "select" && (
                <AddVariantModal
                  newVariantTypeId={newVariantTypeId}
                  setDialogMode={setDialogMode}
                  setNewVariantTypeId={setNewVariantTypeId}
                />
              )}

              {dialogMode === "create" && (
                <CreateVariantModal
                  customTypeName={customTypeName}
                  setCustomTypeName={setCustomTypeName}
                  setDialogMode={setDialogMode}
                />
              )}
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={resetDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleAddVariant}
              disabled={
                isLoadingVariantTypes ||
                isPendingVariantTypes ||
                (dialogMode === "select"
                  ? !newVariantTypeId
                  : !customTypeName.trim())
              }
              className="min-w-24"
            >
              {isPendingVariantTypes
                ? "Creating... ⏳"
                : dialogMode === "create"
                ? "Create & Add"
                : "Add Variant"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddVariantDialog;
