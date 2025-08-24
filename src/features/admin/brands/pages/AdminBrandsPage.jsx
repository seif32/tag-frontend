import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BrandsDataTable } from "../components/BrandsDataTable";
import useBrands from "@/hooks/useBrands";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { useState } from "react";
import AdminAddBrandDialog from "../components/AdminAddBrandDialog";

function AdminBrandsPage() {
  const { brands, errorBrands, isErrorBrands, isLoadingBrands, refetchBrands } =
    useBrands.useAll();

  const { deleteBrand, isPendingBrands } = useBrands.useDelete();

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleEdit(brand) {
    setSelectedBrand(brand);
    setDialogOpen(true);
  }

  function handleDelete(brand) {
    deleteBrand(brand.id);
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Brands Management
          </h1>
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

      <Separator />

      {isLoadingBrands ? (
        <LoadingState type="table" />
      ) : isErrorBrands ? (
        <ErrorMessage
          message={errorBrands.message || "Failed to load data"}
          dismissible={true}
          onDismiss={() => refetchBrands()}
        />
      ) : (
        <BrandsDataTable
          data={brands}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default AdminBrandsPage;
