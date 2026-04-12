import { Suspense } from "react";
import { StatsContainer, ListContainer } from "./_components/EventContainers";
import { StatsSkeleton, TableSkeleton } from "./_components/Skeletons";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    type?: string;
    status?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function CivilEventsPage({ searchParams }: PageProps) {
  const filters = await searchParams;

  return (
    <div className="space-y-6">
      {/* قسم الإحصائيات يحمل بشكل منفصل */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsContainer />
      </Suspense>
      
      {/* قسم الجدول يحمل بشكل منفصل مع فلاتره */}
      <Suspense fallback={<TableSkeleton />}>
        <ListContainer filters={filters} />
      </Suspense>
    </div>
  );
}
