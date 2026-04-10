import { CitizenFormValues } from "@/lib/schema";
import { Control } from "react-hook-form";
import SectionHeader from "./SectionHeader";
import { FieldGroup } from "@/components/ui/field";
import RHFField from "@/components/FormFieldWrapper";
import { Input } from "@/components/ui/input";
import { BookOpen } from "lucide-react";
import React from "react";

interface RegistryDetailsSectionProps {
  control: Control<CitizenFormValues>;
  isEditMode: boolean;
}
const RegistryDetailsSection = ({ control, isEditMode }: RegistryDetailsSectionProps) => {
  return (
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <div className="p-5 border-b">
                <SectionHeader
                  icon={BookOpen}
                  title="تفاصيل القيد المدني"
                  subtitle="بيانات القيد في السجل المدني"
                  color="amber"
                />
              </div>
              <div className="p-5">
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <RHFField
                      name="registryPlace"
                      control={control}
                      label="أمانة / مكان القيد*"
                      render={({ field, fieldState }) => (
                        <Input
                          id="registryPlace"
                          type="text"
                          disabled={isEditMode}
                          readOnly={isEditMode}
                          className={isEditMode ? "bg-muted cursor-not-allowed opacity-70" : ""}
                          placeholder="المديرية أو الأمانة"
                          aria-invalid={fieldState.invalid}
                          {...field}
                          value={field.value as string | undefined}
                        />
                      )}
                    />
                    <RHFField
                      name="registryNumber"
                      control={control}
                      label="رقم القيد (الخانة)*"
                      render={({ field, fieldState }) => (
                        <Input
                          id="registryNumber"
                          type="text"
                          disabled={isEditMode}
                          readOnly={isEditMode}
                          className={isEditMode ? "bg-muted cursor-not-allowed opacity-70" : ""}
                          placeholder="أدخل رقم القيد"
                          aria-invalid={fieldState.invalid}
                          {...field}
                          value={field.value as string | undefined}
                        />
                      )}
                    />
                    <div className="sm:col-span-2">
                      <RHFField
                        name="familyBookId"
                        control={control}
                        label="رقم دفتر العائلة (اختياري)"
                        render={({ field, fieldState }) => (
                          <Input
                            id="familyBookId"
                            type="text"
                            disabled={isEditMode}
                            readOnly={isEditMode}
                            className={isEditMode ? "bg-muted cursor-not-allowed opacity-70" : ""}
                            placeholder="أدخل رقم دفتر العائلة إن وُجد"
                            aria-invalid={fieldState.invalid}
                            {...field}
                            value={field.value as string | undefined}
                          />
                        )}
                      />
                    </div>
                  </div>
                </FieldGroup>
              </div>
            </div>
  );
}

export default React.memo(RegistryDetailsSection);
