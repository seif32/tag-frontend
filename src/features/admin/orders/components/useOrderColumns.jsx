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
import { isOrderFromToday } from "../../services/utils";

export function useOrderColumns({ onView, onEdit, onDelete, onUpdateStatus }) {
  const columns = [
    {
      accessorKey: "order_number",
      header: "Order ID",
      cell: ({ row }) => {
        const orderNumber = row.getValue("order_number");
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
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">
              {order.customer_name || "Unknown Customer"}
            </span>
            <span className="text-xs text-muted-foreground">
              {order.customer_email || "No email"}
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
        const itemCount = order.order_items?.length || 0;

        return (
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-semibold">
              ${totalAmount.toFixed(2)}
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
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">{formattedDate}</span>
            <span className="text-xs text-muted-foreground">
              {order.shipping_city && order.shipping_state
                ? `${order.shipping_city}, ${order.shipping_state}`
                : "Address not available"}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Order Status",
      cell: ({ row }) => {
        const status = row.getValue("status");

        const getStatusColor = (status) => {
          switch (status?.toLowerCase()) {
            case "pending":
              return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
            case "processing":
              return "bg-blue-100 text-blue-800 hover:bg-blue-200";
            case "shipped":
              return "bg-purple-100 text-purple-800 hover:bg-purple-200";
            case "delivered":
              return "bg-green-100 text-green-800 hover:bg-green-200";
            case "cancelled":
              return "bg-red-100 text-red-800 hover:bg-red-200";
            case "refunded":
              return "bg-gray-100 text-gray-800 hover:bg-gray-200";
            default:
              return "bg-gray-100 text-gray-800 hover:bg-gray-200";
          }
        };

        return (
          <Badge
            variant="secondary"
            className={`${getStatusColor(status)} border-0`}
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

        const getPaymentColor = (status) => {
          switch (status?.toLowerCase()) {
            case "pending":
              return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
            case "completed":
              return "bg-green-100 text-green-800 hover:bg-green-200";
            case "failed":
              return "bg-red-100 text-red-800 hover:bg-red-200";
            case "refunded":
              return "bg-purple-100 text-purple-800 hover:bg-purple-200";
            default:
              return "bg-gray-100 text-gray-800 hover:bg-gray-200";
          }
        };

        return (
          <Badge
            variant="secondary"
            className={`${getPaymentColor(paymentStatus)} border-0`}
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
