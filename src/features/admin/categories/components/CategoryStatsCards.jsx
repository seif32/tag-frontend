import { Layers, EyeOff, FolderX, Archive, Tag } from "lucide-react";
import StatsCard from "../../ui/StatsCard";
import { nanoid } from "nanoid";
import LoadingState from "@/ui/LoadingState";
function CategoryStatsCards({ stats, isLoadingStats }) {
  if (isLoadingStats) return <LoadingState />;

  const categoryStats = [
    {
      id: nanoid(),
      title: "Total Subcategories",
      icon: Layers,
      value: stats?.total_sub_categories ?? 0,
      subtitle: "All subcategories listed",
    },
    {
      id: nanoid(),
      title: "Active Subcategories",
      icon: Archive,
      value: stats?.sub_categories_with_products ?? 0,
      subtitle: "Linked to products",
    },
    {
      id: nanoid(),
      title: "Inactive Subcategories",
      icon: EyeOff,
      value: stats?.sub_categories_without_products ?? 0,
      subtitle: "No products assigned",
    },
    {
      id: nanoid(),
      title: "Empty Subcategories",
      icon: FolderX,
      value: stats?.sub_categories_without_products ?? 0, // Same as above, feel free to change!
      subtitle: "Contain zero products",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {categoryStats.map((item) => (
        <StatsCard
          key={item.id}
          icon={item.icon}
          subtitle={item.subtitle}
          title={item.title}
          value={item.value}
        />
      ))}
    </div>
  );
}

export default CategoryStatsCards;
