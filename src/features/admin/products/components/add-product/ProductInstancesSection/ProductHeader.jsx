function ProductHeader({ product }) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-sm font-bold">{product.variantName}</h3>
        <div className="flex gap-2">
          {product.types.map((type) => (
            <span
              key={type.typeid}
              className="text-xs text-white bg-black border px-2 border-black  rounded-md"
            >
              {type.value.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductHeader;
