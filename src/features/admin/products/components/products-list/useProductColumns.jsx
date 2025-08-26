import { ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
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

  return [
    // //  📸 IMAGE COLUMN - Simple & Visual
    // {
    //   accessorKey: "primary_image",
    //   header: "Image",
    //   cell: ({ row }) => {
    //     const product = row.original;
    //     return (
    //       <div className="w-12 h-12 overflow-hidden border rounded-md">
    //         <img
    //           src={product.primary_image || "/placeholder-product.jpg"}
    //           alt={product.name}
    //           className="object-cover w-full h-full"
    //         />
    //       </div>
    //     );
    //   },
    //   enableSorting: false,
    //   size: 60,
    // },

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
      accessorKey: "sub_category_name",
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
      cell: ({ row }) => (
        <span className="px-1  py-0.5 text-[10px] font-medium text-blue-800 border border-blue-800 rounded-full">
          {row.getValue("sub_category_name")}
        </span>
      ),
      enableSorting: true,
    },
    // 💰 PRICE RANGE - Smart Pricing
    {
      id: "priceRange",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-semibold"
        >
          Price
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const { lowest_price, highest_price } = row.original;

        if (!lowest_price)
          return <span className="text-gray-400">No price</span>;

        return (
          <div className="text-xs font-medium">
            {lowest_price === highest_price
              ? `$${lowest_price.toFixed(2)}`
              : `$${lowest_price.toFixed(2)} - $${highest_price.toFixed(2)}`}
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const priceA = rowA.original.lowest_price || 0;
        const priceB = rowB.original.lowest_price || 0;
        return priceA - priceB;
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

        let statusText, colorClass;
        if (stock === 0) {
          statusText = "Out of Stock";
          colorClass = "border border-red-800 text-red-800";
        } else if (stock <= 10) {
          statusText = `Low (${stock})`;
          colorClass = "border border-yellow-800 text-yellow-800";
        } else {
          statusText = `${stock} units`;
          colorClass = "border border-black text-black";
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-[10px] font-medium ${colorClass}`}
          >
            {statusText}
          </span>
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
          className="p-0 font-semibold"
        >
          Variants
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const count = row.original.variant_count || 0;
        return (
          <span className="text-sm text-gray-600">
            {count} {count === 1 ? "variant" : "variants"}
          </span>
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

        // Published (true) comes first, Draft (false) comes second
        return statusB - statusA; // or statusA - statusB for opposite order
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
