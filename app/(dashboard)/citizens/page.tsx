import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import CitizenActions from "../../../components/CitizenActions";


const citizens = [
  { name: "محمد سامر الشمري", nid: "9981234567", gender: "ذكر", neighborhood: "الجبيهة", marital: "متزوج", status: "نشط", updated: "١٥/١١/٢٠٢٤" },
  { name: "فاطمة أحمد العبادي", nid: "9987654321", gender: "أنثى", neighborhood: "الرابية", marital: "متزوجة", status: "نشط", updated: "١٢/١١/٢٠٢٤" },
  { name: "عمر خالد الرفاعي", nid: "9971122334", gender: "ذكر", neighborhood: "صويلح", marital: "أعزب", status: "بانتظار التدقيق", updated: "١٠/١١/٢٠٢٤" },
  { name: "نور الدين يوسف المصري", nid: "9965544332", gender: "ذكر", neighborhood: "الجندويل", marital: "متزوج", status: "متوفى", updated: "٠٨/١١/٢٠٢٤" },
  { name: "سارة محمود الحسن", nid: "9954433221", gender: "أنثى", neighborhood: "الجبيهة", marital: "مطلقة", status: "نشط", updated: "٠٥/١١/٢٠٢٤" },
  { name: "أحمد علي الخالدي", nid: "9943322110", gender: "ذكر", neighborhood: "الرابية", marital: "متزوج", status: "نشط", updated: "٠١/١١/٢٠٢٤" },
  { name: "ليلى حسين الطراونة", nid: "9932211009", gender: "أنثى", neighborhood: "صويلح", marital: "أعزب", status: "بانتظار التدقيق", updated: "٢٨/١٠/٢٠٢٤" },
];

const statusBadge = (s: string) => {
  if (s === "نشط") return "badge-active";
  if (s === "بانتظار التدقيق") return "badge-pending";
  if (s === "متوفى") return "badge-danger";
  return "badge-gray";
};


export default function CitizenSearch() {
  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="bg-card rounded-lg border p-5 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[280px]">
            <label className="block text-xs text-muted-foreground mb-1.5">بحث</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="ابحث بالاسم الكامل أو الرقم الوطني أو رقم دفتر العائلة..."
                className="w-full h-10 pr-10 pl-4 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">الحي</label>
            <select className="h-10 px-3 rounded-md border bg-background text-sm">
              <option>الكل</option>
              <option>الجبيهة</option>
              <option>الرابية</option>
              <option>صويلح</option>
              <option>الجندويل</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">الحالة</label>
            <select className="h-10 px-3 rounded-md border bg-background text-sm">
              <option>الكل</option>
              <option>نشط</option>
              <option>بانتظار التدقيق</option>
              <option>متوفى</option>
            </select>
          </div>
          <button className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">بحث</button>
          <button className="h-10 px-4 rounded-md border text-sm text-muted-foreground hover:bg-secondary/50">إعادة تعيين</button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-5 border-b flex items-center justify-between">
          <h4 className="font-bold">نتائج البحث</h4>

          <CitizenActions citizens={citizens} />
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground text-xs">
                <th className="text-right p-3 font-medium">الاسم الكامل</th>
                <th className="text-right p-3 font-medium">الرقم الوطني</th>
                <th className="text-right p-3 font-medium">الجنس</th>
                <th className="text-right p-3 font-medium">الحي</th>
                <th className="text-right p-3 font-medium">الحالة المدنية</th>
                <th className="text-right p-3 font-medium">حالة السجل</th>
                <th className="text-right p-3 font-medium">آخر تحديث</th>
                <th className="text-right p-3 font-medium">خيارات</th>
              </tr>
            </thead>
            <tbody>
              {citizens.map((c, i) => (
                <tr key={i} className={`border-t hover:bg-secondary/20 ${i % 2 === 1 ? "bg-secondary/10" : ""}`} style={{ height: 56 }}>
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-muted-foreground font-mono text-xs">{c.nid}</td>
                  <td className="p-3">{c.gender}</td>
                  <td className="p-3">{c.neighborhood}</td>
                  <td className="p-3">{c.marital}</td>
                  <td className="p-3"><span className={statusBadge(c.status)}>{c.status}</span></td>
                  <td className="p-3 text-muted-foreground">{c.updated}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Link href="/citizens/1" className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">عرض</Link>
                      <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">تعديل</button>
                      <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">إصدار وثيقة</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* pagination */}
        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          <span>عرض ١–٧ من أصل ١٢٤٬٨٥٦ مواطن</span>
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
