import { Package } from "lucide-react";

export function IconEmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex items-center justify-center w-24 h-24 mb-6 bg-gray-100 rounded-full">
        <Package className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold text-gray-900">{title}</h2>
      <p className="max-w-md mb-6 text-gray-600">{subtitle}</p>
    </div>
  );
}
