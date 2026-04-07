/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  type Path,
  type Control,
  type FieldValues,
  type ControllerFieldState,
} from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type RHFFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  htmlFor?: string;
  description?: React.ReactNode;
  render?: (props: {
    field: any;
    fieldState: ControllerFieldState;
  }) => React.ReactNode;
};

const RHFField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  render,
}: RHFFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          {render?.({ field, fieldState })}
          {fieldState.error?.message && (
            <FieldError errors={[fieldState.error]} />
          )}
          {description && (
            <FieldDescription className="flex items-center gap-2">
              <span className="text-primary/70">•</span>
              {description}
            </FieldDescription>
          )}
        </Field>
      )}
    />
  );
};

export default RHFField;
