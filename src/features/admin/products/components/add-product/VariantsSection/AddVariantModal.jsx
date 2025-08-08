// AddVariantModal.jsx - Clean Backend-Only Version
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

function AddVariantModal({
  setDialogMode,
  setNewVariantTypeId,
  newVariantTypeId,
}) {
  const { variantTypes } = useVariants.useAllTypes();

  const getAvailableVariantTypes = useVariantStore(
    (state) => state.getAvailableVariantTypes
  );

  const availableVariantTypes = getAvailableVariantTypes(variantTypes || []);

  function handleTypeSelection(value) {
    if (value === "custom") {
      setDialogMode("create");
      setNewVariantTypeId("");
    } else {
      setNewVariantTypeId(parseInt(value));
      setDialogMode("select");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="variant-type">Variant Type</Label>
        <Select
          value={newVariantTypeId?.toString()}
          onValueChange={handleTypeSelection}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select variant type" />
          </SelectTrigger>
          <SelectContent>
            {/* 🎪 Map directly from backend types! */}
            {availableVariantTypes.map((type) => (
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

            {availableVariantTypes.length === 0 && (
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
