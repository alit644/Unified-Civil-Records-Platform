import EmployeeStats from "./_components/EmployeeStats";
import EmployeeManager from "./_components/EmployeeManager";
import prisma from "@/lib/db";
import { startOfDay } from "date-fns";
import { StatePlaceholder } from "@/components/shared/StatePlaceholder";
import { AlertCircle, RefreshCcw } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function EmployeeManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page as string, 10) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const todayStart = startOfDay(new Date());

  try {
    const [employees, totalEmployees, activeEmployees, pendingAudits] =
      await Promise.all([
        prisma.employee.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            _count: {
              select: {
                documents: true,
                civilEvents: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: PAGE_SIZE,
        }),
        prisma.employee.count(),
        prisma.employee.count({ where: { isActive: true } }),
        prisma.civilEvent.count({
          where: {
            status: "PENDING",
            registrationDate: { gte: todayStart },
          },
        }),
      ]);

    const totalPages = Math.max(1, Math.ceil(totalEmployees / PAGE_SIZE));

    return (
      <div className="space-y-6">
        <EmployeeStats
          activeEmployees={activeEmployees}
          pendingAudits={pendingAudits}
          totalEmployees={totalEmployees}
        />
        <EmployeeManager
          initialEmployees={employees}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading employee management page:", error);
    return (
      <div className="py-8">
        <StatePlaceholder
          variant="error"
          icon={AlertCircle}
          title="فشل في تحميل بيانات الموظفين"
          description="حدث خطأ أثناء محاولة الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى."
          action={{
            label: "إعادة تحميل الصفحة",
            icon: RefreshCcw,
            href: "/employees",
          }}
        />
      </div>
    );
  }
}
