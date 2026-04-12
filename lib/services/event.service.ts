import prisma from "@/lib/db";
import { EventType, EventStatus } from "@/lib/generated/prisma/enums";
import { startOfMonth, format } from "date-fns";
import { Events } from "@/types";

export interface EventFilters {
  type?: string;
  status?: string;
  q?: string;
  page?: string;
  pageSize?: number;
}

/**
 * جلب إحصائيات الشهر الحالي بشكل منفصل
 */
export async function getEventsStats() {
  const monthStart = startOfMonth(new Date());

  const [birthsCount, marriagesCount, divorcesCount, deathsCount] = await Promise.all([
    prisma.civilEvent.count({ where: { eventType: EventType.BIRTH, createdAt: { gte: monthStart } } }),
    prisma.civilEvent.count({ where: { eventType: EventType.MARRIAGE, createdAt: { gte: monthStart } } }),
    prisma.civilEvent.count({ where: { eventType: EventType.DIVORCE, createdAt: { gte: monthStart } } }),
    prisma.civilEvent.count({ where: { eventType: EventType.DEATH, createdAt: { gte: monthStart } } }),
  ]);

  return {
    births: birthsCount,
    marriages: marriagesCount,
    divorces: divorcesCount,
    deaths: deathsCount,
  };
}

/**
 * جلب قائمة الواقعات المفلترة والمقسمة لصفحات
 */
export async function getEventsData(filters: EventFilters) {
  const { type, status, q, page, pageSize = 10 } = filters;
  const currentPage = Math.max(1, parseInt(page as string, 10) || 1);
  const skip = (currentPage - 1) * pageSize;

  const where: any = {};

  if (type && type !== "الكل") {
    where.eventType = type as EventType;
  }

  if (status && status !== "الكل") {
    where.status = status as EventStatus;
  }

  if (q) {
    where.OR = [
      { eventNumber: { contains: q, mode: 'insensitive' } },
      { primaryCitizen: { firstName: { contains: q, mode: 'insensitive' } } },
      { primaryCitizen: { lastName: { contains: q, mode: 'insensitive' } } },
    ];
  }

  const [dbEvents, totalCount] = await Promise.all([
    prisma.civilEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        primaryCitizen: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    }),
    prisma.civilEvent.count({ where }),
  ]);

  const formattedEvents: Events[] = dbEvents.map((e) => ({
    id: e.eventNumber,
    type: e.eventType,
    citizen: e.primaryCitizen ? `${e.primaryCitizen.firstName} ${e.primaryCitizen.lastName}` : "غير محدد",
    eventDate: format(e.eventDate, "yyyy/MM/dd"),
    regDate: format(e.createdAt, "yyyy/MM/dd"),
    status: e.status,
  }));

  return {
    events: formattedEvents,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    currentPage,
  };
}
