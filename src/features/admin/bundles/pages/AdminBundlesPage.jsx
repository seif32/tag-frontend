import { SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ControlsBar from "@/ui/ControlsBar";
import { useState } from "react";
import StatsCard from "../../ui/StatsCard";
import {
  Package,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Eye,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import useBundles from "@/hooks/useBundles";
import ErrorMessage from "@/ui/ErrorMessage";
import LoadingState from "@/ui/LoadingState";
import { Button } from "@/components/ui/button";

function AdminBundlesPage() {
  const [searchInput, setSearchInput] = useState("");

  const { bundles, isLoadingBundles, refetchBundles, isErrorBundles } =
    useBundles.useAll();

  return (
    <div className="space-y-4 ">
      <Title />
      <BundlesStatsContainer />
      <BundlesControlsBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <BundlesDataTable
        bundles={bundles}
        isLoadingBundles={isLoadingBundles}
        isErrorBundles={isErrorBundles}
        refetchBundles={refetchBundles}
      />
    </div>
  );
}

export default AdminBundlesPage;

function Title() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold">Bundles management</h1>
        <p className="text-muted-foreground">
          Manage all your bundles from here!
        </p>
      </div>
      <Button>+ Add Bundle</Button>
    </div>
  );
}

function BundlesStatsContainer() {
  const {
    bundleStats,
    isLoadingBundleStats,
    refetchBundleStats,
    isErrorBundleStats,
  } = useBundles.useStatistics();

  if (isLoadingBundleStats) return <LoadingState type="stats" />;

  if (isErrorBundleStats) {
    return (
      <ErrorMessage
        message={"Failed to load data"}
        dismissible={true}
        onDismiss={refetchBundleStats}
      />
    );
  }

  function bundlesStats(stats) {
    return [
      {
        title: "Total Bundles",
        icon: Package,
        value: stats.total_bundles,
        subtitle: "All bundles created",
      },
      {
        title: "Active Bundles",
        icon: CheckCircle,
        value: stats.active_bundles,
        subtitle: `${(
          (stats?.active_bundles / stats?.total_bundles) *
          100
        ).toFixed(1)}% are active`,
      },
      {
        title: "Highest Value",
        icon: TrendingUp,
        value: `$${stats.highest_value_bundle}`,
        subtitle: "Most expensive bundle",
      },
      {
        title: "Lowest Value",
        icon: TrendingDown,
        value: `$${stats.lowest_value_bundle}`,
        subtitle: "Most affordable bundle",
      },
    ];
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {bundlesStats(bundleStats).map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          icon={stat.icon}
          value={stat.value}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  );
}

function BundlesDataTable({
  isLoadingBundles,
  isErrorBundles,
  refetchBundles,
  bundles,
}) {
  if (isLoadingBundles) return <LoadingState type="table" rows={9} />;

  if (isErrorBundles) {
    return (
      <ErrorMessage
        message={"Failed to load data"}
        dismissible={true}
        onDismiss={refetchBundles}
      />
    );
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>VAT</TableHead>
            <TableHead className={"font-semibold"}>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bundles?.data?.map((bundle) => (
            <TableRow key={bundle?.id}>
              <TableCell className="font-medium w-[150px]">
                <div className="flex flex-col gap-1">
                  <p>{bundle?.product?.name}</p>
                  <div className="flex gap-1 w-full flex-wrap">
                    {bundle?.product?.variants[0]?.types?.map((variant) => (
                      <span
                        key={variant?.type_id}
                        className="px-2  bg-black text-white rounded-sm text-xs"
                      >
                        {variant?.value?.name}
                      </span>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>{bundle?.quantity}</TableCell>
              <TableCell>{formatCurrency(bundle?.subtotal)}</TableCell>
              <TableCell>{bundle?.vat}%</TableCell>
              <TableCell className={"font-semibold"}>
                {formatCurrency(bundle?.total)}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2.5  rounded-sm py-1 ${
                    bundle?.is_active === 1
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {bundle?.is_active === 1 ? "active" : "inactive"}
                </span>
              </TableCell>
              <TableCell className="flex justify-end ">
                <Eye className="size-5 text-accent cursor-pointer" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function BundlesControlsBar({ searchInput, setSearchInput }) {
  return (
    <ControlsBar
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      searchName={"bundles"}
    >
      <SelectContent>
        <SelectItem value="all">All Coupons</SelectItem>
        <Separator className="my-2" />
        <SelectItem value="active">Active Only</SelectItem>
        <SelectItem value="expired">Expired</SelectItem>
      </SelectContent>
    </ControlsBar>
  );
}
