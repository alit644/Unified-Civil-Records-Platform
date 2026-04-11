import { Control, FieldValues, Path } from "react-hook-form";
import RHFField from "./FormFieldWrapper";
import { Input } from "./ui/input";
import { ComponentProps } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RHFInputProps<T extends FieldValues> extends ComponentProps<typeof Input> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
}

const RHFInput = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  icon: Icon,
  className,
  ...inputProps
}: RHFInputProps<T>) => {
  return (
    <RHFField
      control={control}
      name={name}
      label={label}
      description={description}
      render={({ field }) => (
        <div className="relative group">
          {Icon && (
            <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          )}
          <Input
            {...field}
            {...inputProps}
            value={field.value ?? ""}
            className={cn(Icon && "pr-9", className)}
          />
        </div>
      )}
    />
  );
};

export default RHFInput;