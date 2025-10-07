import { useState } from "react";
import StatsCard from "../../ui/StatsCard";

import {
  ShoppingBag,
  Clock,
  CheckCircle,
  PlusCircle,
  RefreshCcw,
} from "lucide-react";
import { useOrderColumns } from "../components/useOrderColumns";
import { useNavigate } from "react-router";
import useOrders from "@/hooks/useOrders";
import LoadingState from "@/ui/LoadingState";
import OrderDataTable from "../components/OrderDataTable";
import ErrorMessage from "@/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import ControlsBar from "@/ui/ControlsBar";
import useDebounce from "@/hooks/useDebounce";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

function AdminOrdersPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    ordersLight,
    isLoadingOrdersLight,
    errorOrdersLight,
    isErrorOrdersLight,
    refetchOrdersLight,
  } = useOrders.useAllWithoutItems({
    ...(debouncedSearch &&
      !isNaN(Number(debouncedSearch)) && { id: Number(debouncedSearch) }),
    ...(debouncedSearch &&
      isNaN(Number(debouncedSearch)) && { name: debouncedSearch }),
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

  if (isLoadingOrdersLight) return <LoadingState type="dashboard" />;

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
      <Title refetchOrdersLight={refetchOrdersLight} />
      <StatsContainer />
      <OrderControlsBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <OrderDataTable
        columns={columns}
        data={ordersLight?.data || []}
        pageCount={ordersLight?.totalPages}
        totalCount={ordersLight?.total || 0}
        isLoading={isLoadingOrdersLight}
      />
    </div>
  );
}

export default AdminOrdersPage;

function Title({ refetchOrdersLight }) {
  return (
    <div className="flex justify-between">
      <div>
        <h1 className="text-4xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          View, track, and manage all customer orders in one place.
        </p>
      </div>
      <Button
        className={"min-w-30 flex justify-between"}
        onClick={refetchOrdersLight}
      >
        <span>
          <RefreshCcw />
        </span>
        Refresh
      </Button>
    </div>
  );
}

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

function OrderControlsBar({ searchInput, setSearchInput }) {
  return (
    <ControlsBar
      searchInput={searchInput}
      searchName={"order or client name"}
      setSearchInput={setSearchInput}
      searchWidth="w-80"
    >
      <SelectContent>
        <SelectItem value="all">All Orders</SelectItem>
        <Separator />
        <SelectItem value="pending_orders">Pending Orders</SelectItem>
        <SelectItem value="shipped_orders">Shipped Orders</SelectItem>
        <SelectItem value="delivered_orders">Delivered Orders</SelectItem>
        <Separator />
        <SelectItem value="failed_payments">Failed Payments</SelectItem>
        <SelectItem value="pending_payments">Pending Payments</SelectItem>
        <SelectItem value="paid_payments">Paid Payments</SelectItem>
      </SelectContent>
    </ControlsBar>
  );
}
