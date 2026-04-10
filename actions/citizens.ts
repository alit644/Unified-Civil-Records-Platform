"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { CitizenFormValues, citizenSchema } from "@/lib/schema";
import { extractGovernorateCode, getUniqueNationalId } from "@/lib/utils/generate-id";
import { parseISO } from "date-fns";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

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

    if (!session || session.user.role !== "ADMIN" && session.user.role !== "OFFICER") {
      return {
        success: false,
        message: "غير مصرح لك بتعديل معلومات الموظف",
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

    revalidatePath("/citizens");
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