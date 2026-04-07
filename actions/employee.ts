"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role } from "@/lib/generated/prisma/enums";
import { AddEmployeeFormData, addEmployeeSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function addEmployee(data: AddEmployeeFormData) {
  try {
    const validatedFields = addEmployeeSchema.safeParse(data); 
    if (!validatedFields.success) {
      return { success: false, message: "بيانات المدخلات غير صالحة" };
    }
    // التحقق من الصلاحية
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "غير مصرح لك بإضافة موظف"
      }
    }

    // التحقق من وجود الموظف
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        email: `${data.username}@civil.gov.sd`
      }
    })

    if (existingEmployee) {
      return {
        success: false,
        message: "اسم المستخدم موجود بالفعل"
      }
    }

    const newUser = await auth.api.signUpEmail({
      body: {
        email: `${data.username}@civil.gov.sd`,
        password: data.password,
        name: data.name,
        isActive: true,
        role: data.role as Role,
      }
    })
    console.log(newUser)
    revalidatePath("/employees");
    return {
      success: true,
      message: "تم إضافة الموظف بنجاح"
    }
  } catch (error:any) {
    console.error("Error creating employee:", error);
    return {
      success: false,
      message: error.message
    }
  }
}