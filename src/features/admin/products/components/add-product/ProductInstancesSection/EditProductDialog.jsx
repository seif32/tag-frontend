import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useProducts from "@/hooks/useProducts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const productSchema = z.object({
  quantity: z.coerce.number().min(0, "Quantity must be positive"),
  price: z.coerce.number().min(0, "Price must be positive"),
  compare_at_price: z.coerce
    .number()
    .min(0, "Compare at price must be positive"),
  cost_price: z.coerce.number().min(0, "Cost price must be positive"),
  vat: z.coerce.number().min(0, "VAT must be positive"),
  currency: z.string().min(1, "Currency is required"),
});

function EditProductDialog({ isDialogOpen, selectedProduct, onClose }) {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      quantity: 0,
      price: 0,
      compare_at_price: 0,
      cost_price: 0,
      currency: "USD",
      vat: 0,
    },
  });

  const { updateVariant, isPendingVariants } = useProducts.useUpdateVariant();

  useEffect(() => {
    if (selectedProduct && isDialogOpen) {
      form.reset(selectedProduct);
    }
  }, [selectedProduct, isDialogOpen, form]);

  function onSubmit(data) {
    console.log("EditProductDialog", data);
    updateVariant({ variantId: selectedProduct.id, variantData: data });
    onClose();
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>Edit Variant </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              {/* Quantity Field */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter quantity"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
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
                    <FormLabel>VAT</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Compare At Price Field */}
              <FormField
                control={form.control}
                name="compare_at_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare At Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00 (optional)"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Original price for showing discounts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cost Price Field */}
              <FormField
                control={form.control}
                name="cost_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Your cost for this product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currency Field */}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProductDialog;
