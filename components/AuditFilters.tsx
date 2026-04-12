"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuditFilters } from "@/hooks/use-audit-filters";
import { AUDIT_ACTION_MAP } from "@/lib/mappings";
import { Search, Loader2 } from "lucide-react";

interface AuditFiltersProps {
  employees: { id: string; name: string }[];
}

export function AuditFilters({ employees }: AuditFiltersProps) {
  const { filters, setEmployeeId, setAction, setTableName, setSearch, isPending } = useAuditFilters();

  return (
    <div className="bg-card rounded-2xl border p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* 1. البحث النصي */}
        <div className="flex-1 min-w-[240px] relative">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block px-1">البحث (معرف السجل)</Label>
          <div className="relative">
             <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
             <Input
                defaultValue={filters.search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بمعرف السجل..."
                className="pr-10 h-10 text-sm rounded-lg"
              />
              {isPending && <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />}
          </div>
        </div>

        {/* 2. فلتر الموظف */}
        <div className="grid gap-1.5">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase px-1">الموظف</Label>
          <Select value={filters.employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger className="h-10 w-48 bg-background rounded-lg border-secondary-foreground/20">
              <SelectValue placeholder="جميع الموظفين" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الموظفين</SelectItem>
              {employees.map((emp) => (
                 <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 3. نوع الإجراء */}
        <div className="grid gap-1.5">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase px-1">نوع الإجراء</Label>
          <Select value={filters.action} onValueChange={setAction}>
            <SelectTrigger className="h-10 w-44 bg-background rounded-lg border-secondary-foreground/20">
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {Object.entries(AUDIT_ACTION_MAP).map(([key, value]) => (
                 <SelectItem key={key} value={key}>{value.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. الجدول */}
        <div className="grid gap-1.5">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase px-1">الجدول</Label>
          <Select value={filters.tableName} onValueChange={setTableName}>
            <SelectTrigger className="h-10 w-40 bg-background rounded-lg border-secondary-foreground/20">
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="Citizen">المواطنين</SelectItem>
              <SelectItem value="CivilEvent">الواقعات</SelectItem>
              <SelectItem value="Employee">الموظفين</SelectItem>
              <SelectItem value="Document">الوثائق</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
