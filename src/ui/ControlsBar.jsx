import { useUpdateUrlParams } from "@/hooks/useUpdateUrlParams";
import { useSearchParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ControlsBar({
  searchInput,
  setSearchInput,
  children,
  searchName,
  isShowFilter = true,
  isShowLimit = true,
  searchWidth = "w-70",
  onStatusChange,
  urlParams,
}) {
  const [searchParams] = useSearchParams();
  const updateUrlParams = useUpdateUrlParams();

  const limit = parseInt(searchParams.get("limit")) || 10;
  const status = searchParams.get("status") || "";

  function handleStatusChange(value) {
    updateUrlParams({
      status: value === "all" || value === "" ? undefined : value,
      page: 1,
    });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
      {/* Search Input - Full width on mobile */}
      {/* Search Input - Full width on mobile, max-width on desktop */}
      <div className="relative w-full sm:flex-1 sm:max-w-md lg:max-w-lg sm:min-w-0">
        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 pointer-events-none" />
        <Input
          placeholder={`Search by ${searchName}...`}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            updateUrlParams({ page: 1, status: undefined });
          }}
          className="w-full pl-10 pr-4"
          aria-label={`Search by ${searchName}`}
        />
      </div>

      {/* Filter & Limit Selects - Side by side on mobile */}
      <div className="flex gap-2 sm:gap-3 flex-shrink-0">
        {/* Status Filter */}
        {isShowFilter && (
          <Select
            value={urlParams || status}
            onValueChange={onStatusChange || handleStatusChange}
          >
            <SelectTrigger className="w-full sm:w-auto sm:min-w-[140px]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">
                  <SelectValue placeholder="All Status" />
                </span>
                <span className="sm:hidden">
                  <SelectValue placeholder="Filter" />
                </span>
              </div>
            </SelectTrigger>
            {children}
          </Select>
        )}

        {/* Items Per Page Limit */}
        {isShowLimit && (
          <Select
            value={String(limit)}
            onValueChange={(value) => updateUrlParams({ limit: Number(value) })}
          >
            <SelectTrigger className=" " aria-label="Items per page">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
