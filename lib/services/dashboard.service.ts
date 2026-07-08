import prisma from "@/lib/db";
import { EVENT_TYPE_MAP, EVENT_STATUS_MAP } from "@/lib/mappings";
import { format } from "date-fns";

export interface DashboardEvent {
  id: string;
  type: string;
  eventType: string;
  citizen: string;
  date: string;
  status: string;
  statusType: string;
  employee: string;
}

export interface DashboardData {
  pendingEventsCount: number;
  totalCitizens: number;
  newCitizensThisMonth: number;
  eventsTodayCount: number;
  todayBirths: number;
  todayMarriages: number;
  todayDeaths: number;
  todayDivorces: number;
  docsTodayCount: number;
  recentEvents: DashboardEvent[];
}

export async function getDashboardData(): Promise<DashboardData> {
  // 1. إجمالي المواطنين المسجلين
  const totalCitizens = await prisma.citizen.count();

  // 2. المواطنون الجدد هذا الشهر
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newCitizensThisMonth = await prisma.citizen.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  });

  // 3. الواقعات المسجلة اليوم
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const eventsToday = await prisma.civilEvent.findMany({
    where: {
      registrationDate: {
        gte: startOfToday,
      },
    },
    select: {
      eventType: true,
    },
  });

  const eventsTodayCount = eventsToday.length;
  const todayBirths = eventsToday.filter((e) => e.eventType === "BIRTH").length;
  const todayMarriages = eventsToday.filter((e) => e.eventType === "MARRIAGE").length;
  const todayDeaths = eventsToday.filter((e) => e.eventType === "DEATH").length;
  const todayDivorces = eventsToday.filter((e) => e.eventType === "DIVORCE").length;

  // 4. وثائق صادرة اليوم
  const docsTodayCount = await prisma.document.count({
    where: {
      issuedAt: {
        gte: startOfToday,
      },
    },
  });

  // 5. معاملات بانتظار التدقيق
  const pendingEventsCount = await prisma.civilEvent.count({
    where: {
      status: "PENDING",
    },
  });

  // 6. أحدث 5 واقعات مسجلة
  const dbRecentEvents = await prisma.civilEvent.findMany({
    orderBy: {
      registrationDate: "desc",
    },
    take: 5,
    include: {
      primaryCitizen: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      employee: {
        select: {
          name: true,
        },
      },
    },
  });

  // تحويل البيانات لتلائم شكل الجدول
  const recentEvents = dbRecentEvents.map((event) => {
    const typeLabel = EVENT_TYPE_MAP[event.eventType]?.label || event.eventType;
    const statusLabel = EVENT_STATUS_MAP[event.status]?.label || event.status;

    return {
      id: event.id,
      type: typeLabel,
      eventType: event.eventType,
      citizen: `${event.primaryCitizen.firstName} ${event.primaryCitizen.lastName}`,
      date: format(event.registrationDate, "dd/MM/yyyy"),
      status: statusLabel,
      statusType: event.status,
      employee: event.employee.name,
    };
  });

  return {
    pendingEventsCount,
    totalCitizens,
    newCitizensThisMonth,
    eventsTodayCount,
    todayBirths,
    todayMarriages,
    todayDeaths,
    todayDivorces,
    docsTodayCount,
    recentEvents,
  };
}
