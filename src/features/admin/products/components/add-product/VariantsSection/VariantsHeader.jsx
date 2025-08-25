import useVariantStore from "@/features/admin/store/variantStore";
import { IoTrashOutline } from "react-icons/io5";

function VariantsHeader({ index, typeId }) {
  const removeSelectedType = useVariantStore(
    (state) => state.removeSelectedType
  );
  const removeSelectedValuesForType = useVariantStore(
    (state) => state.removeSelectedValuesForType
  );

  function handleDelete() {
    removeSelectedType(typeId);
    removeSelectedValuesForType(typeId);
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium">Variant {index + 1}</p>
      <IoTrashOutline
        size={18}
        className="transition-all duration-75 cursor-pointer hover:text-red-500 hover:scale-105"
        onClick={handleDelete}
      />
    </div>
  );
}

export default VariantsHeader;
