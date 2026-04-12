"use client"
import { Column, DataTable } from "@/components/DataTable";
import { Citizen } from "@/types";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";
import SearchBar from "./SearchBar";
import CitizenActions from "./CitizenActions";
import MPagination from "@/components/shared/MPagination";
import { useEffect, useMemo, useState } from "react";
import EditCitizenDrawer from "./EditCitizenDrawer";
import { Button } from "@/components/ui/button";
import { useCitizenFilters } from "@/hooks/use-citizen-filters";

interface CitizensManagerProps {
  initialCitizens: Citizen[];
  currentPage: number;
  totalPages: number;
  totalCitizens: number;
}


export default function CitizensManager({ initialCitizens, currentPage, totalPages, totalCitizens }: CitizensManagerProps) {
  const { setPage } = useCitizenFilters();
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [citizens, setCitizens] = useState(initialCitizens);
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  
  useEffect(() => {
    setCitizens(initialCitizens);
  }, [initialCitizens]);

  const columns = useMemo<Column<Citizen>[]>(() => [
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
        <span className="font-mono text-xs text-muted-foreground">
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
          {c.currentAddress?.split(" ").slice(0, 2).join(" ") || "غير محدد"}
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
          {new Date(c.updatedAt).toISOString().split("T")[0]}
        </span>
      ),
    },
    {
      key: "actions",
      header: "خيارات",
      render: (c) => (
        <div className="flex gap-1">
          <Link href={`/citizens/${c.id}`} className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">عرض</Link>
          <Button variant="outline" size="sm" className="bg-secondary/10 px-2 py-1 rounded border text-xs hover:bg-secondary/50" onClick={() => {
            setSelectedCitizen(c);
            setEditDrawerOpen(true);
          }}>تعديل</Button>
          <Button variant="outline" size="sm" className="bg-secondary/10 px-2 py-1 rounded border border-primary/20 text-primary text-[10px] sm:text-xs hover:bg-primary/5 transition-colors">
            بيان قيد فردي
          </Button>
        </div>
      ),
    },
  ], [setEditDrawerOpen])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <SearchBar />

      {/* Results */}
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/10">
          <div className="flex items-center gap-2">
            <h4 className="font-bold">نتائج البحث</h4>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{totalCitizens} موطن</span>
          </div>

          <CitizenActions citizens={citizens} />
        </div>
        {/* Table */}
        <DataTable
          columns={columns}
          data={citizens}
          rowHeight={64}
          hoverable
        />
        
        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t bg-secondary/5">
          <div className="text-sm text-muted-foreground p-4">
            <span>عرض {Math.min(totalCitizens, (currentPage - 1) * 10 + 1)}–{Math.min(totalCitizens, currentPage * 10)} من أصل {totalCitizens} مواطن</span>
          </div>
          <MPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setPage}
          />
        </div>
      </div>

      {selectedCitizen && (
        <EditCitizenDrawer
          open={editDrawerOpen}
          onClose={() => setEditDrawerOpen(false)}
          initialData={selectedCitizen}
        />
      )}
    </div>
  )
}