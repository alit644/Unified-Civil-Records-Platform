"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createDocumentRecord } from "@/lib/services/document.service";
import { createAuditLog } from "./audit";
import { revalidatePath } from "next/cache";

export async function issueDocumentAction(citizenId: string, documentTypeArabic: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, message: "غير مصرح لك (تحتاج إلى تسجيل دخول)" };
    }

    // Call service to generate generic document and insert to DB
    const serviceResult = await createDocumentRecord(
      citizenId,
      session.user.id,
      documentTypeArabic
    );

    if ('success' in serviceResult && serviceResult.success === false) {
       return { success: false, message: serviceResult.message };
    }

    const { genericDocData, docRecord } = serviceResult as { genericDocData: any; docRecord: any };


    // Create Audit Log
    await createAuditLog({
      action: "ISSUE_DOCUMENT",
      tableName: "Document",
      recordId: docRecord.id,
      newData: {
        documentType: docRecord.type,
        archiveNumber: docRecord.archiveNumber,
      },
      employeeId: session.user.id,
    });

    revalidatePath("/documents");

    return { 
      success: true, 
      data: genericDocData,
      message: "تم إصدار الوثيقة بنجاح ورشفتها في الخادم."
    };
  } catch (error: any) {
    console.error("issueDocumentAction Error:", error);
    return { success: false, message: "حدث خطأ أثناء إصدار الوثيقة." };
  }
}
