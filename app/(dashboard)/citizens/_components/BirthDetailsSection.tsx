import { CitizenFormValues } from "@/lib/schema";
import { Control } from "react-hook-form";
import SectionHeader from "./SectionHeader";
import { FieldGroup } from "@/components/ui/field";
import RHFField from "@/components/FormFieldWrapper";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import React from "react";

interface BirthDetailsSectionProps {
  control: Control<CitizenFormValues>;
}
const BirthDetailsSection = ({ control }: BirthDetailsSectionProps) => {
  return (
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <div className="p-5 border-b">
                <SectionHeader
                  icon={MapPin}
                  title="تفاصيل الولادة"
                  subtitle="مكان وتاريخ الميلاد"
                  color="violet"
                />
              </div>
              <div className="p-5">
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <RHFField
                      name="placeOfBirth"
                      control={control}
                      label="مكان الولادة*"
                      render={({ field, fieldState }) => (
                        <Input
                          id="placeOfBirth"
                          type="text"
                          placeholder="المدينة / المحافظة"
                          aria-invalid={fieldState.invalid}
                          {...field}
                          value={field.value as string | undefined}
                        />
                      )}
                    />
                    <RHFField
                      name="dateOfBirth"
                      control={control}
                      label="تاريخ الولادة*"
                      render={({ field, fieldState }) => (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          aria-invalid={fieldState.invalid}
                          {...field}
                          value={field.value as string | undefined}
                        />
                      )}
                    />
                  </div>
                </FieldGroup>
              </div>
            </div>
  );
}

export default React.memo(BirthDetailsSection);
