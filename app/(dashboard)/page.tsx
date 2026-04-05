import { ArrowUp, FileText, Users, ClipboardList, AlertCircle } from "lucide-react";

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

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-bold">أهلاً بك، م. أحمد — الثلاثاء، ٢٠ نوفمبر ٢٠٢٤</h3>
        <p className="text-muted-foreground text-sm mt-1">لديك ٥ معاملات بانتظار المراجعة</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "إجمالي المواطنين المسجلين", value: "١٢٤٬٨٥٦", sub: "٢٣٤ جديد هذا الشهر", arrow: true },
          { icon: ClipboardList, label: "واقعات مسجلة اليوم", value: "١٢", sub: "٣ ولادات، ٢ زيجات، ١ وفاة" },
          { icon: FileText, label: "وثائق صادرة اليوم", value: "١٨٧", sub: "" },
          { icon: AlertCircle, label: "معاملات بانتظار التدقيق", value: "٢٣", sub: "تتطلب مراجعة", amber: true },
        ].map((m, i) => (
          <div key={i} className="bg-card rounded-lg border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{m.label}</span>
              <m.icon className="w-5 h-5 text-muted-foreground/50" />
            </div>
            <p className={`text-2xl font-bold ${m.amber ? "text-[hsl(var(--status-amber-text))]" : "text-foreground"}`}>{m.value}</p>
            {m.sub && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {m.arrow && <ArrowUp className="w-3 h-3 text-[hsl(var(--status-green-text))]" />}
                {m.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent events */}
        <div className="lg:col-span-2 bg-card rounded-lg border shadow-sm">
          <div className="p-5 border-b">
            <h4 className="font-bold">أحدث الواقعات المسجلة</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 text-muted-foreground text-xs">
                  <th className="text-right p-3 font-medium">النوع</th>
                  <th className="text-right p-3 font-medium">المواطن</th>
                  <th className="text-right p-3 font-medium">التاريخ</th>
                  <th className="text-right p-3 font-medium">الحالة</th>
                  <th className="text-right p-3 font-medium">الموظف</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((e, i) => (
                  <tr key={i} className={`border-t ${i % 2 === 1 ? "bg-secondary/20" : ""}`}>
                    <td className="p-3"><span className={typeBadge(e.type)}>{e.type}</span></td>
                    <td className="p-3 font-medium">{e.citizen}</td>
                    <td className="p-3 text-muted-foreground">{e.date}</td>
                    <td className="p-3">
                      <span className={e.status === "مقبول" ? "badge-active" : "badge-pending"}>{e.status}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{e.employee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-lg border shadow-sm p-5">
          <h4 className="font-bold mb-4">إجراءات سريعة</h4>
          <div className="space-y-3">
            {[
              { label: "+ تسجيل واقعة جديدة", path: "/events" },
              { label: "+ إضافة مواطن جديد", path: "/citizens" },
              { label: "📄 إصدار سند إقامة", path: "/documents" },
              { label: "📊 تقرير اليوم", path: "/" },
            ].map((a, i) => (
              <button key={i} className="w-full text-right px-4 py-3 rounded-md border text-sm font-medium hover:bg-secondary/50 transition-colors">
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
