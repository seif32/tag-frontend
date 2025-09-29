import { useEffect } from "react";
import useProductStore from "../../store/productStore";
import useVariantStore from "../../store/variantStore";

export function useProductModeSetup(mode, id) {
  const setProductId = useProductStore((state) => state.setProductId);
  const setMode = useProductStore((state) => state.setMode);
  const resetProductState = useProductStore((state) => state.setMode);
  const clearSelectedTypes = useVariantStore(
    (state) => state.clearSelectedTypes
  );
  const clearSelectedValues = useVariantStore(
    (state) => state.clearSelectedValues
  );
  const clearSelectedCombination = useVariantStore(
    (state) => state.clearSelectedCombination
  );

  useEffect(() => {
    resetProductState();
    setMode(mode);
    setProductId(id);
  }, [mode, id]);

  useEffect(() => {
    return () => {
      resetProductState();
      clearSelectedTypes();
      clearSelectedValues();
    };
  }, []);

  return {
    clearSelectedTypes,
    clearSelectedValues,
    clearSelectedCombination,
  };
}
