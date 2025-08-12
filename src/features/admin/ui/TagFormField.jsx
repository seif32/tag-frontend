// ui/TagFormField.jsx (Enhanced with Toggle Group)
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// 🆕 NEW: Import Toggle Group components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export default function TagFormField({
  name,
  label,
  type = "text",
  placeholder = "",
  description = "",
  className = "",
  triggerClassName = "",
  required = false,
  disabled = false,
  options = [],
  rows = 3,
  onBlur = null,
  emptyMessage = null,
  // 🆕 NEW: Toggle Group specific props
  toggleType = "multiple", // "single" or "multiple"
  toggleSize = "default", // "default", "sm", "lg"
  toggleVariant = "default", // "default", "outline"
  toggleItemClassName = "", // ✅ NEW: For styling individual ToggleGroupItem
  allowEmpty = true, // Allow deselecting all options (for multiple mode)
  ...inputProps
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="text-sm font-medium leading-none">
              {label}
            </FormLabel>
          )}

          {description && (
            <FormDescription className="text-xs leading-none text-muted-foreground">
              {description}
            </FormDescription>
          )}

          <FormControl>
            {renderFieldByType(type, field, {
              placeholder,
              disabled,
              required,
              options,
              rows,
              triggerClassName,
              onBlur,
              emptyMessage,
              toggleItemClassName,
              toggleType,
              toggleSize,
              toggleVariant,
              allowEmpty,
              ...inputProps,
            })}
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function renderFieldByType(type, field, props) {
  const {
    placeholder,
    disabled,
    options,
    rows,
    triggerClassName,
    onBlur,
    emptyMessage,
    // 🆕 Extract toggle props
    toggleType,
    toggleSize,
    toggleVariant,
    toggleItemClassName,
    allowEmpty,
    ...restProps
  } = props;

  // 🎯 ENHANCED: Smart display mode for BOTH select AND toggle-group
  if ((type === "select" || type === "toggle-group") && disabled) {
    return renderSelectDisplayMode(field, {
      options,
      placeholder,
      triggerClassName,
      type, // ✅ Pass type to handle different displays
    });
  }

  // 🆕 NEW: Toggle Group case
  if (type === "toggle-group") {
    return renderToggleGroup(field, {
      options,
      disabled,
      toggleType,
      toggleSize,
      toggleVariant,
      allowEmpty,
      triggerClassName,
      toggleItemClassName,

      emptyMessage,
    });
  }

  // 🔄 Rest of your existing cases stay the same...
  switch (type) {
    case "textarea":
      return (
        <Textarea
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={triggerClassName}
          {...field}
          {...restProps}
          onBlur={(e) => {
            field.onBlur();
            if (onBlur) onBlur(e);
          }}
        />
      );

    case "select":
      return (
        <Select
          onValueChange={field.onChange}
          value={field.value || ""}
          disabled={disabled}
        >
          <SelectTrigger className={`w-full ${triggerClassName}`}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.length === 0 && emptyMessage ? (
              <div className="px-3 py-2 text-sm text-center text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              options.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      );

    case "checkbox":
      return (
        <div className={`flex items-center space-x-2 ${triggerClassName}`}>
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            {...restProps}
          />
          {placeholder && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {placeholder}
            </label>
          )}
        </div>
      );

    default:
      return (
        <Input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={triggerClassName}
          {...field}
          {...restProps}
          onBlur={(e) => {
            field.onBlur();
            if (onBlur) onBlur(e);
          }}
        />
      );
  }
}

// 🆕 NEW: Toggle Group renderer
function renderToggleGroup(
  field,
  {
    options,
    disabled,
    toggleType,
    toggleSize,
    toggleVariant,
    allowEmpty,
    triggerClassName,
    toggleItemClassName, // ✅ NEW: Extract the item styling
    emptyMessage,
  }
) {
  // Handle empty options
  if (options.length === 0) {
    return (
      <div className="px-3 py-2 text-sm text-center text-muted-foreground border rounded-md bg-muted">
        {emptyMessage || "No options available"}
      </div>
    );
  }

  // 🎯 Handle value conversion based on toggle type
  const currentValue =
    toggleType === "multiple"
      ? Array.isArray(field.value)
        ? field.value
        : []
      : field.value;

  // 🔄 Handle value changes
  const handleValueChange = (newValue) => {
    if (toggleType === "single") {
      // Single selection: pass the value directly (or null if allowEmpty and same value clicked)
      field.onChange(allowEmpty && newValue === field.value ? null : newValue);
    } else {
      // Multiple selection: pass array of selected values
      field.onChange(newValue);
    }
  };

  return (
    <ToggleGroup
      type={toggleType}
      value={currentValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      size={toggleSize}
      variant={toggleVariant}
      className={cn("justify-start", triggerClassName)}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={String(option.value)}
          disabled={disabled || option.disabled}
          className={cn(
            "flex items-center gap-2", // ✅ Base styles
            toggleItemClassName, // ✅ Your custom item styling!
            option.className // ✅ Per-option custom styles
          )}
        >
          {/* 🎨 Support for icons in options */}
          {option.icon && <span className="w-4 h-4">{option.icon}</span>}
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

// 🔧 Enhanced display mode that handles toggle groups
function renderSelectDisplayMode(
  field,
  { options, placeholder, triggerClassName, type }
) {
  const fieldValue = field.value;

  // 🎯 Handle different value types for toggle groups
  if (type === "toggle-group") {
    return renderToggleDisplayMode(field, {
      options,
      placeholder,
      triggerClassName,
    });
  }

  // 🔄 Rest of your existing display mode logic stays the same
  const hasValue = fieldValue && fieldValue !== "" && fieldValue !== "null";

  if (!hasValue) {
    return (
      <div
        className={`min-h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground italic ${triggerClassName}`}
      >
        {placeholder || "Not selected"}
      </div>
    );
  }

  const selectedOption = options.find(
    (option) => String(option.value) === String(fieldValue)
  );

  if (selectedOption) {
    return (
      <div
        className={`min-h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ${triggerClassName}`}
      >
        <span className="text-foreground">{selectedOption.label}</span>
      </div>
    );
  }

  return (
    <div
      className={`min-h-10 w-full rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm ${triggerClassName}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-destructive">⚠️ Unknown: {fieldValue}</span>
        <span className="text-xs text-muted-foreground">(ID not found)</span>
      </div>
    </div>
  );
}

// 🆕 NEW: Display mode specifically for toggle groups
function renderToggleDisplayMode(
  field,
  { options, placeholder, triggerClassName }
) {
  const fieldValue = field.value;

  // 🔍 Handle array values (multiple selection)
  if (Array.isArray(fieldValue)) {
    if (fieldValue.length === 0) {
      return (
        <div
          className={`min-h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground italic ${triggerClassName}`}
        >
          {placeholder || "No selections"}
        </div>
      );
    }

    // Find all selected options
    const selectedOptions = fieldValue
      .map((value) =>
        options.find((option) => String(option.value) === String(value))
      )
      .filter(Boolean);

    return (
      <div
        className={`min-h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ${triggerClassName}`}
      >
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option, index) => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
            >
              {option.icon && <span className="w-3 h-3">{option.icon}</span>}
              {option.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // 🔍 Handle single value
  if (!fieldValue) {
    return (
      <div
        className={`min-h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground italic ${triggerClassName}`}
      >
        {placeholder || "Not selected"}
      </div>
    );
  }

  const selectedOption = options.find(
    (option) => String(option.value) === String(fieldValue)
  );

  if (selectedOption) {
    return (
      <div
        className={`min-h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ${triggerClassName}`}
      >
        <span className="inline-flex items-center gap-2 text-foreground">
          {selectedOption.icon && (
            <span className="w-4 h-4">{selectedOption.icon}</span>
          )}
          {selectedOption.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`min-h-10 w-full rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm ${triggerClassName}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-destructive">⚠️ Unknown: {fieldValue}</span>
        <span className="text-xs text-muted-foreground">(ID not found)</span>
      </div>
    </div>
  );
}
