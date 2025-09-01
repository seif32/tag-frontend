"use client";

import { useState, useMemo, useEffect } from "react";

const useVariantSelector = (variants = []) => {
  const safeVariants = Array.isArray(variants) ? variants : [];

  // Find the primary variant (or first available)
  const primaryVariant = useMemo(() => {
    if (safeVariants.length === 0) return null;
    const primary = safeVariants.find((v) => v.is_primary === 1);
    return primary || safeVariants[0] || null;
  }, [safeVariants]);

  // Current selected variant
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Auto-select primary variant on load
  useEffect(() => {
    if (primaryVariant && !selectedVariant) {
      setSelectedVariant(primaryVariant);
    }
  }, [primaryVariant, selectedVariant]);

  const variantBlocks = useMemo(() => {
    return safeVariants.map((variant) => {
      // Create display name from variant types
      const combinationName =
        variant.types?.map((type) => type.value.name).join(" • ") ||
        `Variant ${variant.id}`;

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
  }, [safeVariants, selectedVariant]);

  // Handle variant block selection
  const handleVariantSelection = (variantBlock) => {
    setSelectedVariant(variantBlock.variant);
  };

  // Get images for current variant
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
