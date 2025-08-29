import useProductStore from "../../store/productStore";

export function useFilteredVariants(variantsList) {
  const mode = useProductStore((state) => state.mode);

  const filteredVariants =
    mode === "add"
      ? variantsList.filter((variant, index) => {
          if (index === 0 && !variant.price) {
            return false;
          }
          return true;
        })
      : variantsList;

  const isEmpty =
    !filteredVariants ||
    filteredVariants.length === 0 ||
    filteredVariants.every((variant) => !variant.price);
  return { filteredVariants, isEmpty };
}

export default useFilteredVariants;
