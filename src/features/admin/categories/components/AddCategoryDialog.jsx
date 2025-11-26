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
import { Tag, Upload, Info, Plus, Loader2 } from "lucide-react";
import TagFormField from "../../ui/TagFormField";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import useCategories from "@/hooks/useCategories";

function AddCategoryDialog() {
  const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
  const [preview, setPreview] = useState(null);

  const { createCategory, isPendingCreateCategory } = useCategories.useCreate({
    onSuccess: () => {
      setOpenAddCategoryDialog(false);
      form.reset();
      setPreview(null);
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      image_file: "",
    },
  });

  function onSubmit(data) {
    createCategory(data);
  }

  return (
    <Dialog
      open={openAddCategoryDialog}
      onOpenChange={(open) => {
        // 👇 Prevent closing while loading
        if (isPendingCreateCategory) return;
        setOpenAddCategoryDialog(open);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-3">
          <Plus className="w-4 h-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Category
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {/* 🆕 Loading overlay */}
        {isPendingCreateCategory && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Creating category...
              </span>
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Create New Parent Category
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground"></DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <TagFormField
                control={form.control}
                label="Name"
                name="name"
                placeholder="e.g., Electronics, Clothing"
                disabled={isPendingCreateCategory} // 👈 Disable during loading
              />
            </div>

            <Separator />

            {/* Media Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Category Image</h3>
              </div>
              <ImageUploadFormField
                control={form.control}
                name="image_file"
                label="Category Image"
                preview={preview}
                setPreview={setPreview}
                disabled={isPendingCreateCategory} // 👈 Pass disabled state
              />

              <div className="space-y-3">
                {/* Image Guidelines */}
                <div className="flex items-start gap-2 p-3 border border-blue-200 rounded-lg bg-blue-50/50">
                  <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-blue-900">
                      Image Guidelines
                    </p>
                    <ul className="text-xs text-blue-700 space-y-0.5">
                      <li>• Use high-quality images (JPG, PNG, WebP)</li>
                      <li>
                        • Recommended dimensions: 400x300px or 4:3 aspect ratio
                      </li>
                      <li>• Maximum file size: 2MB</li>
                    </ul>
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
                onClick={() => setOpenAddCategoryDialog(false)}
                className="sm:w-auto"
                disabled={isPendingCreateCategory} // 👈 Disable during loading
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="sm:w-auto"
                disabled={isPendingCreateCategory} // 👈 Disable during loading
              >
                {isPendingCreateCategory ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Tag className="w-4 h-4 mr-2" />
                    Create Category
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

export default AddCategoryDialog;
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { UploadCloud, X } from "lucide-react";

function ImageUploadFormField({
  control,
  name,
  label,
  preview,
  setPreview,
  disabled = false, // 👈 Accept disabled prop
}) {
  const [fileName, setFileName] = useState(null);

  const onFileChange = (e, onChange) => {
    const file = e.target.files[0];
    if (!file) return;

    onChange(file);
    setFileName(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const clearFile = (onChange) => {
    onChange(null);
    setFileName(null);
    setPreview(null);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <label
              htmlFor={name}
              className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 transition ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click to upload</span>
              <input
                id={name}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={disabled} // 👈 Disable input
                onChange={(e) => onFileChange(e, field.onChange)}
              />
            </label>
          </FormControl>

          {preview && (
            <div className="mt-4 relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="rounded-md max-h-48 object-cover border shadow"
              />
              <Button
                type="button"
                aria-label="Remove image"
                onClick={() => clearFile(field.onChange)}
                disabled={disabled} // 👈 Disable button
                className={`absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow ${
                  disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-700"
                }`}
              >
                <X className="w-4 h-4" />
              </Button>
              {fileName && (
                <p className="mt-1 text-xs text-gray-600">{fileName}</p>
              )}
            </div>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
