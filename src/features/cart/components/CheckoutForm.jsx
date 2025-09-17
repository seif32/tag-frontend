import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "eg", label: "Egypt" },
];

const cities = [
  { value: "cairo", label: "Cairo" },
  { value: "new-york", label: "New York" },
  { value: "london", label: "London" },
];

function CheckoutForm({
  form,
  onSubmit,
  addresses,
  isLoadingAddresses,
  isErrorAddresses,
  errorAddresses,
  refetchAddresses,
  selectAddress,
  setSelectAddress,
  setIsEditMode,
  isEditMode,
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-6 space-y-4 bg-white border rounded-xl"
      >
        <div className="flex justify-between mb-2">
          <h2 className=" text-xl font-semibold">Address Information</h2>
          <AddressContainer
            addresses={addresses}
            errorAddresses={errorAddresses}
            form={form}
            isEditMode={isEditMode}
            isErrorAddresses={isErrorAddresses}
            isLoadingAddresses={isLoadingAddresses}
            refetchAddresses={refetchAddresses}
            selectAddress={selectAddress}
            setIsEditMode={setIsEditMode}
            setSelectAddress={setSelectAddress}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <CountryDropdown form={form} isEditMode={isEditMode} />
          <CityDropdown form={form} isEditMode={isEditMode} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <ApartmentNumber form={form} isEditMode={isEditMode} />
          <BuildingNumber form={form} isEditMode={isEditMode} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StreetName form={form} isEditMode={isEditMode} />
          <PostalCode form={form} isEditMode={isEditMode} />
        </div>

        <Description form={form} isEditMode={isEditMode} />
        <IsDefaultToggle form={form} isEditMode={isEditMode} />
      </form>
    </Form>
  );
}

export default CheckoutForm;

function AddressContainer({
  form,
  selectAddress,
  setSelectAddress,
  isEditMode,
  setIsEditMode,
  addresses,
  refetchAddresses,
  isLoadingAddresses,
  errorAddresses,
  isErrorAddresses,
}) {
  const [openAddress, setOpenAddress] = useState(false);
  const newAddress = selectAddress === null;

  function handleEditMode() {
    if (isEditMode) {
      form.reset({
        ...selectAddress,
        is_default: Boolean(selectAddress.is_default),
      });
    }
    setIsEditMode((mode) => !mode);
  }

  if (isLoadingAddresses) {
    return <LoadingState />;
  }

  if (isErrorAddresses) {
    return (
      <ErrorMessage
        message={errorAddresses?.message || "Failed to load data"}
        dismissible
        onDismiss={refetchAddresses}
      />
    );
  }

  return (
    <div>
      {!newAddress && (
        <Button variant="ghost" onClick={handleEditMode} type="button">
          {isEditMode ? "Cancel" : "Edit"}
        </Button>
      )}

      <AddressDropdown
        addresses={addresses}
        openAddress={openAddress}
        setOpenAddress={setOpenAddress}
        setIsEditMode={setIsEditMode}
        selectAddress={selectAddress}
        setSelectAddress={setSelectAddress}
        form={form}
      />
    </div>
  );
}

function AddressDropdown({
  setIsEditMode,
  setSelectAddress,
  addresses,
  setOpenAddress,
  openAddress,
  form,
  selectAddress,
}) {
  const handleSelect = (addrId) => {
    if (addrId === null) {
      setIsEditMode(true);
      setSelectAddress(null);
      form.reset({
        description: "",
        city: "",
        postal_code: "",
        country: "",
        location_url: "",
        is_default: true,
        apartment_number: "",
        building_number: "",
        street_name: "",
      });
    } else {
      setIsEditMode(false);
      const selected = addresses.find((a) => a.id === addrId);
      setSelectAddress(selected);
      form.reset({
        ...selected,
        is_default: Boolean(selected.is_default),
      });
    }
    setOpenAddress(false);
  };
  return (
    <Popover open={openAddress} onOpenChange={setOpenAddress}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          className="justify-between  text-xs"
        >
          {selectAddress
            ? `${selectAddress.street_name} – ${selectAddress.city}`
            : "New Address"}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandItem
              key="new"
              value="new"
              onSelect={() => handleSelect(null)}
              className={"text-xs font-medium"}
            >
              New Address
            </CommandItem>

            <div className="border my-2 "></div>

            {addresses.length !== 0 ? (
              addresses.map((addr) => (
                <CommandItem
                  key={addr.id}
                  value={addr.id}
                  onSelect={() => handleSelect(addr.id)}
                  className={"text-xs "}
                >
                  {addr.description} – {addr.city}
                </CommandItem>
              ))
            ) : (
              <div className="text-xs text-muted-foreground p-2">
                No Saved Addresses
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CountryDropdown({ form, isEditMode }) {
  const [openCountry, setOpenCountry] = useState(false);

  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem className={"flex-1"}>
          <FormLabel>Country</FormLabel>
          <FormControl>
            <Popover
              open={openCountry && isEditMode}
              onOpenChange={setOpenCountry}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCountry}
                  disabled={!isEditMode}
                  className={cn(
                    "justify-between w-full border-gray-200",
                    !isEditMode
                      ? "text-gray-700 bg-gray-50 cursor-not-allowed"
                      : "text-gray-500 bg-[#F9FAFB] hover:bg-primary"
                  )}
                >
                  {field.value
                    ? countries.find((country) => country.value === field.value)
                        ?.label
                    : "Select country..."}
                  {isEditMode && (
                    <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                  )}{" "}
                </Button>
              </PopoverTrigger>
              {isEditMode && (
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.value}
                            value={country.value}
                            onSelect={(currentValue) => {
                              const newValue =
                                currentValue === field.value
                                  ? ""
                                  : currentValue;
                              field.onChange(newValue); // Use field.onChange
                              setOpenCountry(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === country.value // Use field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
            </Popover>
          </FormControl>
          <FormMessage /> {/* Don't forget this for validation errors */}
        </FormItem>
      )}
    />
  );
}

function CityDropdown({ form, isEditMode }) {
  const [openCity, setOpenCity] = useState(false);

  return (
    <FormField
      control={form.control}
      name="city"
      render={({ field }) => (
        <FormItem className={"flex-1"}>
          <FormLabel>City</FormLabel>
          <FormControl>
            <Popover open={openCity && isEditMode} onOpenChange={setOpenCity}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCity}
                  disabled={!isEditMode}
                  className={cn(
                    "justify-between w-full border-gray-200",
                    !isEditMode
                      ? "text-gray-700 bg-gray-50 cursor-not-allowed"
                      : "text-gray-500 bg-[#F9FAFB] hover:bg-primary"
                  )}
                >
                  {field.value
                    ? cities.find((city) => city.value === field.value)?.label
                    : "Select city..."}
                  {isEditMode && (
                    <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                  )}
                </Button>
              </PopoverTrigger>
              {isEditMode && (
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search city..." />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {cities.map((city) => (
                          <CommandItem
                            key={city.value}
                            value={city.value}
                            onSelect={(currentValue) => {
                              const newValue =
                                currentValue === field.value
                                  ? ""
                                  : currentValue;
                              field.onChange(newValue);
                              setOpenCity(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === city.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {city.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ApartmentNumber({ form, isEditMode }) {
  return (
    <FormField
      control={form.control}
      name="apartment_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Apartment Number</FormLabel>
          <FormControl>
            <Input {...field} disabled={!isEditMode} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function BuildingNumber({ form, isEditMode }) {
  return (
    <FormField
      control={form.control}
      name="building_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Building Number</FormLabel>
          <FormControl>
            <Input {...field} disabled={!isEditMode} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function StreetName({ form, isEditMode }) {
  return (
    <FormField
      control={form.control}
      name="street_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Street Name</FormLabel>
          <FormControl>
            <Input {...field} disabled={!isEditMode} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PostalCode({ form, isEditMode }) {
  return (
    <FormField
      control={form.control}
      name="postal_code"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Postal Code</FormLabel>
          <FormControl>
            <Input {...field} disabled={!isEditMode} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Description({ form, isEditMode }) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Input {...field} disabled={!isEditMode} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function IsDefaultToggle({ form, isEditMode }) {
  return (
    <FormField
      name="is_default"
      control={form.control}
      render={({ field }) => (
        <FormItem className={"flex flex-row-reverse justify-end gap-2 mt-8"}>
          <FormLabel>Default location</FormLabel>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className={"cursor-pointer"}
              disabled={!isEditMode}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
