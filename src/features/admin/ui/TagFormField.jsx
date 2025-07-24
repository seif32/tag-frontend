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
export default function TagFormField({
  name,
  label,
  type = "text",
  placeholder = "",
  description = "",
  className = "",

  // ✅ NEW: Specific className for the actual input/select trigger
  triggerClassName = "",

  required = false,
  disabled = false,
  options = [],
  rows = 3,
  ...inputProps
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="text-sm font-medium leading-none ">
              {label}
            </FormLabel>
          )}

          {description && (
            <FormDescription className="text-xs leading-none  text-muted-foreground">
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
              triggerClassName, // ✅ Pass it to renderFieldByType
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
    ...restProps
  } = props;

  switch (type) {
    case "textarea":
      return (
        <Textarea
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={triggerClassName} // ✅ Apply to textarea
          {...field}
          {...restProps}
        />
      );

    case "select":
      return (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={disabled}
        >
          <SelectTrigger className={`w-full ${triggerClassName}`}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
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
          className={triggerClassName} // ✅ Apply to input
          {...field}
          {...restProps}
        />
      );
  }
}
