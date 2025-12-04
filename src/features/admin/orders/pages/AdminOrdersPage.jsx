import { useState } from "react";
import StatsCard from "../../ui/StatsCard";

import {
  ShoppingBag,
  Clock,
  CheckCircle,
  PlusCircle,
  RefreshCcw,
  Filter,
  Search,
} from "lucide-react";
import { useOrderColumns } from "../components/useOrderColumns";
import { useNavigate, useSearchParams } from "react-router";
import useOrders from "@/hooks/useOrders";
import LoadingState from "@/ui/LoadingState";
import OrderDataTable from "../components/OrderDataTable";
import ErrorMessage from "@/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import ControlsBar from "@/ui/ControlsBar";
import useDebounce from "@/hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUpdateUrlParams } from "@/hooks/useUpdateUrlParams";
import { Input } from "@/components/ui/input";

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
        value: stats.total_orders ?? 0,
        subtitle: "All orders ever placed",
      },
      {
        title: "New Orders",
        icon: PlusCircle,
        value: stats.new_orders ?? 0,
        subtitle: "Recently placed orders",
      },

      {
        title: "Pending Orders",
        icon: Clock,
        value: stats.pending_orders ?? 0,
        subtitle: "Needs immediate attention",
      },
      {
        title: "Delivered Orders",
        icon: CheckCircle,
        value: stats.delivered_orders ?? 0,
        subtitle: `${(
          (stats?.delivered_orders ?? 0 / stats?.total_orders ?? 1) * 100
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
  const [searchParams] = useSearchParams();
  const updateUrlParams = useUpdateUrlParams();

  const orderStatus = searchParams.get("order_status") || "";
  const paymentStatus = searchParams.get("payment_status") || "";
  let currentValue = "all";
  if (orderStatus) {
    currentValue = orderStatus + "_orders";
  } else if (paymentStatus) {
    currentValue = paymentStatus + "_payments";
  }

  function handleStatusChange(status) {
    if (status === "all") {
      updateUrlParams({
        order_status: undefined,
        payment_status: undefined,
        page: 1,
      });
    } else if (status.includes("orders")) {
      updateUrlParams({
        order_status: status.replace("_orders", ""),
        payment_status: undefined,
        page: 1,
      });
    } else {
      updateUrlParams({
        payment_status: status.replace("_payments", ""),
        order_status: undefined,
        page: 1,
      });
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="relative">
        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        <Input
          placeholder="Search by order or client name..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            updateUrlParams({
              page: 1,
              order_status: undefined,
              payment_status: undefined,
            });
          }}
          className="w-80 min-w-full pl-10"
        />
      </div>

      {/* Status Filter Select */}
      <Select value={currentValue} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-auto min-w-32">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
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
      </Select>
    </div>
  );
}
