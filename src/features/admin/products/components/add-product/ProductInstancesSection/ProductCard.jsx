import { Card, CardContent } from "@/components/ui/card";
import ProductHeader from "./ProductHeader";
import ProductDetails from "./ProductDetails";
import NoProducts from "./NoProducts";
import { Button } from "@/components/ui/button";
import useFilteredVariants from "../../../hooks/useFilteredVariants";
import useProductStore from "@/features/admin/store/productStore";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Plus, Trash2, Upload, X } from "lucide-react";
import useProducts from "@/hooks/useProducts";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import useBundles from "@/hooks/useBundles";
import { useDeleteManager } from "@/hooks/useDeleteManager";
import { DeleteConfirmationDialog } from "@/features/admin/ui/DeleteConfirmationDialog";
import { useParams } from "react-router";
import { toast } from "sonner";

const formSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  vat: z.number().min(0).max(100, "VAT must be between 0 and 100"),
  subtotal: z.number().min(0, "Subtotal must be a positive number"),
  is_active: z.boolean().default(true),
});

function ProductCard({ variantsList, onEditProduct, productName }) {
  const { filteredVariants, isEmpty } = useFilteredVariants(variantsList);

  const mode = useProductStore((state) => state.mode);
  const isAddMode = mode === "add";
  const isViewMode = mode === "view";
  const productId = useProductStore((state) => state.productId);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variant_id: "",
      quantity: 1,
      vat: 14,
      subtotal: 0,
      is_active: true,
    },
  });

  const { deleteBundle, isPendingDelete } = useBundles.useDelete(productId);

  const {
    closeDeleteDialog,
    confirmDelete,
    deleteDialog,
    handleDelete,
    isPending,
  } = useDeleteManager({
    deleteFunction: deleteBundle,
    isPending: isPendingDelete,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);

  function handleCloseModal() {
    setSelectedVariant(null);
    setIsModalOpen(false);
    form.reset({
      variant_id: "",
      quantity: 1,
      vat: 14,
      subtotal: 0,
      is_active: true,
    });
  }

  function handleCreateBundle(variant) {
    setIsEditMode(false);
    setSelectedVariant(variant);
    setIsModalOpen(true);
  }

  function handleEditBundle(bundle) {
    setSelectedBundle(bundle);
    setIsEditMode(true);
    form.reset({
      quantity: Number(bundle?.quantity),
      subtotal: Number(bundle?.subtotal),
      vat: Number(bundle?.vat),
      is_active: Boolean(bundle?.is_active),
    });
    setIsModalOpen(true);
  }

  console.log(filteredVariants);

  return (
    <CardContent className="space-y-4">
      {filteredVariants.map((product, index) => (
        <Card
          key={product.id || index}
          className={
            product?.bundles?.length !== 0 &&
            !isAddMode &&
            "border-green-500 shadow-lg shadow-green-500/20"
          }
        >
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <ProductHeader product={product} productName={productName} />
                {!isAddMode && (
                  <div className="space-x-1">
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct(product);
                      }}
                      size={"sm"}
                      variant={"outline"}
                    >
                      Edit
                    </Button>
                    {isViewMode && (
                      <Button
                        type="button"
                        size={"sm"}
                        onClick={() => handleCreateBundle(product)}
                      >
                        + Add Bundle
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <ProductDetails
              product={product}
              onDeleteBundle={handleDelete}
              onEditBundle={handleEditBundle}
            />

            {/* 🆕 Image Management Component */}
            <ProductImages images={product.images} variantId={product.id} />
          </CardContent>
        </Card>
      ))}

      {isEmpty && <NoProducts />}

      <AddBundleModal
        isModalOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedVariant={selectedVariant}
        form={form}
        setIsModalOpen={setIsModalOpen}
        isEditMode={isEditMode}
        selectedBundle={selectedBundle}
      />

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={closeDeleteDialog}
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
        isPending={isPending}
        entityName="bundle"
        entityLabel={deleteDialog.bundle?.name || ""}
        title="Delete Bundle"
      />
    </CardContent>
  );
}

export default ProductCard;

// 🆕 Fixed Image Management Component with working delete
function ProductImages({ images = [], variantId }) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageToDelete, setImageToDelete] = useState(null);

  const mode = useProductStore((state) => state.mode);
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const canManageImages = isViewMode || isEditMode;

  const imageCount = images?.length || 0;

  // 🎣 Hooks for image operations
  const { uploadImages, isPendingImages } = useProducts.useUploadImages({
    onSuccess: () => {
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
      setPreviewImages([]);
    },
  });

  const { deleteImage, isPendingDelete } = useProducts.useDeleteImage({
    onSuccess: () => {
      setImageToDelete(null);
      toast.success("Image deleted successfully!");
    },
  });

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles(files);

    // Create preview URLs
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setPreviewImages(previews);
  };

  // Upload images to server
  const handleUploadImages = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    uploadImages({
      variantId,
      files: selectedFiles,
    });
  };

  // 🔧 Fixed delete handler
  const handleDeleteClick = (imageId) => {
    console.log("🗑️ Delete clicked for image:", imageId); // Debug log
    setImageToDelete(imageId);
  };

  const confirmDeleteImage = () => {
    console.log("✅ Confirming delete for image:", imageToDelete); // Debug log
    if (imageToDelete) {
      deleteImage(imageToDelete);
    }
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previewImages]);

  if (imageCount === 0 && !canManageImages) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border border-dashed mt-4">
        <ImageIcon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">No images uploaded</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">
              Product Images
            </span>
            <Badge variant="secondary" className="text-xs">
              {imageCount}
            </Badge>
          </div>
          <div className="flex gap-2">
            {canManageImages && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setIsUploadModalOpen(true);
                }}
                className="text-xs h-7 gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Images
              </Button>
            )}
          </div>
        </div>

        {imageCount === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-gray-50">
            <ImageIcon className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 mb-3">No images yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setIsUploadModalOpen(true);
              }}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Images
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {images?.map((image, idx) => {
              return (
                <div
                  key={image.id || idx}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                    image.is_primary
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  <div className="w-full aspect-square bg-gray-100">
                    <img
                      src={image.image_url || "/placeholder.svg"}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Primary Badge */}
                  {Boolean(image.is_primary) && (
                    <div className="absolute top-1 left-1 z-10">
                      <Badge className="text-[8px] px-1 py-0 h-4 bg-blue-500">
                        Primary
                      </Badge>
                    </div>
                  )}

                  {/* 🔧 Fixed Delete Button */}
                  {canManageImages && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("🖱️ Click detected! Image ID:", image.id); // Debug
                        handleDeleteClick(image.id);
                      }}
                      className="absolute inset-0 bg-black/0 hover:bg-black/60 transition-all duration-200 flex items-center justify-center group"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg">
                        <Trash2 className="w-4 h-4" />
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal - unchanged */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Product Images</DialogTitle>
            <DialogDescription>
              Select multiple images to add to this product variant
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              onClick={() => document.getElementById("image-upload").click()}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to upload images
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB each
              </p>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {previewImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Selected Images ({previewImages.length})
                </p>
                <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
                  {previewImages.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-square rounded-lg overflow-hidden border"
                    >
                      <img
                        src={preview.url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPreviewImages((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                          setSelectedFiles((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFiles([]);
                  setPreviewImages([]);
                }}
                disabled={isPendingImages}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUploadImages}
                disabled={isPendingImages || selectedFiles.length === 0}
                className="gap-2"
              >
                {isPendingImages ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload {selectedFiles.length} Image
                    {selectedFiles.length !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!imageToDelete}
        onOpenChange={() => setImageToDelete(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageToDelete(null)}
              disabled={isPendingDelete}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteImage}
              disabled={isPendingDelete}
              className="gap-2"
            >
              {isPendingDelete ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// AddBundleModal component (unchanged)
function AddBundleModal({
  isModalOpen,
  onClose,
  selectedVariant,
  form,
  isEditMode,
  selectedBundle,
}) {
  const { id } = useParams();
  const { createBundle, isPendingBundles: isCreatingBundles } =
    useBundles.useCreate(id);
  const { updateBundle, isPendingBundles: isUpdatingBundles } =
    useBundles.useUpdate(id);

  function onSubmit(data) {
    if (isEditMode) {
      updateBundle(
        { id: selectedBundle?.id, data },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      const payload = {
        ...data,
        variant_id: selectedVariant?.id,
      };
      createBundle(payload, {
        onSuccess: () => onClose(),
      });
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Bundle" : "Add New Bundle"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update bundle pricing and details"
              : "Create a new product bundle with variant and pricing details"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subtotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtotal (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Bundle will be {field.value ? "active" : "inactive"} after
                      {isEditMode ? " update" : " creation"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingBundles || isUpdatingBundles}
              >
                {isEditMode ? "Update Bundle" : "Create Bundle"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
