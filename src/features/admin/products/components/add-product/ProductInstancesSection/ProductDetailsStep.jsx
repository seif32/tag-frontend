import useProductStore from "@/features/admin/store/productStore";
import StepHeader from "@/features/admin/ui/StepHeader";
import TagFormField from "@/features/admin/ui/TagFormField";
import { useFormContext } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function ProductDetailsStep({ currentSelections }) {
  const baseName = useProductStore((state) => state.baseName);
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <StepHeader step={2} title="Tell Us About Your Product" />

      <div className="flex items-center bg-black rounded-lg ">
        <h3 className="px-3 py-4 text-xl text-white font-degular">
          {baseName}
        </h3>
        <div className="flex flex-wrap gap-1">
          {Object.values(currentSelections).map((selection, index) => (
            <span
              key={selection?.id || index}
              className="text-xs h-fit bg-white rounded-sm px-4 py-0.5 ca"
            >
              {selection?.value}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <TagFormField
          control={control}
          name="variants.0.quantity"
          label="Quantity"
          placeholder="e.g., 50"
        />
        <TagFormField
          control={control}
          name="variants.0.vat"
          label="VAT %"
          placeholder="e.g., 79"
        />
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <TagFormField
            control={control}
            name="variants.0.price"
            label="Price"
            placeholder="e.g., 899.99"
          />
        </div>
        {/* <div className="flex-1">
          <FormField
            control={control}
            name="variants.0.currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EUR">EUR - Euro 🇪🇺</SelectItem>
                    <SelectItem value="EGP">EGP - Egyptian Pound 🇪🇬</SelectItem>
                    <SelectItem value="USD">USD - US Dollar 🇺🇸</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound 🇬🇧</SelectItem>
                    <SelectItem value="SAR">SAR - Saudi Riyal 🇸🇦</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <TagFormField
            control={control}
            name="variants.0.compare_at_price"
            label="Compare at Price"
            placeholder="e.g., 1099.99"
          />
        </div>
        <div className="flex-1">
          <TagFormField
            control={control}
            name="variants.0.cost_price"
            label="Cost Price"
            placeholder="e.g., 700.00"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsStep;
