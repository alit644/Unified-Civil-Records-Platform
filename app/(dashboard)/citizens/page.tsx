import { Suspense } from "react";
import { CitizensListContainer } from "./_components/CitizenContainers";
import { CitizensSkeleton } from "./_components/CitizensSkeleton";
import { MBreadcrumbs } from "@/components/shared/MBreadcrumbs";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    gender?: string;
    status?: string;
    page?: string;
  }>;
}


export default async function CitizenSearchPage({ searchParams }: PageProps) {
  const filters = await searchParams;

  return (
    <div className="space-y-6">
      <MBreadcrumbs paths={[{ label: "بحث المواطنين" }]} />
      <Suspense fallback={<CitizensSkeleton />}>
        <CitizensListContainer filters={filters} />
      </Suspense>
    </div>
  );
}
