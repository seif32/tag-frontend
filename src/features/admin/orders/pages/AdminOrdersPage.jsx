import StatsCard from "../../ui/StatsCard";

import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const statsData = [
  // {
  //   title: "Total Revenue",
  //   icon: DollarSign,
  //   value: "$24,847.50",
  //   subtitle: "All completed orders",
  // },
  {
    title: "Total Orders",
    icon: ShoppingBag,
    value: "1,247",
    subtitle: "All orders ever placed",
  },
  {
    title: "Pending Orders",
    icon: Clock,
    value: "23",
    subtitle: "Needs immediate attention",
  },
  {
    title: "Completed Orders",
    icon: CheckCircle,
    value: "1,156",
    //           subtitle: `${((stats?.completedOrders / stats?.totalOrders) * 100).toFixed(1)}% success rate`
    // ,
    subtitle: "92.7% success rate",
  },
  {
    title: "Cancelled Orders",
    icon: XCircle,
    value: "68",
    // subtitle: `${((stats?.cancelledOrders / stats?.totalOrders) * 100).toFixed(1)}% cancellation rate`
    // ,
    subtitle: "5.5% cancellation rate",
  },
];

function AdminOrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl">Orders</h1>
        <p className="text-muted-foreground">
          Manage all your orders from here
        </p>
      </div>
      <StatsContainer />
    </div>
  );
}

export default AdminOrdersPage;

function StatsContainer() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          icon={stat.icon}
          value={stat.value}
          subtitle={stat.subtitle}
        />
      ))}{" "}
    </div>
  );
}
