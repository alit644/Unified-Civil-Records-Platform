import prisma from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";

type ActionType =
  | "CREATE"
  | "CREATE_CITIZEN"
  | "UPDATE_CITIZEN"
  | "UPDATE"
  | "DELETE"
  | "STATUS_CHANGE"
  | "EVENT_REGISTERED"
  | "DOCUMENT_ISSUED"
  | "APPROVE"
  | "REJECT";

interface LogParams {
  action: ActionType;
  tableName: string;
  recordId: string; // معرف السجل المتأثر (مثل ID الموظف أو الجلسة)
  oldData?: Prisma.JsonValue;
  newData?: Prisma.JsonValue;
  employeeId: string; // الآدمن أو الموظف الذي قام بالحدث
}

export async function createAuditLog({
  action,
  tableName,
  recordId,
  oldData,
  newData,
  employeeId,
}: LogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        tableName,
        recordId,
        oldData: oldData || undefined,
        newData: newData || undefined,
        employeeId,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("❌ فشل في حفظ سجل النشاط:", error);
  }
}
