import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import VariantManualValueInput from "./VariantManualValueInput";
import VariantValueToggleGroup from "./VariantValueToggleGroup";

function VariantValueDialog({ variant }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 group cursor-pointer rounded-4xl hover:bg-primary transition-colors duration-300"
        >
          <Plus
            size={14}
            className=" group-hover:text-primary-foreground  transition-colors"
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select or create a new value</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4">
              <VariantValueToggleGroup
                variant={variant}
                setIsDialogOpen={setIsDialogOpen}
              />
              <div className="border" />
              <VariantManualValueInput variant={variant} />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default VariantValueDialog;
