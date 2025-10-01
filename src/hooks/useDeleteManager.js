import { useState } from "react";

export function useDeleteManager({ deleteFunction, isPending }) {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null,
  });

  function handleDelete(item) {
    openDeleteDialog(item);
  }

  function openDeleteDialog(item) {
    setDeleteDialog({ open: true, item });
  }

  function closeDeleteDialog() {
    setDeleteDialog({ open: false, item: null });
  }

  function confirmDelete() {
    if (!deleteDialog.item) return;

    deleteFunction(deleteDialog.item.id, {
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
    isPending,
  };
}
