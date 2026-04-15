import { Skeleton } from "@/components/ui/skeleton";
import { MBreadcrumbs } from "@/components/shared/MBreadcrumbs";

export default function LoadingDocuments() {
  return (
    <div className="space-y-6">
      <MBreadcrumbs paths={[{ label: "إصدار الوثائق" }]} />
      
      {/* QuickIssue Skeleton */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-11 w-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-11 w-full sm:w-32" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-5 border-b">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-5">
           <Skeleton className="h-9 w-64 mb-4" />
           <div className="space-y-2">
             {Array.from({ length: 5 }).map((_, i) => (
               <Skeleton key={i} className="h-12 w-full" />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
