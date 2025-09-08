import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useCategories from "@/hooks/useCategories";
import { CategoriesDataTable } from "../components/CategoriesDataTable";
import CategoryStatsCards from "../components/CategoryStatsCards";
import AddCategoryDialog from "../components/AddCategoryDialog";
import AddEditSubcategoryDialog from "../components/AddEditSubcategoryDialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminCategoriesPage() {
  const [subcategory, setSubcategory] = useState(null);
  const [openSubcategoryDialog, setOpenSubcategoryDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    allSubCategories,
    errorAllSubCategories,
    isLoadingAllSubCategories,
    refetchAllSubCategories,
  } = useCategories.useAllSubCategories();

  const { isLoadingStats, stats } = useCategories.useStats();

  const flatSubCategories = React.useMemo(() => {
    if (!allSubCategories || isLoadingAllSubCategories) return [];

    return allSubCategories.data;
  }, [allSubCategories, isLoadingAllSubCategories]);

  const calculatedStats = React.useMemo(() => {
    if (!allSubCategories) return {};

    const totalCategories = allSubCategories.length;
    const totalSubcategories = flatSubCategories.length;
    const activeSubcategories = flatSubCategories.filter(
      (sub) => sub.active === 1
    ).length;
    const totalProducts = flatSubCategories.reduce(
      (sum, sub) => sum + (sub.product_count || 0),
      0
    );

    return {
      totalCategories,
      totalSubcategories,
      activeSubcategories,
      totalProducts,
    };
  }, [allSubCategories, flatSubCategories]);

  function handleEdit(subcategory) {
    setSubcategory(subcategory);
    setOpenSubcategoryDialog(true);
  }

  function handleAdd() {
    setSubcategory(null);
    setOpenSubcategoryDialog(true);
  }

  function handleDelete(subcategory) {
    deleteSubCategory(subcategory.id);
  }

  const handleView = (subcategory) => {
    toast.info(`👁️ View products in ${subcategory.name}`);
  };

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    subcategory: null,
  });

  const { isPendingDeleteSubCategory, deleteSubCategory } =
    useCategories.useDeleteSubCategory({
      onSuccess: () => {
        refetchAllSubCategories();
        setDeleteDialog({ open: false, subcategory: null }); // ✅ Close dialog
      },
    });

  function handleEdit(subcategory) {
    setSubcategory(subcategory);
    setOpenSubcategoryDialog(true);
  }

  function handleAdd() {
    setSubcategory(null);
    setOpenSubcategoryDialog(true);
  }

  function handleDelete(subcategory) {
    setDeleteDialog({
      open: true,
      subcategory: subcategory,
    });
  }

  function confirmDelete() {
    if (deleteDialog.subcategory) {
      deleteSubCategory(deleteDialog.subcategory.id);
    }
  }

  // ✅ Cancel delete
  function cancelDelete() {
    setDeleteDialog({ open: false, subcategory: null });
  }

  if (isLoadingAllSubCategories) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-2 text-center">
          <div className="w-8 h-8 mx-auto border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="text-sm text-muted-foreground">
            Loading allSubCategories...
          </p>
        </div>
      </div>
    );
  }

  if (errorAllSubCategories) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="text-lg text-red-500">
            ⚠️ Error loading allSubCategories
          </div>
          <p className="text-sm text-muted-foreground">
            {errorAllSubCategories.message}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
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
            onAdd={handleAdd}
            mode={subcategory ? "edit" : "create"}
            refetchAllSubCategories={refetchAllSubCategories}
          />
          <AddCategoryDialog />
        </div>
      </div>

      <CategoryStatsCards
        calculatedStats={calculatedStats}
        stats={stats}
        isLoadingStats={isLoadingStats}
      />

      {/* Main Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subcategories Overview</CardTitle>
          <CardDescription>
            Manage all your product subcategories in one place. Search, sort,
            and take actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoriesDataTable
            data={flatSubCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </CardContent>
      </Card>
      <Dialog open={deleteDialog.open} onOpenChange={cancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete Subcategory
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{deleteDialog.subcategory?.name}"
              </span>
              ? This action cannot be undone and will permanently remove this
              subcategory and all its associated data.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col-reverse gap-2 mt-6 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={isPendingDeleteSubCategory}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isPendingDeleteSubCategory}
            >
              {isPendingDeleteSubCategory ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 rounded-full animate-spin border-background border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Subcategory
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
