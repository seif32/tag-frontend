import { DevTool } from "@hookform/devtools";
import ProductLayout from "../components/add-product/ProductLayout";
import EditProductDialog from "../components/add-product/ProductInstancesSection/EditProductDialog";
import LoadingState from "@/ui/LoadingState";
import { useProductPageManager } from "../hooks/useProductPageManager";
import { useProductDialog } from "../hooks/useProductDialog";
import ProductFormProvider from "../components/add-product/ProductFormProvider";

export default function AdminProductPage({ mode }) {
  const {
    form,
    product,
    isLoadingProduct,
    isPending,
    displayVariants,
    variantsList,
    append,
    onSubmit,
    isAddMode,
  } = useProductPageManager(mode);

  const {
    isDialogOpen,
    selectedProduct,
    handleEditProduct,
    handleDialogClose,
  } = useProductDialog();

  if (isLoadingProduct && !isAddMode) {
    return <LoadingState />;
  }

  return (
    <>
      <ProductFormProvider form={form} onSubmit={onSubmit}>
        <ProductLayout
          product={product}
          displayVariants={displayVariants}
          variantsList={variantsList}
          append={append}
          onEditProduct={handleEditProduct}
          isPending={isPending}
          mode={mode}
        />
        <DevTool control={form.control} />
      </ProductFormProvider>

      <EditProductDialog
        isDialogOpen={isDialogOpen}
        selectedProduct={selectedProduct}
        onClose={handleDialogClose}
      />
    </>
  );
}
