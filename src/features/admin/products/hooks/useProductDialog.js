import { useState } from "react";

export function useProductDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  return {
    isDialogOpen,
    selectedProduct,
    handleEditProduct,
    handleDialogClose,
  };
}
