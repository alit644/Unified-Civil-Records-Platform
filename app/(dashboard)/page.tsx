import { metricsData } from "@/components/data";
import { Column, DataTable } from "@/components/DataTable";
import { MetricCard } from "@/components/MetricCard";
import QuickActions from "@/components/QuickActions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const recentEvents = [
  { type: "ولادة", citizen: "ليان محمد العبادي", date: "٢٠/١١/٢٠٢٤", status: "مقبول", employee: "سارة الحسن" },
  { type: "زواج", citizen: "عمر أحمد الشمري", date: "٢٠/١١/٢٠٢٤", status: "بانتظار التدقيق", employee: "م. أحمد" },
  { type: "وفاة", citizen: "خالد يوسف المصري", date: "١٩/١١/٢٠٢٤", status: "مقبول", employee: "نور العلي" },
  { type: "ولادة", citizen: "آدم سامر الرفاعي", date: "١٩/١١/٢٠٢٤", status: "بانتظار التدقيق", employee: "م. أحمد" },
  { type: "طلاق", citizen: "هدى سالم الخطيب", date: "١٨/١١/٢٠٢٤", status: "مقبول", employee: "سارة الحسن" },
];

const typeBadge = (type: string) => {
  const map: Record<string, string> = { ولادة: "badge-blue", زواج: "badge-active", طلاق: "badge-orange", وفاة: "badge-gray" };
  return map[type] || "badge-gray";
};

const columns: Column<typeof recentEvents[0]>[] = [
  {
    key: "type",
    header: "النوع",
    render: (e) => (
      <span className={typeBadge(e.type)}>{e.type}</span>
    ),
  },
  {
    key: "citizen",
    header: "المواطن",
    render: (e) => (
      <span className="font-medium">
        {e.citizen}
      </span>
    ),
  },
  {
    key: "date",
    header: "التاريخ",
    render: (e) => (
      <span className="text-muted-foreground">
        {e.date}
      </span>
    ),
  },
  {
    key: "status",
    header: "الحالة",
    render: (e) => (
      <span className={e.status === "مقبول" ? "badge-active" : "badge-pending"}>{e.status}</span>
    ),
  },
  {
    key: "employee",
    header: "الموظف",
    render: (e) => (
      <span className="text-muted-foreground">
        {e.employee}
      </span>
    ),
  },
]
export default async function Dashboard() {
  // جلب الجلسة باستخدام الـ headers الحالية
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const {user} = session
  const date = format(new Date(), "EEEE، d MMMM yyyy", { locale: ar })
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-bold">أهلاً بك، {user.name} — {date}</h3>
        <p className="text-muted-foreground text-sm mt-1">لديك ٥ معاملات بانتظار المراجعة</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent events */}
        <div className="lg:col-span-2 bg-card rounded-lg border shadow-sm">
          <div className="p-5 border-b">
            <h4 className="font-bold">أحدث الواقعات المسجلة</h4>
          </div>
          <DataTable columns={columns} data={recentEvents} hoverable />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}
