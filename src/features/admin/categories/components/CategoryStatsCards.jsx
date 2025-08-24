import { Layers, EyeOff, FolderX, Archive, Tag } from "lucide-react";
import StatsCard from "../../ui/StatsCard";
import { nanoid } from "nanoid";
import LoadingState from "@/ui/LoadingState";
import { consoleObject } from "@/utils/consoleObject";

function CategoryStatsCards({ calculatedStats, stats, isLoadingStats }) {
  if (isLoadingStats) return <LoadingState />;

  const inactiveSubcategories =
    calculatedStats.totalSubcategories - calculatedStats.activeSubcategories;
  consoleObject(stats);
  consoleObject(calculatedStats);

  const categoryStats = [
    {
      id: nanoid(),
      title: "Categories",
      icon: Tag,
      value: stats.total_categories,
      subtitle: "Main product categories",
    },
    {
      id: nanoid(),
      title: "Subcategories",
      icon: Layers,
      value: calculatedStats.totalSubcategories,
      subtitle: `${calculatedStats.activeSubcategories} active`,
    },
    {
      id: nanoid(),
      title: "Inactive Subcategories",
      icon: EyeOff,
      value: inactiveSubcategories,
      subtitle: "Hidden from products",
    },
    {
      id: nanoid(),
      title: "Empty Categories",
      icon: FolderX,
      value: stats.categories_without_products,
      subtitle: "Contain zero products",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categoryStats.map((stats) => {
        return (
          <StatsCard
            key={stats.id}
            icon={stats.icon}
            subtitle={stats.subtitle}
            title={stats.title}
            value={stats.value}
          />
        );
      })}
    </div>
  );
}

export default CategoryStatsCards;
