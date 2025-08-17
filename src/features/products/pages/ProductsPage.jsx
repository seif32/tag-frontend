import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProductsSidebar } from "../components/ProductsSidebar";
import ProductCard from "../components/ProductCard";
import { ProductsHeader } from "../components/ProductsHeader";

import useProducts from "@/hooks/useProducts";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";

function ProductsPage() {
  const {
    products,
    isLoadingProducts,
    errorProducts,
    isErrorProducts,
    refetchProducts,
  } = useProducts.useAllWithoutVariants();

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

  const productsCountArray = products.map((product) => product.variant_count);
  const totalVariantsCount = productsCountArray.reduce(
    (acc, curr) => acc + curr,
    0
  );
  const totalProductsCount = products.length;

  return (
    <SidebarProvider className={"flex"}>
      <ProductsSidebar />

      <SidebarTrigger className="mb-4 md:hidden" />

      <main className="flex-1 px-8 overflow-auto">
        <ProductsHeader productCount={totalProductsCount} />

        <div className=" grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.primary_image}
              category={product.category_name}
              name={product.name}
              variantCount={product.variant_count}
              brand={product.brand_name}
            />
          ))}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default ProductsPage;
