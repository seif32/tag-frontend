import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProductsSidebar } from "../components/ProductsSidebar";
import ProductCard from "../components/ProductCard";
import { ProductsHeader } from "../components/ProductsHeader";

import Image1 from "@/assets/product4.jpg";
import Image2 from "@/assets/product5.jpg";
import Image3 from "@/assets/product6.jpg";
import Image4 from "@/assets/product7.jpg";
import Image5 from "@/assets/product8.jpg";
import Image6 from "@/assets/product9.jpg";

const products = [
  {
    image: Image1,
    isSoldOut: true,
  },
  {
    image: Image2,
    isSoldOut: false,
  },
  {
    image: Image3,
    isSoldOut: false,
  },
  {
    image: Image4,
    isSoldOut: true,
  },
  {
    image: Image5,
    isSoldOut: true,
  },
  {
    image: Image6,
    isSoldOut: false,
  },
];

function ProductsPage() {
  return (
    <SidebarProvider className={""}>
      <ProductsSidebar />

      <SidebarTrigger className="mb-4 md:hidden" />

      <main className="flex-1 px-8 overflow-auto">
        <ProductsHeader productCount={4502} />

        <div className=" grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              image={product.image}
              isSoldOut={product.isSoldOut}
            />
          ))}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default ProductsPage;
