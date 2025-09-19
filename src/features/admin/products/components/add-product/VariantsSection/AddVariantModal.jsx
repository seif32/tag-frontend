import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useVariantStore from "@/features/admin/store/variantStore";
import useVariants from "@/hooks/useVariants";
import ErrorMessage from "@/ui/ErrorMessage";
import LoadingState from "@/ui/LoadingState";
import { useMemo, useState } from "react";

function AddVariantModal({ setDialogMode, onTypeSelected }) {
  const [selectedTypeId, setSelectedTypeId] = useState("");

  const {
    isLoadingVariantTypes,
    errorVariantTypes,
    isErrorVariantTypes,
    refetchVariantTypes,
  } = useVariants.useAllTypes();

  const availableTypes = useVariantStore((state) => state.availableTypes);
  const selectedTypes = useVariantStore((state) => state.selectedTypes);

  const filteredTypes = useMemo(() => {
    const selectedIds = new Set(selectedTypes.map((t) => t.id));
    return availableTypes?.filter((type) => !selectedIds.has(type.id));
  }, [availableTypes, selectedTypes]);

  function handleTypeSelection(value) {
    if (value === "custom") {
      setDialogMode("create");
      setSelectedTypeId("");
      onTypeSelected(null);
    } else {
      setSelectedTypeId(value);
      const selectedType = filteredTypes.find(
        (type) => type.id.toString() === value
      );
      onTypeSelected(selectedType);

      setDialogMode("select");
    }
  }

  if (isLoadingVariantTypes) return <LoadingState />;

  if (isErrorVariantTypes)
    return (
      <ErrorMessage
        message={errorVariantTypes.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchVariantTypes()}
      />
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="variant-type">Variant Type</Label>
        <Select value={selectedTypeId} onValueChange={handleTypeSelection}>
          <SelectTrigger>
            <SelectValue placeholder="Select variant type" />
          </SelectTrigger>
          <SelectContent>
            {filteredTypes?.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            ))}

            <SelectItem
              value="custom"
              className="bg-primary text-primary-foreground font-medium"
            >
              Add Custom Type
            </SelectItem>

            {filteredTypes?.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-gray-500 italic">
                All variant types are already added
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default AddVariantModal;
