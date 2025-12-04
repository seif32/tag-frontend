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
import PhoneInputWithCountrySelect from "react-phone-number-input";

const registerSchema = z
  .object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone_number: z
      .string()
      .min(1, "Phone number is required")
      .refine(
        (val) => {
          if (!val) return false;

          // Egypt: +20 followed by 10 digits starting with 1
          if (val.startsWith("+20")) {
            return /^\+201\d{9}$/.test(val);
          }

          // UK: +44 followed by 10 digits
          if (val.startsWith("+44")) {
            return /^\+44\d{10}$/.test(val);
          }

          // US: +1 followed by 10 digits
          if (val.startsWith("+1")) {
            return /^\+1\d{10}$/.test(val);
          }

          // Generic international format for other countries
          return /^\+[1-9]\d{1,14}$/.test(val);
        },
        (val) => {
          // Custom error messages per country
          if (val.startsWith("+20")) {
            return {
              message:
                "Egypt numbers must be 10 digits starting with 1 (e.g., +201012345678)",
            };
          }
          if (val.startsWith("+44")) {
            return {
              message: "UK numbers must be 10 digits (e.g., +447911123456)",
            };
          }
          if (val.startsWith("+1")) {
            return {
              message: "US numbers must be 10 digits (e.g., +15551234567)",
            };
          }
          return { message: "Please enter a valid phone number" };
        }
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),

    business_name: z
      .string()
      .min(2, "Business name is required")
      .max(100, "Business name is too long"),

    vat_number: z
      .string()
      .min(8, "VAT number is required (minimum 8 characters)")
      .max(15, "VAT number is too long")
      .regex(/^[A-Z0-9]+$/, "VAT number format is invalid"),

    categories: z.array(z.number().positive("Invalid category")).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
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
      confirmPassword: "",
      business_name: "",
      vat_number: "",
      categories: [],
    },
  });
  const register = useAuthStore((state) => state.register);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    categories,
    isLoadingCategories,
    errorCategories,
    isErrorCategories,
    refetchCategories,
  } = useCategories.useAll({ limit: 9999999 });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const passwordChecks = {
    minLength: password?.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const CheckItem = ({ isValid, label }) => (
    <div className="flex items-center gap-2 text-xs">
      <span className={`${isValid ? "text-green-600" : "text-red-500"}`}>
        {isValid ? "✓" : "✗"}
      </span>
      <span className={`${isValid ? "text-green-600" : "text-gray-600"}`}>
        {label}
      </span>
    </div>
  );

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      const formattedData = { ...data };

      // Remove confirmPassword before sending to backend
      delete formattedData.confirmPassword;

      await register(formattedData);
      // ✅ Success - will redirect via PublicRoute
    } catch (error) {
      console.error("Registration error:", error);

      form.setError("root.serverError", {
        type: "server",
        message: error.message || "Registration failed. Please try again.",
      });

      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">Join us today and get started 🚀</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Server Error Display */}
            {form.formState.errors.root?.serverError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">
                  ❌ {form.formState.errors.root.serverError.message}
                </p>
              </div>
            )}

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
                    <PhoneInputWithCountrySelect
                      {...field}
                      defaultCountry="EG"
                      international
                      withCountryCallingCode
                      limitMaxLength={true} // ✅ Stops user from exceeding max length
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      numberInputProps={{
                        style: {
                          outline: "none",
                          border: "none",
                          background: "transparent",
                          flex: 1,
                          fontSize: "0.875rem",
                          padding: 0,
                        },
                      }}
                      countrySelectProps={{
                        style: {
                          border: "none",
                          background: "transparent",
                          outline: "none",
                          fontSize: "0.875rem",
                          padding: 0,
                          margin: 0,
                          cursor: "pointer",
                          width: "140px",
                        },
                      }}
                      flagComponent={({ country, countryName }) => (
                        <span
                          title={countryName}
                          style={{
                            display: "inline-block",
                            width: "20px",
                            height: "15px",
                            marginRight: "4px",
                            backgroundImage: `url(https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {/* Dynamic helper based on selected country */}
                    {field.value?.startsWith("+20") && (
                      <span className="text-blue-600 font-medium">
                        🇪🇬 For Egypt: Enter 10 digits starting with 1 (e.g.,
                        1012345678)
                      </span>
                    )}
                    {field.value?.startsWith("+44") && (
                      <span className="text-blue-600 font-medium">
                        🇬🇧 For UK: Enter your number without the leading 0
                      </span>
                    )}
                    {field.value?.startsWith("+1") && (
                      <span className="text-blue-600 font-medium">
                        🇺🇸 For US: Enter 10 digits (area code + number)
                      </span>
                    )}
                    {!field.value && (
                      <span>
                        Select your country and enter your phone number
                      </span>
                    )}
                  </FormDescription>
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
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter strong password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </FormControl>

                  {/* Real-time validation indicators */}
                  {password && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                      <CheckItem
                        isValid={passwordChecks.minLength}
                        label="At least 8 characters"
                      />
                      <CheckItem
                        isValid={passwordChecks.hasUppercase}
                        label="One uppercase letter"
                      />
                      <CheckItem
                        isValid={passwordChecks.hasLowercase}
                        label="One lowercase letter"
                      />
                      <CheckItem
                        isValid={passwordChecks.hasNumber}
                        label="One number"
                      />
                      <CheckItem
                        isValid={passwordChecks.hasSpecial}
                        label="One special character"
                      />
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        {...field}
                        className={
                          confirmPassword &&
                          (passwordsMatch
                            ? "border-green-500"
                            : "border-red-500")
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </FormControl>

                  {/* Password match indicator */}
                  {confirmPassword && (
                    <div
                      className={`mt-2 text-xs flex items-center gap-2 ${
                        passwordsMatch ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      <span>{passwordsMatch ? "✓" : "✗"}</span>
                      <span>
                        {passwordsMatch
                          ? "Passwords match"
                          : "Passwords do not match"}
                      </span>
                    </div>
                  )}

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
                    <FormLabel>Business Categories (Optional)</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="multiple"
                        value={field.value?.map(String) || []}
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
                      Select categories that describe your business
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating Account..." : "Create Account"}
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
