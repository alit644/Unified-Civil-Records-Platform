"use client";
import RHFField from "@/components/FormFieldWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Hash, Loader2, UserCheck } from "lucide-react";
import { useState } from "react";
import { verifyParentId } from "@/actions/event";
import { Control, FieldValues, Path } from "react-hook-form";

interface VerifyParentInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  gender?: "MALE" | "FEMALE" | "ANY";
  onVerifySuccess: (name: string) => void;
  onVerifyClear: () => void;
}

const VerifyParentInput = <T extends FieldValues>({
  control,
  name,
  label,
  gender,
  onVerifySuccess,
  onVerifyClear,
}: VerifyParentInputProps<T>) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerify = async (value: string) => {
    if (!value || value.length !== 11) {
      setErrorMessage("يرجى إدخال 11 رقم");
      return;
    }

    setIsVerifying(true);
    setVerifiedName("");
    setErrorMessage("");
    onVerifyClear();

    try {
      const res = await verifyParentId(value, gender);
      if (res.success) {
        setVerifiedName(res.name || "");
        onVerifySuccess(res.name || "");
      } else {
        setErrorMessage(res.message || "فشل التحقق");
      }
    } catch (error) {
      setErrorMessage("حدث خطأ في الاتصال");
    } finally {
      setIsVerifying(false);
    }
  };

  const clearFeedback = () => {
    if (verifiedName || errorMessage) {
      setVerifiedName("");
      setErrorMessage("");
      onVerifyClear();
    }
  };

  return (
    <RHFField
      control={control}
      name={name}
      label={label}
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
                clearFeedback();
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isVerifying}
              onClick={() => handleVerify(field.value)}
              className="absolute left-1 top-1/2 -translate-y-1/2 h-7 text-[10px] px-2 hover:bg-primary/10 hover:text-primary transition-all"
            >
              {isVerifying ? <Loader2 className="w-3 h-3 animate-spin" /> : "تحقق"}
            </Button>
          </div>
          {verifiedName && (
            <div className="flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
              <UserCheck className="w-3.5 h-3.5 text-green-600" />
              <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 italic">
                {verifiedName}
              </span>
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-3.5 h-3.5 text-destructive" />
              <span className="text-[11px] font-medium text-destructive bg-destructive/5 px-2 py-0.5 rounded-full border border-destructive/10 italic">
                {errorMessage}
              </span>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default VerifyParentInput;
