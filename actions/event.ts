"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role } from "@/lib/generated/prisma/enums";
import { BirthEventFormValues, birthEventSchema, DeathEventFormValues, deathEventSchema, DivorceFormValues, divorceFormSchema, marriageFormSchema, MarriageFormValues } from "@/lib/schema";
import { extractGovernorateCode, getUniqueNationalId } from "@/lib/utils/generate-id";
import { parseISO } from "date-fns";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAuditLog } from "./audit";
import { calculateAge } from "@/lib/utils/calculateAge";

export async function verifyParentId(nationalId: string, expectedGender?: "MALE" | "FEMALE" | "ANY") {
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

    if (expectedGender && expectedGender !== "ANY" && citizen.gender !== expectedGender) {
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

    // التأكد من ارتباط الأبوين ببعضهما (دفتر العائلة المشترك) دلالة على وجود زواج
    if (!father.familyBookId || father.familyBookId !== mother.familyBookId) {
      return { success: false, message: "لا يمكن تسجيل الولادة: الأبوان ليسا مسجلين كعائلة واحدة (دفتر العائلة غير متطابق)." };
    }

    // 3- التحقق من القرابة (المحرمية)
    if (
      (father.fatherId && father.fatherId === mother.fatherId) ||
      (father.motherId && father.motherId === mother.motherId)
    ) {
      return { success: false, message: "لا يمكن إتمام الولادة (يوجد صلة قرابة من الدرجة الأولى - إخوة)." };
    }

    // التحقق من القرابة المباشرة (الأصول والفروع)
    if (
      (mother.fatherId === father.id) || 
      (father.motherId === mother.id)
    ) {
      return { success: false, message: "لا يمكن إتمام الولادة (يوجد صلة قرابة تمنع تسجيل الولادة - أصول وفروع)." };
    }

    // التحقق الذكي: الفارق العمري البيولوجي بين المولود والوالدين
    const fatherAge = calculateAge(father.dateOfBirth);
    const motherAge = calculateAge(mother.dateOfBirth);
    const fatherAgeAtBirth = fatherAge - calculateAge(data.birthDate);
    const motherAgeAtBirth = motherAge - calculateAge(data.birthDate);
    if (fatherAgeAtBirth < 14 || motherAgeAtBirth < 14) {
      return { success: false, message: "لا يمكن إتمام الولادة، أحد الوالدين لم يبلغ السن القانوني المسموح للإنجاب." };
    }
    if (fatherAgeAtBirth > 90 || motherAgeAtBirth > 55) {
      return { success: false, message: "لا يمكن إتمام الولادة، السن المسجل لأحد الوالدين يتجاوز الحد البيولوجي والمنطقي للإنجاب." };
    }

    // 1. تحويل التاريخ المُدخل إلى كائن Date
    const birthDateObj = new Date(data.birthDate);
    const today = new Date();

    // 2. التحقق من التواريخ المستقبلية
    if (birthDateObj > today) {
      return { 
        success: false, 
        message: "تاريخ غير صالح: لا يمكن تسجيل واقعة ولادة في المستقبل!" 
      };
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
        message: "غير مصرح لك بإضافة واقعة زواج",
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

    // 2- التحقق من تاريخ الحدث والمستقبل
    const eventDateObj = new Date(data.eventDate);
    const today = new Date();

    if (eventDateObj > today) {
      return { 
        success: false, 
        message: "تاريخ غير صالح: لا يمكن تسجيل واقعة زواج في المستقبل!" 
      };
    }

    // 3- التحقق من العمر (الحد الأدنى للزواج) بناءً على تاريخ الحدث
    const groomAge = calculateAge(groom.dateOfBirth);
    const brideAge = calculateAge(bride.dateOfBirth);
    const groomAgeAtEvent = groomAge - calculateAge(data.eventDate);
    const brideAgeAtEvent = brideAge - calculateAge(data.eventDate);

    if (groomAgeAtEvent < 18 || brideAgeAtEvent < 18) {
      return { success: false, message: "الزواج غير مسموح قانوناً، يجب أن يكون عمر العريس والعروس 18 عاماً على الأقل في تاريخ عقد الزواج." };
    }

    // 3- التحقق من القرابة من الدرجة الأولى (الإخوة)
    if (
      (groom.fatherId && groom.fatherId === bride.fatherId) ||
      (groom.motherId && groom.motherId === bride.motherId)
    ) {
      return { success: false, message: "لا يمكن إتمام الزواج (يوجد صلة قرابة من الدرجة الأولى - إخوة)." };
    }

    // 4- التحقق من القرابة المباشرة (الأصول والفروع - الآباء والأبناء)
    if (
      (bride.fatherId === groom.id) || 
      (groom.motherId === bride.id)
    ) {
      return { success: false, message: "لا يمكن إتمام الزواج (يوجد صلة قرابة تمنع الزواج - أصول وفروع)." };
    }

    // توليد رقم دفتر عائلة فريد وغير قابل للتكرار
    const generatedFamilyBookId = `FB-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const result = await prisma.$transaction(async (tx) => {
      // أ) تحديث بيانات الزوج
      const updatedHusband = await tx.citizen.update({
        where: { id: groom.id },
        data: {
          maritalStatus: "MARRIED",
          familyBookId: generatedFamilyBookId,
        }
      });

      // ب) تحديث بيانات الزوجة
      const updatedWife = await tx.citizen.update({
        where: { id: bride.id },
        data: {
          maritalStatus: "MARRIED",
          familyBookId: generatedFamilyBookId,
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

      return { updatedHusband, updatedWife, marriageEvent };
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

export async function registerDivorceEvent(data: DivorceFormValues) {
  try {
      // validate data
    const validatedFields = divorceFormSchema.safeParse(data);
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
        message: "غير مصرح لك بإضافة واقعة طلاق",
      };
    }

    // 1- جلب بيانات العريس والعروس معاً في نفس اللحظة 
    const [groom, bride] = await Promise.all([
      prisma.citizen.findUnique({ where: { nationalId: data.groomNationalId } }),
      prisma.citizen.findUnique({ where: { nationalId: data.brideNationalId } })
    ]);

    if (!groom || !bride) {
      return { success: false, message: "بيانات الزوج أو الزوجة غير موجودة في النظام." };
    }
    if (groom.gender !== "MALE" || bride.gender !== "FEMALE") {
      return { success: false, message: "خطأ أمني: تطابق الجنس للعريس والعروس غير صحيح." };
    }
    // التأكد من حالة القيد
    if (groom.status !== "ACTIVE" || bride.status !== "ACTIVE") {
      return { success: false, message: "لا يمكن إتمام العملية، أحد قيود العريس أو العروس غير نشط." };
    }

    if (groom.maritalStatus !== "MARRIED" || bride.maritalStatus !== "MARRIED") {
      return { success: false, message: "لا يمكن إتمام الطلاق. أحد الطرفين أو كلاهما غير مسجل كمتزوج في النظام." };
    }

    // (نفحص تطابق دفتر العائلة
    if (!groom.familyBookId || groom.familyBookId !== bride.familyBookId) {
      return { 
        success: false, 
        message: "الطرفان لا يملكان نفس رقم دفتر العائلة. تأكد من أنهما متزوجان من بعضهما حقاً." 
      };
    }

    // 2- التحقق من تاريخ الحدث والمستقبل
    const eventDateObj = new Date(data.eventDate);
    const today = new Date();

    if (eventDateObj > today) {
      return { 
        success: false, 
        message: "تاريخ غير صالح: لا يمكن تسجيل واقعة طلاق في المستقبل!" 
      };
    }

    // 3- التحقق من العمر (الحد الأدنى للطلاق)
    const groomAge = calculateAge(groom.dateOfBirth);
    const brideAge = calculateAge(bride.dateOfBirth);
    const groomAgeAtEvent = groomAge - calculateAge(data.eventDate);
    const brideAgeAtEvent = brideAge - calculateAge(data.eventDate);

    if (groomAgeAtEvent < 18 || brideAgeAtEvent < 18) {
      return { success: false, message: "الطلاق غير مسموح قانوناً، يجب أن يكون عمر الزوج والزوجة 18 عاماً على الأقل في تاريخ الطلاق." };
    }



    const result = await prisma.$transaction(async (tx) => {
      // البحث عن والد الزوجة لاستعادة قيدها الأصلي
      let brideFather = null;
      if (bride.fatherId) {
        brideFather = await tx.citizen.findUnique({
          where: { id: bride.fatherId },
          select: { familyBookId: true, registryPlace: true, registryNumber: true }
        });
      }

      // أ) تحديث بيانات الزوج
      const updatedHusband = await tx.citizen.update({
        where: { id: groom.id },
        data: {
          maritalStatus: "DIVORCED",
        }
      });

      // ب) تحديث بيانات الزوجة بالعودة لقيد والدها (أو البقاء على ما كان عليه مؤقتاً)
      const updatedWife = await tx.citizen.update({
        where: { id: bride.id },
        data: {
          maritalStatus: "DIVORCED",
          familyBookId: brideFather?.familyBookId || null,
          registryPlace: brideFather?.registryPlace || bride.registryPlace,
          registryNumber: brideFather?.registryNumber || bride.registryNumber,
        }
      });

      // ج) توثيق واقعة الطلاق
      const divorceEvent = await tx.civilEvent.create({
        data: {
          eventType: "DIVORCE",
          eventNumber: `DV-${Date.now()}`,
          eventDate: parseISO(data.eventDate),
          location: data.location,
          documentNumber: data.documentNumber,
          notes: `تسجيل واقعة طلاق للمدعو ${groom.firstName} من المدعوة ${bride.firstName}`,
          status: "PENDING",
          primaryCitizenId: groom.id,     // الزوج (الطرف الأول)
          secondaryCitizenId: bride.id,      // الزوجة (الطرف الثاني)
          employeeId: session.user.id,
        }
      });

      return { updatedHusband, updatedWife, divorceEvent };
    });

    await createAuditLog({
      action: "CREATE_EVENT",
      tableName: "CivilEvent",
      recordId: result.divorceEvent.id,
      newData: {
        eventType: "DIVORCE",
        eventNumber: result.divorceEvent.eventNumber,
        eventDate: result.divorceEvent.eventDate.toISOString(),
        location: result.divorceEvent.location,
        documentNumber: result.divorceEvent.documentNumber,
        notes: result.divorceEvent.notes,
        status: result.divorceEvent.status,
        primaryCitizenId: result.divorceEvent.primaryCitizenId,
      },
      employeeId: session.user.id,
    });

    revalidatePath("/citizens");
    revalidatePath("/events");
    return {
      success: true,
      message: "تم توثيق واقعة الطلاق وتحديث قيود الزوجين بنجاح!",
      data: result
    };

  } catch (error) {
    console.error("Divorce Registration Error:", error);
    return { success: false, message: "حدث خطأ داخلي أثناء تسجيل الطلاق، تم التراجع عن العملية بأمان." };
  }
}

export async function registerDeathEvent(data: DeathEventFormValues) {
  try {
    const validatedFields = deathEventSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, message: "بيانات المدخلات غير صالحة" };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !["ADMIN", "OFFICER"].includes(session.user.role as Role)) {
      return { success: false, message: "غير مصرح لك بإضافة واقعة وفاة" };
    }

    // 1- جلب بيانات المتوفى
    const deceased = await prisma.citizen.findUnique({ where: { nationalId: data.nationalId } });

    if (!deceased) {
      return { success: false, message: "بيانات المواطن غير موجودة في النظام." };
    }

    if (deceased.status === "DECEASED") {
      return { success: false, message: "عفواً، هذا المواطن مسجل كمتوفى بالفعل!" };
    }

    // 2- التحقق من تاريخ الوفاة منطقياً
    const deathDateObj = new Date(data.eventDate);
    const dobObj = new Date(deceased.dateOfBirth);
    const today = new Date();

    if (deathDateObj > today) {
      return { success: false, message: "لا يمكن أن يكون تاريخ الوفاة في المستقبل!" };
    }

    if (deathDateObj < dobObj) {
      return { success: false, message: "خطأ منطقي: تاريخ الوفاة يسبق تاريخ الولادة!" };
    }

    // 3- البحث عن الزوج/الزوجة (إن وُجد) لتحويل الحالة إلى (أرمل/أرملة)
    let spouse = null;
    // إن كان متزوجاً ويمتلك رقم دفتر عائلة
    if (deceased.maritalStatus === "MARRIED" && deceased.familyBookId) {
      // نبحث عن شريكه في نفس الدفتر (عبر الجنس المغاير)
      spouse = await prisma.citizen.findFirst({
        where: {
          familyBookId: deceased.familyBookId,
          maritalStatus: "MARRIED",
          gender: deceased.gender === "MALE" ? "FEMALE" : "MALE",
          status: "ACTIVE"
        }
      });
    }

    // 4- فتح Transaction لتنفيذ كافة المعاملات المعمارية دفعة واحدة
    const result = await prisma.$transaction(async (tx) => {
      // أ- تحديث حالة المواطن إلى متوفى
      const updatedDeceased = await tx.citizen.update({
        where: { id: deceased.id },
        data: {
          status: "DECEASED",
        }
      });

      // ب- تحديث حالة الشريك إلى أرمل/أرملة (إن وُجد)
      let updatedSpouse = null;
      if (spouse) {
        updatedSpouse = await tx.citizen.update({
          where: { id: spouse.id },
          data: {
            maritalStatus: "WIDOWED",
          }
        });
      }

      // ج- توثيق واقعة الوفاة المعمارية
      const deathEvent = await tx.civilEvent.create({
        data: {
          eventType: "DEATH",
          eventNumber: `DT-${Date.now()}`,
          eventDate: parseISO(data.eventDate),
          location: data.location,
          documentNumber: data.documentNumber,
          notes: `تسجيل واقعة وفاة للمواطن ${deceased.firstName} ${deceased.lastName}`,
          status: "PENDING",
          primaryCitizenId: deceased.id,
          secondaryCitizenId: spouse?.id || null, // ربط الشريك كطرف ثانوي إن وجد
          employeeId: session.user.id,
        }
      });

      return { updatedDeceased, updatedSpouse, deathEvent };
    });

    // 5- توثيق العملية أمنياً
    await createAuditLog({
      action: "CREATE_EVENT",
      tableName: "CivilEvent",
      recordId: result.deathEvent.id,
      newData: {
        eventType: "DEATH",
        eventNumber: result.deathEvent.eventNumber,
        eventDate: result.deathEvent.eventDate.toISOString(),
        location: result.deathEvent.location,
        documentNumber: result.deathEvent.documentNumber,
        status: result.deathEvent.status,
      },
      employeeId: session.user.id,
    });

    revalidatePath("/citizens");
    revalidatePath("/events");

    let successMessage = "تم تسجيل واقعة الوفاة بنجاح، ونقل قيده إلى الوفيات.";
    if (result.updatedSpouse) {
      successMessage += ` وتم تحديث حالة ${deceased.gender === "MALE" ? "زوجته" : "زوجها"} ليصبح (أرمل) آلياً.`;
    }

    return {
      success: true,
      message: successMessage,
      data: result
    };

  } catch (error) {
    console.error("Death Registration Error:", error);
    return { success: false, message: "حدث خطأ داخلي أثناء تسجيل الوفاة، لم يتم حفظ البيانات." };
  }
}
