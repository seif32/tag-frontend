function ProductHeader({ product }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-sm font-bold">{product.variant_name}</h3>
        <div className="flex gap-2">
          {product.types.map((type) => (
            <span
              key={type.type_id}
              className="px-2 text-xs text-white bg-black border border-black rounded-md"
            >
              {type.value.name.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductHeader;
