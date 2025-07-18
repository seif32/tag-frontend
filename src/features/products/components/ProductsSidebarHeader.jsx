import { SidebarHeader } from "@/components/ui/sidebar";

function ProductsSidebarHeader() {
  return (
    <SidebarHeader className=" p-4 border-b">
      <div className="flex items-center gap-2">
        <h2 className="text-lg text-foreground">Categories</h2>
      </div>
    </SidebarHeader>
  );
}

export default ProductsSidebarHeader;
