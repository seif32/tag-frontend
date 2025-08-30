import { ArrowUpDown, Eye, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";

export function useProductColumns({ onDelete }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    // Show relative time for recent dates
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 72) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      // Show formatted date for older dates
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return [
    // 🏷️ PRODUCT NAME - Main Identifier
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-semibold"
        >
          Product
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
          </div>
        );
      },
      enableSorting: true,
    },

    // 🏪 CATEGORY - Organization
    {
      accessorKey: "category_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-semibold"
        >
          Category
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const category = row.getValue("category_name");
        const subcategory = row.original.sub_category_name;
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-700">
              {category}
            </span>
            {subcategory && (
              <span className="text-xs text-slate-500">{subcategory}</span>
            )}
          </div>
        );
      },
      enableSorting: true,
    },

    // 📦 STOCK STATUS - Inventory Overview
    {
      id: "stockStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-semibold"
        >
          Stock
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.original.total_quantity || 0;

        let statusText, dotColor, textColor;
        if (stock === 0) {
          statusText = "Out of Stock";
          dotColor = "bg-red-500";
          textColor = "text-red-700";
        } else if (stock <= 10) {
          statusText = `Low (${stock})`;
          dotColor = "bg-amber-500";
          textColor = "text-amber-700";
        } else {
          statusText = `${stock} units`;
          dotColor = "bg-green-500";
          textColor = "text-green-700";
        }

        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
            <span className={`text-xs font-medium ${textColor}`}>
              {statusText}
            </span>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const stockA = rowA.original.total_quantity || 0;
        const stockB = rowB.original.total_quantity || 0;
        return stockA - stockB;
      },
      enableSorting: true,
    },

    // 🔢 VARIANT COUNT - Complexity Indicator
    {
      accessorKey: "variant_count",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-semibold "
        >
          Variants
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const count = row.original.variant_count || 0;
        return (
          <span className="text-xs text-gray-600">
            {count} {count === 1 ? "variant" : "variants"}
          </span>
        );
      },
      enableSorting: true,
    },

    // ✅ CREATED AT - Modern Date Display
    {
      id: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-semibold"
        >
          Created
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const dateString = row.original.created_at;
        const date = new Date(dateString);

        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-slate-700">
              {formatDate(dateString)}
            </span>
            <span className="text-[10px] text-slate-500">
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.created_at).getTime();
        const dateB = new Date(rowB.original.created_at).getTime();

        if (dateA === dateB) return 0;
        return dateA > dateB ? 1 : -1;
      },

      enableSorting: true,
      sortingFn: "datetime",
    },

    // 🔄 UPDATED AT - Modern Date Display
    {
      id: "updated_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-semibold"
        >
          Updated
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const dateString = row.original.updated_at;
        const date = new Date(dateString);

        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-slate-700">
              {formatDate(dateString)}
            </span>
            <span className="text-[10px] text-slate-500">
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        return (
          new Date(rowA.original.updated_at) -
          new Date(rowB.original.updated_at)
        );
      },
      enableSorting: true,
    },

    // 📊 STATUS - Published State
    {
      accessorKey: "active",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-semibold"
        >
          Status
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const active = row.original.active;
        return (
          <Badge
            className={
              active
                ? "border-green-300 bg-green-50 text-green-800 text-[12px]"
                : "border-stone-300 bg-stone-50 text-stone-800 text-[12px]"
            }
            variant={active ? "default" : "secondary"}
          >
            {active ? (
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-[2px] bg-green-400"></div>
                <span>Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-[2px] bg-stone-500"></div>
                <span>Draft</span>
              </div>
            )}
          </Badge>
        );
      },
      sortingFn: (rowA, rowB) => {
        const statusA = rowA.original.is_available;
        const statusB = rowB.original.is_available;
        return statusB - statusA;
      },
      enableSorting: true,
    },

    // ⚙️ ACTIONS - Essential Operations
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">Open menu</span>
                <Eye className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`${product.id}`)}>
                <Eye className="w-4 h-4 mr-2 " />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`${product.id}/edit`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 "
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
    },
  ];
}
