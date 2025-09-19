import { Button } from "@/components/ui/button";
import useVariants from "@/hooks/useVariants";
import ErrorMessage from "@/ui/ErrorMessage";
import LoadingState from "@/ui/LoadingState";
import { Ellipsis, Package, Plus, SwatchBook, Tag } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// const {
//   variantValues,
//   isLoadingVariantValues,
//   errorVariantValues,
//   isErrorVariantValues,
//   refetchVariantValues,
// } = useVariants.useAllValues();

function AdminVariantsTypesPage() {
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [editTypeId, setEditTypeId] = useState(null);

  const { createVariantType, isPendingVariantTypes: isAddType } =
    useVariants.useCreateType();
  const { updateVariantType, isPendingVariantTypes: isUpdateType } =
    useVariants.useUpdateType();

  const resetDialogs = () => {
    setEditingType(null);
    setNewTypeName("");
  };

  function handleCreateType() {
    if (!newTypeName.trim()) return;

    createVariantType(
      { name: newTypeName },
      {
        onSuccess: () => {
          setNewTypeName("");
          setIsTypeDialogOpen(false);
        },
      }
    );
  }

  function handleEditType(type) {
    setEditingType(type);
    setNewTypeName(type?.name);
    setEditTypeId(type?.id);
    setIsTypeDialogOpen(true);
  }

  function handleUpdateType() {
    if (!newTypeName.trim() || !editingType) return;

    // console.log("newTypeName", newTypeName);

    updateVariantType(
      { id: editTypeId, data: { name: newTypeName } },
      {
        onSuccess: () => {
          setEditingType(null);
          setNewTypeName("");
          setIsTypeDialogOpen(false);
        },
      }
    );
  }
  return (
    <div className="space-y-9">
      <Title
        handleCreateType={handleCreateType}
        handleUpdateType={handleUpdateType}
        newTypeName={newTypeName}
        setNewTypeName={setNewTypeName}
        isTypeDialogOpen={isTypeDialogOpen}
        setIsTypeDialogOpen={setIsTypeDialogOpen}
        editingType={editingType}
        resetDialogs={resetDialogs}
      />
      <TypeCardContainer onEditType={handleEditType} />
    </div>
  );
}

export default AdminVariantsTypesPage;

function Title({
  editingType,
  handleCreateType,
  handleUpdateType,
  isTypeDialogOpen,
  newTypeName,
  resetDialogs,
  setIsTypeDialogOpen,
  setNewTypeName,
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-semibold">Variant Management</h1>
        <p className="text-muted-foreground">
          Manage product variant types and their values
        </p>
      </div>
      <AddTypeModal
        editingType={editingType}
        handleCreateType={handleCreateType}
        handleUpdateType={handleUpdateType}
        isTypeDialogOpen={isTypeDialogOpen}
        newTypeName={newTypeName}
        resetDialogs={resetDialogs}
        setIsTypeDialogOpen={setIsTypeDialogOpen}
        setNewTypeName={setNewTypeName}
      />
    </div>
  );
}

function AddTypeModal({
  isTypeDialogOpen,
  setIsTypeDialogOpen,
  resetDialogs,
  editingType,
  newTypeName,
  setNewTypeName,
  handleCreateType,
  handleUpdateType,
}) {
  return (
    <Dialog
      open={isTypeDialogOpen}
      onOpenChange={(open) => {
        setIsTypeDialogOpen(open);
        if (!open) resetDialogs();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Variant Type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingType ? "Edit Variant Type" : "Create New Variant Type"}
          </DialogTitle>
          <DialogDescription>
            {editingType
              ? "Update the variant type details below."
              : "Add a new variant type to organize your product variations."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="type-name">Name</Label>
            <Input
              id="type-name"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="e.g., Color, Size, Material"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsTypeDialogOpen(false);
              resetDialogs();
            }}
          >
            Cancel
          </Button>
          <Button onClick={editingType ? handleUpdateType : handleCreateType}>
            {editingType ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TypeCardContainer({ onEditType }) {
  const {
    variantTypes,
    errorVariantTypes,
    isErrorVariantTypes,
    isLoadingVariantTypes,
    refetchVariantTypes,
  } = useVariants.useAllTypes();

  if (isLoadingVariantTypes) return <LoadingState type="stats" />;

  if (isErrorVariantTypes) {
    return (
      <ErrorMessage
        message={errorVariantTypes?.message || "Failed to load data"}
        dismissible
        onDismiss={refetchVariantTypes}
      />
    );
  }

  return (
    <div className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid gap-3 ">
      {variantTypes?.data?.map((type) => (
        <TypeCard key={type?.id} type={type} onEditType={onEditType} />
      ))}
    </div>
  );
}

function TypeCard({ type, onEditType }) {
  return (
    <div className="border rounded-2xl p-8 space-y-5 bg-white">
      <CardHeader type={type} onEditType={onEditType} />
      <CardValues />
      <CardButton />
    </div>
  );
}

function CardHeader({ type, onEditType }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <div className="bg-gray-200 p-2 rounded-full">
          <SwatchBook />
        </div>
        <span className="font-medium">{type?.name}</span>
      </div>
      <Ellipsis
        className="size-4"
        onClick={() => {
          onEditType(type);
        }}
      />
    </div>
  );
}

function CardValues() {
  return (
    <div className="text-xs space-y-0">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Values</span>
        <span className="p-1 text-center px-2 rounded-sm bg-gray-100">7</span>
      </div>
      <div className="flex flex-wrap gap-1">
        <span className=" px-2 rounded-md border border-black">Red</span>
        <span className=" px-2 rounded-md border border-black">Red</span>
        <span className=" px-2 rounded-md border border-black">Red</span>
      </div>
    </div>
  );
}

function CardButton() {
  return (
    <Button className={"w-full"} variant={"outline"}>
      Manage Values
    </Button>
  );
}
