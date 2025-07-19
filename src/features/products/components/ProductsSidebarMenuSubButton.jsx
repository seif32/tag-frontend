import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { NavLink } from "react-router";

function ProductsSidebarMenuSubButton({
  subcat,
  activeCategory,
  setActiveCategory,
  categoryId,
}) {
  const handleSubcategoryClick = (subcategoryId) => {
    setActiveCategory(subcategoryId);
  };

  return (
    <NavLink
      to={`/products/category/${categoryId}/${subcat.id}`}
      onClick={() => handleSubcategoryClick(subcat.id)}
    >
      {({ isActive }) => (
        <SidebarMenuSubButton
          className={`w-full justify-between cursor-pointer ${
            isActive ? "bg-accent text-accent-foreground" : ""
          }`}
        >
          <span className="text-sm">{subcat.name}</span>
          <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">
            {subcat.count}
          </span>
        </SidebarMenuSubButton>
      )}
    </NavLink>
  );
}

export default ProductsSidebarMenuSubButton;
