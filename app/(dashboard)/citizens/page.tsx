import {  ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import CitizenActions from "./_components/CitizenActions";
import { Column, DataTable } from "@/components/DataTable";
import { Citizen } from "@/types";
import SearchBar from "./_components/SearchBar";


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

  const columns: Column<Citizen>[] = [
    {
      key: "name",
      header: "الاسم الكامل",
      render: (c) => (
        <span className="font-medium ">
          {c.name}
        </span>
      ),
    },
    {
      key: "nid",
      header: "الرقم الوطني",
      render: (c) => (
        <span className="font-mono text-xs
        text-muted-foreground">
          {c.nid}
        </span>
      ),
    },
    {
      key: "gender",
      header: "الجنس",
      render: (c) => (
        <span >
          {c.gender}
        </span>
      ),
    },
    {
      key: "neighborhood",
      header: "الحي",
      render: (c) => (
        <span >
          {c.neighborhood}
        </span>
      ),
    },
    {
      key: "marital",
      header: "الحالة المدنية",
      render: (c) => (
        <span >
          {c.marital}
        </span>
      ),
    },
    {
      key: "status",
      header: "حالة السجل",
      render: (c) => (
        <span className={statusBadge(c.status)}>{c.status}</span>
      ),
    },
    {
      key: "updated",
      header: "آخر تحديث",
      render: (c) => (
        <span className="text-muted-foreground">
          {c.updated}
        </span>
      ),
    },
    {
      key: "actions",
      header: "خيارات",
      render: (c) => (
        <div className="flex gap-1">
          <Link href="/citizens/1" className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">عرض</Link>
          <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">تعديل</button>
          <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">إصدار وثيقة</button>
        </div>
      ),
    },
  ]


export default function CitizenSearch() {

  return (
    <div className="space-y-6">
      {/* Search Bar */}
    <SearchBar />

      {/* Results */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-5 border-b flex items-center justify-between">
          <h4 className="font-bold">نتائج البحث</h4>

          <CitizenActions citizens={citizens} />
        </div>
        {/* Table */}
        <DataTable
          columns={columns}
          data={citizens}
          rowHeight={56}
          hoverable
        />
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
