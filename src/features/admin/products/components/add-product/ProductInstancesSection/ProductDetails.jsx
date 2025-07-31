import { Badge } from "@/components/ui/badge";

function ProductDetails({ product }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">SKU:</span>
          <p className="font-medium">{product.sku}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Quantity:</span>
          <p className="font-medium">{product.quantity}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Price:</span>
          <p className="font-medium">
            {product.currency === "USD" ? "$" : product.currency}{" "}
            {product.price}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Stock Status:</span>
          <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </div>

      {product.images && product.images.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Images</h4>
          <div className="flex flex-wrap gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="w-16 h-16 overflow-hidden bg-gray-100 rounded-md"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} image ${index + 1}`}
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
