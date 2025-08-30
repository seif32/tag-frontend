import {
  RefreshCw,
  Award,
  TrendingUp,
  Building2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BrandsDataTable } from "../components/BrandsDataTable";
import useBrands from "@/hooks/useBrands";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { useState, useMemo } from "react";
import AdminAddBrandDialog from "../components/AdminAddBrandDialog";
import StatsCard from "../../ui/StatsCard";

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

  // ✅ Calculate brand statistics
  const brandStats = useMemo(() => {
    if (!brands || brands.length === 0) {
      return {
        total: 0,
        withProducts: 0,
        recentlyAdded: 0,
        activeToday: 0,
      };
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recentlyAdded = brands.filter(
      (brand) => new Date(brand.created_at) >= weekAgo
    ).length;

    const activeToday = brands.filter((brand) => {
      const updatedDate = new Date(brand.updated_at);
      updatedDate.setHours(0, 0, 0, 0);
      return updatedDate.getTime() === today.getTime();
    }).length;

    return {
      total: brands.length,
      recentlyAdded,
      activeToday,
    };
  }, [brands]);

  if (isLoadingBrands) return <LoadingState type="table" />;

  if (isErrorBrands)
    return (
      <ErrorMessage
        message={errorBrands.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchBrands()}
      />
    );

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

      {/* ✅ Brand Statistics using StatsCard */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Brands"
          icon={Building2}
          value={brandStats.total}
          subtitle="All registered brands"
        />

        <StatsCard
          title="This Week"
          icon={Calendar}
          value={brandStats.recentlyAdded}
          subtitle="Recently added"
        />

        <StatsCard
          title="Active Today"
          icon={TrendingUp}
          value={brandStats.activeToday}
          subtitle="Updated today"
        />
      </div>

      <BrandsDataTable
        data={brands}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default AdminBrandsPage;
