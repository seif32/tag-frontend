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
  return (
    <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
      <div className="text-sm text-gray-700">
        Showing <strong>{totalCount === 0 ? 0 : (page - 1) * limit + 1}</strong>{" "}
        - <strong>{Math.min(page * limit, totalCount)}</strong> of{" "}
        <strong>{totalCount.toLocaleString()}</strong> {dataName}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateUrlParams({ page: 1 })}
          disabled={!canPreviousPage || isLoading}
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => updateUrlParams({ page: page - 1 })}
          disabled={!canPreviousPage || isLoading}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center px-4 space-x-2">
          <span className="text-sm">
            Page {page} of {pageCount}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => updateUrlParams({ page: page + 1 })}
          disabled={!canNextPage || isLoading}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => updateUrlParams({ page: pageCount })}
          disabled={!canNextPage || isLoading}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default PaginationControlsBar;
