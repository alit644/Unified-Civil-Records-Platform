import { getAuditLogs, getAuditMetadata, AuditFiltersParams } from "@/lib/services/audit.service";
import { AuditFilters } from "@/components/AuditFilters";
import { Column, DataTable } from "@/components/DataTable";
import { IAuditLog } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import AuditPaginationWrapper from "./AuditPaginationWrapper";

const columns: Column<IAuditLog>[] = [
  {
    key: "date",
    header: "التاريخ والوقت",
    render: (e) => (
      <div 
        className="flex flex-col gap-0.5" 
        title={formatDistanceToNow(e.createdAt, { addSuffix: true, locale: ar })}
      >
        <span className="text-sm font-medium whitespace-nowrap">
          {format(e.createdAt, "dd MMMM yyyy", { locale: ar })}
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">
          {format(e.createdAt, "HH:mm:ss")}
        </span>
      </div>
    ),
  },
  {
    key: "employee",
    header: "الموظف",
    render: (e) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
          {e.employee.name.charAt(0)}
        </div>
        <span className="text-sm">{e.employee.name}</span>
      </div>
    ),
  },
  {
    key: "action",
    header: "الإجراء",
    render: (e) => (
      <StatusBadge category="audit" value={e.action}/>
    ),
  },
  {
    key: "table",
    header: "الجدول",
    render: (e) => (
      <span className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">{e.tableName}</span>
    ),
  },
  {
    key: "record",
    header: "السجل",
    render: (e) => (
      <span className="font-mono text-[10px] text-primary hover:underline cursor-pointer">{e.recordId.slice(0, 8)}...</span>
    ),
  },
  {
    key: "changes",
    header: "التغييرات",
    render: (e) => (
        <div className="flex flex-col gap-1 max-w-[200px]">
            {e.oldData && (
                <span className="text-[10px] text-muted-foreground font-mono truncate line-through opacity-50">
                    {JSON.stringify(e.oldData)}
                </span>
            )}
            {e.newData && (
                <span className="text-[10px] text-emerald-600 font-mono truncate bg-emerald-50 px-1 rounded">
                    {JSON.stringify(e.newData)}
                </span>
            )}
        </div>
    ),
  },
];

export async function AuditFiltersContainer() {
  const { employees } = await getAuditMetadata();
  return <AuditFilters employees={employees} />;
}

export async function AuditLogsContainer({ filters }: { filters: AuditFiltersParams }) {
  const { logs, totalPages, currentPage, totalCount } = await getAuditLogs(filters);

  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-secondary/10 flex items-center justify-between">
        <h4 className="text-sm font-bold">سجلات النظام</h4>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{totalCount} سجل</span>
      </div>
      <DataTable columns={columns} data={logs} rowHeight={70} />
      
      <div className="p-4 border-t bg-secondary/5 flex justify-end">
        <AuditPaginationWrapper totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
