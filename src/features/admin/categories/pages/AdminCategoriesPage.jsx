import useCategories from "@/hooks/useCategories";
import { CategoriesDataTable } from "../components/CategoriesDataTable";
import CategoryStatsCards from "../components/CategoryStatsCards";
import AddCategoryDialog from "../components/AddCategoryDialog";
import AddEditSubcategoryDialog from "../components/AddEditSubcategoryDialog";
import { useDeleteSubcategoryManager } from "../hooks/useDeleteSubcategoryManager";
import { useSubcategoryStats } from "../hooks/useSubcategoryStats";
import { toast } from "sonner";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { useSubcategoryManager } from "../hooks/useSubcategoryManager";
import { DeleteSubcategoryDialog } from "../components/DeleteSubcategoryDialog";
import ControlsBar from "@/ui/ControlsBar";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import PaginationControlsBar from "../../ui/PaginationControlsBar";

export default function AdminCategoriesPage() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    allSubCategories,
    errorAllSubCategories,
    isLoadingAllSubCategories,
    refetchAllSubCategories,
  } = useCategories.useAllSubCategories({
    search: debouncedSearch,
  });

  const { subCategoryStats, isLoadingSubCategoryStats } =
    useCategories.useSubCategoryStatistics();

  const {
    subcategory,
    openSubcategoryDialog,
    handleEdit,
    handleAdd,
    setOpenSubcategoryDialog,
  } = useSubcategoryManager();

  const {
    deleteDialog,
    handleDelete,
    confirmDelete,
    cancelDelete,
    isPendingDeleteSubCategory,
  } = useDeleteSubcategoryManager(refetchAllSubCategories);

  const { flatSubCategories } = useSubcategoryStats(
    allSubCategories,
    isLoadingAllSubCategories
  );

  const handleView = (subcategory) => {
    toast.info(`👁️ View products in ${subcategory.name}`);
  };

  if (isLoadingAllSubCategories) {
    return <LoadingState type="dashboard" />;
  }

  if (errorAllSubCategories)
    return (
      <ErrorMessage
        message={errorAllSubCategories?.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchAllSubCategories()}
      />
    );

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        key={subcategory?.id || "create"}
        openSubcategoryDialog={openSubcategoryDialog}
        setOpenSubcategoryDialog={setOpenSubcategoryDialog}
        subcategory={subcategory}
        onAdd={handleAdd}
        mode={subcategory ? "edit" : "create"}
        refetchAllSubCategories={refetchAllSubCategories}
      />
      <CategoryStatsCards
        stats={subCategoryStats}
        isLoadingStats={isLoadingSubCategoryStats}
      />

      <ControlsBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchName={"subcategory or parent category"}
        isShowFilter={false}
        searchWidth="w-100"
      />

      <CategoriesDataTable
        data={flatSubCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <PaginationControlsBar
        dataName={"subcategories"}
        isLoading={isLoadingAllSubCategories}
        pageCount={allSubCategories?.pagination?.totalPages}
        totalCount={allSubCategories?.pagination?.total}
      />
      <DeleteSubcategoryDialog
        deleteDialog={deleteDialog}
        onConfirmDelete={confirmDelete}
        onCancelDelete={cancelDelete}
        isPending={isPendingDeleteSubCategory}
      />
    </div>
  );
}

function PageHeader({
  subcategory,
  openSubcategoryDialog,
  setOpenSubcategoryDialog,
  onAdd,
  refetchAllSubCategories,
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Manage your product categories and subcategories
        </p>
      </div>
      <div className="flex gap-2">
        <AddEditSubcategoryDialog
          key={subcategory?.id || "create"}
          openSubcategoryDialog={openSubcategoryDialog}
          setOpenSubcategoryDialog={setOpenSubcategoryDialog}
          subcategory={subcategory}
          onAdd={onAdd}
          mode={subcategory ? "edit" : "create"}
          refetchAllSubCategories={refetchAllSubCategories}
        />
        <AddCategoryDialog />
      </div>
    </div>
  );
}
