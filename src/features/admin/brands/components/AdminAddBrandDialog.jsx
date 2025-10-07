import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import useBrands from "@/hooks/useBrands";

const brandSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Brand name must be at least 2 characters" })
    .max(50, { message: "Brand name must be less than 50 characters" })
    .regex(/^[a-zA-Z0-9\s&.-]+$/, {
      message:
        "Brand name can only contain letters, numbers, spaces, &, ., and -",
    }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be less than 500 characters" }),
});

function AdminAddBrandDialog({
  open,
  setOpen,
  selectedBrand,
  setSelectedBrand,
  mode = "add",
}) {
  const isAddMode = mode === "add";

  const {
    createBrand,
    errorCreateBrand,
    isErrorCreateBrand,
    isPendingBrands: isAddingBrand,
    resetCreateBrand,
  } = useBrands.useCreate({
    onSuccess: () => {
      setOpen(false);
      form.reset();
    },
  });

  const {
    updateBrand,
    errorUpdateBrand,
    isErrorUpdateBrand,
    isPendingBrands: isUpdatingBrand,
    resetUpdateBrand,
  } = useBrands.useUpdate({
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

  const form = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (selectedBrand) {
      form.reset({
        name: selectedBrand.name || "",
        description: selectedBrand.description || "",
      });
    } else {
      form.reset({ name: "", description: "" });
    }
  }, [selectedBrand, form]);

  function onSubmit(data) {
    if (selectedBrand) {
      updateBrand({
        id: selectedBrand.id,
        data,
      });
    } else {
      createBrand(data);
    }
  }

  const handleReset = () => {
    form.reset();
    resetCreateBrand();
    resetUpdateBrand;
  };

  const handleDialogClose = (open) => {
    setOpen(open);
    if (!open) {
      handleReset();
      setSelectedBrand(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {/* <Building className="h-5 w-5" /> */}
            Add New Brand
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new brand for your catalog.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Brand Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Nike, Apple, Samsung..."
                      {...field}
                      disabled={isAddingBrand || isUpdatingBrand}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what makes this brand special..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isAddingBrand || isUpdatingBrand}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isErrorCreateBrand && errorCreateBrand && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  {errorCreateBrand.message ||
                    "An error occurred while creating the brand"}
                </p>
              </div>
            )}

            {isErrorUpdateBrand && errorUpdateBrand && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  {errorUpdateBrand.message ||
                    "An error occurred while updating the brand"}
                </p>
              </div>
            )}

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
                disabled={isAddingBrand || isUpdatingBrand}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isAddingBrand || isUpdatingBrand || !form.formState.isValid
                }
                className="gap-2 "
              >
                {isAddingBrand || isUpdatingBrand ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>{isAddMode ? "Create Brand" : "Edit Brand"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAddBrandDialog;
