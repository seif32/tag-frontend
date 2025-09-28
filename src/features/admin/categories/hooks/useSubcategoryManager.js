import { useState } from "react";

export const useSubcategoryManager = () => {
  const [subcategory, setSubcategory] = useState(null);
  const [openSubcategoryDialog, setOpenSubcategoryDialog] = useState(false);

  const handleEdit = (subcategory) => {
    setSubcategory(subcategory);
    setOpenSubcategoryDialog(true);
  };

  const handleAdd = () => {
    setSubcategory(null);
    setOpenSubcategoryDialog(true);
  };

  return {
    subcategory,
    openSubcategoryDialog,
    setOpenSubcategoryDialog,
    handleEdit,
    handleAdd,
  };
};
