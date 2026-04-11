import RHFField from "@/components/FormFieldWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues } from "@/lib/schema";
import { AlertCircle, Calendar, CheckCircle2, FileText, Hash, Info, Loader2, MapPin, UserCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { verifyParentId } from "@/actions/event";
import RHFInput from "@/components/RHFInput";

interface IBirthFields {
  form: UseFormReturn<FormValues>;
}

const BirthFields = ({ form }: IBirthFields) => {
  const [isVerifying, setIsVerifying] = useState<{ father: boolean; mother: boolean }>({
    father: false,
    mother: false,
  });

  const [verifiedNames, setVerifiedNames] = useState<{ father: string; mother: string }>({
    father: "",
    mother: "",
  });

  const [errorMessages, setErrorMessages] = useState<{ father: string; mother: string }>({
    father: "",
    mother: "",
  });

  // Check if both parents are verified to unlock remaining fields
  const isParentsVerified = !!(verifiedNames.father && verifiedNames.mother);

  const handleVerify = async (role: "father" | "mother") => {
    const fieldName = role === "father" ? "fatherNationalId" : "motherNationalId";
    const gender = role === "father" ? "MALE" : "FEMALE";
    const nationalId = form.getValues(fieldName);

    if (!nationalId || nationalId.length !== 11) {
      setErrorMessages(prev => ({ ...prev, [role]: "يرجى إدخال 11 رقم" }));
      return;
    }

    setIsVerifying((prev) => ({ ...prev, [role]: true }));
    setVerifiedNames((prev) => ({ ...prev, [role]: "" }));
    setErrorMessages(prev => ({ ...prev, [role]: "" }));

    try {
      const res = await verifyParentId(nationalId, gender);
      if (res.success) {
        setVerifiedNames((prev) => ({ ...prev, [role]: res.name || "" }));
      } else {
        setErrorMessages(prev => ({ ...prev, [role]: res.message || "فشل التحقق" }));
      }
    } catch (error) {
      setErrorMessages(prev => ({ ...prev, [role]: "حدث خطأ في الاتصال" }));
    } finally {
      setIsVerifying((prev) => ({ ...prev, [role]: false }));
    }
  };

  const clearFeedback = (role: "father" | "mother") => {
    if (verifiedNames[role] || errorMessages[role]) {
      setVerifiedNames(prev => ({ ...prev, [role]: "" }));
      setErrorMessages(prev => ({ ...prev, [role]: "" }));
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Father Field */}
        <RHFField
          control={form.control}
          name="fatherNationalId"
          label="الرقم الوطني للأب"
          render={({ field }) => (
            <div className="space-y-1">
              <div className="relative group">
                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  {...field}
                  placeholder="أدخل 11 رقم"
                  className="pr-9 pl-16 h-9"
                  onChange={(e) => {
                    field.onChange(e);
                    clearFeedback("father");
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isVerifying.father}
                  onClick={() => handleVerify("father")}
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-7 text-[10px] px-2 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  {isVerifying.father ? <Loader2 className="w-3 h-3 animate-spin" /> : "تحقق"}
                </Button>
              </div>
              {verifiedNames.father && (
                <div className="flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <UserCheck className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 italic">
                    {verifiedNames.father}
                  </span>
                </div>
              )}
              {errorMessages.father && (
                <div className="flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  <span className="text-[11px] font-medium text-destructive bg-destructive/5 px-2 py-0.5 rounded-full border border-destructive/10 italic">
                    {errorMessages.father}
                  </span>
                </div>
              )}
            </div>
          )}
        />

        {/* Mother Field */}
        <RHFField
          control={form.control}
          name="motherNationalId"
          label="الرقم الوطني للأم"
          render={({ field }) => (
            <div className="space-y-1">
              <div className="relative group">
                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  {...field}
                  placeholder="أدخل 11 رقم"
                  className="pr-9 pl-16 h-9"
                  onChange={(e) => {
                    field.onChange(e);
                    clearFeedback("mother");
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isVerifying.mother}
                  onClick={() => handleVerify("mother")}
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-7 text-[10px] px-2 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  {isVerifying.mother ? <Loader2 className="w-3 h-3 animate-spin" /> : "تحقق"}
                </Button>
              </div>
              {verifiedNames.mother && (
                <div className="flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <UserCheck className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 italic">
                    {verifiedNames.mother}
                  </span>
                </div>
              )}
              {errorMessages.mother && (
                <div className="flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  <span className="text-[11px] font-medium text-destructive bg-destructive/5 px-2 py-0.5 rounded-full border border-destructive/10 italic">
                    {errorMessages.mother}
                  </span>
                </div>
              )}
            </div>
          )}
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
    </>
  );
};

export default BirthFields;