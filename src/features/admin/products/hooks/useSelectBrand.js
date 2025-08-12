import useBrands from "@/hooks/useBrands";
import { useMemo } from "react";

export function useSelectBrand(mode) {
  const { brands, isLoadingBrands } = useBrands.useAll();
  const { allBrands } = useMemo(() => {
    if (isLoadingBrands || !brands) return { allBrands: [] };

    const allBrands = brands.map((brand) => ({
      value: brand.id,
      label: brand.name,
    }));
    return { allBrands };
  }, [brands, isLoadingBrands]);
  return { allBrands, isLoadingBrands };
}
