import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen w-full bg-background" dir="rtl">
      {/* 1. هيكل الشريط الجانبي */}
      <div className="hidden md:flex flex-col w-60 border-l bg-sidebar-background p-4 space-y-6 z-40">
        {/* اللوجو */}
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        
        {/* عناصر القائمة */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* 2. منطقة المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-card border-b flex items-center justify-between px-6">
          <Skeleton className="h-6 w-32 hidden md:block" /> {/* عنوان الصفحة */}
          <Skeleton className="h-6 w-8 md:hidden" /> {/* أيقونة القائمة في الموبايل */}
          
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-48 md:w-64 rounded-md" /> {/* مربع البحث */}
            <Skeleton className="h-8 w-8 rounded-full" /> {/* الإشعارات */}
            <Skeleton className="h-8 w-8 rounded-full" /> {/* صورة المستخدم */}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 space-y-6">
          {/* إحصائيات (بطاقات) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-xl border bg-card space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            ))}
          </div>

          {/* هيكل الجدول (Table) */}
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <div className="flex justify-between items-center mb-6">
               <Skeleton className="h-6 w-1/4" />
               <Skeleton className="h-9 w-32 rounded-md" />
            </div>
            
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />  
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full" /> 
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}