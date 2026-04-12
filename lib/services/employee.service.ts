import prisma from "@/lib/db";
import { startOfDay } from "date-fns";

export interface EmployeeFilters {
  page?: string;
  pageSize?: number;
}

/**
 * جلب إحصائيات الموظفين والمهام المعلقة
 */
export async function getEmployeeStats() {
  const todayStart = startOfDay(new Date());

  const [totalEmployees, activeEmployees, pendingAudits] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { isActive: true } }),
    prisma.civilEvent.count({
      where: {
        status: "PENDING",
        registrationDate: { gte: todayStart },
      },
    }),
  ]);

  return {
    totalEmployees,
    activeEmployees,
    pendingAudits,
  };
}

/**
 * جلب قائمة الموظفين مع التقسيم لصفحات
 */
export async function getEmployeesList(filters: EmployeeFilters) {
  const { page = "1", pageSize = 10 } = filters;
  const currentPage = Math.max(1, parseInt(page as string, 10) || 1);
  const skip = (currentPage - 1) * pageSize;

  const [employees, totalEmployees] = await Promise.all([
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
      take: pageSize,
    }),
    prisma.employee.count(),
  ]);

  return {
    employees: employees as any[],
    totalPages: Math.max(1, Math.ceil(totalEmployees / pageSize)),
    currentPage,
  };
}
