import { Search, FolderOpen, FileText, Download } from "lucide-react";

const archives = [
  { id: "ARC-001", type: "سند إقامة", citizen: "محمد سامر الشمري", date: "١٥/١١/٢٠٢٤", size: "٢٤٠ ك.ب" },
  { id: "ARC-002", type: "شهادة ميلاد", citizen: "ليان محمد العبادي", date: "١٢/١١/٢٠٢٤", size: "١٨٥ ك.ب" },
  { id: "ARC-003", type: "شهادة زواج", citizen: "عمر أحمد الشمري", date: "١٠/١١/٢٠٢٤", size: "٣١٢ ك.ب" },
  { id: "ARC-004", type: "قيد عائلي", citizen: "فاطمة أحمد العبادي", date: "٠٨/١١/٢٠٢٤", size: "٤٥٦ ك.ب" },
  { id: "ARC-005", type: "شهادة وفاة", citizen: "خالد يوسف المصري", date: "٠٥/١١/٢٠٢٤", size: "١٩٨ ك.ب" },
];

export default function DigitalArchive() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: FolderOpen, label: "إجمالي الملفات المؤرشفة", value: "٤٥٬٢٣١" },
          { icon: FileText, label: "ملفات مؤرشفة هذا الشهر", value: "٣٤٧" },
          { icon: Download, label: "عمليات تحميل اليوم", value: "٢٣" },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-lg border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="w-5 h-5 text-muted-foreground/50" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-card rounded-lg border p-5 shadow-sm">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1.5">بحث في الأرشيف</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input placeholder="ابحث برقم الأرشيف أو اسم المواطن..." className="w-full h-10 pr-10 pl-4 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <select className="h-10 px-3 rounded-md border bg-background text-sm">
            <option>جميع الأنواع</option>
            <option>سند إقامة</option>
            <option>شهادة ميلاد</option>
            <option>شهادة زواج</option>
            <option>شهادة وفاة</option>
            <option>قيد عائلي</option>
          </select>
          <button className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">بحث</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50 text-muted-foreground text-xs">
              <th className="text-right p-3 font-medium">رقم الأرشيف</th>
              <th className="text-right p-3 font-medium">نوع الوثيقة</th>
              <th className="text-right p-3 font-medium">المواطن</th>
              <th className="text-right p-3 font-medium">تاريخ الأرشفة</th>
              <th className="text-right p-3 font-medium">حجم الملف</th>
              <th className="text-right p-3 font-medium">خيارات</th>
            </tr>
          </thead>
          <tbody>
            {archives.map((a, i) => (
              <tr key={i} className={`border-t hover:bg-secondary/20 ${i % 2 === 1 ? "bg-secondary/10" : ""}`}>
                <td className="p-3 font-mono text-xs text-muted-foreground">{a.id}</td>
                <td className="p-3"><span className="badge-blue">{a.type}</span></td>
                <td className="p-3 font-medium">{a.citizen}</td>
                <td className="p-3 text-muted-foreground">{a.date}</td>
                <td className="p-3 text-muted-foreground">{a.size}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">عرض</button>
                    <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50 flex items-center gap-1">
                      <Download className="w-3 h-3" /> تحميل
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
