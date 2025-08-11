import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { ProductsDataTable } from "../components/products-list/ProductsDataTable";
import useProducts from "@/hooks/useProducts";
import ProductsStats from "../components/products-list/ProductsStats";

const data = {
  totalProducts: 1247,
  activeProducts: 1189,
  inactiveProducts: 58,
  featuredProducts: 156,
  outOfStockProducts: 23,
  lowStockProducts: 87,
};

export function AdminProductsPage() {
  const {
    products,
    isLoadingProducts,
    isErrorProducts,
    errorProducts,
    refetchProducts,
  } = useProducts.useAll();

  const totalCount = products?.length;

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
    <div className="container py-8 mx-auto space-y-6">
      {/* 📋 Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-gray-600">
            Manage your product inventory ({totalCount} total)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => refetchProducts()}
            variant="outline"
            disabled={isLoadingProducts}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                isLoadingProducts ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <ProductsStats data={data} />

      {/* 📊 Data Table */}
      <ProductsDataTable
        products={products}
        isLoadingProducts={isLoadingProducts}
        isErrorProducts={isErrorProducts}
        errorProducts={errorProducts}
      />
    </div>
  );
}
