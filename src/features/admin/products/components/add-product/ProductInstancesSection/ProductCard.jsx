import { Card, CardContent } from "@/components/ui/card";
import ProductHeader from "./ProductHeader";
import ProductDetails from "./ProductDetails";
import NoProducts from "./NoProducts";
import { Button } from "@/components/ui/button";
import useFilteredVariants from "../../../hooks/useFilteredVariants";
import useProductStore from "@/features/admin/store/productStore";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import useBundles from "@/hooks/useBundles";

const formSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  vat: z.number().min(0).max(100, "VAT must be between 0 and 100"),
  subtotal: z.number().min(0, "Subtotal must be a positive number"),
  is_active: z.boolean().default(true),
});

function ProductCard({ variantsList, onEditProduct, productName }) {
  const { filteredVariants, isEmpty } = useFilteredVariants(variantsList);

  const mode = useProductStore((state) => state.mode);
  const isAddMode = mode === "add";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variant_id: "",
      quantity: 1,
      vat: 14,
      subtotal: 0,
      is_active: true,
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedVariant(null);
    form.reset({
      variant_id: "",
      quantity: 1,
      vat: 14,
      subtotal: 0,
      is_active: true,
    });
  }

  function handleCreateBundle(variant) {
    setSelectedVariant(variant);
    setIsModalOpen(true);
  }

  return (
    <CardContent className="space-y-4">
      {filteredVariants.map((product, index) => (
        <Card key={product.id || index}>
          <CardContent>
            <div className="flex justify-between">
              <ProductHeader product={product} productName={productName} />
              {!isAddMode && (
                <div className="space-x-1">
                  <Button
                    type="button" // Important: prevent parent form submission
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProduct(product); // Use the passed handler
                    }}
                    size={"sm"}
                    variant={"outline"}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size={"sm"}
                    onClick={() => handleCreateBundle(product)}
                  >
                    + Add Bundle
                  </Button>
                </div>
              )}
            </div>
            <ProductDetails product={product} />
          </CardContent>
        </Card>
      ))}

      {isEmpty && <NoProducts />}

      <AddBundleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedVariant={selectedVariant}
        form={form}
      />
    </CardContent>
  );
}

export default ProductCard;

function AddBundleModal({ isOpen, onClose, selectedVariant, form }) {
  const { createBundle, isPendingBundles } = useBundles.useCreate();
  function onSubmit(data) {
    const payload = {
      ...data,
      variant_id: selectedVariant?.id,
    };
    createBundle(payload, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Bundle</DialogTitle>
          <DialogDescription>
            Create a new product bundle with variant and pricing details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation(); // Stop event bubbling to parent forms
              form.handleSubmit(onSubmit)(e); // Call react-hook-form submit
            }}
            className="space-y-6"
          >
            {/* Variant Selection */}

            {/* Quantity and VAT Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subtotal */}
            <FormField
              control={form.control}
              name="subtotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtotal (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Toggle */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Bundle will be {field.value ? "active" : "inactive"} after
                      creation
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPendingBundles}>
                Create Bundle
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
