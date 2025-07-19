import { SidebarMenuSubButton } from "@/components/ui/sidebar";

function ProductsSidebarMenuSubButton({
  subcat,
  activeCategory,
  setActiveCategory,
}) {
  const handleSubcategoryClick = (subcategoryId) => {
    setActiveCategory(subcategoryId);
    // TODO: Add filtering logic here later
    console.log("ProductsSidebarMenuSubButton", activeCategory);
  };
  return (
    <SidebarMenuSubButton
      onClick={() => handleSubcategoryClick(subcat.id)}
      className={`w-full justify-between cursor-pointer  ${
        activeCategory === subcat.id
          ? "bg-primary/10 text-primary font-semibold"
          : "hover:bg-accent hover:text-accent-foreground "
      }`}
    >
      <span className="text-sm">{subcat.name}</span>
      <span
        className={`text-xs text-muted-foreground  px-2 py-1 rounded-full  ${
          activeCategory === subcat.id
            ? "text-accent font-semibold "
            : "hover:bg-accent hover:text-accent-foreground "
        }`}
      >
        {subcat.count}
      </span>
    </SidebarMenuSubButton>
  );
}

export default ProductsSidebarMenuSubButton;
