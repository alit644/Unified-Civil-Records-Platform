import prisma from "@/lib/db";
import { DOCUMENT_TYPE_MAP } from "@/lib/mappings";

export async function getRecentDocuments(limit = 20) {
  try {
    const docs = await prisma.document.findMany({
      take: limit,
      orderBy: { issuedAt: "desc" },
      include: {
        citizen: { select: { firstName: true, lastName: true, nationalId: true } },
        employee: { select: { name: true } },
      },
    });

    const recentDocs = docs.map((doc) => ({
      id: doc.id,
      archiveNumber: doc.archiveNumber,
      type: doc.type,
      citizen: `${doc.citizen.firstName} ${doc.citizen.lastName}`,
      nid: doc.citizen.nationalId,
      time: doc.issuedAt.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      employee: doc.employee.name,
      issuedAt: doc.issuedAt,
    }));
    return {
      message: "تم جلب الوثائق بنجاح",
      success: true,
      data: recentDocs,
    };
  } catch (error) {
    console.error("getRecentDocuments Error:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء جلب الوثائق",
    };
  }
}

const mapArabicToEnum: Record<string, string> = {
  "سند إقامة": "RESIDENCE",
  "شهادة ميلاد": "BIRTH",
  "شهادة زواج": "MARRIAGE",
  "قيد عائلي": "FAMILY_BOOK",
  "قيد فردي": "INDIVIDUAL_EXTRACT",
};

export async function createDocumentRecord(citizenId: string, employeeId: string, documentTypeArabic: string) {
  const citizen = await prisma.citizen.findUnique({
    where: { id: citizenId },
    include: {
      father: true,
      mother: true,
    },
  });

  if (!citizen) {
    return {
      success: false,
      message: "المواطن غير موجود",
    };
  }

  const enumType = mapArabicToEnum[documentTypeArabic] || "INDIVIDUAL_EXTRACT";
  
  // Create archive number
  const archiveNumber = `DOC-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Insert into DB
  const docRecord = await prisma.document.create({
    data: {
      archiveNumber,
      type: enumType,
      citizenId: citizen.id,
      employeeId: employeeId,
      issuedAt: new Date(),
    },
  });

  const translation = DOCUMENT_TYPE_MAP[enumType]?.label || documentTypeArabic;

  // Prepare dynamic fields based on document type
  let fields: { label: string; value: string }[] = [];

  if (enumType === "RESIDENCE") {
    fields = [
      { label: "الاسم الكامل", value: `${citizen.firstName} ${citizen.lastName}` },
      { label: "مكان وتاريخ الولادة", value: `${citizen.placeOfBirth} - ${new Date(citizen.dateOfBirth).toLocaleDateString('en-GB')}` },
      { label: "مكان الإقامة الحالي", value: citizen.currentAddress || "غير محدد" },
      { label: "مدة الإقامة", value: "مقيم بشكل دائم" },
    ];
  } else if (enumType === "BIRTH") {
    fields = [
      { label: "اسم المولود", value: `${citizen.firstName}` },
      { label: "الجنس", value: citizen.gender === "MALE" ? "ذكر" : "أنثى" },
      { label: "تاريخ الولادة", value: new Date(citizen.dateOfBirth).toLocaleDateString('en-GB') },
      { label: "مكان الولادة", value: citizen.placeOfBirth },
      { label: "اسم الأب", value: citizen.father ? `${citizen.father.firstName} ${citizen.father.lastName}` : citizen.fatherName },
      { label: "اسم الأم", value: citizen.mother ? `${citizen.mother.firstName} ${citizen.mother.lastName}` : citizen.motherName },
    ];
  } else {
    // Default fallback (e.g. INDIVIDUAL_EXTRACT)
    fields = [
      { label: "الاسم الكامل", value: `${citizen.firstName} ${citizen.lastName}` },
      { label: "اسم الأب", value: citizen.fatherName },
      { label: "اسم الأم", value: citizen.motherName },
      { label: "الجنس", value: citizen.gender === "MALE" ? "ذكر" : "أنثى" },
      { label: "محافظة القيد", value: `أمانة ${citizen.registryPlace} - خانة ${citizen.registryNumber}` },
    ];
  }

  const genericDocData = {
    documentId: archiveNumber,
    documentTitle: translation,
    documentTitleEN: enumType.replace("_", " "),
    citizenNationalId: citizen.nationalId,
    registryDetails: `أمانة ${citizen.registryPlace}`,
    fields,
  };

  return { genericDocData, docRecord };
}
