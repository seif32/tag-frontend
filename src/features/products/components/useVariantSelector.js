// src/hooks/useVariantSelector.js
import { useState, useMemo, useEffect } from "react";

const useVariantSelector = (variants = []) => {
  // 🎯 Find the primary variant (or first available)
  const primaryVariant = useMemo(() => {
    const primary = variants.find((v) => v.is_primary === 1);
    return primary || variants[0] || null;
  }, [variants]);

  // 📊 Current selected variant
  const [selectedVariant, setSelectedVariant] = useState(null);

  // 🚀 Auto-select primary variant on load
  useEffect(() => {
    if (primaryVariant && !selectedVariant) {
      setSelectedVariant(primaryVariant);
    }
  }, [primaryVariant, selectedVariant]);

  const variantBlocks = useMemo(() => {
    return variants.map((variant) => {
      // Create display name from variant types
      const combinationName =
        variant.types?.map((type) => type.value.name).join(" • ") ||
        variant.variant_name;

      return {
        id: variant.id,
        name: combinationName,
        variant: variant,
        isAvailable: variant.quantity >= 1,
        isSelected: selectedVariant?.id === variant.id,
        price: variant.price,
        comparePrice: variant.compare_at_price,
        images: variant.images || [],
      };
    });
  }, [variants, selectedVariant]);

  // 🔄 Handle variant block selection
  const handleVariantSelection = (variantBlock) => {
    setSelectedVariant(variantBlock.variant);
  };

  // 🖼️ Get images for current variant
  const currentImages = useMemo(() => {
    if (!selectedVariant?.images) return [];

    return selectedVariant.images.map((img) => ({
      original: img.image_url,
      thumbnail: img.image_url,
      originalAlt: selectedVariant.variant_name,
      thumbnailAlt: selectedVariant.variant_name,
    }));
  }, [selectedVariant]);

  return {
    selectedVariant,
    variantBlocks,
    currentImages,
    handleVariantSelection,
    isLoading: !selectedVariant && variants.length > 0,
  };
};

export default useVariantSelector;
