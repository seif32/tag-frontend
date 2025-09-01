import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProductCard from "../components/ProductCard";
import useProducts from "@/hooks/useProducts";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUrlParams } from "@/hooks/useUpdateUrlParams";

function ProductsPage() {
  const updateUrlParams = useUpdateUrlParams();
  const [searchParams] = useSearchParams();
  const { categoryId, subcategoryId } = useParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  const {
    products,
    isLoadingProducts,
    errorProducts,
    isErrorProducts,
    refetchProducts,
  } = useProducts.useAllWithoutVariants({
    category_id: categoryId,
    id: subcategoryId,
  });

  const navigate = useNavigate();

  function handleViewProductDetails(productId) {
    navigate(`/products/${productId}`);
  }

  const getPageInfo = () => {
    if (!products || products.length === 0) {
      return {
        title: "Products",
        subtitle: null,
        breadcrumb: [],
      };
    }

    const firstProduct = products.data[0];
    const categoryName = firstProduct.category_name;
    const subcategoryName = firstProduct.sub_category_name;

    if (subcategoryId && subcategoryName) {
      return {
        title: subcategoryName,
        subtitle: `in ${categoryName}`,
        breadcrumb: [
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: categoryName, path: `/categories/${categoryId}` },
          { name: subcategoryName, path: null },
        ],
      };
    }

    if (categoryId && categoryName) {
      return {
        title: categoryName,
        subtitle: "Products",
        breadcrumb: [
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: categoryName, path: null },
        ],
      };
    }

    return {
      title: "All Products",
      subtitle: null,
      breadcrumb: [
        { name: "Home", path: "/" },
        { name: "All Products", path: null },
      ],
    };
  };

  if (isLoadingProducts)
    return <LoadingState type="card" rows={20} columns={3} />;

  if (isErrorProducts)
    return (
      <ErrorMessage
        message={errorProducts.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchProducts()}
      />
    );

  const totalProductsCount = products?.data?.length || 0;

  const pageInfo = getPageInfo();

  return (
    <SidebarProvider className="flex">
      <SidebarTrigger className="mb-4 md:hidden" />

      <main className="flex-1 px-8 overflow-auto">
        {/* 🎯 Dynamic Page Header with Breadcrumb */}
        <div className="mb-8">
          {/* 🍞 Breadcrumb Navigation */}
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
                  <span className="font-medium text-foreground">
                    {item.name}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* 🏷️ Dynamic Page Title */}
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-4xl font-bold text-foreground">
              {pageInfo.title}
            </h1>
            {pageInfo.subtitle && (
              <span className="text-xl text-muted-foreground">
                {pageInfo.subtitle}
              </span>
            )}
          </div>

          {/* 📊 Product Count */}
          <div className="flex justify-between items-baseline">
            <p className="text-muted-foreground">
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
              <p className="text-sm text-gray-700">Products per page</p>
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

        {/* <ProductsHeader productCount={totalProductsCount} /> */}

        {/* 🎨 Empty State */}
        {totalProductsCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center w-24 h-24 mb-6 bg-gray-100 rounded-full">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              {/* No products in {pageInfo.title} */}
              No products
            </h2>
            <p className="max-w-md mb-6 text-gray-600">
              We couldn't find any products in this category. Try exploring
              other categories!
            </p>
          </div>
        ) : (
          /* 📦 Products Grid */
          // <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          <div className="grid grid-cols-4 gap-6">
            {products?.data?.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  image={product.primary_image}
                  category={product.category_name}
                  name={product.name}
                  variantCount={product.variant_count}
                  brand={product.brand_name}
                  onViewProductDetails={handleViewProductDetails}
                  productId={product.id}
                />
              );
            })}
          </div>
        )}
        <div className="mt-8 justify-self-end flex-col flex items-start space-y-2">
          <p className="text-sm text-gray-700">
            Page {products?.pagination?.page || 1} of{" "}
            {products?.pagination?.totalPages || 1}
          </p>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrlParams({ page: page - 1 })}
              disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrlParams({ page: page + 1 })}
              disabled={page >= (products?.pagination?.totalPages || 1)}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default ProductsPage;
