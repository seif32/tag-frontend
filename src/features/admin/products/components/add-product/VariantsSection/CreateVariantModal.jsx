import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoArrowBackOutline } from "react-icons/io5";

function CreateVariantModal({
  customTypeName,
  setCustomTypeName,
  setDialogMode,
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="custom-type">Custom Type Name</Label>
        <Input
          id="custom-type"
          value={customTypeName}
          onChange={(e) => setCustomTypeName(e.target.value)}
          placeholder="e.g., Warranty Period"
          className="w-48"
          autoFocus
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDialogMode("select")}
        className="gap-2 self-start"
      >
        <IoArrowBackOutline size={14} />
        Back to Selection
      </Button>
    </div>
  );
}

export default CreateVariantModal;
