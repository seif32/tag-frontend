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
}) {
  const [searchParams] = useSearchParams();
  const updateUrlParams = useUpdateUrlParams();

  const limit = parseInt(searchParams.get("limit")) || 10;
  const status = searchParams.get("status") || "";

  return (
    <div className="flex gap-2">
      <div className="relative ">
        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        <Input
          placeholder={`Search by ${searchName} . . .`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className=" w-70 min-w-full  pl-10"
        />
      </div>
      <Select
        value={status}
        onValueChange={(value) => {
          if (value === "all" || value === "") {
            updateUrlParams({ status: undefined });
          } else {
            updateUrlParams({ status: value });
          }
        }}
      >
        <SelectTrigger className="w-auto min-w-32">
          <div className="flex items-center gap-2">
            <Filter />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
        {children}
      </Select>
      <Select
        value={String(limit)}
        onValueChange={(value) => updateUrlParams({ limit: Number(value) })}
      >
        <SelectTrigger className="w-auto ">
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
    </div>
  );
}
