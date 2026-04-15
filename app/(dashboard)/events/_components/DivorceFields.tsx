import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, Info, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { registerBirthEvent, registerDivorceEvent, registerMarriageEvent } from "@/actions/event";
import VerifyParentInput from "./VerifyParentInput";
import RHFInput from "@/components/RHFInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventType } from "@/lib/generated/prisma/enums";
import { notify } from "@/lib/notify";
import { divorceFormSchema, DivorceFormValues } from "@/lib/schema";
interface IDivorceForm {
  onSuccess: () => void;
}

const DivorceFields = ({ onSuccess }: IDivorceForm) => {
  const form = useForm<DivorceFormValues>({
    resolver: zodResolver(divorceFormSchema),
    defaultValues: {
      eventType: EventType.DIVORCE,
      groomNationalId: "",
      brideNationalId: "",
      documentNumber: "",
      location: "",
      eventDate: "",
    },
  });

  const [verifiedNames, setVerifiedNames] = useState<{ groom: string; bride: string }>({
    groom: "",
    bride: "",
  });

  // Check if both parents are verified to unlock remaining fields
  const isParentsVerified = !!(verifiedNames.groom && verifiedNames.bride);

  const onSubmit = async (data: DivorceFormValues) => {
    console.log(data);
    try {
      const result = await registerDivorceEvent(data);
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
    <form id="divorce-event-form" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <VerifyParentInput
          control={form.control}
          name="groomNationalId"
          label="الرقم الوطني للزوج"
          gender="MALE"
          onVerifySuccess={(name) => setVerifiedNames((prev) => ({ ...prev, groom: name }))}
          onVerifyClear={() => setVerifiedNames((prev) => ({ ...prev, groom: "" }))}
        />
        <VerifyParentInput
          control={form.control}
          name="brideNationalId"
          label="الرقم الوطني للزوجة"
          gender="FEMALE"
          onVerifySuccess={(name) => setVerifiedNames((prev) => ({ ...prev, bride: name }))}
          onVerifyClear={() => setVerifiedNames((prev) => ({ ...prev, bride: "" }))}
        />
      </div>

      <div className={`space-y-6 transition-all duration-300 ${!isParentsVerified ? "opacity-55 grayscale-[0.5] pointer-events-none select-none blur-[0.3px]" : "opacity-100"}`}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <RHFInput
            control={form.control}
            name="eventDate"
            label="تاريخ الطلاق"
            type="date"
            className="h-9"
            disabled={!isParentsVerified}
            icon={Calendar}
          />
          <RHFInput
            control={form.control}
            name="location"
            label="مكان الطلاق (المحكمة)"
            placeholder="أدخل مكان الطلاق (المحكمة)"
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
              label="رقم صك الطلاق"
              placeholder="أدخل رقم صك الطلاق"
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

export default DivorceFields;