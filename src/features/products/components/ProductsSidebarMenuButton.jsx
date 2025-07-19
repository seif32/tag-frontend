// src/features/products/components/ProductsSidebarMenuButton.jsx
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router";

function ProductsSidebarMenuButton({
  expandedCategories,
  setExpandedCategories,
  category,
}) {
  const location = useLocation();

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const isCategoryActive = location.pathname.includes(
    `/products/category/${category.id}`
  );
  const totalProducts = category.subcategories.reduce(
    (sum, sub) => sum + sub.count,
    0
  );

  return (
    <SidebarMenuButton
      onClick={() => toggleCategory(category.id)}
      className={`w-full justify-between cursor-pointer ${
        isCategoryActive ? "bg-accent text-accent-foreground" : ""
      }`}
    >
      <NavLink
        to={`/products/category/${category.id}`}
        className="flex items-center gap-3 flex-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <span className="text-base">{category.icon}</span> */}
        <span className="font-medium">{category.name}</span>
      </NavLink>

      <div className="flex items-center gap-2">
        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
          {totalProducts}
        </span>
        <ChevronRight
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            expandedCategories.has(category.id) ? "rotate-90" : ""
          }`}
        />
      </div>
    </SidebarMenuButton>
  );
}

export default ProductsSidebarMenuButton;
