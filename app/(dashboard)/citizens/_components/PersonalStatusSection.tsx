import { CitizenFormValues } from "@/lib/schema";
import { Control } from "react-hook-form";
import SectionHeader from "./SectionHeader";
import { FieldGroup } from "@/components/ui/field";
import RHFField from "@/components/FormFieldWrapper";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { citizenStatusOptions, genderOptions, maritalStatusOptions } from "@/lib/constants";
import { RHFSelect } from "@/components/SelectWrapper";
import React from "react";

interface PersonalStatusSectionProps {
  control: Control<CitizenFormValues>;
}
const PersonalStatusSection = ({ control }: PersonalStatusSectionProps) => {
  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <SectionHeader
              icon={Heart}
              title="الحالة الشخصية"
              subtitle="الجنس والحالة الاجتماعية والمعلومات الأخرى"
              color="rose"
            />
          </div>
          <div className="p-5">
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RHFSelect
                  name="gender"
                  control={control}
                  label="الجنس"
                  placeholder="اختر الجنس"
                  options={genderOptions}
                />
                <RHFSelect
                  name="maritalStatus"
                  control={control}
                  label="الحالة الاجتماعية"
                  placeholder="اختر الحالة الاجتماعية"
                  options={maritalStatusOptions}
                />
                <RHFSelect
                  name="status"
                  control={control}
                  label="حالة المواطن"
                  placeholder="اختر الحالة"
                  options={citizenStatusOptions}
                />
                <RHFField
                  name="religion"
                  control={control}
                  label="الديانة (اختياري)"
                  render={({ field, fieldState }) => (
                    <Input
                      id="religion"
                      type="text"
                      placeholder="أدخل الديانة"
                      aria-invalid={fieldState.invalid}
                      {...field}
                      value={field.value as string | undefined}
                    />
                  )}
                />
                <div className="sm:col-span-2">
                  <RHFField
                    name="currentAddress"
                    control={control}
                    label="العنوان الحالي (اختياري)"
                    render={({ field, fieldState }) => (
                      <Input
                        id="currentAddress"
                        type="text"
                        placeholder="أدخل العنوان الحالي"
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
  )
};

export default React.memo(PersonalStatusSection);
