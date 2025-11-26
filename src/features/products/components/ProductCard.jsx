// ProductCard.jsx
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
      className="group flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
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
    </div>
  );
}

export default ProductCard;
