// hooks/useOrdersColumns.js
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { getStatusColor, isOrderFromToday } from "../../services/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDateShort } from "@/utils/dateUtils";

export function useOrderColumns({ onView, onEdit, onDelete, onUpdateStatus }) {
  const columns = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => {
        const orderNumber = row.getValue("id");
        const order = row.original;
        const isTodayOrder = isOrderFromToday(order.created_at);

        return (
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm font-medium">{orderNumber}</span>
            {isTodayOrder && (
              <Badge
                variant="secondary"
                className="px-2 py-1 text-xs text-red-800 bg-red-100 animate-pulse"
              >
                TODAY
              </Badge>
            )}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorFn: (row) =>
        `${row.user?.first_name ?? ""} ${row.user?.last_name ?? ""}`,
      id: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : "Unknown Customer"}
            </span>
            <span className="text-xs text-muted-foreground">
              {user?.email || "No email"}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "total_amount",
      header: "Price & Items",
      cell: ({ row }) => {
        const order = row.original;
        const totalAmount = order.total_amount || 0;
        const itemCount = order.items?.length || 0;

        return (
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-semibold">
              {formatCurrency(totalAmount)}
            </span>
            <span className="text-xs text-muted-foreground">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "created_at",
      header: "Date & Address",
      cell: ({ row }) => {
        const order = row.original;
        const date = new Date(order.created_at);

        return (
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">{formatDateShort(date)}</span>
            <span className="text-xs text-muted-foreground">
              {order.address.city && order.address.street_name
                ? `${order.address.street_name}, ${order.address.city}`
                : "Address not available"}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "order_status",
      header: "Order Status",
      cell: ({ row }) => {
        const status = row.getValue("order_status");

        return (
          <Badge
            variant="secondary"
            className={`${getStatusColor(status, "order")} border-0`}
          >
            {status || "Unknown"}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "payment_status",
      header: "Payment Status",
      cell: ({ row }) => {
        const paymentStatus = row.getValue("payment_status");

        return (
          <Badge
            variant="secondary"
            className={`${getStatusColor(paymentStatus, "payment")} border-0`}
          >
            {paymentStatus || "Unknown"}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onView?.(order)}
                className="cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit?.(order)}
                className="cursor-pointer"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Order
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(order)}
                className="text-red-600 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
}
