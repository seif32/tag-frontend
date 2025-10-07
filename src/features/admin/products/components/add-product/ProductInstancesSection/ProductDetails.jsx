import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import useProductStore from "@/features/admin/store/productStore";

function ProductDetails({ product, onEditBundle, onDeleteBundle }) {
  const mode = useProductStore((state) => state.mode);
  const isAddMode = mode === "add";
  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <p className="font-medium text-muted-foreground">Product</p>
          <TableRow>
            <TableHead className={"text-left pl-0 "}>Quantity</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>VAT</TableHead>
            <TableHead>Compare Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{product.quantity}</TableCell>
            <TableCell className="font-medium">
              {formatCurrency(product.cost_price)}
            </TableCell>
            <TableCell>
              <Badge
                variant={product.quantity > 0 ? "default" : "destructive"}
                className={product.quantity > 0 ? "bg-green-500" : ""}
              >
                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              {formatCurrency(product.price)}
            </TableCell>
            <TableCell className="font-medium">{product.vat}%</TableCell>
            <TableCell>
              <span
                className={`font-medium ${
                  parseFloat(product.compare_at_price) > 0 ? "line-through" : ""
                }`}
              >
                {formatCurrency(product.compare_at_price)}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {product?.bundles?.length !== 0 && !isAddMode && (
        <Table>
          <TableHeader>
            <p className="font-medium text-muted-foreground">Bundles</p>

            <TableRow>
              <TableHead className={"text-left pl-0 "}>Quantity</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Vat</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product?.bundles?.map((bundle) => (
              <TableRow key={bundle?.id}>
                <TableCell className="font-medium">
                  {bundle?.quantity}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(bundle?.subtotal)}
                </TableCell>
                <TableCell>{bundle?.vat}%</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(bundle?.total)}
                </TableCell>
                <TableCell>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                      <Eye className="size-4 left-3 relative cursor-pointer text-accent hover:text-accent/70" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={(e) => {
                          console.log("📝 Edit bundle dropdown clicked");
                          e.stopPropagation();
                          onEditBundle?.(bundle);
                        }}
                      >
                        <Edit />
                        <p>Edit Bundle</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          console.log("🗑️ Delete bundle dropdown clicked");
                          e.stopPropagation();
                          onDeleteBundle?.(bundle);
                        }}
                      >
                        <Trash />
                        <p>Delete Bundle</p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default ProductDetails;
