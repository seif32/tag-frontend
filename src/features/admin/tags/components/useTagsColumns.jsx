"use client";

import { useMemo } from "react";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function useTagsColumns({ onEdit, onDelete }) {
  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2"
            >
              ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="font-medium text-muted-foreground">
            #{row.getValue("id")}
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2"
            >
              Tag Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const name = row.getValue("name");
          return (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-medium">{name}</div>
                <div className="text-sm text-muted-foreground">
                  Tag ID: {row.getValue("id")}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "category_id",
        header: "Category",
        cell: ({ row }) => {
          const categoryId = row.getValue("category_id");
          // You can map this to actual category names later
          return (
            <Badge variant="outline" className="font-medium">
              Category {categoryId}
            </Badge>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2"
            >
              Created
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
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
          const tag = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onEdit?.(tag)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit tag
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(tag)}
                  className="gap-2 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete tag
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onEdit, onDelete]
  );
}
