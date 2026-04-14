import { getPublicVerificationData } from "@/actions/citizens";
import { CheckCircle2, XCircle, ShieldCheck, Calendar, Hash, User } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VerifyPageProps {
  params: Promise<{ nationalId: string }>;
  searchParams: Promise<{ doc?: string }>;
}

export default async function VerifyPage({ params, searchParams }: VerifyPageProps) {
  const { nationalId } = await params;
  const { doc } = await searchParams;

  const res = await getPublicVerificationData(nationalId);
  const isValid = res.success && res.data;
  const data = res.data;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Header / Branding */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
             <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900">نظام التحقق الرقمي</h1>
          <p className="text-sm text-zinc-500">الجمهورية العربية السورية - السجل المدني</p>
        </div>

        {isValid ? (
          <Card className="border-t-4 border-t-emerald-500 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <CardTitle className="text-emerald-700 font-black">وثيقة معتمدة وأصلية</CardTitle>
              <p className="text-xs text-zinc-400">تم التحقق من البيانات بنجاح من سجلاتنا المركزية</p>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              {/* تفاصيل المستند */}
              <div className="bg-zinc-100 p-3 rounded-lg flex justify-between items-center border border-zinc-200">
                <div className="flex items-center gap-2">
                   <Hash className="w-4 h-4 text-zinc-400" />
                   <span className="text-xs font-bold text-zinc-600">رقم الوثيقة:</span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-900">{doc || "---"}</span>
              </div>

              {/* بيانات صاحب العلاقة */}
              <div className="space-y-4">
                <div className="border-b pb-3 flex items-start gap-4">
                  <div className="p-2 bg-zinc-100 rounded">
                    <User className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 mb-0.5">الاسم والكنية</p>
                    <p className="text-sm font-bold text-zinc-900">{data?.fullName}</p>
                  </div>
                </div>

                <div className="border-b pb-3 flex items-start gap-4">
                  <div className="p-2 bg-zinc-100 rounded">
                    <Hash className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 mb-0.5">الرقم الوطني</p>
                    <p className="text-sm font-bold text-zinc-900 font-mono tracking-wider">{nationalId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-zinc-100 rounded">
                    <Calendar className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 mb-0.5">تاريخ الولادة</p>
                    <p className="text-sm font-bold text-zinc-900">{data?.birthDate}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed">
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-center">
                  <p className="text-[10px] text-emerald-700 font-bold mb-1">تاريخ التحقق الفعلي</p>
                  <p className="text-xs text-emerald-800 font-mono">{format(new Date(), "yyyy-MM-dd HH:mm:ss")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-t-4 border-t-red-500 shadow-xl">
            <CardHeader className="text-center">
               <div className="flex justify-center mb-2">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <CardTitle className="text-red-700 font-black">فشل التحقق من الوثيقة</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-zinc-600 leading-relaxed">
                هذه الوثيقة غير موجودة في سجلاتنا الرقمية، أو قد يكون الرقم الوطني غير صحيح. يرجى مراجعة أقرب مركز للشؤون المدنية.
              </p>
              <Badge variant="destructive" className="font-mono">{nationalId}</Badge>
            </CardContent>
          </Card>
        )}

        <p className="mt-8 text-center text-[10px] text-zinc-400">
          تنبيه: هذه الصفحة مخصصة لغرض التحقق الرسمي فقط من قبل الجهات المختصة.<br/>
          جميع الحقوق محفوظة © {new Date().getFullYear()} المديرية العامة للشؤون المدنية
        </p>
      </div>
    </div>
  );
}
