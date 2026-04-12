import { Suspense } from "react";
import { EmployeeStatsContainer, EmployeeListContainer } from "./_components/EmployeeContainers";
import { EmployeeStatsSkeleton, EmployeeTableSkeleton } from "./_components/EmployeeSkeletons";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function EmployeeManagementPage({ searchParams }: PageProps) {
  const filters = await searchParams;

  return (
    <div className="space-y-6">
      <Suspense fallback={<EmployeeStatsSkeleton />}>
        <EmployeeStatsContainer />
      </Suspense>
      
      <Suspense fallback={<EmployeeTableSkeleton />}>
        <EmployeeListContainer filters={filters} />
      </Suspense>
    </div>
  );
}
