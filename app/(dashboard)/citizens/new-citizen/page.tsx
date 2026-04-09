import NewCitizenForm from "../_components/NewCitizenForm";
import {
  ChevronRight,
} from "lucide-react";

export default function NewCitizenPage() {
  

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6" dir="rtl">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">تسجيل مواطن جديد</h1>
          <p className="text-sm text-muted-foreground">
            أدخل البيانات الكاملة للمواطن كما هي مسجلة في وثائق الهوية الرسمية
          </p>
        </div>
      </div>

    <NewCitizenForm />
    </div>
  );
}