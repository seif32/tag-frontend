// src/features/products/components/ProductsSidebarHeader.jsx
import { SidebarHeader } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

function ProductsSidebarHeader() {
  const totalProducts = 3247; // You can get this from your store/API

  return (
    <SidebarHeader className="p-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Categories</h2>
            <p className="text-xs text-muted-foreground">Browse products</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs font-medium">
          {totalProducts.toLocaleString()}
        </Badge>
      </div>
    </SidebarHeader>
  );
}

export default ProductsSidebarHeader;
