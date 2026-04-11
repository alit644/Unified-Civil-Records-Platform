"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role } from "@/lib/generated/prisma/enums";
import { BirthEventFormValues, birthEventSchema, marriageFormSchema, MarriageFormValues } from "@/lib/schema";
import { extractGovernorateCode, getUniqueNationalId } from "@/lib/utils/generate-id";
import { parseISO } from "date-fns";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAuditLog } from "./audit";
import { calculateAge } from "@/lib/utils/calculateAge";

export async function verifyParentId(nationalId: string, expectedGender: "MALE" | "FEMALE") {
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

    // 1. التحقق من طول الرقم
    if (nationalId.length !== 11) {
      return { success: false, message: "الرقم الوطني يجب أن يكون 11 رقماً" };
    }

    // 2. البحث في قاعدة البيانات
    const citizen = await prisma.citizen.findUnique({
      where: { nationalId },
      select: { firstName: true, lastName: true, gender: true, status: true }
    });

    // 3. معالجة الحالات
    if (!citizen) {
      return { success: false, message: "لا يوجد قيد بهذا الرقم الوطني" };
    }

    if (citizen.gender !== expectedGender) {
      return { success: false, message: `هذا الرقم يعود لـ ${citizen.gender === "MALE" ? "ذكر" : "أنثى"}، يرجى التحقق!` };
    }

    if (citizen.status !== "ACTIVE") {
      return { success: false, message: "عذراً، حالة هذا القيد لا تسمح بإجراء العملية (متوفى/موقوف)" };
    }

    return {
      success: true,
      name: `${citizen.firstName} ${citizen.lastName}`
    };

  } catch (error) {
    return { success: false, message: "حدث خطأ في الخادم" };
  }
}

export async function registerBirthEvent(data: BirthEventFormValues) {
  try {

    // validate data
    const validatedFields = birthEventSchema.safeParse(data);
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
        message: "غير مصرح لك بأضافة واقعة ولادة",
      };
    }

    // 1- جلب بيانات الأب والأم معاً في نفس اللحظة 
    const [father, mother] = await Promise.all([
      prisma.citizen.findUnique({ where: { nationalId: data.fatherNationalId } }),
      prisma.citizen.findUnique({ where: { nationalId: data.motherNationalId } })
    ]);
    // التأكد من وجودهما في قاعدة البيانات
    if (!father || !mother) {
      return { success: false, message: "بيانات الوالدين غير موجودة في النظام." };
    }
    if (father.gender !== "MALE" || mother.gender !== "FEMALE") {
      return { success: false, message: "خطأ أمني: تطابق الجنس للوالدين غير صحيح." };
    }
    // التأكد من حالة القيد
    if (father.status !== "ACTIVE" || mother.status !== "ACTIVE") {
      return { success: false, message: "لا يمكن إتمام العملية، أحد قيود الوالدين غير نشط." };
    }

    // 2- التوليد الآلي الإجباري للرقم الوطني 
    const birthYear = validatedFields.data.birthDate
    const govCode = extractGovernorateCode(validatedFields.data.placeOfBirth);
    const babyNationalId = await getUniqueNationalId(birthYear, govCode);

    // 3- (Prisma Transaction)
    const result = await prisma.$transaction(async (tx) => {
      // أ) إنشاء قيد المولود (وراثة البيانات آلياً)
      const baby = await tx.citizen.create({
        data: {
          nationalId: babyNationalId,
          firstName: data.babyFirstName,
          gender: data.babyGender,
          dateOfBirth: parseISO(validatedFields.data.birthDate),
          placeOfBirth: data.placeOfBirth,
          //  الوراثة الذكية من الأب
          lastName: father.lastName,
          fatherName: father.firstName,
          motherName: mother.firstName,
          religion: father.religion,
          registryPlace: father.registryPlace,
          registryNumber: father.registryNumber,
          familyBookId: father.familyBookId,
          currentAddress: father.currentAddress,
          maritalStatus: "SINGLE",
          status: "ACTIVE",
          // الروابط العائلية 
          fatherId: father.id,
          motherId: mother.id,
        }
      })
      // ب) إنشاء واقعة الولادة وربطها بالمولود
      const event = await tx.civilEvent.create({
        data: {
          eventType: "BIRTH",
          eventNumber: `BR-${Date.now()}`,
          eventDate: parseISO(data.birthDate),
          location: data.location,
          documentNumber: data.documentNumber,
          notes: `تسجيل ولادة للطفل ${data.babyFirstName} بن ${father.firstName}`,
          status: "PENDING",
          // الطرف الأساسي هنا هو الطفل
          primaryCitizenId: baby.id,
          employeeId: session.user.id,
        }
      })
      return { baby, event }
    })

    await createAuditLog({
      action: "CREATE_EVENT",
      tableName: "CivilEvent",
      recordId: result.event.id,
      newData: {
        eventType: "BIRTH",
        eventNumber: result.event.eventNumber,
        eventDate: result.event.eventDate.toISOString(),
        location: result.event.location,
        documentNumber: result.event.documentNumber,
        notes: result.event.notes,
        status: result.event.status,
        primaryCitizenId: result.event.primaryCitizenId,
      },
      employeeId: session.user.id,
    })

    revalidatePath("/citizens");
    revalidatePath("/events");
    return {
      success: true,
      message: `تم تسجيل المولود بنجاح! رقمه الوطني: ${result.baby.nationalId}`,
      data: result
    };

  } catch (error) {
    console.error("Birth Registration Error:", error);
    // التمييز بين أخطاء قاعدة البيانات (مثل تكرار الرقم الوطني) والأخطاء العامة
    return {
      success: false,
      message: "حدث خطأ داخلي أثناء حفظ البيانات. يرجى المحاولة مرة أخرى."
    };
  }
}

export async function registerMarriageEvent(data: MarriageFormValues) {
  try {
    // validate data
    const validatedFields = marriageFormSchema.safeParse(data);
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
        message: "غير مصرح لك بأضافة واقعة ولادة",
      };
    }

    // 1- جلب بيانات العريس والعروس معاً في نفس اللحظة 
    const [groom, bride] = await Promise.all([
      prisma.citizen.findUnique({ where: { nationalId: data.groomNationalId } }),
      prisma.citizen.findUnique({ where: { nationalId: data.brideNationalId } })
    ]);
    // التأكد من وجودهما في قاعدة البيانات
    if (!groom || !bride) {
      return { success: false, message: "بيانات العريس أو العروس غير موجودة في النظام." };
    }
    if (groom.gender !== "MALE" || bride.gender !== "FEMALE") {
      return { success: false, message: "خطأ أمني: تطابق الجنس للعريس والعروس غير صحيح." };
    }
    // التأكد من حالة القيد
    if (groom.status !== "ACTIVE" || bride.status !== "ACTIVE") {
      return { success: false, message: "لا يمكن إتمام العملية، أحد قيود العريس أو العروس غير نشط." };
    }

    if (groom.maritalStatus === "MARRIED" || bride.maritalStatus === "MARRIED") {
      return { success: false, message: "أحد الطرفين مسجل كمتزوج حالياً في النظام." };
    }

    // 2- التحقق من العمر (الحد الأدنى للزواج)
    const groomAge = calculateAge(groom.dateOfBirth);
    const brideAge = calculateAge(bride.dateOfBirth);

    if (groomAge < 18 || brideAge < 18) {
      return { success: false, message: "الزواج غير مسموح قانوناً، يجب أن يكون عمر العريس والعروس 18 عاماً على الأقل." };
    }

    // 3- التحقق من القرابة من الدرجة الأولى (الإخوة)
    if (
      (groom.fatherId && groom.fatherId === bride.fatherId) ||
      (groom.motherId && groom.motherId === bride.motherId)
    ) {
      return { success: false, message: "لا يمكن إتمام الزواج (يوجد صلة قرابة من الدرجة الأولى - إخوة)." };
    }

    const result = await prisma.$transaction(async (tx) => {
      // أ) تحديث بيانات الزوج
      const updatedHusband = await tx.citizen.update({
        where: { id: groom.id },
        data: {
          maritalStatus: "MARRIED",
          familyBookId: data.familyBookId,
        }
      });

      // ب) تحديث بيانات الزوجة
      const updatedWife = await tx.citizen.update({
        where: { id: bride.id },
        data: {
          maritalStatus: "MARRIED",
          familyBookId: data.familyBookId,
          registryPlace: groom.registryPlace, // وراثة أمانة السجل من الزوج
          registryNumber: groom.registryNumber, // وراثة رقم القيد من الزوج
        }
      });

      // ج) توثيق واقعة الزواج
      const marriageEvent = await tx.civilEvent.create({
        data: {
          eventType: "MARRIAGE",
          eventNumber: `MR-${Date.now()}`,
          eventDate: parseISO(data.eventDate),
          location: data.location,
          documentNumber: data.documentNumber,
          notes: `عقد زواج المدعو ${groom.firstName} على المدعوة ${bride.firstName}`,
          status: "PENDING",
          primaryCitizenId: groom.id,     // الزوج (الطرف الأول)
          secondaryCitizenId: bride.id,      // الزوجة (الطرف الثاني)
          employeeId: session.user.id,
        }
      });

      await createAuditLog({
        action: "CREATE_EVENT",
        tableName: "CivilEvent",
        recordId: result.marriageEvent.id,
        newData: {
          eventType: "MARRIAGE",
          eventNumber: result.marriageEvent.eventNumber,
          eventDate: result.marriageEvent.eventDate.toISOString(),
          location: result.marriageEvent.location,
          documentNumber: result.marriageEvent.documentNumber,
          notes: result.marriageEvent.notes,
          status: result.marriageEvent.status,
          primaryCitizenId: result.marriageEvent.primaryCitizenId,
        },
        employeeId: session.user.id,
      });

      return { updatedHusband, updatedWife, marriageEvent };
    });

    revalidatePath("/citizens");
    revalidatePath("/events");
    return {
      success: true,
      message: "تم توثيق واقعة الزواج وتحديث قيود الزوجين بنجاح!",
      data: result
    };

  } catch (error) {
    console.error("Marriage Registration Error:", error);
    return { success: false, message: "حدث خطأ داخلي أثناء تسجيل الزواج، تم التراجع عن العملية بأمان." };
  }
}