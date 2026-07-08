import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, Info, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { registerBirthEvent, registerMarriageEvent } from "@/actions/event";
import VerifyParentInput from "./VerifyParentInput";
import RHFInput from "@/components/RHFInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventType } from "@/lib/generated/prisma/enums";
import { notify } from "@/lib/notify";
import RHFField from "@/components/FormFieldWrapper";
import { marriageFormSchema, MarriageFormValues } from "@/lib/schema";
interface IMarriageRegistrationFilds {
  onSuccess: () => void;
}

const MarriageRegistrationFilds = ({ onSuccess }: IMarriageRegistrationFilds) => {
  const form = useForm<MarriageFormValues>({
    resolver: zodResolver(marriageFormSchema),
    defaultValues: {
      eventType: EventType.MARRIAGE,
      groomNationalId: "",
      brideNationalId: "",
      documentNumber: "",
      location: "",
      eventDate: "",
    },
  });

  const [verifiedNames, setVerifiedNames] = useState<{ father: string; mother: string }>({
    father: "",
    mother: "",
  });

  // Check if both parents are verified to unlock remaining fields
  const isParentsVerified = !!(verifiedNames.father && verifiedNames.mother);

  const onSubmit = async (data: MarriageFormValues) => {
    try {
      const result = await registerMarriageEvent(data);
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
    <form id="marriage-event-form" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <VerifyParentInput
          control={form.control}
          name="groomNationalId"
          label="الرقم الوطني للعريس"
          gender="MALE"
          onVerifySuccess={(name) => setVerifiedNames((prev) => ({ ...prev, father: name }))}
          onVerifyClear={() => setVerifiedNames((prev) => ({ ...prev, father: "" }))}
        />
        <VerifyParentInput
          control={form.control}
          name="brideNationalId"
          label="الرقم الوطني للعروس"
          gender="FEMALE"
          onVerifySuccess={(name) => setVerifiedNames((prev) => ({ ...prev, mother: name }))}
          onVerifyClear={() => setVerifiedNames((prev) => ({ ...prev, mother: "" }))}
        />
      </div>

      <div className={`space-y-6 transition-all duration-300 ${!isParentsVerified ? "opacity-55 grayscale-[0.5] pointer-events-none select-none blur-[0.3px]" : "opacity-100"}`}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <RHFInput
            control={form.control}
            name="eventDate"
            label="تاريخ عقد الزواج"
            type="date"
            className="h-9"
            disabled={!isParentsVerified}
            icon={Calendar}
          />
          <RHFInput
            control={form.control}
            name="location"
            label="مكان العقد (المحكمة)"
            placeholder="أدخل مكان العقد (المحكمة)"
            className="h-9"
            disabled={!isParentsVerified}
            icon={Info}
          />
        </div>
        <section className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h4 className="font-semibold text-sm">بيانات التوثيق الإداري</h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
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

export default MarriageRegistrationFilds;