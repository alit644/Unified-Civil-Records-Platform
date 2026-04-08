"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Column, DataTable } from "@/components/DataTable";
import { Employee } from "@/types";
import { Role } from "@/lib/generated/prisma/enums";
import { useToggleEmployeeStatus } from "@/hooks/useToggleEmployeeStatus";
import AddEmployeeDrawer from "./AddEmployeeDrawer";
import EditEmployeeDrawer from "./EditEmployeeDrawer";
import MPagination from "@/components/shared/MPagination";
import { StatusBadge } from "@/components/shared/StatusBadge";


interface EmployeeManagerProps {
  initialEmployees: Employee[];
}

export default function EmployeeManager({
  initialEmployees,
}: EmployeeManagerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [employees, setEmployees] = useState(initialEmployees);
  const { toggleStatus, isPending } = useToggleEmployeeStatus(setEmployees);

  const columns = useMemo<Column<Employee>[]>(
    () => [
      {
        key: "name",
       header: "اسم الموظف",
        render: (e) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {e.name.charAt(0)}
            </div>
            <span className="font-medium">{e.name}</span>
          </div>
        ),
      },
      {
        key: "username",
        header: "اسم المستخدم",
        render: (e) => (
          <span className="font-mono text-xs text-muted-foreground">
            {e.email.split("@")[0]}
          </span>
        ),
      },
      {
        key: "role",
        header: "الدور",
        render: (e) => (
          <StatusBadge value={e.role} category="role" />
        ),
      },
      {
        key: "status",
        header: "الحالة",
        render: (e) => (
          <StatusBadge value={e.isActive} category="status" className=""/>
        ),
      },
      {
        key: "events",
       header: "المعاملات",
        render: (e) => (
          <span className="text-muted-foreground">{e._count.civilEvents}</span>
        ),
      },
      {
        key: "docs",
        header: "الوثائق",
        render: (e) => (
          <span className="text-muted-foreground">{e._count.documents}</span>
        ),
      },
      {
        key: "actions",
         header: "الإجراءات",
        render: (e) => (
          <div className="flex gap-1">
            <button
              onClick={() => {
                setSelectedEmployee(e);
                setEditDrawerOpen(true);
              }}
              className="rounded border px-2 py-1 text-xs transition-colors hover:bg-secondary/50"
            >
             تعديل الدور
            </button>
            <button
              onClick={() => toggleStatus(e.id, e.isActive)}
              disabled={e.role === "ADMIN" || isPending}
              className={`rounded border px-2 py-1 text-xs transition-colors hover:bg-secondary/50 disabled:cursor-not-allowed disabled:opacity-50 ${
                e.isActive
                  ? "text-[hsl(var(--status-red-text))]"
                  : "text-primary"
              }`}
            >
              {e.isActive ? "تعطيل" : "تفعيل"}
            </button>
          </div>
        ),
      },
    ],
    [isPending, toggleStatus],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b p-5">
          <h4 className="font-bold">إدارة الموظفين</h4>
          <button
            onClick={() => setDrawerOpen(true)}
            type="button"
            aria-label="إضافة موظف جديد"
            className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> إضافة موظف جديد
          </button>
        </div>
        <DataTable
          columns={columns}
          data={employees}
        />
        <MPagination totalPages={10} currentPage={1} onPageChange={() => 5}/>
      </div>

      <AddEmployeeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdded={(employee) => {
          setEmployees((current) => [employee, ...current]);
        }}
      />
      {selectedEmployee ? (
        <EditEmployeeDrawer
          open={editDrawerOpen}
          onClose={() => {
            setEditDrawerOpen(false);
            setSelectedEmployee(null);
          }}
          selectedEmployee={selectedEmployee}
        />
      ) : null}
    </div>
  );
}
