import { useState } from "react";
import useCategories from "@/hooks/useCategories";

export const useDeleteSubcategoryManager = (refetchAllSubCategories) => {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    subcategory: null,
  });

  const { isPendingDeleteSubCategory, deleteSubCategory } =
    useCategories.useDeleteSubCategory({
      onSuccess: () => {
        refetchAllSubCategories();
        setDeleteDialog({ open: false, subcategory: null });
      },
    });

  const handleDelete = (subcategory) => {
    setDeleteDialog({
      open: true,
      subcategory: subcategory,
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.subcategory) {
      deleteSubCategory(deleteDialog.subcategory.id);
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, subcategory: null });
  };

  return {
    deleteDialog,
    handleDelete,
    confirmDelete,
    cancelDelete,
    isPendingDeleteSubCategory,
  };
};
