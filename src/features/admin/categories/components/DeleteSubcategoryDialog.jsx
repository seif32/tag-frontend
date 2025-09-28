import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteSubcategoryDialog({
  deleteDialog,
  onConfirmDelete,
  onCancelDelete,
  isPending,
}) {
  return (
    <Dialog open={deleteDialog.open} onOpenChange={onCancelDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Delete Subcategory
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              "{deleteDialog.subcategory?.name}"
            </span>
            ? This action cannot be undone and will permanently remove this
            subcategory and all its associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse gap-2 mt-6 sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            variant="outline"
            onClick={onCancelDelete}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 rounded-full animate-spin border-background border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Subcategory
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
