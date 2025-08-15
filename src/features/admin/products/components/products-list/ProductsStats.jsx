import LoadingState from "@/ui/LoadingState";
import {
  AlertTriangle,
  CheckCircle,
  Package,
  Star,
  XCircle,
} from "lucide-react";

function ProductsStats({ data, isLoadingStats }) {
  if (isLoadingStats) return <LoadingState type="stats" columns={4} rows={1} />;
  const stats = [
    {
      icon: Package,
      label: "Total Products",
      value: data?.total_products || 0,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: CheckCircle,
      label: "Active Products",
      value: data?.active_products || 0,
      iconColor: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      icon: XCircle,
      label: "Inactive Products",
      value: data?.inactive_products || 0,
      iconColor: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      icon: Star,
      label: "Featured Products",
      value: data?.featured_products || 0,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
    // {
    //   icon: AlertTriangle,
    //   label: "Out of Stock",
    //   value: data?.out_of_stock_products || 0,
    //   iconColor: "text-orange-500",
    //   bgColor: "bg-orange-100",
    // },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => {
        return (
          <div
            key={stat.label}
            className="flex items-center gap-4 px-4 py-8 border rounded-md shadow-2xs justify-between"
          >
            <div className="flex flex-col">
              <p className="text-xs font-medium text-muted-foreground ">
                {stat.label}
              </p>
              <p className="text-3xl font-semibold font-degular">
                {stat.value}
              </p>
            </div>
            <div
              className={`${stat.bgColor} w-12 h-12 rounded-xl grid place-items-center`}
            >
              <stat.icon className={`w-6 h-6   ${stat.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductsStats;
