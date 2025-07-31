function VariantsType({ variantType }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Type</p>
      <h3 className="text-sm font-medium capitalize">{variantType}</h3>
    </div>
  );
}

export default VariantsType;
