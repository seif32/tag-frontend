import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, AlertCircle } from "lucide-react";

import { useProductColumns } from "./useProductColumns";
import LoadingState from "@/ui/LoadingState";
import { useSearchParams } from "react-router";
import { useUpdateUrlParams } from "@/hooks/useUpdateUrlParams";

export function ProductsDataTable({
  products = [],
  isLoadingProducts,
  isErrorProducts,
  errorProducts,
  onDelete,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const updateUrlParams = useUpdateUrlParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("limit")) || 10;

  const productColumns = useProductColumns({ onDelete });

  const memoizedProducts = useMemo(() => {
    return products?.data || [];
  }, [products]);

  const table = useReactTable({
    data: memoizedProducts || [],
    columns: productColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    // 📊 Feature configuration
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // 🎨 Current state
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    manualPagination: true,
    pageCount: products?.pagination?.totalPages || 0,
  });

  // 🔄 Loading State - Clean and Professional
  if (isLoadingProducts) {
    return <LoadingState type="table" rows={10} />;
  }

  // ⚠️ Error State - User-Friendly Error Handling
  if (isErrorProducts) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64 border border-red-200 rounded-lg bg-red-50">
          <div className="flex flex-col items-center gap-2 text-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="font-medium text-red-700">Failed to load products</p>
            <p className="text-sm text-red-600">
              {errorProducts?.message ||
                "Something went wrong. Please try again."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 🎨 Main Table Render
  return (
    <div className="w-full space-y-4">
      {/* 🔍 Search and Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            {/* <Input
              placeholder="Search products in this page..."
              value={globalFilter ?? ""}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                setCurrentPage(1); // 👈 HERE! Reset when searching
              }}
              className="w-70 pl-8"
            /> */}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">
            {table.getFilteredRowModel().rows.length} of{" "}
            {table.getCoreRowModel().rows.length} products
          </p>
        </div>
      </div>

      {/* 📊 Main Data Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={productColumns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500">No products found.</p>
                    {globalFilter && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGlobalFilter("")}
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 📄 Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              updateUrlParams({
                limit: value,
                page: 1, // ✅ Reset to page 1 when changing page size
              });
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue
                placeholder={pageSize} // ✅ Use your own pageSize state
              />
            </SelectTrigger>
            <SelectContent side="top">
              {[2, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">
            Page {products?.pagination?.page || 1} of{" "}
            {products?.pagination?.totalPages || 1}
          </p>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrlParams({ page: currentPage - 1 })} // ✅ Update URL
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrlParams({ page: currentPage + 1 })} // ✅ Update URL
              disabled={currentPage >= (products?.pagination?.totalPages || 1)}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
