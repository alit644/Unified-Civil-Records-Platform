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

export async function updateCitizen(data: CitizenFormValues , id: string) {
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