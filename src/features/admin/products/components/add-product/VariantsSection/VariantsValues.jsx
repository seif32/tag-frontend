import VariantValueDialog from "./VariantValueDialog";
import VariantValueList from "./VariantValueList";

function VariantsValues({ variant }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Values</p>
      <div className="flex flex-wrap gap-2 p-3 rounded-lg border min-h-[60px]">
        <VariantValueList variant={variant} />
        <VariantValueDialog variant={variant} />
      </div>
    </div>
  );
}

export default VariantsValues;
