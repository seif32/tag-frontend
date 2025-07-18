import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProductsSidebar } from "../components/ProductsSidebar";
import ProductCard from "../components/ProductCard";
import { ProductsHeader } from "../components/ProductsHeader";

function ProductsPage() {
  return (
    <SidebarProvider className={"pr-8"}>
      <ProductsSidebar />

      <div className="mb-4 md:hidden">
        <SidebarTrigger />
      </div>

      <main className=" overflow-auto flex-1">
        <ProductsHeader productCount={4502} />

        <div className=" grid  grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
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
