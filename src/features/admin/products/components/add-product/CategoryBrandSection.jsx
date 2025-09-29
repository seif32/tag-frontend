import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TagFormField from "../../../ui/TagFormField";
import LoadingState from "@/ui/LoadingState";
import { useSelectCategory } from "../../hooks/useSelectCategory";
import { useSelectBrand } from "../../hooks/useSelectBrand";
import useProductStore from "@/features/admin/store/productStore";
import { useFormContext } from "react-hook-form";
import { RxCaretSort } from "react-icons/rx";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CheckIcon } from "lucide-react";

function CategoryBrandSection() {
  const mode = useProductStore((state) => state.mode);
  const isViewMode = mode === "view";
  const { control } = useFormContext();

  const {
    isLoadingCategories,
    mainCategories,
    selectedCategoryId,
    subcategoriesByParent,
    selectedCategoryHasSubcategories,
  } = useSelectCategory(mode);
  const { allBrands, isLoadingBrands } = useSelectBrand(mode);

  if (isLoadingCategories || isLoadingBrands) return <LoadingState />;

  return (
    <Card>
      <CardHeader className={"font-bold"}>Category & Brand</CardHeader>
      <CardContent className={"space-y-4"}>
        <FormField
          control={control}
          name="category_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between border-gray-200 text-black hover:bg-white hover:text-black",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isViewMode}
                    >
                      {field.value
                        ? mainCategories.find(
                            (cat) => cat.value === field.value
                          )?.label
                        : "Select a category"}
                      <RxCaretSort />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search categories..."
                      className="h-9"
                    />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {mainCategories.map((category) => (
                        <CommandItem
                          value={category.label}
                          key={category.value}
                          onSelect={() => {
                            field.onChange(category.value);
                          }}
                        >
                          {category.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              category.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="subcategory_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Sub-category</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between border-gray-200 text-black hover:bg-white hover:text-black",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={
                        isViewMode || isLoadingCategories || !selectedCategoryId
                      }
                    >
                      {field.value
                        ? (
                            subcategoriesByParent[selectedCategoryId] || []
                          ).find((sub) => sub.value === field.value)?.label
                        : selectedCategoryId
                        ? selectedCategoryHasSubcategories
                          ? "Select a subcategory"
                          : "No subcategories available"
                        : "First select a category"}
                      <RxCaretSort />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search subcategories..."
                      className="h-9"
                    />
                    <CommandEmpty>
                      {selectedCategoryId && !selectedCategoryHasSubcategories
                        ? "🏷️ This category has no subcategories available"
                        : "No subcategory found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {(subcategoriesByParent[selectedCategoryId] || []).map(
                        (subcategory) => (
                          <CommandItem
                            value={subcategory.label}
                            key={subcategory.value}
                            onSelect={() => {
                              field.onChange(subcategory.value);
                            }}
                          >
                            {subcategory.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                subcategory.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        )
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="brand_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Brand</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between border-gray-200 text-black hover:bg-white hover:text-black",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isViewMode}
                    >
                      {field.value
                        ? allBrands.find((brand) => brand.value === field.value)
                            ?.label
                        : "Select a brand"}
                      <RxCaretSort />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search brands..."
                      className="h-9"
                    />
                    <CommandEmpty>No brand found.</CommandEmpty>
                    <CommandGroup>
                      {allBrands.map((brand) => (
                        <CommandItem
                          value={brand.label}
                          key={brand.value}
                          onSelect={() => {
                            field.onChange(brand.value);
                          }}
                        >
                          {brand.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              brand.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

export default CategoryBrandSection;
