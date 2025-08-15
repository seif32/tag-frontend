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
import { Badge } from "@/components/ui/badge";
import { Tag, Upload, Info, Plus } from "lucide-react";
import TagFormField from "../../ui/TagFormField";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import useCategories from "@/hooks/useCategories";

function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const { createCategory, isPendingCreateCategory } = useCategories.useCreate({
    onSuccess: () => {
      setOpen(false);
      form.reset();
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      image_url:
        "https://images.unsplash.com/photo-1723223440648-dc41fb3d9a7f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      active: true,
    },
  });

  function onSubmit(data) {
    createCategory(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-3">
          <Plus className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Category
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Create New Parent Category
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground"></DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              {/* <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Category Details</h3>
              </div> */}

              <TagFormField
                control={form.control}
                label="Name"
                name="name"
                placeholder="e.g., Electronics, Clothing"
                required
              />
            </div>

            <Separator />

            {/* Media Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Category Image</h3>
              </div>

              <div className="space-y-3">
                <TagFormField
                  control={form.control}
                  name="image_url"
                  type="image-upload"
                  maxSize={2 * 1024 * 1024} // 2MB
                  accept="image/*"
                />

                {/* Image Guidelines */}
                <div className="flex items-start gap-2 p-3 border rounded-lg bg-blue-50/50 border-blue-200">
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
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="sm:w-auto"
                disabled={
                  form.formState.isSubmitting || isPendingCreateCategory
                }
              >
                {form.formState.isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Tag className="mr-2 h-4 w-4" />
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
