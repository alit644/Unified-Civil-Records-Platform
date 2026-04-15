"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role } from "@/lib/generated/prisma/enums";
import { CitizenFormValues, citizenSchema } from "@/lib/schema";
import { extractGovernorateCode, getUniqueNationalId } from "@/lib/utils/generate-id";
import { parseISO } from "date-fns";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAuditLog } from "./audit";

export async function createCitizen(data: CitizenFormValues) {

  try {
    // validate data
    const validatedFields = citizenSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, message: "بيانات المدخلات غير صالحة" };
    }

    // التحقق من الصلاحية
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !["ADMIN", "OFFICER"].includes(session.user.role as Role)) {
      return {
        success: false,
        message: "غير مصرح لك بتعديل معلومات المواطن",
      };
    }

    // 2. التوليد الآلي الإجباري للرقم الوطني 
    const birthYear = validatedFields.data.dateOfBirth
    const govCode = extractGovernorateCode(validatedFields.data.registryPlace);
    const generatedNationalId = await getUniqueNationalId(birthYear, govCode);

    // 3. الحفظ في قاعدة البيانات
    const newCitizen = await prisma.citizen.create({
      data: {
        ...validatedFields.data,
        nationalId: generatedNationalId,
        dateOfBirth: parseISO(validatedFields.data.dateOfBirth),
      },
    });

    await createAuditLog({
      action: "CREATE_CITIZEN",
      tableName: "citizen",
      recordId: newCitizen.id,
      newData: {
        firstName: newCitizen.firstName,
        lastName: newCitizen.lastName,
        nationalId: newCitizen.nationalId,
        gender: newCitizen.gender,
        dateOfBirth: newCitizen.dateOfBirth.toISOString(),
        maritalStatus: newCitizen.maritalStatus,
        status: newCitizen.status,
        fatherName: newCitizen.fatherName,
        motherName: newCitizen.motherName,
        currentAddress: newCitizen.currentAddress,
      },
      employeeId: session.user.id,
    });
    revalidatePath("/citizens");
    revalidatePath("/audit");
    return {
      success: true,
      message: `تم حفظ المواطن بنجاح! الرقم الوطني المُولد: ${generatedNationalId}`,
      data: newCitizen
    };
  } catch (error: any) {
    console.error("Error creating citizen:", error);
    if (error.name === "ZodError") {
      return { success: false, message: "بيانات غير صالحة، يرجى التحقق من الحقول." };
    }
    return { success: false, message: "حدث خطأ داخلي في الخادم أثناء الحفظ." };
  }

}

export async function updateCitizen(data: CitizenFormValues, id: string) {
  try {
    // validate data
    const validatedFields = citizenSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, message: "بيانات المدخلات غير صالحة" };
    }

    // التحقق من الصلاحية
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !["ADMIN", "OFFICER"].includes(session.user.role as Role)) {
      return {
        success: false,
        message: "غير مصرح لك بتعديل معلومات المواطن",
      };
    }

    // check if citizen exists
    const existingCitizen = await prisma.citizen.findUnique({
      where: { id },
    });

    if (!existingCitizen) {
      return { success: false, message: "المواطن غير موجود" };
    }

    // update citizen
    const updatedCitizen = await prisma.citizen.update({
      where: { id },
      data: {
        ...validatedFields.data,
        dateOfBirth: parseISO(validatedFields.data.dateOfBirth),
      },
    });

    await createAuditLog({
      action: "UPDATE_CITIZEN",
      tableName: "citizen",
      recordId: updatedCitizen.id,
      newData: {
        firstName: updatedCitizen.firstName,
        lastName: updatedCitizen.lastName,
        fatherName: updatedCitizen.fatherName,
        motherName: updatedCitizen.motherName,
        gender: updatedCitizen.gender,
        currentAddress: updatedCitizen.currentAddress,
      },
      employeeId: session.user.id,
    });
    revalidatePath("/citizens");
    revalidatePath("/audit");
    return {
      success: true,
      message: "تم تعديل المواطن بنجاح!",
      data: updatedCitizen
    };

  } catch (error: any) {
    console.error("Error creating citizen:", error);
    if (error.name === "ZodError") {
      return { success: false, message: "بيانات غير صالحة، يرجى التحقق من الحقول." };
    }
    return { success: false, message: "حدث خطأ داخلي في الخادم أثناء الحفظ." };
  }
}

export async function quickSearchCitizens(query: string) {
  if (!query || query.length < 2) return [];

  const searchParts = query.trim().replace(/\s+/g, ' ').split(" ");

  const where: any = {};
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
      { firstName: { contains: query, mode: 'insensitive' } },
      { lastName: { contains: query, mode: 'insensitive' } },
      { fatherName: { contains: query, mode: 'insensitive' } },
      { nationalId: { contains: query, mode: 'insensitive' } },
      { familyBookId: { contains: query, mode: 'insensitive' } },
    ];
  }

  try {
    const citizens = await prisma.citizen.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nationalId: true,
        status: true,
      },
      take: 5,
    });
    return citizens;
  } catch (error) {
    console.error("Global search error:", error);
    return [];
  }
}

export async function verifyCitizenById(nationalId: string) {
  if (!nationalId || nationalId.length !== 11) {
    return { success: false, message: "الرقم الوطني يجب أن يتكون من 11 رقم" };
  }

  try {
    const citizen = await prisma.citizen.findUnique({
      where: { nationalId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        fatherName: true,
        motherName: true,
        gender: true,
      },
    });

    if (!citizen) {
      return { success: false, message: "لم يتم العثور على مواطن بهذا الرقم الوطني" };
    }

    return {
      success: true,
      data: citizen,
      message: `تم العثور على: ${citizen.firstName} ${citizen.fatherName} ${citizen.lastName}`
    };
  } catch (error) {
    console.error("Verify citizen error:", error);
    return { success: false, message: "حدث خطأ أثناء التحقق من الرقم الوطني" };
  }
}

export async function getCivilRecordExtract(nationalId: string) {
  if (!nationalId || nationalId.length !== 11) {
    return { success: false, message: "الرقم الوطني يجب أن يتكون من 11 رقم" };
  }

  try {
    // التحقق من الصلاحية
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !["ADMIN", "OFFICER"].includes(session.user.role as Role)) {
      return {
        success: false,
        message: "غير مصرح لك",
      };
    }

    // 1. جلب المواطن مع بيانات والديه، وكل الواقعات المرتبطة به
    const citizen = await prisma.citizen.findUnique({
      where: { nationalId },
      include: {
        // جلب أسماء الوالدين لطباعتها في البيان
        father: { select: { firstName: true, lastName: true, nationalId: true } },
        mother: { select: { firstName: true, lastName: true, nationalId: true } },
        // جلب الواقعات التي هو طرف أساسي فيها (ولادة، زواجه، طلاقه، وفاته)
        primaryEvents: {
          include: {
            secondaryCitizen: { select: { firstName: true, lastName: true } }
          }
        },
        // جلب الواقعات التي هو طرف ثانوي فيها (مثلاً: هي الزوجة في عقد زواج)
        secondaryEvents: {
          include: {
            primaryCitizen: { select: { firstName: true, lastName: true } }
          }
        }
      }
    });

    if (!citizen) {
      return { success: false, message: "لم يتم العثور على قيود مطابقة لهذا الرقم." };
    }

    // 2. تجميع الواقعات وترتيبها زمنياً
    const allEvents = [...citizen.primaryEvents, ...citizen.secondaryEvents];

    const timeline = allEvents.sort((a, b) => {
      return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    });

    // 3. إنشاء سجل رسمي للوثيقة في قاعدة البيانات (الأرشفة الرقمية)
    const archiveNumber = `SC-MCI-${citizen.nationalId.slice(0, 4)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    await prisma.document.create({
      data: {
        archiveNumber,
        type: "INDIVIDUAL_EXTRACT",
        citizenId: citizen.id,
        employeeId: session.user.id,
        issuedAt: new Date(),
      }
    });

    const recordData = {
      documentId: archiveNumber, // الرقم الموحد الذي سيستخدم في كل مكان
      personalInfo: {
        nationalId: citizen.nationalId,
        fullName: `${citizen.firstName} ${citizen.lastName}`,
        fatherName: citizen.father ? `${citizen.father.firstName} ${citizen.father.lastName}` : "غير مسجل",
        motherName: citizen.mother ? `${citizen.mother.firstName} ${citizen.mother.lastName}` : "غير مسجل",
        gender: citizen.gender === "MALE" ? "ذكر" : "أنثى",
        // placeAndDateOfBirth: `${citizen.placeOfBirth} - ${new Date(citizen.dateOfBirth).toLocaleDateString('ar-SY')}`,
        birthDate: new Date(citizen.dateOfBirth).toLocaleDateString('en-GB'),
        placeOfBirth: citizen.placeOfBirth,
        registryDetails: `أمانة ${citizen.registryPlace} - خانة ${citizen.registryNumber}`,
        maritalStatus: citizen.maritalStatus,
        status: citizen.status,
      },
      eventsHistory: timeline
    };

    await createAuditLog({
      action: "DOCUMENT_EXTRACTED",
      tableName: "citizen",
      recordId: citizen.id,
      newData: {
        nationalId: citizen.nationalId,
        fullName: `${citizen.firstName} ${citizen.lastName}`,
      },
      employeeId: session.user.id,
    });

    return { success: true, data: recordData , message: "تم استخراج البيان بنجاح" };
  } catch (error) {
    console.error("Civil Record Error:", error);
    return { success: false, message: "حدث خطأ أثناء استخراج البيان." };
  }
}

// دالة التحقق العامة (بدون تسجيل دخول)
export async function getPublicVerificationData(nationalId: string) {
  if (!nationalId || nationalId.length !== 11) {
    return { success: false, message: "رقم وطني غير صالح" };
  }

  try {
    const citizen = await prisma.citizen.findUnique({
      where: { nationalId },
      select: {
        firstName: true,
        lastName: true,
        fatherName: true,
        motherName: true,
        gender: true,
        dateOfBirth: true,
        placeOfBirth: true,
        registryPlace: true,
        registryNumber: true,
        status: true,
      }
    });

    if (!citizen) {
      return { success: false, message: "هذه الوثيقة غير مدرجة في سجلاتنا." };
    }

    return {
      success: true,
      data: {
        fullName: `${citizen.firstName} ${citizen.lastName}`,
        fatherName: citizen.fatherName,
        motherName: citizen.motherName,
        birthDate: new Date(citizen.dateOfBirth).toLocaleDateString('en-GB'),
        placeOfBirth: citizen.placeOfBirth,
        registryDetails: `أمانة ${citizen.registryPlace} - ${citizen.registryNumber}`,
      }
    };
  } catch (error) {
    console.error("Public Verification Error:", error);
    return { success: false, message: "حدث خطأ أثناء التحقق من البيانات." };
  }
}