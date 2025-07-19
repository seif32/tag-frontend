import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProductsSidebar } from "../components/ProductsSidebar";
import ProductCard from "../components/ProductCard";
import { ProductsHeader } from "../components/ProductsHeader";

function ProductsPage() {
  return (
    <SidebarProvider className={""}>
      <ProductsSidebar />

      <SidebarTrigger className="mb-4 md:hidden" />

      <main className="flex-1 px-8 overflow-auto">
        <ProductsHeader productCount={4502} />

        <div className=" grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default ProductsPage;
