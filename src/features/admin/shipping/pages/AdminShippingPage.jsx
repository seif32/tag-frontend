import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Eye,
  Filter,
  Gift,
  MapPin,
  Search,
  SquarePen,
  Truck,
} from "lucide-react";
import StatsCard from "../../ui/StatsCard";
import useCities from "@/hooks/useCities";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { useSearchParams } from "react-router";
import { useUpdateUrlParams } from "@/hooks/useUpdateUrlParams";
import { formatDateDMY } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatCurrency";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useDebounce from "@/hooks/useDebounce";
import PaginationControlsBar from "../../ui/PaginationControlsBar";

const citySchema = z.object({
  name: z
    .string()
    .min(2, "City name must be at least 2 characters")
    .max(100, "City name must be less than 100 characters")
    .trim(),
  shipping_fees: z
    .number()
    .min(0, "Shipping fee cannot be negative")
    .max(1000, "Shipping fee seems too high"),
  has_shipping: z.boolean(),
  free_shipping_threshold: z
    .number()
    .min(0, "Free shipping threshold cannot be negative")
    .max(100000, "Threshold seems too high"),
  always_charge_shipping: z.boolean(),
});

function AdminShippingPage() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const [cityModal, setCityModal] = useState({
    open: false,
    mode: "add",
    city: null,
  });

  const form = useForm({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: "",
      shipping_fees: 45,
      has_shipping: true,
      free_shipping_threshold: 2000,
      always_charge_shipping: true,
    },
  });

  const { cities, isErrorCities, isLoadingCities, refetchCities } =
    useCities.useAll({
      search: debouncedSearch,
    });

  const {
    statistics,
    isLoadingStatistics,
    refetchStatistics,
    isErrorStatistics,
  } = useCities.useStatistics();

  function handleAddCity() {
    form.reset({
      name: "",
      shipping_fees: 45,
      has_shipping: true,
      free_shipping_threshold: 2000,
      always_charge_shipping: true,
    });
    setCityModal({
      open: true,
      mode: "add",
      city: null,
    });
  }

  function handleEditCity(city) {
    form.reset({
      ...city,
      free_shipping_threshold: Number(city?.free_shipping_threshold),
      shipping_fees: Number(city?.shipping_fees),
      has_shipping: Boolean(city?.has_shipping),
      always_charge_shipping: Boolean(city?.always_charge_shipping),
    });
    setCityModal({
      open: true,
      mode: "edit",
      city: city,
    });
  }

  if (isLoadingCities || isLoadingStatistics)
    return <LoadingState type="dashboard" />;

  if (isErrorCities || isErrorStatistics)
    return (
      <ErrorMessage
        message={"Failed to load data"}
        dismissible={true}
        onDismiss={refetchCities && refetchStatistics}
      />
    );

  return (
    <div className="space-y-6 p-6">
      <Title
        form={form}
        cityModal={cityModal}
        setCityModal={setCityModal}
        onAddCity={handleAddCity}
      />
      <ShippingStatsContainer stats={statistics} />
      <ControlsBar searchInput={searchInput} setSearchInput={setSearchInput} />
      <ShippingDataTable cities={cities?.data} onEditCity={handleEditCity} />
      <PaginationControlsBar
        dataName={"cities"}
        isLoading={isLoadingCities}
        pageCount={cities?.pagination?.totalPages}
        totalCount={cities?.pagination?.total}
      />
    </div>
  );
}

export default AdminShippingPage;

function Title({ form, setCityModal, cityModal, onAddCity }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold">Shipping fees management</h1>
        <p className="text-muted-foreground">
          Manage all your city shipping fees in here!
        </p>
      </div>
      <Button onClick={onAddCity}>+ Add City</Button>
      <CityModal form={form} modal={cityModal} setModal={setCityModal} />
    </div>
  );
}

function ShippingStatsContainer({ stats }) {
  function shippingStats(stats) {
    return [
      {
        id: 1,
        title: "Total Cities",
        icon: MapPin,
        value: stats?.total_cities || 0,
        subtitle: "Cities configured for shipping",
      },
      {
        id: 2,
        title: "Average Shipping Fee",
        icon: DollarSign,
        value: formatCurrency(stats?.avg_shipping_fee),
        subtitle: "Across all cities with shipping",
      },
      {
        id: 3,
        title: "Free Shipping Cities",
        icon: Gift,
        value: stats?.free_shipping_cities || 0,
        subtitle: "Cities offering free shipping threshold",
      },
      {
        id: 4,
        title: "Always Charged Cities",
        icon: Truck,
        value: stats?.always_charged_cities || 0,
        subtitle: "Cities where free shipping is disabled",
      },
    ];
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {shippingStats(stats).map((stat) => (
        <StatsCard
          key={stat.id}
          icon={stat.icon}
          subtitle={stat.subtitle}
          title={stat.title}
          value={stat.value}
        />
      ))}
    </div>
  );
}

function ControlsBar({ searchInput, setSearchInput }) {
  const [searchParams] = useSearchParams();
  const updateUrlParams = useUpdateUrlParams();

  const limit = parseInt(searchParams.get("limit")) || 10;
  const status = searchParams.get("status") || "";

  return (
    <div className="flex gap-2">
      <div className="relative ">
        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        <Input
          placeholder="Search by city . . ."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            updateUrlParams({ page: 1, status: "all" });
          }}
          className=" w-70 min-w-full  pl-10"
        />
      </div>
      <Select
        value={status}
        onValueChange={(value) => {
          updateUrlParams({
            status: value === "all" || value === "" ? undefined : value,
            page: 1,
          });
        }}
      >
        <SelectTrigger className="w-auto min-w-32">
          <div className="flex items-center gap-2">
            <Filter />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          <Separator className={"my-2"} />
          <SelectItem value="free_shipping">Free Shipping Eligible</SelectItem>
          <SelectItem value="always_charged">Always Charged</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={String(limit)}
        onValueChange={(value) => updateUrlParams({ limit: Number(value) })}
      >
        <SelectTrigger className="w-auto ">
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent>
          {[10, 20, 50, 100].map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ShippingDataTable({ cities, onEditCity }) {
  return (
    <div className="p-4  rounded-lg border">
      <Table className={" "}>
        <TableCaption>
          A list of the cities and their shipping fees.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Shipping Fee</TableHead>
            <TableHead>Free Shipping Above</TableHead>
            <TableHead>Always Charge Shipping</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Updated at</TableHead>
            <TableHead className={"text-right"}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cities?.map((city) => (
            <TableRow key={city?.id}>
              <TableCell className="font-medium">{city?.id}</TableCell>
              <TableCell>{city?.name}</TableCell>
              <TableCell className={"font-semibold"}>
                {formatCurrency(city?.shipping_fees)}
              </TableCell>
              <TableCell>
                {formatCurrency(city?.free_shipping_threshold)}
              </TableCell>
              <TableCell>
                <span
                  className={`px-3 py-1 rounded-lg text-xs ${
                    city?.always_charge_shipping === 1
                      ? "text-red-500 bg-red-100"
                      : "text-green-500 bg-green-100"
                  } `}
                >
                  {city?.always_charge_shipping === 1
                    ? "Yes"
                    : "FREE above threshold"}
                </span>
              </TableCell>
              <TableCell className={"text-xs text-muted-foreground"}>
                {formatDateDMY(city?.created_at)}
              </TableCell>
              <TableCell className={"text-xs text-muted-foreground"}>
                {formatDateDMY(city?.updated_at)}
              </TableCell>
              <TableCell className={"flex justify-end mr-4"}>
                <SquarePen
                  className="size-4 text-accent cursor-pointer"
                  onClick={() => onEditCity(city)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CityModal({ form, setModal, modal }) {
  const isEditMode = modal.mode === "edit";

  const { isPendingCities: isPendingCreate, createCity } = useCities.useCreate({
    onSuccess: () => {
      setModal({ open: false, mode: "add", city: null });
      form.reset();
    },
  });

  const { isPendingCities: isPendingUpdate, updateCity } = useCities.useUpdate({
    onSuccess: () => {
      setModal({ open: false, mode: "add", city: null });
      form.reset();
    },
  });

  function onSubmit(data) {
    if (isEditMode) {
      updateCity({ id: modal.city.id, data });
    } else {
      createCity(data);
    }
  }

  const isPending = isEditMode ? isPendingUpdate : isPendingCreate;

  return (
    <Dialog
      open={modal.open}
      onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? `Edit ${modal.city?.name}` : "Add New City"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update city shipping configuration"
              : "Create a new city with shipping configuration"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter city name (e.g., London)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipping_fees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Fee</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="5.50"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Base shipping cost for this city (in your currency)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_shipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Shipping Available
                    </FormLabel>
                    <FormDescription>
                      Enable shipping services for this city
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="free_shipping_threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Free Shipping Above</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="100.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum order value for free shipping
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="always_charge_shipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Always Charge Shipping
                    </FormLabel>
                    <FormDescription>
                      Charge shipping even above free threshold
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setModal({ open: false, mode: "add", city: null })
                }
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Update City" : "Add City"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
