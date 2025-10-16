import ProductCard from "../components/ProductCard";
import useProducts from "@/hooks/useProducts";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUrlParams } from "@/hooks/useUpdateUrlParams";
import { getPageInfo } from "../services/getPageInfo";
import PaginationControlsBar from "@/features/admin/ui/PaginationControlsBar";

function ProductsPage() {
  const { categoryId, subcategoryId } = useParams();
  const navigate = useNavigate();

  const {
    products,
    isLoadingProducts,
    errorProducts,
    isErrorProducts,
    refetchProducts,
  } = useProducts.useAllWithoutVariants({
    category_id: categoryId,
    subcategory_id: subcategoryId,
    active: 1,
  });

  if (isLoadingProducts) {
    return <LoadingState type="page" />;
  }

  if (isErrorProducts) {
    return (
      <ErrorMessage
        message={errorProducts?.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchProducts()}
      />
    );
  }

  const totalProductsCount = products?.data?.length || 0;

  return (
    <main className="md:px-8 space-y-10">
      <PageHeader
        categoryId={categoryId}
        products={products}
        subcategoryId={subcategoryId}
      />
      {totalProductsCount === 0 ? (
        <EmptyProductState />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 gap-3">
          {products.data.map((product) => {
            return (
              <ProductCard
                key={product.id}
                image={product.primary_image}
                category={product.category_name}
                name={product.name}
                variantCount={product.variant_count}
                brand={product.brand_name}
                onViewProductDetails={(productId) =>
                  navigate(`/products/${productId}`)
                }
                productId={product.id}
                variants={product?.variant_values?.flatMap((type) =>
                  type?.values.map((value) => value?.value)
                )}
              />
            );
          })}
        </div>
      )}
      <PaginationControlsBar
        dataName={"products"}
        isLoading={isLoadingProducts}
        pageCount={products?.pagination?.totalPages}
        totalCount={products?.pagination?.total}
      />
    </main>
  );
}

export default ProductsPage;

function PageHeader({ products, categoryId, subcategoryId }) {
  const updateUrlParams = useUpdateUrlParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const limit = parseInt(searchParams.get("limit")) || 10;

  const pageInfo = getPageInfo(products, categoryId, subcategoryId);

  const totalProductsCount = products?.data?.length || 0;

  return (
    <div className="mb-8">
      <nav className="flex items-center mb-4 space-x-2 text-sm text-muted-foreground">
        {pageInfo.breadcrumb.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {item.path ? (
              <button
                onClick={() => navigate(item.path)}
                className="transition-colors hover:text-primary"
              >
                {item.name}
              </button>
            ) : (
              <span className="font-medium text-foreground">{item.name}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="flex items-baseline gap-3 mb-2">
        <h1 className="text-4xl font-bold text-foreground">{pageInfo.title}</h1>
        {pageInfo.subtitle && (
          <span className="text-xl text-muted-foreground">
            {pageInfo.subtitle}
          </span>
        )}
      </div>

      <div className="flex justify-between items-baseline">
        <p className="text-muted-foreground text-xs sm:text-lg">
          {totalProductsCount > 0 ? (
            <>
              Showing {totalProductsCount} product
              {totalProductsCount !== 1 ? "s" : ""}
            </>
          ) : (
            "No products found"
          )}
        </p>
        <div className="flex items-center space-x-2">
          <p className="text-xs sm:text-lg text-gray-700 hidden sm:block">
            Products per page
          </p>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              updateUrlParams({
                limit: value,
                page: 1,
              });
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function EmptyProductState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex items-center justify-center w-24 h-24 mb-6 bg-gray-100 rounded-full">
        <Package className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold text-gray-900">No products</h2>
      <p className="max-w-md mb-6 text-gray-600">
        We couldn't find any products in this category. Try exploring other
        categories!
      </p>
    </div>
  );
}
