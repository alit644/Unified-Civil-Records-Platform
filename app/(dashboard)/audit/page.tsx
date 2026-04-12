import { Suspense } from "react";
import { AuditFiltersContainer, AuditLogsContainer } from "./_components/AuditContainers";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    employeeId?: string;
    action?: string;
    tableName?: string;
    q?: string;
  }>;
}

export default async function AuditLogPage({ searchParams }: PageProps) {
  const filters = await searchParams;

  return (
    <div className="space-y-6">
      {/* الفلاتر تحمل بيانات الموظفين بشكل مستقل */}
      <Suspense fallback={<Skeleton className="h-28 w-full rounded-2xl" />}>
        <AuditFiltersContainer />
      </Suspense>

      {/* الجدول يحمل معالجة الاستعلامات والفلترة بشكل مستقل */}
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <AuditLogsContainer filters={{
           ...filters,
           search: filters.q
        }} />
      </Suspense>
    </div>
  );
}
