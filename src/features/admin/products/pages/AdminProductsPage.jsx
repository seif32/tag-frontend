import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ProductsDataTable } from "../components/products-list/ProductsDataTable";
import useProducts from "@/hooks/useProducts";
import ProductsStats from "../components/products-list/ProductsStats";
import ProductsHeader from "../components/products-list/ProductsHeader";
import { useState } from "react";

export default function AdminProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {
    products,
    isLoadingProducts,
    errorProducts,
    isErrorProducts,
    refetchProducts,
  } = useProducts.useAllWithoutVariants({
    page: currentPage,
    limit: pageSize,
  });

  const { stats, isLoadingStats, refetchStats } = useProducts.useStats();

  const { deleteProduct } = useProducts.useDelete();

  function handleDelete(productId) {
    deleteProduct(productId);
  }

  if (isErrorProducts) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center text-red-600">
          <h3 className="text-lg font-semibold">Error Loading Products</h3>
          <p className="text-sm">{errorProducts.message}</p>
        </div>
        <Button onClick={() => refetchProducts()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container  mx-auto space-y-6 ">
      <ProductsHeader
        isLoadingProducts={isLoadingProducts}
        isLoadingStats={isLoadingStats}
        refetchProducts={refetchProducts}
        refetchStats={refetchStats}
        totalCount={stats?.total_products}
      />

      <ProductsStats data={stats} isLoadingStats={isLoadingStats} />

      {/* 📊 Data Table */}
      <ProductsDataTable
        products={products}
        isLoadingProducts={isLoadingProducts}
        isErrorProducts={isErrorProducts}
        errorProducts={errorProducts}
        onDelete={handleDelete}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </div>
  );
}
