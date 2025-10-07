import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useVariants from "@/hooks/useVariants";
import ErrorMessage from "@/ui/ErrorMessage";
import LoadingState from "@/ui/LoadingState";
import { formatDateShort } from "@/utils/dateUtils";
import { ArrowLeft, Plus, SquarePen } from "lucide-react";
import { useNavigate, useParams } from "react-router";

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

function AdminVariantsValuesPage() {
  const { typeId } = useParams();
  const {
    variantValues,
    isLoadingVariantValues,
    isErrorVariantValues,
    errorVariantValues,
    refetchVariantValues,
  } = useVariants.useValuesByType(typeId, { limit: 999999 });

  const { createManyValues, isPendingVariantValues: isAddingValue } =
    useVariants.useCreateManyValues();
  const { updateValue, isPendingVariantValues: isUpdatingValue } =
    useVariants.useUpdateValue();

  const [isValueDialogOpen, setIsValueDialogOpen] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const [newValueName, setNewValueName] = useState("");
  const [editValueId, setEditValueId] = useState(null);

  function handleCreateValue() {
    if (!newValueName.trim()) return;

    const data = {
      variant_type_id: Number(typeId),
      values: [newValueName],
    };

    createManyValues(data, {
      onSuccess: () => {
        setNewValueName("");
        setIsValueDialogOpen(false);
      },
    });
  }

  function handleEditValue(value) {
    setEditingValue(value);
    setNewValueName(value?.value);
    setEditValueId(value?.id);
    setIsValueDialogOpen(true);
  }

  function handleUpdateValue() {
    if (!newValueName.trim() || !editingValue) return;

    const payload = {
      id: editValueId,
      data: { value: newValueName, variant_type_id: typeId },
    };

    updateValue(payload, {
      onSuccess: () => {
        setEditingValue(null);
        setNewValueName("");
        setIsValueDialogOpen(false);
      },
    });
  }

  function resetDialogs() {
    setEditingValue(null);
    setNewValueName("");
  }

  if (isLoadingVariantValues) return <LoadingState type="table" />;

  if (isErrorVariantValues)
    return (
      <ErrorMessage
        message={errorVariantValues.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchVariantValues()}
      />
    );

  return (
    <div className="space-y-5 p-6">
      <Title
        editingValue={editingValue}
        handleCreateValue={handleCreateValue}
        handleUpdateValue={handleUpdateValue}
        isValueDialogOpen={isValueDialogOpen}
        newValueName={newValueName}
        resetDialogs={resetDialogs}
        setIsValueDialogOpen={setIsValueDialogOpen}
        setNewValueName={setNewValueName}
        isAddingValue={isAddingValue}
        isUpdatingValue={isUpdatingValue}
        variantTypeName={variantValues?.variant_type_name}
      />
      <ValuesTable
        values={variantValues?.data}
        onEditValue={handleEditValue}
        variantTypeName={variantValues?.variant_type_name}
      />
    </div>
  );
}

export default AdminVariantsValuesPage;

function Title({
  isValueDialogOpen,
  setIsValueDialogOpen,
  resetDialogs,
  editingValue,
  newValueName,
  setNewValueName,
  handleUpdateValue,
  handleCreateValue,
  isAddingValue,
  isUpdatingValue,
  variantTypeName,
}) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-1.5">
          <ArrowLeft
            className="cursor-pointer hover:text-accent"
            onClick={() => navigate("/admin/variants")}
          />
          <h1 className="text-3xl">{variantTypeName} variant values</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage by creating a new one or edit an existing one
        </p>
      </div>
      <AddValueModal
        editingValue={editingValue}
        handleCreateValue={handleCreateValue}
        handleUpdateValue={handleUpdateValue}
        isValueDialogOpen={isValueDialogOpen}
        newValueName={newValueName}
        resetDialogs={resetDialogs}
        setIsValueDialogOpen={setIsValueDialogOpen}
        setNewValueName={setNewValueName}
        isAddingValue={isAddingValue}
        isUpdatingValue={isUpdatingValue}
      />
    </div>
  );
}

function AddValueModal({
  isValueDialogOpen,
  setIsValueDialogOpen,
  resetDialogs,
  editingValue,
  newValueName,
  setNewValueName,
  handleUpdateValue,
  handleCreateValue,
  isAddingValue,
  isUpdatingValue,
}) {
  return (
    <Dialog
      open={isValueDialogOpen}
      onOpenChange={(open) => {
        setIsValueDialogOpen(open);
        if (!open) resetDialogs();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Value
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingValue ? "Edit Value" : `Add New  Value`}
          </DialogTitle>
          <DialogDescription>
            {editingValue
              ? "Update the value details below."
              : `Add a new value to the variant type.`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="value-name" className={"mb-2"}>
              Name
            </Label>
            <Input
              id="value-name"
              value={newValueName}
              onChange={(e) => setNewValueName(e.target.value)}
              placeholder="e.g., Red, Large, Cotton"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsValueDialogOpen(false);
              resetDialogs();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editingValue ? handleUpdateValue : handleCreateValue}
            disabled={editingValue ? isUpdatingValue : isAddingValue}
          >
            {editingValue ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ValuesTable({ values = [], onEditValue, variantTypeName }) {
  return (
    <Table>
      <TableCaption>
        {values?.length === 0
          ? `No values for variant ${variantTypeName}, add it's first . . .`
          : `Values for variant ${variantTypeName}`}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead className={"text-right"}>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {values?.map((value) => (
          <TableRow key={value?.id}>
            <TableCell className="text-xs">#{value?.id}</TableCell>
            <TableCell className={"font-medium"}>{value?.value}</TableCell>
            <TableCell className={"text-muted-foreground "}>
              {formatDateShort(value?.created_at)}
            </TableCell>
            <TableCell className={"text-muted-foreground "}>
              {formatDateShort(value?.updated_at)}
            </TableCell>
            <TableCell className={" flex justify-end text-accent"}>
              <SquarePen
                className="text-right size-4 cursor-pointer"
                onClick={() => onEditValue(value)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
