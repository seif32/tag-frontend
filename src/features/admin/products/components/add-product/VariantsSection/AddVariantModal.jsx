import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VARIANT_TYPES = [
  { value: "color", label: "Color" },
  { value: "size", label: "Size" },
  { value: "material", label: "Material" },
  { value: "style", label: "Style" },
  { value: "storage", label: "Storage" },
  { value: "__ADD_CUSTOM__", label: "Add Custom Type" }, // Special identifier
];

function AddVariantModal({ setDialogMode, setNewVariantType, newVariantType }) {
  function handleTypeSelection(value) {
    if (value === "__ADD_CUSTOM__") {
      setDialogMode("create"); // Switch to custom creation mode
      setNewVariantType(""); // Clear selection
    } else {
      setNewVariantType(value);
      setDialogMode("select"); // Stay in selection mode
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="variant-type">Variant Type</Label>
        <Select value={newVariantType} onValueChange={handleTypeSelection}>
          <SelectTrigger>
            <SelectValue placeholder="Select variant type" />
          </SelectTrigger>
          <SelectContent>
            {VARIANT_TYPES.map((type) => (
              <SelectItem
                key={type.value}
                value={type.value}
                className={
                  type.value === "__ADD_CUSTOM__"
                    ? "bg-primary text-primary-foreground font-medium"
                    : ""
                }
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default AddVariantModal;
