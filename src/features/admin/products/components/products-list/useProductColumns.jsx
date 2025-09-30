import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/utils/dateUtils";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function useProductColumns({ onDelete }) {
  const navigate = useNavigate();

  return [
    // 🏷️ PRODUCT NAME - Main Identifier
    {
      accessorKey: "name",
      header: ({ column }) => <div className="p-0 ">Product</div>,
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
      header: ({ column }) => <div className="p-0 ">Category</div>,
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
      header: ({ column }) => <div className="p-0 ">Stock</div>,
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
      header: ({ column }) => <div className="p-0  ">Variants</div>,
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
      header: ({ column }) => <div className="p-0 ">Created</div>,
      cell: ({ row }) => {
        const dateString = row.original.created_at;
        const date = new Date(dateString);

        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-slate-700">
              {formatDateShort(dateString)}
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
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 "
        >
          Updated
        </div>
      ),
      cell: ({ row }) => {
        const dateString = row.original.updated_at;
        const date = new Date(dateString);

        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-slate-700">
              {formatDateShort(dateString)}
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
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 "
        >
          Status
        </div>
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
              <Button variant={"ghost"} className="w-8 h-8 p-0">
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
                onClick={() => onDelete(product)}
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
