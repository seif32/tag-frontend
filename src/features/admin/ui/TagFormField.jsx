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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
// 🆕 NEW: Import Toggle Group components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CheckCheck, Folder } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function TagFormField({
  control,
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
  const [uploadStatus, setUploadStatus] = useState({
    hasFiles: false,
    fileCount: 0,
    totalSize: 0,
  });

  const [comboboxOpen, setComboboxOpen] = useState(false);

  return (
    <FormField
      control={control}
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
              comboboxOpen,
              setComboboxOpen,
              uploadStatus,
              setUploadStatus,
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
    comboboxOpen,
    setComboboxOpen,
    uploadStatus, // ✅ Extract this!
    setUploadStatus, // ✅ Extract this!
    multiple,
    accept,
    maxFiles,
    maxSize,
    placeholder,
    disabled,
    options,
    rows,
    triggerClassName,
    onBlur,
    emptyMessage,
    toggleType,
    toggleSize,
    toggleVariant,
    toggleItemClassName,
    allowEmpty,
    ...restProps
  } = props;

  // 🎯 ENHANCED: Smart display mode for BOTH select AND toggle-group
  if (
    (type === "select" || type === "toggle-group" || type === "combobox") &&
    disabled
  ) {
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
    case "combobox":
      return renderCombobox(field, {
        options,
        disabled,
        placeholder,
        triggerClassName,
        emptyMessage,
        // 🎯 Pass state from component
        open: comboboxOpen,
        setOpen: setComboboxOpen,
      });

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

    case "switch":
      return (
        <div className={`flex items-center space-x-2 ${triggerClassName}`}>
          <Switch
            id={restProps.id || field.name}
            checked={field.value || false}
            onCheckedChange={field.onChange}
            disabled={disabled}
            {...restProps}
          />
          {placeholder && (
            <label
              htmlFor={restProps.id || field.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {placeholder}
            </label>
          )}
        </div>
      );

    case "file":
    case "image-upload":
      return renderFileUpload(field, {
        uploadStatus, // ✅ Extract this!
        setUploadStatus, // ✅ Extract this!
        multiple,
        accept,
        maxFiles,
        maxSize,
        placeholder,
        disabled,
        triggerClassName,
        multiple: restProps.multiple || false,
        accept: restProps.accept || "image/*",
        maxFiles: restProps.maxFiles || 1,
        maxSize: restProps.maxSize || 5 * 1024 * 1024, // 5MB default
        ...restProps,
      });

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

function renderCombobox(
  field,
  {
    options,
    disabled,
    placeholder,
    triggerClassName,
    emptyMessage,
    open, // 🎯 Receive from props
    setOpen, // 🎯 Receive from props
  }
) {
  const selectedOption = options.find(
    (option) => String(option.value) === String(field.value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedOption && "text-muted-foreground",
            triggerClassName
          )}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        side="up" // 🎯 Controls which side it appears
        sideOffset={4} // 🎯 Distance from trigger
        alignOffset={0} // 🎯 Offset along alignment axis
        avoidCollisions={true} // 🎯 Auto-reposition when needed
      >
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder?.toLowerCase() || "options"}...`}
          />
          <CommandEmpty>{emptyMessage || "No options found."}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => {
                  field.onChange(String(option.value));
                  setOpen(false);
                }}
                disabled={option.disabled}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    String(field.value) === String(option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ✅ Updated renderFileUpload - receives state as props
function renderFileUpload(field, props) {
  const {
    uploadStatus,
    setUploadStatus,
    placeholder,
    disabled,
    multiple,
    accept,
    triggerClassName,
    maxFiles,
    maxSize,
  } = props;

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const totalSize = fileList.reduce((sum, file) => sum + file.size, 0);

      // ✅ Use state setter from props
      setUploadStatus({
        hasFiles: true,
        fileCount: fileList.length,
        totalSize: totalSize,
      });

      field.onChange(multiple ? fileList : fileList[0]);
    } else {
      setUploadStatus({
        hasFiles: false,
        fileCount: 0,
        totalSize: 0,
      });
      field.onChange(null);
    }
  };

  return (
    <div className="">
      <Input
        type="file"
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        className={`file:bg-primary file:text-primary-foreground file:px-4 file:rounded-md border-0 p-0 bg-transparent shadow-none hover:file:bg-primary/90 ${triggerClassName}`}
      />

      {/* ✅ Display upload status */}
      <div className="text-sm">
        {uploadStatus.hasFiles ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCheck color="green" />
            <span>
              {uploadStatus.fileCount} file(s) uploaded (
              {(uploadStatus.totalSize / 1024).toFixed(1)} KB)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <Folder size={16} />
            <span>No files uploaded yet</span>
          </div>
        )}
      </div>
    </div>
  );
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
