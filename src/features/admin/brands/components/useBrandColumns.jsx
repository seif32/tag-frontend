import { useMemo } from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function useBrandColumns({ onEdit, onDelete }) {
  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => {
          return (
            <span
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2"
            >
              ID
            </span>
          );
        },
        cell: ({ row }) => (
          <div className="font-xs text-muted-foreground">
            #{row.getValue("id")}
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <span
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2"
            >
              Brand Name
            </span>
          );
        },
        cell: ({ row }) => {
          const name = row.getValue("name");
          return (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <div className="font-medium">{name}</div>
                <div className="text-sm text-muted-foreground">
                  Brand ID: {row.getValue("id")}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          const description = row.getValue("description");
          return (
            <div className="max-w-[300px]">
              <p
                className="text-sm text-muted-foreground truncate"
                title={description}
              >
                {description || "No description available"}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => {
          return (
            <span
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2"
            >
              Created
            </span>
          );
        },
        cell: ({ row }) => {
          const date = new Date(row.getValue("created_at"));
          const now = new Date();
          const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

          let variant = "secondary";
          if (diffInDays <= 7) variant = "default";
          if (diffInDays <= 1) variant = "destructive";

          return (
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <Badge variant={variant} className="text-xs">
                {diffInDays === 0
                  ? "Today"
                  : diffInDays === 1
                  ? "Yesterday"
                  : diffInDays <= 7
                  ? `${diffInDays}d ago`
                  : "Older"}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "updated_at",
        header: "Last Updated",
        cell: ({ row }) => {
          const date = new Date(row.getValue("updated_at"));
          return (
            <div className="text-sm text-muted-foreground">
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const brand = row.original;

          return (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => onEdit(brand)}
                >
                  <Edit className="h-4 w-4" />
                  Edit brand
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 text-destructive"
                  onClick={() => onDelete(brand)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete brand
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );
}
