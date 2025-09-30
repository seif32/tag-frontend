import useProducts from "@/hooks/useProducts";
import { useState } from "react";

export function useDeleteProductManager() {
  const { deleteProduct, isPendingProducts } = useProducts.useDelete();

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    product: null,
  });

  function handleDelete(product) {
    openDeleteDialog(product);
  }

  function openDeleteDialog(product) {
    setDeleteDialog({ open: true, product });
  }

  function closeDeleteDialog() {
    setDeleteDialog({ open: false, product: null });
  }

  function confirmDelete() {
    if (!deleteDialog.product) return;

    deleteProduct(deleteDialog.product.id, {
      onSuccess: () => {
        closeDeleteDialog();
      },
    });
  }
  return {
    handleDelete,
    deleteDialog,
    closeDeleteDialog,
    confirmDelete,
    isPendingProducts,
  };
}
