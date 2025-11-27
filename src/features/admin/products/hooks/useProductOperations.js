import { useState } from "react";
import { toast } from "sonner";
import useProducts from "@/hooks/useProducts";
import useVariantStore from "../../store/variantStore";

export const useProductOperations = (navigate) => {
  const clearSelectedTypes = useVariantStore(
    (state) => state.clearSelectedTypes
  );
  const clearSelectedValues = useVariantStore(
    (state) => state.clearSelectedValues
  );
  const clearSelectedCombination = useVariantStore(
    (state) => state.clearSelectedCombination
  );

  // 🆕 Loading state tracker
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    stage: "preparing",
    progress: 0,
  });

  const {
    createProduct: createProductMutation,
    isPendingProducts: isCreating,
  } = useProducts.useCreate({
    onSuccess: () => {
      // Stage 4: Complete (100%)
      setLoadingState({ isLoading: true, stage: "complete", progress: 100 });

      setTimeout(() => {
        toast.success("Product created successfully! 🎉", {
          description: "Your product is now live and ready to sell!",
          duration: 3000,
        });
        navigate("/admin/products");
        clearSelectedTypes();
        clearSelectedValues();
        clearSelectedCombination();
        setLoadingState({ isLoading: false, stage: "preparing", progress: 0 });
      }, 1500); // Show success state for 1.5s
    },
    onError: (error) => {
      setLoadingState({ isLoading: false, stage: "preparing", progress: 0 });

      if (
        error.details?.sqlMessage?.includes("Duplicate entry") &&
        error.details?.sqlMessage?.includes("for key 'products.name'")
      ) {
        toast.error("Product name already exists!", {
          description: "Please choose a different product name and try again.",
          duration: 5000,
        });
      } else {
        toast.error("❌ Failed to create product", {
          description:
            error.message || "Something went wrong. Please try again.",
          duration: 5000,
        });
      }
    },
  });

  const {
    updateProduct: updateProductMutation,
    isPendingProducts: isUpdating,
  } = useProducts.useUpdate({
    onSuccess: () => {
      // Simple completion for updates (no images to upload)
      setLoadingState({ isLoading: true, stage: "complete", progress: 100 });

      setTimeout(() => {
        toast.success("Product updated successfully!", {
          description: "Your changes have been saved.",
          duration: 3000,
        });
        navigate("/admin/products");
        setLoadingState({ isLoading: false, stage: "preparing", progress: 0 });
      }, 1000);
    },
    onError: (error) => {
      setLoadingState({ isLoading: false, stage: "preparing", progress: 0 });
      toast.error("❌ Failed to update product", {
        description: error.message || "Something went wrong. Please try again.",
        duration: 5000,
      });
    },
  });

  const createProduct = async (data, validVariants) => {
    if (validVariants.length === 0) {
      toast.warning("📦 No valid product variants found", {
        description: "Please add at least one variant with quantity and price.",
        duration: 5000,
      });
      return;
    }

    // Stage 1: Preparing (0-20%)
    setLoadingState({ isLoading: true, stage: "preparing", progress: 10 });

    // Small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLoadingState({ isLoading: true, stage: "preparing", progress: 20 });

    const addTransformedData = {
      ...data,
      name: data?.name?.trim(),
      description: data?.description?.trim(),
      short_description: data?.short_description?.trim(),
      brand_id: parseInt(data?.brand_id),
      category_id: parseInt(data?.category_id),
      subcategory_id: parseInt(data?.subcategory_id),
      variants: validVariants?.map((variant) => ({
        vat: parseInt(variant?.vat),
        quantity: parseInt(variant?.quantity),
        price: parseFloat(variant?.price),
        compare_at_price:
          variant?.compare_at_price && parseFloat(variant.compare_at_price) > 0
            ? parseFloat(variant.compare_at_price)
            : undefined,
        cost_price: parseFloat(variant?.cost_price || 0),
        currency: variant?.currency || "GBP",
        types:
          variant?.types?.map((type) => ({
            type_id: parseInt(type?.typeId),
            value_id: parseInt(type?.selectedValue?.id),
          })) || [],
        images: variant?.images || [],
      })),
    };

    // Count total images for progress calculation
    const totalImages = validVariants.reduce(
      (sum, v) => sum + (v?.images?.length || 0),
      0
    );

    console.log("➕ Creating product:", addTransformedData);
    console.log(`📸 Total images to upload: ${totalImages}`);

    // Stage 2: Uploading (20-80%)
    if (totalImages > 0) {
      setLoadingState({ isLoading: true, stage: "uploading", progress: 30 });

      // Simulate progress for images (you can enhance this with actual upload progress)
      const uploadInterval = setInterval(() => {
        setLoadingState((prev) => {
          if (prev.progress >= 70) {
            clearInterval(uploadInterval);
            return prev;
          }
          return {
            ...prev,
            progress: Math.min(prev.progress + 5, 70),
          };
        });
      }, 500);
    }

    // Stage 3: Saving (80-90%)
    setTimeout(
      () => {
        setLoadingState({ isLoading: true, stage: "saving", progress: 80 });
      },
      totalImages > 0 ? 2000 : 500
    );

    setTimeout(
      () => {
        setLoadingState({ isLoading: true, stage: "saving", progress: 90 });
      },
      totalImages > 0 ? 3000 : 800
    );

    createProductMutation(addTransformedData);
  };

  const updateProduct = ({ id, data }) => {
    console.log("🔄 Editing product:", data);

    // Simple loading for updates
    setLoadingState({ isLoading: true, stage: "saving", progress: 50 });

    setTimeout(() => {
      setLoadingState({ isLoading: true, stage: "saving", progress: 80 });
    }, 300);

    updateProductMutation({ id, data });
  };

  return {
    createProduct,
    updateProduct,
    isPending: isCreating || isUpdating,
    loadingState, // 🆕 Export loading state
  };
};
