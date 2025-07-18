import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";

function ProductsSidebarMenuButton({
  expandedCategories,
  setExpandedCategories,
  category,
}) {
  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <SidebarMenuButton
      onClick={() => toggleCategory(category.id)}
      className=" w-full justify-between hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* <span className="text-lg">{category.icon}</span> */}
        <span className="font-medium">{category.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs bg-gray-200 text-primary px-2 py-1 rounded-sm">
          {category.subcategories.reduce((sum, sub) => sum + sub.count, 0)}
        </span>
        {expandedCategories.has(category.id) ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </SidebarMenuButton>
  );
}

export default ProductsSidebarMenuButton;
