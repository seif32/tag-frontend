function ExtraInfoSection() {
  return (
    <div className="space-y-1">
      <div className="flex gap-1 text-sm text-muted-foreground">
        <p className="font-semibold">Brand : </p>
        <p>Apple</p>
      </div>
      <div className="flex gap-1 text-sm text-muted-foreground">
        <p className="font-semibold">SKU: </p>
        <p>DEF125</p>
      </div>
      <div className="flex gap-1 text-sm text-muted-foreground">
        <p className="font-semibold">Tags: </p>
        <p>Mobile, Electronics, Smart, Portable</p>
      </div>
    </div>
  );
}

export default ExtraInfoSection;
