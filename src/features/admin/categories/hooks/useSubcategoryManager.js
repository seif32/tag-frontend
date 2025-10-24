import { useState } from "react";

export const useSubcategoryManager = () => {
  const [subcategory, setSubcategory] = useState(null);
  const [openSubcategoryDialog, setOpenSubcategoryDialog] = useState(false);

  const handleEdit = (subcategory) => {
    console.log("edit");
    setSubcategory(subcategory);
    setOpenSubcategoryDialog(true);
  };

  const handleAdd = () => {
    console.log("Add");
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
