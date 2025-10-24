import z from "zod";

export const addProductDefaultValues = {
  name: "",
  description: "",
  short_description: "",
  category_id: "",
  subcategory_id: "",
  brand_id: "",
  featured: false,
  active: true,
  tags: [],
  variants: [],
};

// Main product schema
export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Product name is too long"),

  description: z.string().optional(),

  short_description: z
    .string()
    .max(500, "Short description is too long")
    .optional(),

  category_id: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? "" : parseInt(val)))
    .refine((val) => val !== "" && !isNaN(val), {
      message: "Category is required",
    }),

  subcategory_id: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? "" : parseInt(val)))
    .refine((val) => val !== "" && !isNaN(val), {
      message: "Subcategory is required",
    }),

  brand_id: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? "" : parseInt(val)))
    .optional(),

  featured: z.boolean().default(false),
  active: z.boolean().default(true),

  tags: z.array(z.string()).default([]).optional(),

  variants: z.array(z.any()).optional().default([]),
});

// Edit mode schema (simpler validation)
export const editProductSchema = productSchema.pick({
  name: true,
  description: true,
  short_description: true,
  category_id: true,
  subcategory_id: true,
  brand_id: true,
  featured: true,
  active: true,
});

// Helper function to validate data
export const validateProductData = (data, isEditMode = false) => {
  const schema = isEditMode ? editProductSchema : productSchema;

  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData, errors: null };
  } catch (error) {
    return { success: false, data: null, errors: error.errors };
  }
};

// Helper to get validation errors in a friendly format
export const formatValidationErrors = (errors) => {
  if (!errors) return [];

  return errors.map((error) => ({
    field: error.path.join("."),
    message: error.message,
  }));
};
