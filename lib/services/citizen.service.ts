import prisma from "@/lib/db";
import { CitizenStatus, Gender } from "@/lib/generated/prisma/enums";

export interface CitizenFilters {
  q?: string;
  gender?: string;
  status?: string;
  page?: string;
  pageSize?: number;
}

export async function getCitizensList(filters: CitizenFilters) {
  const { q, gender, status, page = "1", pageSize = 10 } = filters;
  const currentPage = Math.max(1, parseInt(page as string, 10) || 1);
  const skip = (currentPage - 1) * pageSize;

  const where: any = {};

  if (status && status !== "all") {
    where.status = status as CitizenStatus;
  }

  if (gender && gender !== "all") {
    where.gender = gender as Gender;
  }

  if (q) {
    const searchString = q as string;
    const searchParts = searchString.split(" ").filter(Boolean);
    
    if (searchParts.length > 1) {
      where.AND = searchParts.map((part) => ({
        OR: [
          { firstName: { contains: part, mode: 'insensitive' } },
          { lastName: { contains: part, mode: 'insensitive' } },
          { fatherName: { contains: part, mode: 'insensitive' } },
          { nationalId: { contains: part, mode: 'insensitive' } },
          { familyBookId: { contains: part, mode: 'insensitive' } },
        ],
      }));
    } else {
      where.OR = [
        { firstName: { contains: searchString, mode: 'insensitive' } },
        { lastName: { contains: searchString, mode: 'insensitive' } },
        { fatherName: { contains: searchString, mode: 'insensitive' } },
        { nationalId: { contains: searchString, mode: 'insensitive' } },
        { familyBookId: { contains: searchString, mode: 'insensitive' } },
      ];
    }
  }

  const [citizens, totalCount] = await Promise.all([
    prisma.citizen.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.citizen.count({ where }),
  ]);

  return {
    citizens,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    currentPage,
  };
}
