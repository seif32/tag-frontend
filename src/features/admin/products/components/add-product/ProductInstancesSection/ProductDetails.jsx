import { Badge } from "@/components/ui/badge";

function ProductDetails({ product }) {
  return (
    <div className="space-y-6">
      {/* Main Info */}
      <div className="grid grid-cols-2 gap-6 text-sm md:grid-cols-3">
        <div>
          <span className="text-muted-foreground">SKU:</span>
          <p className="font-medium">{product.variant_sku}</p>
        </div>

        <div>
          <span className="text-muted-foreground">Quantity:</span>
          <p className="font-medium">{product.quantity}</p>
        </div>

        <div className="flex flex-col">
          <span className="text-muted-foreground">Stock Status:</span>
          <Badge
            variant={product.quantity > 0 ? "default" : "destructive"}
            className={product.quantity > 0 && "bg-green-500"}
          >
            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="grid grid-cols-2 gap-6 text-sm md:grid-cols-3">
        <div>
          <span className="text-muted-foreground">Price:</span>
          <p className="font-medium">
            {product.currency === "USD" ? "$" : product.currency}{" "}
            {product.price}
          </p>
        </div>

        <div>
          <span className="text-muted-foreground">Compare at Price:</span>
          <p
            className={`font-medium ${
              parseFloat(product.compare_at_price) > 0 ? "line-through " : ""
            }`}
          >
            {product.currency === "USD" ? "$" : product.currency}{" "}
            {product.compare_at_price}
          </p>
        </div>

        <div>
          <span className="text-muted-foreground">Cost Price:</span>
          <p className="font-medium ">
            {product.currency === "USD" ? "$" : product.currency}{" "}
            {product.cost_price}
          </p>
        </div>
      </div>

      {/* Images */}
      {product.images && product.images.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Images</h4>
          <div className="flex flex-wrap gap-3">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="relative w-20 h-20 overflow-hidden bg-gray-100 rounded-md shadow-sm"
              >
                <img
                  src={image.image_url || "/placeholder.svg"}
                  alt={`${product.variant_name} image ${index + 1}`}
                  className="object-cover w-full h-full rounded-md"
                />
                {image.is_primary && (
                  <Badge
                    variant="default"
                    className="absolute top-1 left-1 text-[10px] px-1 py-0.5"
                  >
                    Primary
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>No Images</div>
      )}
    </div>
  );
}

export default ProductDetails;
