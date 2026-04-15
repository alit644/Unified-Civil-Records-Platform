import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, Info, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { registerBirthEvent } from "@/actions/event";
import VerifyParentInput from "./VerifyParentInput";
import RHFInput from "@/components/RHFInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventType } from "@/lib/generated/prisma/enums";
import { notify } from "@/lib/notify";
import RHFField from "@/components/FormFieldWrapper";
import { BirthEventFormValues, birthEventSchema } from "@/lib/schema";
interface IBirthFields {
  onSuccess: () => void;
}

const BirthFields = ({ onSuccess }: IBirthFields) => {
  const form = useForm<BirthEventFormValues>({
    resolver: zodResolver(birthEventSchema),
    defaultValues: {
      eventType: EventType.BIRTH,
      documentNumber: "",
      location: "",
      notes: "",
      babyFirstName: "",
      birthDate: "",
      placeOfBirth: "",
      fatherNationalId: "",
      motherNationalId: "",
    },
  });

  const [verifiedNames, setVerifiedNames] = useState<{ father: string; mother: string }>({
    father: "",
    mother: "",
  });

  // Check if both parents are verified to unlock remaining fields
  const isParentsVerified = !!(verifiedNames.father && verifiedNames.mother);

  const onSubmit = async (data: BirthEventFormValues) => {
    try {
      const result = await registerBirthEvent(data);
      if (result.success) {
        notify(result.message, "success");
        onSuccess();
      } else {
        notify(result.message, "error");
      }
    } catch (error: any) {
      console.error(error.message);
      notify(error.message, "error");
    }
  };

  return (
    <form id="birth-event-form" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <VerifyParentInput
          control={form.control}
          name="fatherNationalId"
          label="الرقم الوطني للأب"
          gender="MALE"
          onVerifySuccess={(name) => setVerifiedNames((prev) => ({ ...prev, father: name }))}
          onVerifyClear={() => setVerifiedNames((prev) => ({ ...prev, father: "" }))}
        />
        <VerifyParentInput
          control={form.control}
          name="motherNationalId"
          label="الرقم الوطني للأم"
          gender="FEMALE"
          onVerifySuccess={(name) => setVerifiedNames((prev) => ({ ...prev, mother: name }))}
          onVerifyClear={() => setVerifiedNames((prev) => ({ ...prev, mother: "" }))}
        />
      </div>

      <div className={`space-y-6 transition-all duration-300 ${!isParentsVerified ? "opacity-55 grayscale-[0.5] pointer-events-none select-none blur-[0.3px]" : "opacity-100"}`}>
        <RHFInput
          control={form.control}
          name="babyFirstName"
          label="اسم المولود"
          placeholder="أدخل الاسم الأول للمولود"
          className="h-9"
          disabled={!isParentsVerified}
          icon={Info}
        />
        <div className="grid grid-cols-2 gap-3">
          <RHFInput
            control={form.control}
            name="birthDate"
            label="تاريخ الولادة"
            type="date"
            className="h-9"
            disabled={!isParentsVerified}
            icon={Calendar}
          />
          <RHFField
            control={form.control}
            name="babyGender"
            label="الجنس"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isParentsVerified}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="اختر الجنس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">ذكر</SelectItem>
                  <SelectItem value="FEMALE">أنثى</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <RHFInput
            control={form.control}
            name="placeOfBirth"
            label="مكان الولادة (المدينة)"
            placeholder="مثال: حمص - بابا عمر"
            className="h-9"
            disabled={!isParentsVerified}
            icon={MapPin}
          />
          <RHFInput
            control={form.control}
            name="location"
            label="موقع الولادة (المستشفى)"
            placeholder="مثال: مستشفى التوليد"
            className="h-9"
            disabled={!isParentsVerified}
            icon={MapPin}
          />
        </div>

        <section className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h4 className="font-semibold text-sm">بيانات التوثيق الإداري</h4>
          </div>
          <div className="grid grid-cols gap-3">
            <RHFInput
              control={form.control}
              name="documentNumber"
              label="رقم الوثيقة"
              placeholder="الشهادة الورقية"
              className="h-9"
              disabled={!isParentsVerified}
              icon={FileText}
            />
          </div>
        </section>

        {!isParentsVerified && (
          <p className="text-[11px] text-muted-foreground text-center bg-muted/30 py-2 rounded-md border border-dashed animate-pulse">
            يرجى التحقق من الرقم الوطني للأب والأم لفتح باقي الحقول
          </p>
        )}
      </div>
    </form>
  );
};

export default BirthFields;