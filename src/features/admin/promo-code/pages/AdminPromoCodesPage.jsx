import { useState } from "react";
import PromoCodesTable from "../components/PromoCodesDataTable";
import PromoCodeModal from "../components/PromoCodeModal";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import usePromoCode from "@/hooks/usePromoCode";
import useDebounce from "@/hooks/useDebounce";
import ControlsBar from "@/ui/ControlsBar";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import StatsCard from "../../ui/StatsCard";
import { CheckCircle, Clock, Tag, TrendingUp } from "lucide-react";
import PaginationControlsBar from "../../ui/PaginationControlsBar";

export default function AdminPromoCodesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'view', 'edit'

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    promoCodes,
    isLoadingPromoCodes,
    isErrorPromoCodes,
    refetchPromoCodes,
  } = usePromoCode.useAll({ search: debouncedSearch });

  const {
    statistics,
    isErrorStatistics,
    isLoadingStatistics,
    refetchStatistics,
  } = usePromoCode.useStatistics();

  if (isLoadingPromoCodes || isLoadingStatistics)
    return <LoadingState type="dashboard" />;

  if (isErrorPromoCodes || isErrorStatistics) {
    return (
      <ErrorMessage
        message={"Failed to load data"}
        dismissible={true}
        onDismiss={refetchPromoCodes && refetchStatistics}
      />
    );
  }

  function handleCreate() {
    setSelectedPromoCode(null);
    setModalMode("create");
    setIsModalOpen(true);
  }

  function handleView(promoCode) {
    setSelectedPromoCode(promoCode);
    setModalMode("view");
    setIsModalOpen(true);
  }

  function handleEdit(promoCode) {
    setSelectedPromoCode(promoCode);
    setModalMode("edit");
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedPromoCode(null);
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Promo Codes</h1>
        <Button onClick={handleCreate}>+ Add New Code</Button>
      </div>

      <PromoCodeStatsContainer promoStats={statistics} />

      <PromoCodeControlsBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />

      <PromoCodesTable
        promoCodes={promoCodes?.data}
        onView={handleView}
        onEdit={handleEdit}
      />

      <PromoCodeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        promoCode={selectedPromoCode}
        onSuccess={() => {
          handleCloseModal();
        }}
      />

      <PaginationControlsBar
        isLoading={isLoadingPromoCodes}
        dataName={"promo codes"}
        pageCount={promoCodes?.totalPages}
        totalCount={promoCodes?.total}
      />
    </div>
  );
}

function PromoCodeStatsContainer({ promoStats }) {
  function promoCodeStats(stats) {
    return [
      {
        title: "Total Codes",
        icon: Tag,
        value: stats.total_codes,
        subtitle: "All promo codes created",
      },
      {
        title: "Active Codes",
        icon: CheckCircle,
        value: stats.active_codes,
        subtitle: "Currently usable codes",
      },
      {
        title: "Total Usage",
        icon: TrendingUp,
        value: stats.total_usage,
        subtitle: `${(
          (stats?.total_usage / stats?.total_capacity) *
          100
        ).toFixed(1)}% capacity used`,
      },
      {
        title: "Expiring Soon",
        icon: Clock,
        value: stats.expiring_soon,
        subtitle: "Within 3 days",
      },
    ];
  }
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {promoCodeStats(promoStats).map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          icon={stat.icon}
          value={stat.value}
          subtitle={stat.subtitle}
        />
      ))}{" "}
    </div>
  );
}

function PromoCodeControlsBar({ searchInput, setSearchInput }) {
  return (
    <ControlsBar
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      searchName={"code"}
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
