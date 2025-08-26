import useProductStore from "@/features/admin/store/productStore";

const obg = {
  id: "28bc246a-68ec-4935-a3b7-f8d04a956f78",
  product_id: 1,
  variant_sku: "IPHONE_1-BLACK-256",
  variant_name: "iPhone Pro Black 256GB",
  is_primary: 0,
  price: "395.28",
  compare_at_price: null,
  cost_price: "276.70",
  currency: "USD",
  has_discount: 0,
  quantity: 11,
  in_stock: 1,
  created_at: "2025-08-08T03:08:51.000Z",
  updated_at: "2025-08-08T03:08:51.000Z",
  types: [
    {
      type_id: 1,
      type_name: "Color",
      value: {
        id: 1,
        name: "Black",
      },
    },
    {
      type_id: 3,
      type_name: "Storage",
      value: {
        id: 19,
        name: "256GB",
      },
    },
  ],
  images: [
    {
      image_url: "https://picsum.photos/400/400?random=4",
      is_primary: 1,
    },
    {
      image_url: "https://picsum.photos/400/400?random=5",
      is_primary: 0,
    },
    {
      image_url: "https://picsum.photos/400/400?random=6",
      is_primary: 0,
    },
    {
      image_url: "https://picsum.photos/400/400?random=3",
      is_primary: 1,
    },
    {
      image_url: "https://picsum.photos/400/400?random=4",
      is_primary: 0,
    },
  ],
};

function ProductHeader({ product }) {
  const mode = useProductStore((state) => state.mode);

  const notAddMode = mode !== "add";

  console.log("ProductHeader", product);
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-sm font-bold">{product.variant_name}</h3>
        <div className="flex gap-2">
          {product?.types?.map((type) => (
            <span
              key={type.typeid}
              className="px-2 text-xs text-white bg-black border border-black rounded-md"
            >
              {notAddMode ? type?.value?.name : type?.selectedValue?.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductHeader;
