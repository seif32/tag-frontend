import { ProductsDataTable } from "../components/products-list/ProductsDataTable";
import useProducts from "@/hooks/useProducts";
import ProductsStats from "../components/products-list/ProductsStats";
import ProductsHeader from "../components/products-list/ProductsHeader";
import ControlsBar from "@/ui/ControlsBar";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useDebounce from "@/hooks/useDebounce";
import PaginationControlsBar from "../../ui/PaginationControlsBar";
import { useSearchParams } from "react-router";
import { useUpdateUrlParams } from "@/hooks/useUpdateUrlParams";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminProductsPage() {
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    products,
    isLoadingProducts,
    errorProducts,
    isErrorProducts,
    refetchProducts,
  } = useProducts.useAllWithoutVariants({
    search: debouncedSearch,
  });
  const { stats, isLoadingStats, refetchStats } = useProducts.useStats();
  const { deleteProduct } = useProducts.useDelete();

  function handleDelete(productId) {
    deleteProduct(productId);
  }

  return (
    <div className="space-y-6 ">
      <ProductsHeader
        isLoadingProducts={isLoadingProducts}
        isLoadingStats={isLoadingStats}
        refetchProducts={refetchProducts}
        refetchStats={refetchStats}
      />

      <ProductsStats data={stats} isLoadingStats={isLoadingStats} />

      <ProductsControlsBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />

      <ProductsDataTable
        products={products}
        isLoadingProducts={isLoadingProducts}
        isErrorProducts={isErrorProducts}
        errorProducts={errorProducts}
        refetchProducts={refetchProducts}
        onDelete={handleDelete}
      />

      <PaginationControlsBar
        dataName={"products"}
        isLoading={isLoadingProducts}
        pageCount={products?.pagination?.totalPages}
        totalCount={products?.pagination?.total}
      />
    </div>
  );
}

function ProductsControlsBar({ searchInput, setSearchInput }) {
  const [searchParams] = useSearchParams();
  const updateUrlParams = useUpdateUrlParams();

  const active = searchParams.get("active") || "";
  const limit = parseInt(searchParams.get("limit")) || 10;
  return (
    <div className="flex gap-2">
      <div className="relative ">
        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        <Input
          placeholder={`Search by product name...`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className=" w-70 min-w-full  pl-10 "
        />
      </div>
      <Select
        value={active}
        onValueChange={(value) => {
          if (value === "all" || value === "") {
            updateUrlParams({ active: undefined });
          } else {
            updateUrlParams({ active: value });
          }
        }}
      >
        <SelectTrigger className="w-auto min-w-32">
          <div className="flex items-center gap-2">
            <Filter />
            <SelectValue placeholder="All Products" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Products </SelectItem>
          <Separator className="my-2" />
          <SelectItem value="1">Active Products</SelectItem>
          <SelectItem value="0">Inactive Products</SelectItem>
        </SelectContent>
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
