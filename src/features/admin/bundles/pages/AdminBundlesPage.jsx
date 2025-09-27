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

function AdminBundlesPage() {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="space-y-4">
      <BundlesStatsContainer />
      <BundlesControlsBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <BundlesDataTable />
    </div>
  );
}

export default AdminBundlesPage;

function BundlesStatsContainer() {
  const dummyBundleStats = {
    total_bundles: 125,
    active_bundles: 98,
    highest_value_bundle: 1299.99,
    lowest_value_bundle: 99.99,
  };

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
      {bundlesStats(dummyBundleStats).map((stat, index) => (
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

function BundlesDataTable() {
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>VAT</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium w-[150px]">
              <div className="flex flex-col gap-1">
                <p>Iphone 11</p>
                <div className="flex gap-1 w-full flex-wrap">
                  <span className="px-2  bg-black text-white rounded-sm text-xs">
                    Black
                  </span>
                  <span className="px-2  bg-black text-white rounded-sm text-xs">
                    128GB
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>5</TableCell>
            <TableCell>14%</TableCell>
            <TableCell>{formatCurrency(56)}</TableCell>
            <TableCell>{formatCurrency(45)}</TableCell>
            <TableCell>
              <span className="px-2.5 bg-green-100 text-green-500 rounded-sm py-1">
                active
              </span>
            </TableCell>
            <TableCell className="flex justify-end">
              <Eye className="size-5 text-accent" />
            </TableCell>
          </TableRow>
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
