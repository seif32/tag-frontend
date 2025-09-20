import { useState } from "react";
import StatsCard from "../../ui/StatsCard";

import { ShoppingBag, Clock, CheckCircle, PlusCircle } from "lucide-react";
import { useOrderColumns } from "../components/useOrderColumns";
import { useNavigate } from "react-router";
import useOrders from "@/hooks/useOrders";
import LoadingState from "@/ui/LoadingState";
import OrderDataTable from "../components/OrderDataTable";
import ErrorMessage from "@/ui/ErrorMessage";

function AdminOrdersPage() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });

  const {
    ordersLight,
    isLoadingOrdersLight,
    errorOrdersLight,
    isErrorOrdersLight,
    refetchOrdersLight,
  } = useOrders.useAllWithoutItems({
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
    search: filters.search,
    ...(filters.search &&
      !isNaN(Number(filters.search)) && { id: Number(filters.search) }),
    ...(filters.search &&
      isNaN(Number(filters.search)) && { name: filters.search }),
    ...(filters.status && { status: filters.status }),
  });

  function handleEditOrder(order) {
    navigate(`/admin/orders/${order?.id}`);
  }
  function handleDeleteOrder() {}

  const columns = useOrderColumns({
    onView: (order) => navigate(`/admin/orders/${order.id}`),
    onEdit: handleEditOrder,
    onDelete: handleDeleteOrder,
  });

  if (isLoadingOrdersLight) return <LoadingState type="table" />;

  if (isErrorOrdersLight) {
    return (
      <ErrorMessage
        message={errorOrdersLight?.message || "Failed to load data"}
        dismissible
        onDismiss={refetchOrdersLight}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl">Orders</h1>
        <p className="text-muted-foreground">
          Manage all your orders from here
        </p>
      </div>
      <StatsContainer />

      <OrderDataTable
        columns={columns}
        data={ordersLight?.data || []}
        pageCount={ordersLight?.totalPages}
        totalCount={ordersLight?.total || 0}
        sorting={sorting}
        filters={filters}
        onSortingChange={setSorting}
        onFiltersChange={setFilters}
        isLoading={isLoadingOrdersLight}
      />
    </div>
  );
}

export default AdminOrdersPage;

function StatsContainer() {
  const {
    orderStats,
    isLoadingOrderStats,
    isErrorOrderStats,
    errorOrderStats,
    refetchOrderStats,
  } = useOrders.useStats();

  if (isLoadingOrderStats) return <LoadingState type="stats" />;

  if (isErrorOrderStats) {
    return (
      <ErrorMessage
        message={errorOrderStats?.message || "Failed to load data"}
        dismissible
        onDismiss={refetchOrderStats}
      />
    );
  }

  function stats(stats) {
    return [
      {
        title: "Total Orders",
        icon: ShoppingBag,
        value: stats.total_orders,
        subtitle: "All orders ever placed",
      },
      {
        title: "New Orders",
        icon: PlusCircle,
        value: stats.new_orders,
        subtitle: "Recently placed orders",
      },

      {
        title: "Pending Orders",
        icon: Clock,
        value: stats.pending_orders,
        subtitle: "Needs immediate attention",
      },
      {
        title: "Delivered Orders",
        icon: CheckCircle,
        value: stats.delivered_orders,
        subtitle: `${(
          (stats?.delivered_orders / stats?.total_orders) *
          100
        ).toFixed(1)}% success rate`,
      },
    ];
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {stats(orderStats).map((stat, index) => (
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
