import { Package } from "lucide-react";

function DashedIconEmptyState({ title, subtitle, icon }) {
  const Icon = icon || Package;
  return (
    <div className="flex justify-center flex-col items-center bg-stone-100 border-dashed border-stone-300 border h-60 rounded-xl gap-4">
      <div className="bg-stone-200 p-5 rounded-full">
        <Icon className="size-12 text-stone-700" />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

export default DashedIconEmptyState;
