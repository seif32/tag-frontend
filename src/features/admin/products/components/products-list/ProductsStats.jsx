import StatsCard from "@/features/admin/ui/StatsCard";
import LoadingState from "@/ui/LoadingState";
import {
  AlertTriangle,
  CheckCircle,
  Package,
  Star,
  XCircle,
} from "lucide-react";
import { nanoid } from "nanoid";

function ProductsStats({ data, isLoadingStats }) {
  if (isLoadingStats) return <LoadingState type="stats" columns={4} rows={1} />;
  const stats = [
    {
      id: nanoid(),
      icon: Package,
      title: "Total Products",
      value: data?.total_products || 0,
      subtitle: "All inventory items",
    },
    {
      id: nanoid(),
      icon: CheckCircle,
      title: "Active Products",
      value: data?.active_products || 0,
      subtitle: "Currently available online",
    },
    {
      id: nanoid(),
      icon: XCircle,
      title: "Inactive Products",
      value: data?.inactive_products || 0,
      subtitle: "Hidden from customers",
    },
    {
      id: nanoid(),
      icon: Star,
      title: "Featured Products",
      value: data?.featured_products || 0,
      subtitle: "Promoted on homepage",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {stats.map((stat) => {
        return (
          <StatsCard
            key={stat.id}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
          />
        );
      })}
    </div>
  );
}

export default ProductsStats;
