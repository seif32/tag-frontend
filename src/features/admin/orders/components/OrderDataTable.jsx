import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
} from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

export default function OrderDataTable({
  // Data props
  columns,
  data = [],

  // Server-side pagination props
  pageCount = 0,
  totalCount = 0,

  // Current state
  pagination = { pageIndex: 0, pageSize: 10 },
  sorting = [],
  filters = { search: "", status: "", dateRange: null },

  // Event handlers
  onPaginationChange,
  onSortingChange,
  onFiltersChange,

  // Loading & selection
  isLoading = false,
  selectedRows = [],
  onRowSelectionChange,
}) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (onFiltersChange && debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch]); // Only depends on debounced value!

  const table = useReactTable({
    data,
    columns,
    pageCount,

    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    state: {
      sorting,
      pagination,
    },

    onSortingChange,
    onPaginationChange,

    getCoreRowModel: getCoreRowModel(),
  });

  function handleStatusFilter(status) {
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        status: status === "all" ? "" : status,
      });
    }
  }

  const canPreviousPage = pagination.pageIndex > 0;
  const canNextPage = pagination.pageIndex < pageCount - 1;

  return (
    <div className="space-y-4">
      {/* Filters & Actions Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        {/* Search & Filters */}
        <div className="flex flex-col flex-1 gap-2 sm:flex-row">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input
              placeholder="Search orders, customers..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="max-w-xs pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Page Size Selector */}
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) =>
              onPaginationChange?.({
                pageIndex: 0,
                pageSize: Number(value),
              })
            }
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`
                      ${
                        header.column.getCanSort()
                          ? "cursor-pointer select-none hover:bg-gray-50"
                          : ""
                      }
                      px-4 py-3
                    `}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    <div className="flex items-center space-x-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {{
                            asc: "↑",
                            desc: "↓",
                          }[header.column.getIsSorted()] ?? "↕"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: pagination.pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="w-full h-6" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-gray-400">📦</div>
                    <p className="text-gray-500">No orders found</p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`
                    hover:bg-gray-50 transition-colors
                    ${
                      selectedRows.includes(row.original.id) ? "bg-blue-50" : ""
                    }
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
        {/* Results info */}
        <div className="text-sm text-gray-700">
          Showing{" "}
          <strong>
            {totalCount === 0
              ? 0
              : pagination.pageIndex * pagination.pageSize + 1}
          </strong>{" "}
          -{" "}
          <strong>
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              totalCount
            )}
          </strong>{" "}
          of <strong>{totalCount.toLocaleString()}</strong> orders
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onPaginationChange?.({ ...pagination, pageIndex: 0 })
            }
            disabled={!canPreviousPage || isLoading}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onPaginationChange?.({
                ...pagination,
                pageIndex: pagination.pageIndex - 1,
              })
            }
            disabled={!canPreviousPage || isLoading}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center px-4 space-x-2">
            <span className="text-sm">
              Page {pagination.pageIndex + 1} of {pageCount}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onPaginationChange?.({
                ...pagination,
                pageIndex: pagination.pageIndex + 1,
              })
            }
            disabled={!canNextPage || isLoading}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onPaginationChange?.({
                ...pagination,
                pageIndex: pageCount - 1,
              })
            }
            disabled={!canNextPage || isLoading}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
