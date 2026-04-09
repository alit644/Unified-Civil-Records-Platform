import React from 'react';
import { CitizenFormValues } from "@/lib/schema";
import { Control } from "react-hook-form";
import SectionHeader from "./SectionHeader";
import { FileText, User } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import RHFField from "@/components/FormFieldWrapper";
import { Input } from "@/components/ui/input";

interface PersonalInfoSectionProps {
  control: Control<CitizenFormValues>;
}
const PersonalInfoSection = ({ control }: PersonalInfoSectionProps) => {
  return (
    <>
      {/* 1. الهوية والرقم الوطني */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <SectionHeader
            icon={FileText}
            title="بيانات الهوية"
            subtitle="الرقم الوطني الفريد للمواطن"
            color="blue"
          />
        </div>
        <div className="p-5">
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <RHFField
                  name="nationalId"
                  control={control}
                  label="الرقم الوطني*"
                  render={({ field, fieldState }) => (
                    <Input
                      id="nationalId"
                      type="text"
                      readOnly
                      disabled
                      placeholder="سيتم توليد الرقم الوطني آلياً عند الحفظ"
                      className='disabled:cursor-not-allowed disabled:opacity-50'
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

      {/* 2. البيانات الشخصية */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <SectionHeader
            icon={User}
            title="البيانات الشخصية"
            subtitle="الاسم الكامل وبيانات الوالدين"
            color="emerald"
          />
        </div>
        <div className="p-5">
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <RHFField
                name="firstName"
                control={control}
                label="الاسم الأول*"
                render={({ field, fieldState }) => (
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="أدخل الاسم الأول"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    value={field.value as string | undefined}
                  />
                )}
              />
              <RHFField
                name="lastName"
                control={control}
                label="الكنية / العائلة*"
                render={({ field, fieldState }) => (
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="أدخل الكنية أو اسم العائلة"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    value={field.value as string | undefined}
                  />
                )}
              />
              <RHFField
                name="fatherName"
                control={control}
                label="اسم الأب*"
                render={({ field, fieldState }) => (
                  <Input
                    id="fatherName"
                    type="text"
                    placeholder="أدخل اسم الأب"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    value={field.value as string | undefined}
                  />
                )}
              />
              <RHFField
                name="motherName"
                control={control}
                label="اسم الأم*"
                render={({ field, fieldState }) => (
                  <Input
                    id="motherName"
                    type="text"
                    placeholder="أدخل اسم الأم"
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
    </>
  );
};

export default React.memo(PersonalInfoSection);
