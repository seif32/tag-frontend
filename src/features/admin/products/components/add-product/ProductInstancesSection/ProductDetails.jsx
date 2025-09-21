import { Badge } from "@/components/ui/badge";

function ProductDetails({ product }) {
  return (
    <div className="space-y-8">
      {/* Inventory & Cost Info */}
      <div>
        <div className="grid grid-cols-2 gap-6 text-sm md:grid-cols-3">
          <div>
            <span className="text-muted-foreground block">Quantity</span>
            <p className="font-medium">{product.quantity}</p>
          </div>

          <div>
            <span className="text-muted-foreground block">Cost Price</span>
            <p className="font-medium">
              {product.currency === "USD" ? "$" : product.currency}{" "}
              {product.cost_price}
            </p>
          </div>

          <div>
            <span className="text-muted-foreground block">Stock Status</span>
            <Badge
              variant={product.quantity > 0 ? "default" : "destructive"}
              className={product.quantity > 0 ? "bg-green-500" : ""}
            >
              {product.quantity > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Pricing Info */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Pricing</h4>
        <div className="grid grid-cols-2 gap-6 text-sm md:grid-cols-3">
          <div>
            <span className="text-muted-foreground block">Price</span>
            <p className="font-medium">
              {product.currency === "USD" ? "$" : product.currency}{" "}
              {product.price}
            </p>
          </div>

          <div>
            <span className="text-muted-foreground block">VAT</span>
            <p className="font-medium">{product.vat}</p>
          </div>

          <div>
            <span className="text-muted-foreground block">
              Compare at Price
            </span>
            <p
              className={`font-medium ${
                parseFloat(product.compare_at_price) > 0 ? "line-through" : ""
              }`}
            >
              {product.currency === "USD" ? "$" : product.currency}{" "}
              {product.compare_at_price}
            </p>
          </div>
        </div>
      </div>

      {/* Images */}
      {/* {product.images?.length > 0 ? (
        <div>
          <h4 className="text-sm font-semibold mb-3">Images</h4>
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
        <div className="text-sm text-gray-500">No Images</div>
      )} */}
    </div>
  );
}

export default ProductDetails;
