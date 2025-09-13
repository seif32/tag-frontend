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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

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
  selectAddress,
  setSelectAddress,
  setIsEditMode,
  isEditMode,
}) {
  const [openCountry, setOpenCountry] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  const [openAddress, setOpenAddress] = useState(false);

  const newAddress = selectAddress === null;

  useEffect(() => {
    handleSelect(null);
  }, []);

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

  function handleEditMode() {
    if (isEditMode) {
      form.reset({
        ...selectAddress,
        is_default: Boolean(selectAddress.is_default),
      });
    }
    setIsEditMode((mode) => !mode);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-6 space-y-4 bg-white border rounded-xl"
      >
        <div className="flex justify-between mb-2">
          <div>
            <h2 className=" text-xl font-semibold">Address Information</h2>
          </div>

          <div>
            {!newAddress && (
              <Button variant="ghost" onClick={handleEditMode} type="button">
                {isEditMode ? "Cancel" : "Edit"}
              </Button>
            )}

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

                    {addresses.map((addr) => (
                      <CommandItem
                        key={addr.id}
                        value={addr.id}
                        onSelect={() => handleSelect(addr.id)}
                        className={"text-xs "}
                      >
                        {addr.description} – {addr.city}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex gap-2">
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
                          ? countries.find(
                              (country) => country.value === field.value
                            )?.label
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

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className={"flex-1"}>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Popover
                    open={openCity && isEditMode}
                    onOpenChange={setOpenCity}
                  >
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
                          ? cities.find((city) => city.value === field.value)
                              ?.label
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
        </div>

        <div className="grid grid-cols-2 gap-2">
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
        </div>

        <div className="grid grid-cols-2 gap-2">
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
        </div>

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

        <FormField
          name="is_default"
          control={form.control}
          render={({ field }) => (
            <FormItem
              className={"flex flex-row-reverse justify-end gap-2 mt-8"}
            >
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
      </form>
    </Form>
  );
}

export default CheckoutForm;
