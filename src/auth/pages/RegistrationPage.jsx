import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCategories from "@/hooks/useCategories";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";

const registerSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z
    .string()
    .min(10, "Phone number must be valid")
    .regex(/^[0-9+]+$/, "Only digits or + allowed"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  business_name: z
    .string()
    .min(2, "Business name is required")
    .max(100, "Business name is too long"),

  vat_number: z
    .string()
    .min(8, "VAT number is required (minimum 8 characters)")
    .max(15, "VAT number is too long")
    .regex(/^[A-Z0-9]+$/, "VAT number format is invalid"),

  categories: z
    .array(z.number().positive("Invalid category"))
    .min(1, "Please select at least one business category")
    .max(5, "Maximum 5 categories allowed"),
});

function RegistrationPage() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      business_name: "",
      vat_number: "",
      categories: [],
    },
  });
  const register = useAuthStore((state) => state.register);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    categories,
    isLoadingCategories,
    errorCategories,
    isErrorCategories,
    refetchCategories,
  } = useCategories.useAll({ limit: 9999999 });

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        phone_number: data.phone_number.startsWith("+")
          ? data.phone_number
          : `+20${data.phone_number.replace(/^0/, "")}`,
      };

      await register(formattedData);
      // ✅ Success - will redirect via PublicRoute
    } catch (error) {
      console.error("Registration error:", error);

      // 🆕 Set form error instead of just toast
      form.setError("root.serverError", {
        type: "server",
        message: error.message || "Registration failed. Please try again.",
      });

      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // 🆕 Add error display in JSX (same as LoginPage)
  {
    form.formState.errors.root?.serverError && (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600 font-medium">
          ❌ {form.formState.errors.root.serverError.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">Join us today and get started </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Adidas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+201234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vat_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Number</FormLabel>
                  <FormControl>
                    <Input placeholder="5984FHEU" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter strong password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoadingCategories ? (
              <LoadingState />
            ) : isErrorCategories ? (
              <ErrorMessage
                message={errorCategories?.message || "Failed to load data"}
                dismissible
                onDismiss={refetchCategories}
              />
            ) : (
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Categories</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="multiple"
                        value={field.value.map(String)}
                        onValueChange={(values) => {
                          const numberValues = values.map(Number);
                          field.onChange(numberValues);
                        }}
                        className="grid grid-cols-2 gap-2"
                      >
                        {categories?.data?.map((category) => (
                          <ToggleGroupItem
                            key={category.id}
                            value={String(category.id)}
                            className="text-left data-[state=on]:bg-accent/15 data-[state=on]:text-accent"
                          >
                            {category.name}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormDescription>
                      Select up to 5 categories that describe your business
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating Account..." : "Create Account "}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to={"/login"} className="text-accent hover:text-accent/70">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default RegistrationPage;
