import { statsData } from "@/components/data";
import { Column, DataTable } from "@/components/DataTable";
import { MetricCard } from "@/components/MetricCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Archive } from "@/types";
import { Search, Download } from "lucide-react";

const archives: Archive[] = [
  { id: "ARC-001", type: "سند إقامة", citizen: "محمد سامر الشمري", date: "١٥/١١/٢٠٢٤", size: "٢٤٠ ك.ب" },
  { id: "ARC-002", type: "شهادة ميلاد", citizen: "ليان محمد العبادي", date: "١٢/١١/٢٠٢٤", size: "١٨٥ ك.ب" },
  { id: "ARC-003", type: "شهادة زواج", citizen: "عمر أحمد الشمري", date: "١٠/١١/٢٠٢٤", size: "٣١٢ ك.ب" },
  { id: "ARC-004", type: "قيد عائلي", citizen: "فاطمة أحمد العبادي", date: "٠٨/١١/٢٠٢٤", size: "٤٥٦ ك.ب" },
  { id: "ARC-005", type: "شهادة وفاة", citizen: "خالد يوسف المصري", date: "٠٥/١١/٢٠٢٤", size: "١٩٨ ك.ب" },
];
// table columns
const columns: Column<Archive>[] = [
  {
    key: "id",
    header: "رقم الأرشيف",
    render: (e) => (
      <span className="font-mono text-xs text-muted-foreground">{e.id}</span>
    ),
  },
  {
    key: "type",
    header: "نوع الوثيقة",
    render: (e) => (
      <span className="badge-blue">{e.type}</span>
    ),
  },
  {
    key: "citizen",
    header: "المواطن",
    render: (e) => (
      <span className="font-medium">{e.citizen}</span>
    ),
  },
  {
    key: "date",
    header: "تاريخ الأرشفة",
    render: (e) => (
      <span className="text-muted-foreground">{e.date}</span>
    ),
  },
  {
    key: "size",
    header: "حجم الملف",
    render: (e) => (
      <span className="text-muted-foreground">{e.size}</span>
    ),
  },
  {
    key: "actions",
    header: "الإجراءات",
    render: (e) => (
      <div className="flex gap-2">
        <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">عرض</button>
        <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50 flex items-center gap-1">
          <Download className="w-3 h-3" /> تحميل
        </button>
      </div>
    ),
  },

]

export default function DigitalArchive() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1
  sm:grid-cols-3 gap-4">
        {statsData.map((s, i) => (
          <MetricCard key={i} size="sm" {...s} />
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
          <Select defaultValue="all">
            <SelectTrigger className="h-10 px-3 rounded-md border bg-background text-sm">
                <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">حميع الأنواع</SelectItem>
            <SelectItem value="sindIqama">سند إقامة</SelectItem>
            <SelectItem value="shahadatMilad">شهادة ميلاد</SelectItem>
            <SelectItem value="shahadatZawaj">شهادة زواج</SelectItem>
            <SelectItem value="shahadatWafah">شهادة وفاة</SelectItem>
            <SelectItem value="qaidI3ali">قيد عائلي</SelectItem>
            </SelectContent>
          </Select>
          <button className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">بحث</button>
        </div>
      </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-10 px-3 rounded-md border bg-background text-sm">
              <SelectValue placeholder="اختر الحي" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="jubeilha">الجبيهة</SelectItem>
              <SelectItem value="rabieh">الرابية</SelectItem>
              <SelectItem value="sweileh">صويلح</SelectItem>
              <SelectItem value="jandawil">الجندويل</SelectItem>
            </SelectContent>
          </Select>
      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm">
        <DataTable data={archives} columns={columns} />
      </div>
    </div>
  );
}
