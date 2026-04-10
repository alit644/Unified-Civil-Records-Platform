"use client"
import { Column, DataTable } from "@/components/DataTable";
import { Citizen } from "@/types";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";
import SearchBar from "./SearchBar";
import CitizenActions from "./CitizenActions";
import MPagination from "@/components/shared/MPagination";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CitizensManagerProps {
  initialCitizens: Citizen[];
  currentPage: number;
  totalPages: number;
  totalCitizens: number;
}

const columns: Column<Citizen>[] = [
  {
    key: "name",
    header: "الاسم الكامل",
    render: (c) => (
      <span className="font-medium ">
        {`${c.firstName} ${c.fatherName} ${c.lastName}`}
      </span>
    ),
  },
  {
    key: "nid",
    header: "الرقم الوطني",
    render: (c) => (
      <span className="font-mono text-xs
        text-muted-foreground">
        {c.nationalId}
      </span>
    ),
  },
  {
    key: "gender",
    header: "الجنس",
    render: (c) => (
      <span >
        {c.gender === "MALE" ? "ذكر" : "أنثى"}
      </span>
    ),
  },
  {
    key: "neighborhood",
    header: "الحي",
    render: (c) => (
      <span >
        {c.currentAddress?.split(" ").slice(0, 2).join(" ")}
      </span>
    ),
  },
  {
    key: "marital",
    header: "الحالة المدنية",
    render: (c) => (
      <StatusBadge value={c.maritalStatus} category="marital" />
    ),
  },
  {
    key: "status",
    header: "حالة السجل",
    render: (c) => (
      <StatusBadge value={c.status} category="status_citizen" />
    ),
  },
  {
    key: "updated",
    header: "آخر تحديث",
    render: (c) => (
      <span className="text-muted-foreground">
        {c.updatedAt.toISOString().split("T")[0]}
      </span>
    ),
  },
  {
    key: "actions",
    header: "خيارات",
    render: (c) => (
      <div className="flex gap-1">
        <Link href={`/citizens/${c.id}`} className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">عرض</Link>
        <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">تعديل</button>
        <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">إصدار وثيقة</button>
      </div>
    ),
  },
]
export default function CitizensManager({ initialCitizens, currentPage, totalPages, totalCitizens }: CitizensManagerProps) {
  const router = useRouter();
  const [citizens, setCitizens] = useState(initialCitizens);
  useEffect(() => {
    setCitizens(initialCitizens);
  }, [initialCitizens]);
  const handlePageChange = (page: number) => {
    router.push(`/citizens?page=${page}`);
  };
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
        <div className="flex items-center justify-between border-t bg-secondary/30">
          <div className="text-sm text-muted-foreground p-4">
            <span>عرض {currentPage * 10 - 10 + 1}–{currentPage * 10} من أصل {totalCitizens} مواطن</span>
          </div>
          {/* pagination */}
          <MPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => handlePageChange(page)}
          />
        </div>

      </div>
    </div>
  )
}