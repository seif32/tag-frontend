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
import { Plus, Tag, UploadCloud, X, Loader2 } from "lucide-react";
import TagFormField from "../../ui/TagFormField";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import useCategories from "@/hooks/useCategories";
import LoadingState from "@/ui/LoadingState";

import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function AddEditSubcategoryDialog({
  subcategory,
  openSubcategoryDialog,
  setOpenSubcategoryDialog,
  onAdd,
  mode = "create",
  refetchAllSubCategories,
}) {
  const isEditMode = mode === "edit";
  const [preview, setPreview] = useState(null);

  const form = useForm({
    defaultValues: {
      name: subcategory?.name || "",
      parent_id: subcategory?.parent_id || "",
      image_file: subcategory?.image_url || "",
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
      ? categories.data.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      : [];

  const handleImageChange = (file, onChange) => {
    if (!file) return;

    onChange(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  function onSubmit(data) {
    if (isEditMode) {
      console.log({ id: subcategory.id, data });
      updateSubCategory({ id: subcategory.id, data });
    } else {
      createSubCategory(data);
      console.log(data);
    }
  }

  // 🎯 Check if any operation is pending
  const isLoading = isPendingCreateSubCategory || isPendingUpdateSubCategory;

  return (
    <Dialog
      open={openSubcategoryDialog}
      onOpenChange={(open) => {
        // 👇 Prevent closing while loading
        if (isLoading) return;
        setOpenSubcategoryDialog(open);
      }}
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
        {/* 🆕 Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {isEditMode
                  ? "Updating subcategory..."
                  : "Creating subcategory..."}
              </span>
            </div>
          </div>
        )}

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
                  disabled={isLoading} // 👈 Disable during loading
                />

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
                    disabled={isLoading} // 👈 Disable during loading
                  />
                )}
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="image_file"
                rules={{ required: "Image file is required" }}
                render={({ field }) => {
                  const onClear = () => {
                    field.onChange(null);
                    setPreview(null);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Subcategory Image</FormLabel>
                      <FormControl>
                        <label
                          htmlFor="image_file_input"
                          className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 transition ${
                            isLoading
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                          }`}
                        >
                          <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Click or drag image to upload
                          </span>
                          <input
                            id="image_file_input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isLoading} // 👈 Disable during loading
                            onChange={(e) =>
                              handleImageChange(
                                e.target.files?.[0],
                                field.onChange
                              )
                            }
                          />
                        </label>
                      </FormControl>

                      {preview && (
                        <div className="mt-4 relative inline-block">
                          <img
                            src={preview}
                            alt="Image preview"
                            className="rounded-md max-h-48 object-cover border shadow"
                          />
                          <button
                            type="button"
                            aria-label="Remove image"
                            onClick={onClear}
                            disabled={isLoading} // 👈 Disable during loading
                            className={`absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow ${
                              isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-red-700"
                            }`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenSubcategoryDialog(false)}
                className="sm:w-auto"
                disabled={isLoading} // 👈 Disable during loading
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="sm:w-auto"
                disabled={isLoading} // 👈 Disable during loading
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {isEditMode ? "Edit Subcategory" : "Create Subcategory"}
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
