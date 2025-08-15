import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Tag, TrendingUp, Archive } from "lucide-react";
import { toast } from "sonner";
import useCategories from "@/hooks/useCategories";
import { CategoriesDataTable } from "../components/CategoriesDataTable";
import CategoryStatsCards from "../components/CategoryStatsCards";

export default function AdminCategoriesPage() {
  const { allSubCategories, errorAllSubCategories, isLoadingAllSubCategories } =
    useCategories.useAllSubCategories();

  const { isLoadingStats, stats } = useCategories.useStats();

  const { isPendingDeleteSubCategory, deleteSubCategory } =
    useCategories.useDeleteSubCategory({
      onSuccess: () => {
        toast.success("🗑️ Subcategory deleted successfully!");
      },
    });

  const flatSubCategories = React.useMemo(() => {
    if (!allSubCategories || isLoadingAllSubCategories) return [];

    return allSubCategories;
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

  // Action handlers
  const handleEdit = (subcategory) => {
    toast.info(`🖊️ Edit ${subcategory.name} (ID: ${subcategory.id})`);
    // Navigate to edit form or open modal
  };

  const handleDelete = (subcategory) => {
    if (
      window.confirm(`Are you sure you want to delete "${subcategory.name}"?`)
    ) {
      deleteSubCategory(subcategory.id);
    }
  };

  const handleView = (subcategory) => {
    toast.info(`👁️ View products in ${subcategory.name}`);
    // Navigate to products filtered by subcategory
  };

  if (isLoadingAllSubCategories) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
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
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg">
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
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories and subcategories
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Tag className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Subcategory
          </Button>
        </div>
      </div>

      <CategoryStatsCards calculatedStats={calculatedStats} stats={stats} />

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
    </div>
  );
}
