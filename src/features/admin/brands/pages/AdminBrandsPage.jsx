import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandsDataTable } from "../components/BrandsDataTable";
import useBrands from "@/hooks/useBrands";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { useState } from "react";
import AdminAddBrandDialog from "../components/AdminAddBrandDialog";
import { DeleteConfirmationDialog } from "../../ui/DeleteConfirmationDialog";
import { useDeleteManager } from "@/hooks/useDeleteManager";
import PaginationControlsBar from "../../ui/PaginationControlsBar";

function AdminBrandsPage() {
  const { brands, errorBrands, isErrorBrands, isLoadingBrands, refetchBrands } =
    useBrands.useAll();

  const { deleteBrand, isPendingBrands } = useBrands.useDelete();
  const {
    closeDeleteDialog,
    confirmDelete,
    deleteDialog,
    handleDelete,
    isPending,
  } = useDeleteManager({
    deleteFunction: deleteBrand,
    isPending: isPendingBrands,
  });

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleEdit(brand) {
    setSelectedBrand(brand);
    setDialogOpen(true);
  }

  if (isLoadingBrands) return <LoadingState type="dashboard" />;

  if (isErrorBrands)
    return (
      <ErrorMessage
        message={errorBrands?.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchBrands()}
      />
    );

  console.log("AdminBrandsPage", brands);

  return (
    <div className="p-6 space-y-6">
      <PageTitle
        dialogOpen={dialogOpen}
        isLoadingBrands={isLoadingBrands}
        refetchBrands={refetchBrands}
        selectedBrand={selectedBrand}
        setDialogOpen={setDialogOpen}
        setSelectedBrand={setSelectedBrand}
      />

      <BrandsDataTable
        data={brands.data}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <PaginationControlsBar
        dataName={"brands"}
        isLoading={isLoadingBrands}
        pageCount={brands?.pagination?.totalPages}
        totalCount={brands?.pagination?.total}
      />

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={closeDeleteDialog}
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
        isPending={isPending}
        entityName="product"
        entityLabel={deleteDialog.product?.name || ""}
        title="Delete Product"
      />
    </div>
  );
}

export default AdminBrandsPage;

function PageTitle({
  refetchBrands,
  isLoadingBrands,
  dialogOpen,
  setDialogOpen,
  selectedBrand,
  setSelectedBrand,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Brands Management</h1>
        <p className="text-muted-foreground">
          Manage your product brands, descriptions, and brand information
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={refetchBrands}
          disabled={isLoadingBrands}
          className="gap-2 text-accent"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoadingBrands ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>

        <AdminAddBrandDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          mode={selectedBrand ? "edit" : "add"}
        />
      </div>
    </div>
  );
}
