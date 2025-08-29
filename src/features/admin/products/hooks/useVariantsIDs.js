import { useMemo } from "react";

export function useVariantsIDs(product, variantsList) {
  return useMemo(() => {
    if (product?.variants) {
      return product.variants; // Integer IDs preserved! ✅
    }

    // In add mode, use RHF managed variants
    return variantsList;
  }, [product, variantsList]);
}
