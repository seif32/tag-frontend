import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ProductDetails({ product }) {
  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quantity</TableHead>
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
              {product.currency === "USD" ? "$" : product.currency}{" "}
              {product.cost_price}
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
              {product.currency === "USD" ? "$" : product.currency}{" "}
              {product.price}
            </TableCell>
            <TableCell className="font-medium">{product.vat}%</TableCell>
            <TableCell>
              <span
                className={`font-medium ${
                  parseFloat(product.compare_at_price) > 0 ? "line-through" : ""
                }`}
              >
                {product.currency === "USD" ? "$" : product.currency}{" "}
                {product.compare_at_price}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default ProductDetails;
