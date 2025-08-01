import VariantValueToggleGroup from "./VariantValueToggleGroup";

function VariantTypeRow({ variant }) {
  return (
    <div className="mb-4">
      <p className="font-medium capitalize mb-2">{variant.type}</p>
      <VariantValueToggleGroup variant={variant} />
    </div>
  );
}

export default VariantTypeRow;
