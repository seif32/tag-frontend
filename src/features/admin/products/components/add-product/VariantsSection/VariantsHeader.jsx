import useVariantStore from "@/features/admin/store/variantStore";
import { IoTrashOutline } from "react-icons/io5";

function VariantsHeader({ index, variantId }) {
  const setVariants = useVariantStore((state) => state.setVariants);

  const deleteVariant = (variantId) => {
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  const variants = useVariantStore((state) => state.variants);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium">Variant {index + 1}</p>
      <IoTrashOutline
        size={18}
        className="transition-all duration-75 cursor-pointer hover:text-red-500 hover:scale-105"
        onClick={() => deleteVariant(variantId)}
      />
    </div>
  );
}

export default VariantsHeader;
