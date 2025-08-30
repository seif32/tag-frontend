import { useFormContext, Controller } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItem, FormMessage } from "@/components/ui/form";
import useProductStore from "@/features/admin/store/productStore";
import productsApi from "@/services/productsApi";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function NameSkuFields({ mode }) {
  const { control, setError, clearErrors, trigger } = useFormContext();
  const setBaseName = useProductStore((state) => state.setBaseName);

  const [validationState, setValidationState] = useState({
    status: null,
    isChecking: false,
  });

  const checkNameAvailability = async (productName) => {
    if (!productName?.trim() || productName.length < 2) {
      setValidationState({ status: null, isChecking: false });
      return;
    }

    setValidationState({ status: "checking", isChecking: true });
    clearErrors("name");

    try {
      const result = await productsApi.checkNameExists(productName.trim());

      if (result.exists) {
        setValidationState({ status: "exists", isChecking: false });
        setError("name", {
          type: "manual",
          message:
            "Product name already exists. Please choose a different name.",
        });
      } else {
        setValidationState({ status: "available", isChecking: false });
        clearErrors("name");
        trigger("name");
      }
    } catch (error) {
      setValidationState({ status: "error", isChecking: false });
      console.warn("Name validation failed:", error);
    }
  };

  return (
    <FormItem>
      <Label htmlFor="name">Product Name</Label>

      <Controller
        name="name"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="relative">
            <Input
              {...field}
              id="name"
              placeholder="Enter product name"
              disabled={mode === "view" || validationState.isChecking}
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500",
                validationState.status === "available" && "border-green-500",
                validationState.status === "exists" && "border-red-500"
              )}
              onBlur={(e) => {
                field.onBlur(e); // Important: call the original onBlur
                setBaseName(e.target.value);
                checkNameAvailability(e.target.value); // ✅ Check on blur
              }}
            />

            {/* Status indicator */}
            {validationState.isChecking && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              </div>
            )}
          </div>
        )}
      />

      <FormMessage />

      {/* Validation feedback */}
      {validationState.status === "available" && (
        <p className="flex items-center gap-1.5 text-green-600 text-xs mt-1">
          <CheckCircle className="w-3 h-3" />
          Name is available
        </p>
      )}

      {validationState.status === "exists" && (
        <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
          <AlertCircle className="w-3 h-3" />
          Name is already taken
        </p>
      )}

      {validationState.status === "error" && (
        <p className="flex items-center gap-1.5 text-amber-600 text-xs mt-1">
          <AlertCircle className="w-3 h-3" />
          Unable to verify availability
        </p>
      )}
    </FormItem>
  );
}

export default NameSkuFields;
