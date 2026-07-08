import { Column, DataTable } from "@/components/DataTable";
import { MetricCard } from "@/components/MetricCard";
import QuickActions from "@/components/QuickActions";
import { auth } from "@/lib/auth";
import { getDashboardData, DashboardEvent } from "@/lib/services/dashboard.service";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Users, ClipboardList, FileText, AlertCircle } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    BIRTH: "badge-blue",
    MARRIAGE: "badge-active",
    DIVORCE: "badge-orange",
    DEATH: "badge-gray",
  };
  return map[type] || "badge-gray";
};

const columns: Column<DashboardEvent>[] = [
  {
    key: "type",
    header: "النوع",
    render: (e) => (
      <span className={typeBadge(e.eventType)}>{e.type}</span>
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
      <span className={
        e.statusType === "APPROVED"
          ? "badge-active"
          : e.statusType === "REJECTED"
            ? "badge-danger"
            : "badge-pending"
      }>
        {e.status}
      </span>
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
];

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  const date = format(new Date(), "EEEE، d MMMM yyyy", { locale: ar });

  // جلب البيانات من طبقة الخدمة (Service Layer) لفصل المنطق عن الواجهة
  const data = await getDashboardData();

  const dynamicMetricsData = [
    {
      icon: Users,
      label: "إجمالي المواطنين المسجلين",
      value: data.totalCitizens.toLocaleString("ar-EG"),
      sub: `${data.newCitizensThisMonth.toLocaleString("ar-EG")} جديد هذا الشهر`,
      arrow: true,
    },
    {
      icon: ClipboardList,
      label: "واقعات مسجلة اليوم",
      value: data.eventsTodayCount.toLocaleString("ar-EG"),
      sub: `${data.todayBirths.toLocaleString("ar-EG")} ولادة، ${data.todayMarriages.toLocaleString("ar-EG")} زواج، ${data.todayDeaths.toLocaleString("ar-EG")} وفاة`,
    },
    {
      icon: FileText,
      label: "وثائق صادرة اليوم",
      value: data.docsTodayCount.toLocaleString("ar-EG"),
      sub: "",
    },
    {
      icon: AlertCircle,
      label: "معاملات بانتظار التدقيق",
      value: data.pendingEventsCount.toLocaleString("ar-EG"),
      sub: "تتطلب مراجعة",
      amber: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-bold">أهلاً بك، {user.name} — {date}</h3>
        <p className="text-muted-foreground text-sm mt-1">لديك {data.pendingEventsCount.toLocaleString("ar-EG")} معاملات بانتظار المراجعة</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicMetricsData.map((m, i) => (
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
          <DataTable columns={columns} data={data.recentEvents} hoverable />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}
