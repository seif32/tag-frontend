import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Percent,
  DollarSign,
  Calendar,
  Users,
  Tag,
  Info,
  Gift,
  Timer,
} from "lucide-react";

import { z } from "zod";
import usePromoCode from "@/hooks/usePromoCode";

const promoCodeSchema = z
  .object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(20, "Code must be less than 20 characters")
      .regex(
        /^[A-Z0-9]+$/,
        "Code must contain only uppercase letters and numbers"
      ),

    description: z
      .string()
      .min(5, "Description must be at least 5 characters")
      .max(100, "Description must be less than 100 characters"),

    discount_type: z.enum(["percentage", "fixed"], {
      required_error: "Please select a discount type",
    }),

    discount_value: z
      .number()
      .min(1, "Discount value must be at least 1")
      .max(500, "Discount value cannot exceed 500"),

    min_order_value: z
      .number()
      .min(0, "Minimum order value cannot be negative")
      .optional(),

    max_discount: z
      .number()
      .min(0, "Maximum discount cannot be negative")
      .optional(),

    start_date: z.string().min(1, "Start date is required"),

    end_date: z.string().min(1, "End date is required"),

    usage_limit: z.number().min(1, "Usage limit must be at least 1").optional(),

    per_user_limit: z
      .number()
      .min(1, "Per user limit must be at least 1")
      .optional(),

    is_first_order: z.boolean().default(false),

    is_active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      return new Date(data.end_date) > new Date(data.start_date);
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

export default function PromoCodeModal({
  isOpen,
  onClose,
  mode,
  promoCode,
  onSuccess,
}) {
  const { createPromoCode, isPendingPromoCodes: isCreatingPromoCode } =
    usePromoCode.useCreate();
  const { updatePromoCode, isPendingPromoCodes: isUpdatingPromoCode } =
    usePromoCode.useUpdate();

  const form = useForm({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 10,
      min_order_value: 0,
      max_discount: 0,
      start_date: "",
      end_date: "",
      usage_limit: 100,
      per_user_limit: 1,
      is_first_order: false,
      is_active: true,
    },
  });

  const watchedDiscountType = form.watch("discount_type");
  const watchedDiscountValue = form.watch("discount_value");

  useEffect(() => {
    if (isOpen && promoCode && (mode === "edit" || mode === "view")) {
      const formattedPromoCode = {
        ...promoCode,
        discount_value: Number(promoCode?.discount_value),
        min_order_value: Number(promoCode?.min_order_value),
        max_discount: Number(promoCode?.max_discount),
        is_first_order: Boolean(promoCode?.is_first_order),
        is_active: Boolean(promoCode?.is_active),
        start_date: promoCode.start_date
          ? new Date(promoCode.start_date).toISOString().split("T")[0]
          : "",
        end_date: promoCode.end_date
          ? new Date(promoCode.end_date).toISOString().split("T")[0]
          : "",
      };
      form.reset(formattedPromoCode);
    } else if (isOpen && mode === "create") {
      form.reset({
        code: "",
        description: "",
        discount_type: "percentage",
        discount_value: 10,
        min_order_value: 0,
        max_discount: 0,
        start_date: "",
        end_date: "",
        usage_limit: 100,
        per_user_limit: 1,
        is_first_order: false,
        is_active: true,
      });
    }
  }, [isOpen, promoCode, mode, form]);

  async function onSubmit(data) {
    try {
      const formattedData = {
        ...data,
        start_date: data.start_date + "T00:00:00", // MySQL DATETIME format
        end_date: data.end_date + "T23:59:59", // End of day
      };

      if (mode === "create") {
        console.log("add", formattedData);
        createPromoCode(formattedData, { onSuccess: () => onSuccess() });
      } else if (mode === "edit") {
        console.log("edit", formattedData);

        updatePromoCode(
          {
            id: promoCode.id,
            data: formattedData,
          },
          { onSuccess: () => onSuccess() }
        );
      }
    } catch (error) {
      console.error("Failed to save promo code:", error);
    }
  }

  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return "Create New Promo Code";
      case "edit":
        return "Edit Promo Code";
      case "view":
        return "Promo Code Details";
      default:
        return "Promo Code";
    }
  };

  const getModalIcon = () => {
    switch (mode) {
      case "create":
        return <Gift className="w-5 h-5 text-blue-500" />;
      case "edit":
        return <Tag className="w-5 h-5 text-amber-500" />;
      case "view":
        return <Info className="w-5 h-5 text-green-500" />;
      default:
        return <Tag className="w-5 h-5" />;
    }
  };

  const isReadOnly = mode === "view";

  // Preview of what the promo code will look like
  const getDiscountPreview = () => {
    if (!watchedDiscountValue) return null;

    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          {watchedDiscountType === "percentage" ? (
            <Percent className="w-4 h-4" />
          ) : (
            <DollarSign className="w-4 h-4" />
          )}
          <span className="font-medium">
            Customer gets: {watchedDiscountValue}
            {watchedDiscountType === "percentage" ? "% off" : " dollars off"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[70vw] !max-w-[1400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            {getModalIcon()}
            <div>
              <DialogTitle className="text-2xl font-bold">
                {getModalTitle()}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {mode === "create" &&
                  "Create a new promotional code for your customers"}
                {mode === "edit" && "Modify the existing promotional code"}
                {mode === "view" && "View promotional code details"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Tag className="w-5 h-5" />
                Basic Information
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Promo Code *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="WELCOME2025"
                          {...field}
                          disabled={isReadOnly}
                          className="font-mono text-lg h-12"
                        />
                      </FormControl>
                      <FormDescription>
                        The code customers will enter at checkout (uppercase
                        letters and numbers only)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Discount Type *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isReadOnly}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">
                            <div className="flex items-center gap-2">
                              <Percent className="w-4 h-4" />
                              Percentage (%)
                            </div>
                          </SelectItem>
                          <SelectItem value="fixed">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Fixed Amount ($)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose between percentage discount or fixed dollar
                        amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Description *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="10% off for new customers - welcome to our store!"
                        {...field}
                        disabled={isReadOnly}
                        className="min-h-[80px] resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      A friendly description that explains what this promo code
                      offers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Discount Configuration Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Gift className="w-5 h-5" />
                Discount Configuration
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="discount_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Discount Value *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            disabled={isReadOnly}
                            className="h-12 pl-10"
                            placeholder="10"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            {watchedDiscountType === "percentage" ? (
                              <Percent className="w-4 h-4 text-gray-400" />
                            ) : (
                              <DollarSign className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        {watchedDiscountType === "percentage"
                          ? "Percentage off (1-100)"
                          : "Dollar amount off"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="min_order_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Minimum Order Value
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            disabled={isReadOnly}
                            className="h-12 pl-8"
                            placeholder="50"
                          />
                          <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Minimum cart value required to use this code
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Maximum Discount
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            disabled={isReadOnly}
                            className="h-12 pl-8"
                            placeholder="20"
                          />
                          <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Maximum dollar amount that can be discounted
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {getDiscountPreview()}
            </div>

            <Separator />

            {/* Validity Period Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Calendar className="w-5 h-5" />
                Validity Period
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Start Date *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={isReadOnly}
                          className="h-12"
                        />
                      </FormControl>
                      <FormDescription>
                        When customers can start using this promo code
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        End Date *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={isReadOnly}
                          className="h-12"
                        />
                      </FormControl>
                      <FormDescription>
                        When this promo code expires and becomes invalid
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Usage Limits Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Users className="w-5 h-5" />
                Usage Limits
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="usage_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Total Usage Limit
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          disabled={isReadOnly}
                          className="h-12"
                          placeholder="100"
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of times this code can be used across all
                        customers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="per_user_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Per User Limit
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          disabled={isReadOnly}
                          className="h-12"
                          placeholder="1"
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of times each individual customer can use
                        this code
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Special Conditions Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Timer className="w-5 h-5" />
                Special Conditions
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="is_first_order"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div className="space-y-1">
                        <FormLabel className="text-base font-medium">
                          First Order Only
                        </FormLabel>
                        <FormDescription className="text-sm">
                          Restrict this promo code to customers making their
                          first purchase
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div className="space-y-1">
                        <FormLabel className="text-base font-medium">
                          Active Status
                        </FormLabel>
                        <FormDescription className="text-sm">
                          Enable or disable this promo code for customer use
                        </FormDescription>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                          <Badge
                            variant={field.value ? "default" : "secondary"}
                          >
                            {field.value ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* View-Only Information - Missing GET response fields */}
            {mode === "view" && promoCode && (
              <>
                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Info className="w-5 h-5" />
                    Usage Statistics
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Record ID */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <FormLabel className="text-base font-medium">
                        Record ID
                      </FormLabel>
                      <div className="mt-2">
                        <Input
                          value={`#${promoCode.id}`}
                          disabled
                          className="h-12 font-mono bg-white"
                        />
                      </div>
                      <FormDescription>
                        Unique identifier for this promo code record
                      </FormDescription>
                    </div>

                    {/* Usage Count */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <FormLabel className="text-base font-medium">
                        Times Used
                      </FormLabel>
                      <div className="mt-2">
                        <Input
                          value={`${promoCode.usage_count || 0} times`}
                          disabled
                          className="h-12 bg-white"
                        />
                      </div>
                      <FormDescription>
                        How many times customers have used this code
                      </FormDescription>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6"
              >
                {isReadOnly ? "Close" : "Cancel"}
              </Button>

              {!isReadOnly && (
                <Button
                  type="submit"
                  disabled={isCreatingPromoCode || isUpdatingPromoCode}
                  className="px-6"
                >
                  {mode === "create"
                    ? "Create Promo Code"
                    : "Update Promo Code"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
