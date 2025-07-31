import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useProductStore from "@/features/admin/store/productStore";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

const variantValues = [
  {
    value: "s",
    label: "S",
  },
  {
    value: "m",
    label: "M",
  },
  {
    value: "l",
    label: "L",
  },
  {
    value: "xl",
    label: "XL",
  },
];

function VariantsValues({ variant }) {
  const [newValueInputs, setNewValueInputs] = useState({});
  const [selectedValues, setSelectedValues] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addVariantValue = useProductStore((state) => state.addVariantValue);
  const removeVariantValues = useProductStore(
    (state) => state.removeVariantValues
  );

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  function handleSelectValue() {
    const existingValues = variant.values.map((v) => v.value.toLowerCase());
    selectedValues.forEach((val) => {
      if (!existingValues.includes(val.toLowerCase())) {
        addVariantValue(variant.id, val);
      }
    });
    const manualValues = variant.values
      .filter(
        (v) =>
          !variantValues.some(
            (opt) => opt.value.toLowerCase() === v.value.toLowerCase()
          )
      )
      .map((v) => v.value);

    const finalSelected = [...selectedValues, ...manualValues];
    const toggledOff = variant.values.filter(
      (v) => !finalSelected.includes(v.value)
    );

    if (toggledOff.length > 0) {
      removeVariantValues(
        variant.id,
        toggledOff.map((v) => v.id)
      );
    }
  }

  function handleAddValue(variantId, value) {
    if (!value.trim()) return;
    addVariantValue(variantId, value);
    setNewValueInputs({ ...newValueInputs, [variantId]: "" });
  }

  // const removeVariantValue = (variantId, valueId) => {
  //   setVariants(
  //     variants.map((v) =>
  //       v.id === variantId
  //         ? { ...v, values: v.values.filter((val) => val.id !== valueId) }
  //         : v
  //     )
  //   );
  // };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Values</p>
      <div className="flex flex-wrap gap-2 p-3 rounded-lg border min-h-[60px]">
        {variant.values.map((value) => (
          <Badge key={value.id} variant="secondary" className="gap-1 pb-0 pt0">
            <span className="text-sm">{value.value}</span>
            {/* <MdCancel
              className="text-sm transition-all duration-75 cursor-pointer hover:text-red-600"
              onClick={() => removeVariantValue(variant.id, value.id)}
            /> */}
          </Badge>
        ))}
        <div className="flex items-center gap-2">
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
                    <div className="flex flex-col ">
                      <div
                        className="flex justify-between items-center
                  "
                      >
                        <div>
                          <h5 className="leading-none mb-1">Choose value</h5>
                          <h6 className="text-primary/50 text-xs leading-none mb-2.5">
                            Just click on it!
                          </h6>
                        </div>
                        <Button onClick={handleSelectValue}>Done</Button>
                      </div>

                      <ToggleGroup
                        value={selectedValues}
                        onValueChange={setSelectedValues}
                        type="multiple"
                        className={"gap-2 flex flex-wrap"}
                      >
                        {variantValues.map((value) => {
                          return (
                            <ToggleGroupItem
                              key={value.value}
                              value={value.value}
                            >
                              {value.label}
                            </ToggleGroupItem>
                          );
                        })}
                      </ToggleGroup>
                    </div>
                    <div className="border" />
                    <div>
                      <h5 className="leading-none mb-1">
                        You don't find what you want?
                      </h5>
                      <h6 className="text-primary/50 text-xs leading-none mb-2.5">
                        It's fine, just create your new one!
                      </h6>
                      <div className="flex gap-4 items-center">
                        <Input
                          value={newValueInputs[variant.id] || ""}
                          onChange={(e) =>
                            setNewValueInputs({
                              ...newValueInputs,
                              [variant.id]: e.target.value,
                            })
                          }
                          placeholder="(optional)"
                          className=" "
                          onKeyPress={(e) => {
                            handleKeyPress(e, () =>
                              handleAddValue(
                                variant.id,
                                newValueInputs[variant.id] || ""
                              )
                            );
                          }}
                        />
                        <Button
                          onClick={() => {
                            handleAddValue(
                              variant.id,
                              newValueInputs[variant.id] || ""
                            );
                          }}
                        >
                          Create
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default VariantsValues;
