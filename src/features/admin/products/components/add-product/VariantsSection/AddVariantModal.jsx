import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useVariantStore from "@/features/admin/store/variantStore";

const VARIANT_TYPES = [
  { value: "color", label: "Color" },
  { value: "size", label: "Size" },
  { value: "material", label: "Material" },
  { value: "style", label: "Style" },
  { value: "storage", label: "Storage" },
  { value: "__ADD_CUSTOM__", label: "Add Custom Type" },
];

function AddVariantModal({ setDialogMode, setNewVariantType, newVariantType }) {
  const getAvailableVariantTypes = useVariantStore(
    (state) => state.getAvailableVariantTypes
  );

  // 🔥 Get only available variant types (excludes already selected ones)
  const availableVariantTypes = getAvailableVariantTypes(VARIANT_TYPES);

  function handleTypeSelection(value) {
    if (value === "__ADD_CUSTOM__") {
      setDialogMode("create");
      setNewVariantType("");
    } else {
      setNewVariantType(value);
      setDialogMode("select");
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
            {/* 🎪 Only show available variant types! */}
            {availableVariantTypes.map((type) => (
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

            {/* 🎯 Show helpful message when no options available */}
            {availableVariantTypes.filter((t) => t.value !== "__ADD_CUSTOM__")
              .length === 0 && (
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
