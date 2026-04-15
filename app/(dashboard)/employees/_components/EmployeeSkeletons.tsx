import { Skeleton } from "@/components/ui/skeleton";

export function EmployeeStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded-xl border p-6 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export function EmployeeTableSkeleton() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="p-5 border-b flex justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="p-5 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 items-center">
             <Skeleton className="h-8 w-8 rounded-full" />
             <Skeleton className="h-4 flex-1" />
             <Skeleton className="h-4 w-20" />
             <Skeleton className="h-4 w-20" />
             <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
