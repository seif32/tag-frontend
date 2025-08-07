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
import { consoleObject } from "@/utils/consoleObject";

function VariantValueDialog({ variant }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  consoleObject(variant);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="hover:bg-transparent group cursor-pointer"
        >
          <Plus
            size={14}
            className=" group-hover:scale-125  transition-all text-accent duration-200"
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
