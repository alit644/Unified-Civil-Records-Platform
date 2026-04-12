import prisma from "@/lib/db";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ArrowRight, Calendar, MapPin, FileText, User, UserPlus, Info, History } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";
import EventApprovalActions from "../_components/EventApprovalActions";
import { StatePlaceholder } from "@/components/shared/StatePlaceholder";
import { Search } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const event = await prisma.civilEvent.findUnique({
    where: { eventNumber: id },
    include: {
      primaryCitizen: {
        include: {
          father: true,
          mother: true,
        }
      },
      secondaryCitizen: true,
      employee: true,
    },
  });

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <StatePlaceholder
          title="عذراً، الواقعة غير موجودة"
          description={`لم نتمكن من العثور على أي بيانات مرتبطة بالرقم المرجعي ${id}. يرجى التأكد من صحة الرقم والمحاولة مرة أخرى.`}
          icon={Search}
          variant="empty"
          action={{
            label: "العودة لقائمة الوقائع",
            icon: ArrowRight,
            href: "/events",
          }}
        />
      </div>
    );
  }

  const details = [
    { label: "رقم الواقعة", value: event.eventNumber, icon: HashIcon },
    { label: "تاريخ الحدوث", value: format(event.eventDate, "dd MMMM yyyy", { locale: ar }), icon: Calendar },
    { label: "تاريخ التسجيل", value: format(event.registrationDate, "dd MMMM yyyy", { locale: ar }), icon: Info },
    { label: "مكان الحدوث", value: event.location || "غير محدد", icon: MapPin },
    { label: "رقم الوثيقة المرجعية", value: event.documentNumber || "غير متوفر", icon: FileText },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/events" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">تدقيق واقعة {event.eventNumber}</h1>
              <StatusBadge value={event.status} category="event_status" />
            </div>
            <p className="text-xs text-muted-foreground">بواسطة الموظف: {event.employee.name}</p>
          </div>
        </div>

        <EventApprovalActions 
            eventId={event.id} 
            currentStatus={event.status} 
            userRole={session?.user.role || "GUEST"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Info Card */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">تفاصيل الواقعة القانونية</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {details.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="mt-1">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-0.5">{item.label}</label>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
              <div className="md:col-span-2 flex gap-3 p-3 bg-muted/20 rounded-lg italic">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold not-italic ml-1">ملاحظات الإدخال:</span>
                  {event.notes || "لا توجد ملاحظات إضافية."}
                </p>
              </div>
            </div>
          </div>

          {/* Involved Citizens Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 pr-2">
              <UserPlus className="w-5 h-5 text-primary" />
              الأطراف المعنية
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CitizenCard
                title={getPrimaryLabel(event.eventType)}
                citizen={event.primaryCitizen}
                isPrimary
              />
              {event.secondaryCitizen && (
                <CitizenCard
                  title={getSecondaryLabel(event.eventType)}
                  citizen={event.secondaryCitizen}
                />
              )}
            </div>

            {event.eventType === "BIRTH" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-dashed">
                <div className="md:col-span-2 text-xs font-bold text-muted-foreground pr-2">معلومات الوالدين (الربط العائلي)</div>
                <CitizenCard title="الأب" citizen={event.primaryCitizen.father} />
                <CitizenCard title="الأم" citizen={event.primaryCitizen.mother} />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-3">
              <History className="w-4 h-4 text-primary" />
              مسار الواقعة
            </h3>
            <div className="space-y-5 relative before:absolute before:right-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
              <div className="relative pr-6">
                <div className="absolute right-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-primary bg-white z-10" />
                <p className="text-xs font-bold">تقديم الطلب</p>
                <p className="text-[10px] text-muted-foreground">{format(event.registrationDate, "p - dd/MM/yyyy", { locale: ar })}</p>
                <p className="text-[10px] text-muted-foreground mt-1">بواسطة: {event.employee.name}</p>
              </div>

              {event.status !== "PENDING" && (
                <div className="relative pr-6">
                  <div className={`absolute right-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${event.status === "APPROVED" ? "border-green-500" : "border-red-500"} bg-white z-10`} />
                  <p className="text-xs font-bold">{event.status === "APPROVED" ? "تم الاعتماد النهائي" : "تم الرفض"}</p>
                  {event.finalDate && (
                    <p className="text-[10px] text-muted-foreground">{format(event.finalDate, "p - dd/MM/yyyy", { locale: ar })}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              هذا النظام مصمم لتدقيق البيانات المدنية بدقة فائقة. يرجى التأكد من مطابقة الوثيقة الورقية للبيانات المدخلة قبل الاعتماد.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HashIcon(props: any) {
  return <span {...props} className="font-bold text-[10px] opacity-40">#</span>;
}

function CitizenCard({ title, citizen, isPrimary }: { title: string, citizen: any, isPrimary?: boolean }) {
  if (!citizen) return null;

  return (
    <div className={`p-4 rounded-xl border bg-card shadow-sm transition-all ${isPrimary ? "ring-1 ring-primary/20 border-primary/20" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{title}</span>
        <User className={`w-4 h-4 ${isPrimary ? "text-primary" : "text-muted-foreground opacity-50"}`} />
      </div>
      <div className="space-y-2">
        <p className="font-bold text-sm leading-none">{citizen.firstName} {citizen.lastName}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
            {citizen.nationalId}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2 text-[10px] text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>السجل: {citizen.registryPlace} / {citizen.registryNumber}</span>
        </div>
      </div>
    </div>
  );
}

function getPrimaryLabel(type: string) {
  switch (type) {
    case "BIRTH": return "المولود";
    case "MARRIAGE": return "الزوج";
    case "DIVORCE": return "المطلق";
    case "DEATH": return "المتوفى";
    default: return "الطرف الرئيسي";
  }
}

function getSecondaryLabel(type: string) {
  switch (type) {
    case "MARRIAGE": return "الزوجة";
    case "DIVORCE": return "المطلقة";
    case "DEATH": return "الشريك (أرمل)";
    default: return "الطرف الثانوي";
  }
}
