import { X, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  eventTypes: { label: string; icon: LucideIcon }[];
}

const Drawer = ({ isOpen, onClose, selectedType, setSelectedType, eventTypes }: DrawerProps) => {
  if (!isOpen) return null;

  const renderFields = (type: string) => {
    switch (type) {
      case "ولادة":
        return (
          <>
            <InputField label="اسم المولود" placeholder="أدخل اسم المولود الكامل" />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="تاريخ الولادة" placeholder="يوم/شهر/سنة" />
              <div>
                <Label className="block text-xs text-muted-foreground mb-1.5">الجنس</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <InputField label="مكان الولادة" placeholder="المستشفى أو المكان" />
            <InputField label="بحث عن الأب" placeholder="ابحث بالاسم أو الرقم الوطني" />
            <InputField label="بحث عن الأم" placeholder="ابحث بالاسم أو الرقم الوطني" />
          </>
        );
      case "زواج":
        return (
          <>
            <InputField label="بحث عن الزوج" placeholder="ابحث بالاسم أو الرقم الوطني" />
            <InputField label="بحث عن الزوجة" placeholder="ابحث بالاسم أو الرقم الوطني" />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="تاريخ الزواج" placeholder="يوم/شهر/سنة" />
              <InputField label="رقم الوثيقة" placeholder="أدخل رقم الوثيقة" />
            </div>
            <InputField label="مكان الزواج" placeholder="المدينة أو المكان" />
          </>
        );
      case "طلاق":
        return (
          <>
            <InputField label="بحث عن الزوج" placeholder="ابحث بالاسم أو الرقم الوطني" />
            <InputField label="بحث عن الزوجة" placeholder="ابحث بالاسم أو الرقم الوطني" />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="تاريخ الطلاق" placeholder="يوم/شهر/سنة" />
              <InputField label="رقم حكم المحكمة" placeholder="أدخل رقم الحكم" />
            </div>
          </>
        );
      case "وفاة":
        return (
          <>
            <InputField label="بحث عن المتوفى" placeholder="ابحث بالاسم أو الرقم الوطني" />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="تاريخ الوفاة" placeholder="يوم/شهر/سنة" />
              <InputField label="مكان الوفاة" placeholder="المستشفى أو المكان" />
            </div>
            <InputField label="سبب الوفاة" placeholder="أدخل سبب الوفاة" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-foreground/30" onClick={onClose} />
      <div className="w-full max-w-md bg-card shadow-xl border-r overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">تسجيل واقعة مدنية جديدة</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm font-medium mb-3">نوع الواقعة</p>
            <div className="grid grid-cols-2 gap-3">
              {eventTypes.map((et) => (
                <button
                  key={et.label}
                  onClick={() => setSelectedType(et.label)}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${selectedType === et.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}
                >
                  <et.icon className={`w-6 h-6 mx-auto mb-2 ${selectedType === et.label ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">{et.label}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedType && (
            <div className="space-y-4">
              <p className="text-sm font-medium">بيانات الواقعة</p>
              {renderFields(selectedType)}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button className="flex-1">إرسال للتدقيق</Button>
            <Button variant="outline" onClick={onClose} className="flex-1">إلغاء</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <Label className="block text-xs text-muted-foreground mb-1.5">{label}</Label>
      <Input placeholder={placeholder} />
    </div>
  );
}

export default Drawer;
