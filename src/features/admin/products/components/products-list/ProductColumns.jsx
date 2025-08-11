import { ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const productColumns = [
  // // 📸 IMAGE COLUMN - Simple & Visual
  // {
  //   accessorKey: "image",
  //   header: "Image",
  //   cell: ({ row }) => {
  //     const product = row.original;
  //     return (
  //       <div className="w-12 h-12 rounded-md overflow-hidden border">
  //         <img
  //           src={product.image || "/placeholder-product.jpg"}
  //           alt={product.name}
  //           className="w-full h-full object-cover"
  //           onError={(e) => {
  //             e.target.src = "/placeholder-product.jpg";
  //           }}
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
        <ArrowUpDown className="ml-2 h-4 w-4" />
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

  //   // 🏪 CATEGORY - Organization
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        {row.getValue("category")}
      </span>
    ),
    enableSorting: true,
  },

  // 💰 PRICE RANGE - Smart Pricing
  {
    accessorKey: "priceRange",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 font-semibold"
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const product = row.original;
      const { min_price, max_price } = product;

      if (!min_price) return <span className="text-gray-400">No price</span>;

      return (
        <div className="font-semibold">
          {min_price === max_price
            ? `$${min_price.toFixed(2)}`
            : `$${min_price.toFixed(2)} - $${max_price.toFixed(2)}`}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const priceA = rowA.original.min_price || 0;
      const priceB = rowB.original.min_price || 0;
      return priceA - priceB;
    },
    enableSorting: true,
  },

  // 📦 STOCK STATUS - Inventory Overview
  {
    accessorKey: "stockStatus",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.total_stock || 0;

      let statusText, colorClass;
      if (stock === 0) {
        statusText = "Out of Stock";
        colorClass = "bg-red-100 text-red-800";
      } else if (stock <= 10) {
        statusText = `Low (${stock})`;
        colorClass = "bg-yellow-100 text-yellow-800";
      } else {
        statusText = `${stock} units`;
        colorClass = "bg-green-100 text-green-800";
      }

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
        >
          {statusText}
        </span>
      );
    },
    sortingFn: (rowA, rowB) => {
      const stockA = rowA.original.total_stock || 0;
      const stockB = rowB.original.total_stock || 0;
      return stockA - stockB;
    },
    enableSorting: true,
  },

  // 🔢 VARIANT COUNT - Complexity Indicator
  {
    accessorKey: "variantCount",
    header: "Variants",
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isAvailable = row.original.is_available;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {isAvailable ? "Published" : "Draft"}
        </span>
      );
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Eye className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("View", product.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Edit", product.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => console.log("Delete", product.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];
