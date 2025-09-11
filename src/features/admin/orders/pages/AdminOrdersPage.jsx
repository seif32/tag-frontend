import { useState } from "react";
import StatsCard from "../../ui/StatsCard";

import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
} from "lucide-react";
import { useOrderColumns } from "../components/useOrderColumns";
import { useNavigate } from "react-router";

const statsData = [
  // {
  //   title: "Total Revenue",
  //   icon: DollarSign,
  //   value: "$24,847.50",
  //   subtitle: "All completed orders",
  // },
  {
    title: "New Orders",
    icon: PlusCircle,
    value: "15",
    subtitle: "Recently placed orders",
  },
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
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });

  // const { data, isLoading } = useOrders({
  //   page: pagination.pageIndex + 1,
  //   limit: pagination.pageSize,
  //   sortBy: sorting[0]?.id,
  //   sortOrder: sorting[0]?.desc ? "desc" : "asc",
  //   search: filters.search,
  //   status: filters.status,
  // });

  function handleEditOrder() {}
  function handleDeleteOrder() {}

  const columns = useOrderColumns({
    onView: (order) => navigate(`/admin/orders/${order.id}`),
    onEdit: handleEditOrder,
    onDelete: handleDeleteOrder,
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl">Orders</h1>
        <p className="text-muted-foreground">
          Manage all your orders from here
        </p>
      </div>
      <StatsContainer />

      {/* <OrderDataTable
        columns={columns}
        data={data?.orders || []}
        pageCount={Math.ceil(data?.totalCount / pagination.pageSize)}
        totalCount={data?.totalCount || 0}
        pagination={pagination}
        sorting={sorting}
        filters={filters}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onFiltersChange={setFilters}
        isLoading={isLoading}
      /> */}
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
