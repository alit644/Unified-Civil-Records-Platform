import { ChevronLeft, ChevronRight } from "lucide-react";

const logs = [
  { date: "٢٠/١١/٢٠٢٤ ١٠:٣٢", employee: "م. أحمد الخالدي", action: "أصدر وثيقة", table: "documents", record: "DOC-2024-00187", oldVal: "—", newVal: '{"type":"سند إقامة"}' },
  { date: "٢٠/١١/٢٠٢٤ ١٠:١٥", employee: "سارة الحسن", action: "سجّل واقعة", table: "civil_events", record: "CE-2024-001", oldVal: "—", newVal: '{"type":"ولادة","name":"ليان"}' },
  { date: "٢٠/١١/٢٠٢٤ ٠٩:٤٥", employee: "م. أحمد الخالدي", action: "عدّل بيانات", table: "citizens", record: "CIT-9981234567", oldVal: '{"address":"شارع المدينة ١٢"}', newVal: '{"address":"شارع الجامعة ٤٥"}' },
  { date: "٢٠/١١/٢٠٢٤ ٠٩:٢٠", employee: "نور العلي", action: "وافق", table: "civil_events", record: "CE-2024-003", oldVal: '{"status":"pending"}', newVal: '{"status":"approved"}' },
  { date: "١٩/١١/٢٠٢٤ ١٦:٣٠", employee: "سارة الحسن", action: "أضاف مواطن", table: "citizens", record: "CIT-9971122334", oldVal: "—", newVal: '{"name":"عمر أحمد الشمري"}' },
  { date: "١٩/١١/٢٠٢٤ ١٥:١٠", employee: "م. أحمد الخالدي", action: "رفض", table: "civil_events", record: "CE-2024-006", oldVal: '{"status":"pending"}', newVal: '{"status":"rejected"}' },
  { date: "١٩/١١/٢٠٢٤ ١٤:٠٠", employee: "ريم الصالح", action: "أصدر وثيقة", table: "documents", record: "DOC-2024-00186", oldVal: "—", newVal: '{"type":"قيد عائلي"}' },
];

const actionBadge = (a: string) => {
  if (a === "أضاف مواطن" || a === "سجّل واقعة") return "badge-blue";
  if (a === "عدّل بيانات") return "badge-pending";
  if (a === "أصدر وثيقة") return "badge-active";
  if (a === "وافق") return "badge-active";
  if (a === "رفض") return "badge-danger";
  return "badge-gray";
};

export default function AuditLog() {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card rounded-lg border p-5 shadow-sm flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">من تاريخ</label>
          <input type="text" placeholder="يوم/شهر/سنة" className="h-9 px-3 rounded-md border bg-background text-sm w-36" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">إلى تاريخ</label>
          <input type="text" placeholder="يوم/شهر/سنة" className="h-9 px-3 rounded-md border bg-background text-sm w-36" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">الموظف</label>
          <select className="h-9 px-3 rounded-md border bg-background text-sm">
            <option>جميع الموظفين</option>
            <option>م. أحمد الخالدي</option>
            <option>سارة الحسن</option>
            <option>نور العلي</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">نوع الإجراء</label>
          <select className="h-9 px-3 rounded-md border bg-background text-sm">
            <option>الكل</option>
            <option>أضاف مواطن</option>
            <option>عدّل بيانات</option>
            <option>أصدر وثيقة</option>
            <option>سجّل واقعة</option>
            <option>وافق</option>
            <option>رفض</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">الجدول المتأثر</label>
          <select className="h-9 px-3 rounded-md border bg-background text-sm">
            <option>الكل</option>
            <option>citizens</option>
            <option>civil_events</option>
            <option>documents</option>
          </select>
        </div>
        <button className="h-9 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">تطبيق الفلترة</button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50 text-muted-foreground text-xs">
              <th className="text-right p-3 font-medium">التاريخ والوقت</th>
              <th className="text-right p-3 font-medium">الموظف</th>
              <th className="text-right p-3 font-medium">الإجراء</th>
              <th className="text-right p-3 font-medium">الجدول</th>
              <th className="text-right p-3 font-medium">السجل</th>
              <th className="text-right p-3 font-medium">القيمة القديمة</th>
              <th className="text-right p-3 font-medium">القيمة الجديدة</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, i) => (
              <tr key={i} className={`border-t ${i % 2 === 1 ? "bg-secondary/10" : ""}`}>
                <td className="p-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{l.date}</td>
                <td className="p-3">{l.employee}</td>
                <td className="p-3"><span className={actionBadge(l.action)}>{l.action}</span></td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{l.table}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{l.record}</td>
                <td className="p-3">
                  <span className="text-xs text-muted-foreground font-mono truncate block max-w-[120px]" title={l.oldVal}>{l.oldVal}</span>
                </td>
                <td className="p-3">
                  <span className="text-xs text-muted-foreground font-mono truncate block max-w-[120px]" title={l.newVal}>{l.newVal}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          <span>عرض ١–٥٠ من أصل ١٬٢٣٤ سجل</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded border flex items-center justify-center hover:bg-secondary/50"><ChevronRight className="w-4 h-4" /></button>
            <button className="w-8 h-8 rounded border bg-primary text-primary-foreground flex items-center justify-center">١</button>
            <button className="w-8 h-8 rounded border flex items-center justify-center hover:bg-secondary/50">٢</button>
            <button className="w-8 h-8 rounded border flex items-center justify-center hover:bg-secondary/50">٣</button>
            <button className="w-8 h-8 rounded border flex items-center justify-center hover:bg-secondary/50"><ChevronLeft className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
