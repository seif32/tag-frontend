// src/features/products/components/ProductsSidebar.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import ProductsSidebarHeader from "./ProductsSidebarHeader";
import ProductsSidebarMenuButton from "./ProductsSidebarMenuButton";
import ProductsSidebarMenuSubButton from "./ProductsSidebarMenuSubButton";

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "📱",
    subcategories: [
      { id: "smartphones", name: "Smartphones", count: 145 },
      { id: "laptops", name: "Laptops", count: 89 },
      { id: "tablets", name: "Tablets", count: 67 },
      { id: "headphones", name: "Headphones", count: 234 },
      { id: "cameras", name: "Cameras", count: 78 },
    ],
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: "👕",
    subcategories: [
      { id: "mens", name: "Men's Wear", count: 567 },
      { id: "womens", name: "Women's Wear", count: 892 },
      { id: "kids", name: "Kids' Wear", count: 234 },
      { id: "shoes", name: "Shoes", count: 345 },
      { id: "accessories", name: "Accessories", count: 156 },
    ],
  },
  {
    id: "home",
    name: "Home & Garden",
    icon: "🏠",
    subcategories: [
      { id: "furniture", name: "Furniture", count: 123 },
      { id: "decor", name: "Home Decor", count: 267 },
      { id: "kitchen", name: "Kitchen", count: 189 },
      { id: "garden", name: "Garden", count: 98 },
      { id: "tools", name: "Tools", count: 76 },
    ],
  },
  {
    id: "sports",
    name: "Sports & Outdoors",
    icon: "⚽",
    subcategories: [
      { id: "fitness", name: "Fitness", count: 134 },
      { id: "outdoor", name: "Outdoor Gear", count: 89 },
      { id: "team-sports", name: "Team Sports", count: 167 },
      { id: "water-sports", name: "Water Sports", count: 45 },
      { id: "winter-sports", name: "Winter Sports", count: 67 },
    ],
  },
  {
    id: "books",
    name: "Books & Media",
    icon: "📚",
    subcategories: [
      { id: "fiction", name: "Fiction", count: 345 },
      { id: "non-fiction", name: "Non-Fiction", count: 234 },
      { id: "textbooks", name: "Textbooks", count: 123 },
      { id: "ebooks", name: "E-Books", count: 456 },
      { id: "audiobooks", name: "Audiobooks", count: 89 },
    ],
  },
];

export function ProductsSidebar() {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState(null);

  // Auto-expand category if user is on that route
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const categoryFromPath = pathParts[3]; // /products/category/[categoryId]

    if (categoryFromPath) {
      setExpandedCategories((prev) => new Set([...prev, categoryFromPath]));
    }
  }, [location.pathname]);

  return (
    <Sidebar className="relative h-full">
      <ProductsSidebarHeader />

      <SidebarContent className="p-2">
        <SidebarMenu>
          {categories.map((category) => (
            <SidebarMenuItem key={category.id}>
              <ProductsSidebarMenuButton
                category={category}
                expandedCategories={expandedCategories}
                setExpandedCategories={setExpandedCategories}
              />

              {expandedCategories.has(category.id) && (
                <SidebarMenuSub className="mt-1 ml-4 space-y-1">
                  {category.subcategories.map((subcat) => (
                    <SidebarMenuSubItem key={subcat.id}>
                      <ProductsSidebarMenuSubButton
                        subcat={subcat}
                        categoryId={category.id}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                      />
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
