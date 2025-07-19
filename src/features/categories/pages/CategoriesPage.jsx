// src/features/categories/pages/CategoriesPage.jsx
import CategoryCard from "../components/CategoryCard";
import { CategoriesHeader } from "../components/CategoryHeader";

// 🎯 Import images properly
import Image1 from "@/assets/product4.jpg";
import Image2 from "@/assets/product5.jpg";
import Image3 from "@/assets/product6.jpg";
import Image4 from "@/assets/product7.jpg";
import Image5 from "@/assets/product8.jpg";
import Image6 from "@/assets/product9.jpg";

function CategoriesPage() {
  return (
    <>
      <CategoriesHeader />
      <div className="space-y-24">
        {/* Electronics Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Electronics</h2>
          <p className="mb-6 text-muted-foreground">
            Discover our latest tech products and gadgets
          </p>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-y-20 gap-x-6">
            <CategoryCard
              name="Mobiles"
              storage={458}
              image={Image1}
              onClick={() => console.log("Navigate to mobiles")}
            />
            <CategoryCard
              name="Laptops"
              storage={780}
              image={Image2}
              onClick={() => console.log("Navigate to laptops")}
            />
            <CategoryCard
              name="Cameras"
              storage={248}
              image={Image3}
              onClick={() => console.log("Navigate to cameras")}
            />
            <CategoryCard
              name="Mobiles"
              storage={458}
              image={Image1}
              onClick={() => console.log("Navigate to mobiles")}
            />
            <CategoryCard
              name="Laptops"
              storage={780}
              image={Image2}
              onClick={() => console.log("Navigate to laptops")}
            />
            <CategoryCard
              name="Cameras"
              storage={248}
              image={Image3}
              onClick={() => console.log("Navigate to cameras")}
            />
          </div>
        </div>

        {/* 👕 Clothing Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Clothing</h2>
          <p className="mb-6 text-muted-foreground">
            Fashion for everyone, from casual to formal
          </p>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-y-20 gap-x-6 mb-16">
            <CategoryCard
              name="Men's Wear"
              storage={567}
              image={Image4} // Add when you have the image
              onClick={() => console.log("Navigate to mens wear")}
            />
            <CategoryCard
              name="Women's Wear"
              storage={892}
              image={Image5} // Add when you have the image
              onClick={() => console.log("Navigate to womens wear")}
            />
            <CategoryCard
              name="Kids' Wear"
              storage={234}
              image={Image6} // Add when you have the image
              onClick={() => console.log("Navigate to kids wear")}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoriesPage;
