import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus, Info, Upload, Tag } from "lucide-react";
import TagFormField from "../../ui/TagFormField";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import useCategories from "@/hooks/useCategories";
import LoadingState from "@/ui/LoadingState";
import { useEffect } from "react";

function AddEditSubcategoryDialog({
  subcategory,
  openSubcategoryDialog,
  setOpenSubcategoryDialog,
  onAdd,
  mode = "create",
  refetchAllSubCategories,
}) {
  const isEditMode = mode === "edit";

  const form = useForm({
    defaultValues: {
      name: subcategory?.name || "",
      parent_id: subcategory?.parent_id || "",
      active: subcategory?.active ?? true,
      image_url:
        subcategory?.image_url ||
        "https://images.unsplash.com/photo-1723223440648-dc41fb3d9a7f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  });

  const { categories, isLoadingCategories, isErrorCategories } =
    useCategories.useAll();
  const { createSubCategory, isPendingCreateSubCategory } =
    useCategories.useCreateSubCategory({
      onSuccess: () => {
        refetchAllSubCategories();
        setOpenSubcategoryDialog(false);
        form.reset();
      },
    });
  const { updateSubCategory, isPendingUpdateSubCategory } =
    useCategories.useUpdateSubCategory({
      onSuccess: () => {
        refetchAllSubCategories();
        setOpenSubcategoryDialog(false);
        form.reset();
      },
    });

  const selectCategories =
    !isLoadingCategories && categories
      ? categories.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      : [];

  function onSubmit(data) {
    if (isEditMode) {
      console.log({ id: subcategory.id, data });
      updateSubCategory({ id: subcategory.id, data });
    } else {
      createSubCategory(data);
    }
  }

  return (
    <Dialog
      open={openSubcategoryDialog}
      onOpenChange={setOpenSubcategoryDialog}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-3 group"
          onClick={onAdd}
        >
          <span className="text-accent group-hover:text-white">
            <Tag className="w-4 h-4" />
          </span>
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-accent group-hover:text-white">
            Add Subcategory
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            {isEditMode
              ? `Edit ${subcategory.name} subcategory`
              : "Create New Subcategory"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground"></DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Basic Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <TagFormField
                  control={form.control}
                  label="Name"
                  name="name"
                  placeholder="Enter subcategory name"
                  className="col-span-1"
                />

                {/* {mode === "edit" && <span>{subcategory.parent_name}</span>} */}

                {isLoadingCategories ? (
                  <div className="flex items-center justify-center col-span-1 p-4">
                    <LoadingState />
                  </div>
                ) : (
                  <TagFormField
                    control={form.control}
                    name="parent_id"
                    label="Parent Category"
                    type="select"
                    options={selectCategories}
                    placeholder="Select parent category"
                    className="col-span-1"
                  />
                )}
              </div>
            </div>

            <Separator />

            {/* Media Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Image Upload</h3>
              </div>

              {/* <TagFormField
                control={form.control}
                name="image_url"
                type="image-upload"
                maxSize={2 * 1024 * 1024}
                accept="image/*"
                description="To represent this subcategory (max 2MB)"
                className="w-full"
              /> */}
            </div>

            <Separator />

            {/* Settings Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Visibility Settings</h3>
              </div>

              <div className="flex items-start justify-between p-4 border rounded-lg bg-muted/30">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Active Status</p>
                    <TagFormField
                      control={form.control}
                      name="active"
                      type="switch"
                    />
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Controls whether this subcategory is visible to customers
                      on your site. You can always change this later.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenSubcategoryDialog(false)}
                className="sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="sm:w-auto"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ||
                isPendingCreateSubCategory ||
                isPendingUpdateSubCategory ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 rounded-full animate-spin border-background border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {isEditMode ? "Edit Subcategory" : " Create Subcategory"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEditSubcategoryDialog;
