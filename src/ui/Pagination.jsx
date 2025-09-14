import { Button } from "@/components/ui/button";

export default function Pagination({
  setSearchParams,
  currentPage,
  data,
  isFetching,
  totalPages,
}) {
  function goToPage(pageNumber) {
    setSearchParams({ page: pageNumber.toString() });
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }

  function goToNextPage() {
    if (data?.page < data?.totalPages) {
      goToPage(currentPage + 1);
    }
  }
  return (
    <div className="flex flex-col self-end items-end gap-2">
      <div className="flex gap-2 items-center  mt-8">
        <Button
          variant="outline"
          onClick={goToPreviousPage}
          disabled={currentPage === 1 || isFetching}
        >
          Previous
        </Button>

        <span className="px-4 py-2 text-sm">Page {currentPage}</span>

        <Button
          onClick={goToNextPage}
          disabled={isFetching || data?.page >= data?.totalPages}
        >
          Next
        </Button>
      </div>
      <p className="text-muted-foreground text-sm">Total {totalPages} pages</p>
    </div>
  );
}
