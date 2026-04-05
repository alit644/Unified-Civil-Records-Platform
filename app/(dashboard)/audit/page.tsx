import { Column, DataTable } from "@/components/DataTable";
import { IAuditLog } from "@/types";
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
const columns: Column<IAuditLog>[] = [
  {
    key: "date",
    header: "التاريخ والوقت",
    render: (e) => (
      <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">{e.date}</span>
    ),
  },
  {
    key: "employee",
    header: "الموظف",
    render: (e) => (
      <span >{e.employee}</span>
    ),
  },
  {
    key: "action",
    header: "الإجراء",
    render: (e) => (
      <span className={actionBadge(e.action)}>{e.action}</span>
    ),
  },
  {
    key: "table",
    header: "الجدول",
    render: (e) => (
      <span className="font-mono text-xs text-muted-foreground">{e.table}</span>
    ),
  },
  {
    key: "record",
    header: "السجل",
    render: (e) => (
      <span className="font-mono text-xs text-muted-foreground">{e.record}</span>
    ),
  },
  {
    key: "oldVal",
    header: "القيمة القديمة",
    render: (e) => (
      <span className="text-xs text-muted-foreground font-mono truncate block max-w-[120px]" title={e.oldVal}>{e.oldVal}</span>
    ),
  },
  {
    key: "newVal",
    header: "القيمة الجديدة",
    render: (e) => (
      <span className="text-xs text-muted-foreground font-mono truncate block max-w-[120px]" title={e.newVal}>{e.newVal}</span>
    ),
  },
]

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
      <div className="bg-card rounded-lg border shadow-sm">
        <DataTable columns={columns} data={logs} />
      </div>
    </div>
  );
}
