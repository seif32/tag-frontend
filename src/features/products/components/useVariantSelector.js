// src/hooks/useVariantSelector.js
import { useState, useMemo, useEffect } from "react";

/**
 * 🎯 Smart Variant Selection Hook
 * Handles all variant logic: auto-selection, filtering, and state management
 *
 * @param {Array} variants - All product variants from API
 * @returns {Object} - Current variant, selection handlers, and helper functions
 */
const useVariantSelector = (variants = []) => {
  // 🎯 Find the primary variant (or first available)
  const primaryVariant = useMemo(() => {
    const primary = variants.find((v) => v.is_primary === 1);
    return primary || variants[0] || null;
  }, [variants]);

  // 📊 Current selected variant
  const [selectedVariant, setSelectedVariant] = useState(null);

  // 🎨 User's current selections (Color: "Red", Size: "L", etc.)
  const [selections, setSelections] = useState({});

  // 🚀 Auto-select primary variant on load
  useEffect(() => {
    if (primaryVariant && !selectedVariant) {
      setSelectedVariant(primaryVariant);

      // Extract initial selections from primary variant
      const initialSelections = {};
      primaryVariant.types?.forEach((type) => {
        initialSelections[type.type_name] = type.value.name;
      });
      setSelections(initialSelections);
    }
  }, [primaryVariant, selectedVariant]);

  // 🔍 Get available values for a specific variant type
  const getAvailableValues = (typeName) => {
    const availableValues = new Set();

    variants.forEach((variant) => {
      if (variant.in_stock) {
        // Only show in-stock options
        const typeValue = variant.types?.find((t) => t.type_name === typeName);
        if (typeValue) {
          availableValues.add(typeValue.value.name);
        }
      }
    });

    return Array.from(availableValues);
  };

  // 🎯 Find matching variant based on user selections
  const findMatchingVariant = (newSelections) => {
    return variants.find((variant) => {
      return Object.entries(newSelections).every(
        ([typeName, selectedValue]) => {
          const variantType = variant.types?.find(
            (t) => t.type_name === typeName
          );
          return variantType?.value.name === selectedValue;
        }
      );
    });
  };

  // 🔄 Handle variant type selection (Color, Size, etc.)
  const handleVariantSelection = (typeName, value) => {
    const newSelections = { ...selections, [typeName]: value };
    setSelections(newSelections);

    // Find and set the matching variant
    const matchingVariant = findMatchingVariant(newSelections);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
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

  // ✅ Check if a value is available/in-stock
  const isValueAvailable = (typeName, value) => {
    const testSelections = { ...selections, [typeName]: value };
    const matchingVariant = findMatchingVariant(testSelections);
    return matchingVariant?.in_stock === 1;
  };

  return {
    selectedVariant,
    selections,
    currentImages,
    handleVariantSelection,
    getAvailableValues,
    isValueAvailable,
    isLoading: !selectedVariant && variants.length > 0,
  };
};

export default useVariantSelector;
