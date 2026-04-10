import prisma from "@/lib/db";
import CitizensManager from "./_components/CitizensManager";
import { StatePlaceholder } from "@/components/shared/StatePlaceholder";
import { AlertCircle, RefreshCcw } from "lucide-react";
export const dynamic = "force-dynamic";
const PAGE_SIZE = 10;

// TODO: اصدار وثائق جديدة للمواطن
export default async function CitizenSearch({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { page = "1", q, gender, status } = await searchParams;
  const currentPage = Math.max(1, parseInt(page as string, 10) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const where: any = {};
  // search by status
  if (status && status !== "all") {
    where.status = status as any;
  }
  // search by gender
  if (gender && gender !== "all") {
    where.gender = gender as any;
  }
  // search by name or national id or family book id
  if (q) {
    const searchString = q as string;
    const searchParts = searchString.split(" ");
    
    if (searchParts.length > 1) {
      // If multi-word, all words must match somewhere (AND of multiple ORs)
      where.AND = [
        ...(where.AND || []),
        ...searchParts.map((part) => ({
          OR: [
            { firstName: { contains: part, mode: 'insensitive' } },
            { lastName: { contains: part, mode: 'insensitive' } },
            { fatherName: { contains: part, mode: 'insensitive' } },
            { nationalId: { contains: part, mode: 'insensitive' } },
            { familyBookId: { contains: part, mode: 'insensitive' } },
          ],
        })),
      ];
    } else {
      // Single word search
      where.OR = [
        { firstName: { contains: searchString, mode: 'insensitive' } },
        { lastName: { contains: searchString, mode: 'insensitive' } },
        { fatherName: { contains: searchString, mode: 'insensitive' } },
        { nationalId: { contains: searchString, mode: 'insensitive' } },
        { familyBookId: { contains: searchString, mode: 'insensitive' } },
      ];
    }
  }

  try {
    const citizens = await prisma.citizen.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nationalId: true,
        gender: true,
        dateOfBirth: true,
        maritalStatus: true,
        status: true,
        fatherName: true,
        motherName: true,
        currentAddress: true,
        updatedAt: true,
        registryPlace: true,
        registryNumber: true,
        familyBookId: true,
        placeOfBirth: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    });
    const totalCitizens = await prisma.citizen.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalCitizens / PAGE_SIZE));

    return (
      <div >
        <CitizensManager initialCitizens={citizens} currentPage={currentPage} totalPages={totalPages} totalCitizens={totalCitizens} />
      </div>
    );

  } catch (error) {
    console.error("Error loading employee management page:", error);
    return (
      <div className="py-8">
        <StatePlaceholder
          variant="error"
          icon={AlertCircle}
          title="فشل في تحميل بيانات المواطنين"
          description="حدث خطأ أثناء محاولة الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى."
          action={{
            label: "إعادة تحميل الصفحة",
            icon: RefreshCcw,
            href: "/citizens",
          }}
        />
      </div>
    );
  }



}

