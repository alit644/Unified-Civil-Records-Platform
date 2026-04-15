import prisma from "@/lib/db";
import { Prisma } from "../generated/prisma/client";

export interface AuditFiltersParams {
  page?: string;
  pageSize?: number;
  employeeId?: string;
  action?: string;
  tableName?: string;
  search?: string;
}

/**
 * جلب سجلات التدقيق مع الفلترة
 */
export async function getAuditLogs(filters: AuditFiltersParams) {
  const { 
    page = "1", 
    pageSize = 15, 
    employeeId, 
    action, 
    tableName, 
    search 
  } = filters;

  const currentPage = Math.max(1, parseInt(page as string, 10) || 1);
  const skip = (currentPage - 1) * pageSize;

  const where: Prisma.AuditLogWhereInput = {};

  if (employeeId && employeeId !== "all") {
    where.employeeId = employeeId;
  }

  if (action && action !== "all") {
    where.action = action;
  }

  if (tableName && tableName !== "all") {
    where.tableName = tableName;
  }

  if (search) {
    where.OR = [
      { recordId: { contains: search, mode: 'insensitive' } },
      { action: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        employee: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs: logs as any[],
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount,
    currentPage,
  };
}

/**
 * جلب قائمة الموظفين لملء الفلاتر
 */
export async function getAuditMetadata() {
  const employees = await prisma.employee.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  return { employees };
}
