/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  AddEmployeeFormData,
  addEmployeeSchema,
  EditEmployeeFormData,
  editEmployeeSchema,
} from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { hashPassword } from "better-auth/crypto";
import { createAuditLog } from "./audit";

export async function addEmployee(data: AddEmployeeFormData) {
  try {
    const validatedFields = addEmployeeSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, message: "بيانات المدخلات غير صالحة" };
    }
    // التحقق من الصلاحية
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "غير مصرح لك بإضافة موظف",
      };
    }

    // التحقق من وجود الموظف
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        email: `${data.username}@civil.gov.sd`,
      },
    });

    if (existingEmployee) {
      return {
        success: false,
        message: "اسم المستخدم موجود بالفعل",
      };
    }

    const newUserResponse = await auth.api.createUser({
      body: {
        email: `${data.username}@civil.gov.sd`,
        password: data.password,
        name: data.name,
        role: data.role as any,
      },
      headers: await headers(),
    });

    // 2. تجهيز كائن الموظف للواجهة (بدون استعلام Prisma إضافي)
    const createdEmployee = {
      ...newUserResponse.user,
      _count: {
        documents: 0,
        civilEvents: 0,
      }
    } as any;

    // 3. إضافة السجل
    await createAuditLog({
      action: "CREATE",
      tableName: "Employee",
      recordId: createdEmployee.id,
      newData: {
        name: createdEmployee.name,
        email: createdEmployee.email,
        role: createdEmployee.role,
      },
      employeeId: session.user.id,
    });

    revalidatePath("/employees");
    revalidatePath("/audit");
    return {
      success: true,
      message: "تم إضافة الموظف بنجاح",
      employee: createdEmployee,
    };
  } catch (error: any) {
    console.error("Error creating employee:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

//! TOGGLE EMPLOYEE STATUS
export async function toggleEmployeeStatus(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "غير مصرح لك بتعديل حالة الموظف" };
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return { success: false, message: "الموظف غير موجود" };
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: { isActive: !employee.isActive },
    });

    revalidatePath("/employees", "page");
    return {
      success: true,
      message: `تم ${updatedEmployee.isActive ? "تفعيل" : "تعطيل"} الموظف بنجاح`,
    };
  } catch (error: any) {
    console.error("Error toggling employee status:", error);
    return { success: false, message: error.message };
  }
}
//! EDIT EMPLOYEE DETAILS
export async function editEmployeeDetails(
  id: string,
  data: EditEmployeeFormData,
) {
  try {
    const validatedFields = editEmployeeSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, message: "بيانات المدخلات غير صالحة" };
    }

    // التحقق من الصلاحية
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "غير مصرح لك بتعديل معلومات الموظف",
      };
    }

    // التحقق من وجود الموظف
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return {
        success: false,
        message: "الموظف غير موجود",
      };
    }

    // منع تعديل حالة موظف ADMIN
    if (employee.role === "ADMIN" && data.isActive !== employee.isActive) {
      return {
        success: false,
        message: "لا يمكن تعديل حالة موظف إداري",
      };
    }

    // تحديث بيانات الموظف
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        isActive: data.isActive,
        email: `${data.username}@civil.gov.sd`,
      },
    });

    // تحديث كلمة المرور مباشرة عبر Prisma بدون الحاجة للكلمة القديمة
    if (data.password && data.password.trim()) {
      const hashedPassword = await hashPassword(data.password);
      await prisma.account.updateMany({
        where: {
          userId: id,
          providerId: "credential",
        },
        data: {
          password: hashedPassword,
        },
      });
    }
    if (updatedEmployee) {
      await createAuditLog({
        action: "UPDATE",
        tableName: "Employee",
        recordId: id,
        oldData: {
          name: employee.name,
          email: employee.email,
          role: employee.role,
          isActive: employee.isActive,
        },
        newData: {
          name: updatedEmployee.name,
          email: updatedEmployee.email,
          role: updatedEmployee.role,
          isActive: updatedEmployee.isActive,
        },
        employeeId: session.user.id, 
      });
    }

    revalidatePath("/employees", "page");
    revalidatePath("/audit");
    return {
      success: true,
      message: "تم تحديث بيانات الموظف بنجاح",
      employee: updatedEmployee,
    };
  } catch (error: any) {
    console.error("Error editing employee details:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}
