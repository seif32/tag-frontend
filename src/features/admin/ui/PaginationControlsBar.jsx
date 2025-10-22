import { Button } from "@/components/ui/button";
import { useUpdateUrlParams } from "@/hooks/useUpdateUrlParams";
import LoadingState from "@/ui/LoadingState";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useSearchParams } from "react-router";

function PaginationControlsBar({ pageCount, totalCount, isLoading, dataName }) {
  const [searchParams] = useSearchParams();
  const updateUrlParams = useUpdateUrlParams();

  if (isLoading) return <LoadingState />;

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  const canPreviousPage = page > 1;
  const canNextPage = page < pageCount;

  const startItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row sm:gap-2 sm:px-0">
      {/* Results Summary - Hidden on small mobile */}
      <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left order-2 sm:order-1">
        <span className="hidden sm:inline">Showing </span>
        <strong>{startItem}</strong> - <strong>{endItem}</strong> of{" "}
        <strong>{totalCount.toLocaleString()}</strong> {dataName}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
        {/* First Page - Hidden on mobile */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateUrlParams({ page: 1 })}
          disabled={!canPreviousPage || isLoading}
          className="hidden sm:flex"
          aria-label="Go to first page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateUrlParams({ page: page - 1 })}
          disabled={!canPreviousPage || isLoading}
          className="px-2 sm:px-3"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </Button>

        {/* Page Indicator - Compact on mobile */}
        <div className="flex items-center px-2 sm:px-4">
          <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
            <span className="hidden xs:inline">Page </span>
            {page}
            <span className="text-gray-400 mx-1">/</span>
            {pageCount}
          </span>
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateUrlParams({ page: page + 1 })}
          disabled={!canNextPage || isLoading}
          className="px-2 sm:px-3"
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last Page - Hidden on mobile */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateUrlParams({ page: pageCount })}
          disabled={!canNextPage || isLoading}
          className="hidden sm:flex"
          aria-label="Go to last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default PaginationControlsBar;
