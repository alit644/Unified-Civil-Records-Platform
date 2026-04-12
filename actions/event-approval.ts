"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role, EventStatus } from "@/lib/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAuditLog } from "./audit";

export async function updateEventStatus(eventId: string, status: EventStatus, notes?: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "غير مصرح لك بإجراء هذا العمل (يتطلب صلاحية مدير)" };
    }

    const event = await prisma.civilEvent.findUnique({
      where: { id: eventId },
      include: { primaryCitizen: true }
    });

    if (!event) {
      return { success: false, message: "الواقعة غير موجودة" };
    }

    if (event.status !== "PENDING") {
        return { success: false, message: "لا يمكن تعديل حالة واقعة معتمدة أو مرفوضة مسبقاً" };
    }

    const updatedEvent = await prisma.civilEvent.update({
      where: { id: eventId },
      data: {
        status,
        finalDate: status === "APPROVED" ? new Date() : null,
        notes: notes ? `${event.notes}\n--- تاريخ التحديث: ${notes}` : event.notes
      }
    });

    await createAuditLog({
      action: status === "APPROVED" ? "APPROVE" : "REJECT",
      tableName: "CivilEvent",
      recordId: event.id,
      oldData: { status: event.status },
      newData: { status: updatedEvent.status, finalDate: updatedEvent.finalDate?.toISOString() },
      employeeId: session.user.id,
    });

    revalidatePath("/events");
    revalidatePath(`/events/${event.eventNumber}`);

    return { 
        success: true, 
        message: status === "APPROVED" ? "تم اعتماد الواقعة بنجاح" : "تم رفض الواقعة" 
    };

  } catch (error) {
    console.error("Update Event Status Error:", error);
    return { success: false, message: "حدث خطأ أثناء تحديث حالة الواقعة" };
  }
}
