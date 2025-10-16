import ProductCardImage from "./ProductCardImage";
import ProductCardInfo from "./ProductCardInfo";

function ProductCard({
  image,
  category,
  name,
  variantCount,
  brand,
  onViewProductDetails,
  productId,
  variants,
}) {
  return (
    <div
      className="flex flex-col border  rounded-md shadow-sm overflow-hidden cursor-pointer"
      onClick={() => onViewProductDetails(productId)}
    >
      <ProductCardImage image={image} variantCount={variantCount} />
      <ProductCardInfo
        category={category}
        name={name}
        variantCount={variantCount}
        brand={brand}
        variants={variants}
      />

      {/* <ProductCardActions
        onViewProductDetails={onViewProductDetails}
        productId={productId}
      /> */}
    </div>
  );
}

export default ProductCard;
