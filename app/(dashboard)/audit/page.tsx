import { Column, DataTable } from "@/components/DataTable";
import { IAuditLog } from "@/types";
import { AuditFilters } from "@/components/AuditFilters";
import prisma from "@/lib/db";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { StatePlaceholder } from "@/components/shared/StatePlaceholder";

const columns: Column<IAuditLog>[] = [
  {
    key: "date",
    header: "التاريخ والوقت",
    render: (e) => (
      <div 
        className="flex flex-col gap-0.5 cursor-help" 
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
      <span >{e.employee.name}</span>
    ),
  },
  {
    key: "action",
    header: "الإجراء",
    render: (e) => (
      <>
      <StatusBadge category="audit" value={e.action}/>
      </>
    ),
  },
  {
    key: "table",
    header: "الجدول",
    render: (e) => (
      <span className="font-mono text-xs text-muted-foreground">{e.tableName}</span>
    ),
  },
  {
    key: "record",
    header: "السجل",
    render: (e) => (
      <span className="font-mono text-xs text-muted-foreground">{e.recordId}</span>
    ),
  },
  {
    key: "oldVal",
    header: "القيمة القديمة",
    render: (e) => (
      <span className="text-xs text-muted-foreground font-mono truncate block max-w-30" title={JSON.stringify(e.oldData)}>{JSON.stringify(e.oldData)}</span>
    ),
  },
  {
    key: "newVal",
    header: "القيمة الجديدة",
    render: (e) => (
      <span className="text-xs text-muted-foreground font-mono truncate block max-w-30" title={JSON.stringify(e.newData)}>{JSON.stringify(e.newData)}</span>
    ),
  },
]
export default async function AuditLog() {
  try {
    const auditLogs = await prisma.auditLog.findMany({
      include: {
        employee: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return (
      <div className="space-y-6">
        <AuditFilters />

        {/* Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <DataTable columns={columns} data={auditLogs} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Audit log error:", error);
    
    return (
      <div className="space-y-6">
        <AuditFilters />
        <StatePlaceholder 
        title="عذراً، حدث خطأ ما"
        description="لم نتمكن من تحميل سجلات التدقيق حالياً. قد يكون هناك مشكلة في الاتصال بقاعدة البيانات."
        icon={AlertCircle}
        variant="error"
        action={{
          label: "إعادة المحاولة",
          icon: RefreshCcw,
          href: "/audit",
        }}
        
        />
      </div>
    );
  }
}
