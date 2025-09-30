import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isPending = false,
  entityName = "item",
  entityLabel = "",
  title = "Delete Item",
  description = null,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description ? (
              description
            ) : (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  {entityLabel}
                </span>
                ? This action cannot be undone and will permanently remove this{" "}
                {entityName} and all its associated data.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse gap-2 mt-6 sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
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
                Delete{" "}
                {entityName.charAt(0).toUpperCase() + entityName.slice(1)}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// function ProductList({ products }) {
//   const [deleteDialog, setDeleteDialog] = useState({
//     open: false,
//     product: null,
//   });
//   const { deleteProduct, isPendingDeleteProduct } = useProducts.useDelete();

//   // Open dialog and set selected product to delete
//   function openDeleteDialog(product) {
//     setDeleteDialog({ open: true, product });
//   }

//   // Cancel deletion - close dialog
//   function closeDeleteDialog() {
//     setDeleteDialog({ open: false, product: null });
//   }

//   // Confirm deletion - call API, then close dialog
//   async function confirmDelete() {
//     if (!deleteDialog.product) return;

//     try {
//       await deleteProduct(deleteDialog.product.id, {
//         onSuccess: () => {
//           closeDeleteDialog();
//           // Optionally refresh product list or show toast
//         },
//       });
//     } catch (err) {
//       // Handle error, maybe show toast here
//     }
//   }

//   return (
//     <>
//       <ul>
//         {products.map((product) => (
//           <li key={product.id} className="flex justify-between items-center">
//             <span>{product.name}</span>
//             <button
//               className="text-red-600 hover:underline"
//               onClick={() => openDeleteDialog(product)}
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>

//       <DeleteConfirmationDialog
//         open={deleteDialog.open}
//         onOpenChange={closeDeleteDialog}
//         onCancel={closeDeleteDialog}
//         onConfirm={confirmDelete}
//         isPending={isPendingDeleteProduct}
//         entityName="product"
//         entityLabel={deleteDialog.product?.name || ""}
//         title="Delete Product"
//       />
//     </>
//   );
// }

// export default ProductList;
