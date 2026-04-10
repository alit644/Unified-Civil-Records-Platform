import prisma from "@/lib/db";
import CitizensManager from "./_components/CitizensManager";
import { StatePlaceholder } from "@/components/shared/StatePlaceholder";
import { AlertCircle, RefreshCcw } from "lucide-react";
export const dynamic = "force-dynamic";
const PAGE_SIZE = 10;

// TODO: عرض المواطنيين في جدول مع امكانية البحث والتصفية والفرز
// TODO: عند الضغط على عرض، يتم فتح صفحة تفاصيل المواطن مع كل بياناته وخيارات تعديلها او اصدار وثائق جديدة له
export default async function CitizenSearch({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page as string, 10) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  try {
    const citizens = await prisma.citizen.findMany({
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
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    });
    const totalCitizens = await prisma.citizen.count();
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
