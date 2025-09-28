import { Button } from "@/components/ui/button";
import LoadingState from "@/ui/LoadingState";
import { Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";

function ProductsHeader({
  refetchProducts,
  isLoadingProducts,
  isLoadingStats,
  refetchStats,
}) {
  const navigate = useNavigate();

  if (isLoadingProducts || isLoadingStats)
    return <LoadingState type="header" />;
  return (
    <div className=" flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-1 text-gray-600">Manage your product inventory </p>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          onClick={() => {
            refetchProducts();
            refetchStats();
          }}
          variant="outline"
          disabled={isLoadingProducts}
          className={"text-accent"}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 text-accent${
              isLoadingProducts ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>

        <Button onClick={() => navigate("add")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>
    </div>
  );
}

export default ProductsHeader;
