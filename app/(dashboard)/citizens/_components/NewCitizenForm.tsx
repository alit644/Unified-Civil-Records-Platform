"use client";
import {
  Save,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonalInfoSection from "./PersonalInfoSection";
import BirthDetailsSection from "./BirthDetailsSection";
import RegistryDetailsSection from "./RegistryDetailsSection";
import PersonalStatusSection from "./PersonalStatusSection";
import { useCitizenForm } from "@/hooks/useCitizenForm";

interface CitizenFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

const NewCitizenForm = ({ initialData, onSuccess }: CitizenFormProps) => {
  const { control, handleSubmit, reset, isSubmitting, onSubmit, isEditMode } = useCitizenForm({ initialData, onSuccess })
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* 1. البيانات الشخصية */}
        <PersonalInfoSection control={control} />
        {/* 3. تفاصيل الولادة */}
        <BirthDetailsSection control={control} isEditMode={isEditMode} />
        {/* 4. تفاصيل القيد */}
        <RegistryDetailsSection control={control} isEditMode={isEditMode} />
        {/* 5. الحالة الشخصية */}
        <PersonalStatusSection control={control} isEditMode={isEditMode} />
        {/* action buttons */}
        <div className="flex items-center justify-end gap-3 rounded-2xl border bg-card p-4 shadow-sm">
          {
            isEditMode ? (<>
              <Button type="submit" disabled={isSubmitting} className="w-full" size={"lg"}>
                <Save className="size-4" />
                {isSubmitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
              </Button>
            </>) : (<>
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={isSubmitting}
                className="gap-2"
                size={"lg"}
              >
                <RotateCcw className="size-4" />
                إعادة تعيين
              </Button>

              <Button type="submit" disabled={isSubmitting} className="gap-2" size={"lg"}>
                <Save className="size-4" />
                {isSubmitting ? "جارٍ الحفظ..." : "حفظ المواطن"}
              </Button>
            </>
            )
          }

        </div>
      </form>
    </div>
  );
};

export default NewCitizenForm;
