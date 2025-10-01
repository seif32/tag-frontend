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
  const [selectedBundle, setSelectedBundle] = useState(null); // Default to null (no bundle)

  useEffect(() => {
    if (primaryVariant) {
      setSelectedVariant(primaryVariant);
      // DON'T auto-select bundle - let user choose
      setSelectedBundle(null);
    }
  }, [primaryVariant]);

  // Reset bundle when variant changes
  useEffect(() => {
    if (selectedVariant) {
      // Reset to no bundle when variant changes
      setSelectedBundle(null);
    }
  }, [selectedVariant]);

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
        bundles: variant.bundles || [],
      };
    });
  }, [safeVariants, selectedVariant]);

  const handleVariantSelection = (variantBlock) => {
    setSelectedVariant(variantBlock.variant);
  };

  const handleBundleSelection = (bundle) => {
    // Allow deselecting bundle by clicking the same bundle
    if (selectedBundle?.id === bundle?.id) {
      setSelectedBundle(null);
    } else {
      setSelectedBundle(bundle);
    }
  };

  // Clear bundle selection (new function)
  const clearBundleSelection = () => {
    setSelectedBundle(null);
  };

  // Calculate effective price based on bundle selection
  const effectivePrice = useMemo(() => {
    if (selectedBundle) {
      return {
        unitPrice:
          parseFloat(selectedBundle.subtotal) / selectedBundle.quantity,
        bundlePrice: parseFloat(selectedBundle.total),
        bundleSubtotal: parseFloat(selectedBundle.subtotal),
        quantity: selectedBundle.quantity,
        savings:
          selectedVariant?.price * selectedBundle.quantity -
          parseFloat(selectedBundle.subtotal),
        vat: parseFloat(selectedBundle.vat),
        isBundle: true,
      };
    }

    // Default to individual item pricing
    return {
      unitPrice: selectedVariant?.price || 0,
      bundlePrice: selectedVariant?.price || 0,
      bundleSubtotal: selectedVariant?.price || 0,
      quantity: 1,
      savings: 0,
      vat: selectedVariant?.vat || 0,
      isBundle: false,
    };
  }, [selectedBundle, selectedVariant]);

  const currentImages = useMemo(() => {
    if (!selectedVariant?.images) return [];

    return selectedVariant.images.map((img) => ({
      original: img.image_url,
      thumbnail: img.image_url,
    }));
  }, [selectedVariant]);

  return {
    selectedVariant,
    selectedBundle,
    variantBlocks,
    currentImages,
    effectivePrice,
    handleVariantSelection,
    handleBundleSelection,
    clearBundleSelection, // New function
    isLoading: !selectedVariant && safeVariants.length > 0,
  };
};

export default useVariantSelector;
