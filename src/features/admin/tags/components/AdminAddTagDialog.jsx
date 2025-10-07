import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tag, Hash, Save, Loader2, Plus } from "lucide-react";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import useTags from "@/hooks/useTags";
import useCategories from "@/hooks/useCategories";

const tagSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Tag name must be at least 2 characters" })
    .max(30, { message: "Tag name must be less than 30 characters" })
    .regex(/^[a-zA-Z0-9\s-]+$/, {
      message:
        "Tag name can only contain letters, numbers, spaces, and hyphens",
    }),
  category_id: z
    .string()
    .min(1, { message: "Please select a category" })
    .transform((val) => parseInt(val, 10)),
});

function AdminAddTagDialog({
  open,
  onOpenChange,
  tagToEdit = null,
  setSelectedTag,
}) {
  const isEditMode = Boolean(tagToEdit?.id);

  const { categories, isLoadingCategories } = useCategories.useAll();

  const {
    createTag,
    errorCreateTag,
    isErrorCreateTag,
    isPendingTags: isAddingTag,
    resetCreateTag,
  } = useTags.useCreate({
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
    },
  });

  const {
    updateTag,
    errorUpdateTag,
    isErrorUpdateTag,
    isPendingTags: isUpdatingTag,
    resetUpdateTag,
  } = useTags.useUpdate({
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
    },
  });

  const form = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      category_id: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (tagToEdit) {
      form.reset({
        name: tagToEdit.name || "",
        category_id: tagToEdit.category_id?.toString() || "",
      });
    } else {
      form.reset({
        name: "",
        category_id: "",
      });
    }
  }, [tagToEdit, form]);

  function onSubmit(data) {
    if (isEditMode) {
      updateTag({
        id: tagToEdit.id,
        data,
      });
    } else {
      createTag(data);
    }

    form.reset();
    onOpenChange(false);
  }

  const handleReset = () => {
    form.reset();
    resetCreateTag?.();
    resetUpdateTag?.();
  };

  const handleDialogClose = (open) => {
    onOpenChange(open);
    if (!open) {
      setSelectedTag(null);
      handleReset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Tag
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? `Edit "${tagToEdit.name}"` : "Add New Tag"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the tag information below."
              : "Create a new tag to organize your products."}
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
                    Tag Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Sports, Electronics, Fashion..."
                      {...field}
                      disabled={isAddingTag || isUpdatingTag}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isLoadingCategories && (
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isAddingTag || isUpdatingTag}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.data?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the category this tag belongs to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(isErrorCreateTag || isErrorUpdateTag) &&
              (errorCreateTag || errorUpdateTag) && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">
                    {errorCreateTag?.message ||
                      errorUpdateTag?.message ||
                      "An error occurred"}
                  </p>
                </div>
              )}

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
                disabled={isAddingTag || isUpdatingTag}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isAddingTag || isUpdatingTag || !form.formState.isValid
                }
                className="gap-2"
              >
                {isAddingTag || isUpdatingTag ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEditMode ? "Update Tag" : "Create Tag"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAddTagDialog;
