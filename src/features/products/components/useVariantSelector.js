import { useState, useMemo, useEffect } from "react";

const useVariantSelector = (variants = []) => {
  const safeVariants = useMemo(
    () => (Array.isArray(variants) ? variants : []),
    [variants]
  );
  const primaryVariant = useMemo(() => {
    if (safeVariants.length === 0) return null;
    const primary = safeVariants.find((v) => v.is_primary === 1);
    return primary || safeVariants[0] || null;
  }, [safeVariants]);

  const [selectedVariant, setSelectedVariant] = useState(null);

  console.log("useVariantSelector", selectedVariant);

  useEffect(() => {
    if (primaryVariant) {
      setSelectedVariant(primaryVariant);
    }
  }, [primaryVariant]);

  useEffect(() => {
    if (primaryVariant && !selectedVariant) {
      setSelectedVariant(primaryVariant);
    }
  }, [primaryVariant, selectedVariant]);

  const variantBlocks = useMemo(() => {
    return safeVariants.map((variant) => {
      const combinationName =
        variant.types?.map((type) => type.value.name).join(" • ") ||
        `Variant ${variant.id}`;

      return {
        id: variant.id,
        name: combinationName,
        vat: variant?.vat,
        variant: variant,
        isAvailable: variant.quantity >= 1,
        isSelected: selectedVariant?.id === variant.id,
        price: variant.price,
        comparePrice: variant.compare_at_price,
        images: variant.images || [],
      };
    });
  }, [safeVariants, selectedVariant]);

  const handleVariantSelection = (variantBlock) => {
    setSelectedVariant(variantBlock.variant);
  };

  const currentImages = useMemo(() => {
    if (!selectedVariant?.images) return [];

    return selectedVariant.images.map((img) => ({
      original: img.image_url,
      thumbnail: img.image_url,
    }));
  }, [selectedVariant]);

  return {
    selectedVariant,
    variantBlocks,
    currentImages,
    handleVariantSelection,
    isLoading: !selectedVariant && safeVariants.length > 0,
  };
};

export default useVariantSelector;
