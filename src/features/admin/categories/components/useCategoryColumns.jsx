import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * 🏷️ CATEGORY COLUMNS HOOK
 * Defines column structure for your subcategory-focused table
 * Following shadcn/ui data table patterns with actions dropdown
 * Perfect for your preference of subcategories as main data[3]
 */
export const useCategoryColumns = ({ onEdit, onDelete, onView }) => {
  const columns = [
    {
      accessorKey: "image_url",
      header: "Image",
      cell: ({ getValue }) => {
        const imageUrl = getValue();
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Category"
            className="w-12 h-8 rounded object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Subcategory",
      cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
    },
    {
      accessorKey: "parent_name",
      header: "Main Category",
      cell: ({ getValue }) => (
        <div className="text-sm text-muted-foreground">{getValue()}</div>
      ),
    },

    {
      accessorKey: "product_count",
      header: "Products",
      cell: ({ getValue }) => {
        const count = getValue() ?? 0;
        const hasProducts = count > 0;

        return (
          <div className="flex items-center gap-1">
            <span
              className={hasProducts ? "" : "text-muted-foreground text-[10px]"}
            >
              {hasProducts ? count : "No"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {hasProducts ? "products" : "products yet"}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "active",
      header: "Status",
      cell: ({ getValue }) => {
        const isActive = getValue() === 1;
        return (
          <Badge
            className={
              isActive
                ? "border-green-300 bg-green-50 text-green-800 text-[10px]"
                : "border-red-300 bg-red-50 text-red-800 text-[10px]"
            }
            variant={isActive ? "default" : "secondary"}
          >
            {isActive ? (
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-[2px] bg-green-400"></div>
                <span>Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-[2px] bg-red-500"></div>
                <span>Inactive</span>
              </div>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ getValue }) => (
        <div className="text-sm">
          {new Date(getValue()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const subcategory = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {/* <DropdownMenuItem onClick={() => onView?.(subcategory)}>
                <Eye className="mr-2 h-4 w-4" />
                View products
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => onEdit?.(subcategory)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit subcategory
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(subcategory)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
