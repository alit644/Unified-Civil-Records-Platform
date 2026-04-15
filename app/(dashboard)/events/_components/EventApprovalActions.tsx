"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { updateEventStatus } from "@/actions/event-approval";
import { EventStatus } from "@/lib/generated/prisma/enums";
import { notify } from "@/lib/notify";
import { useRouter } from "next/navigation";

interface EventApprovalActionsProps {
  eventId: string;
  currentStatus: string;
  userRole: string;
}

export default function EventApprovalActions({ eventId, currentStatus, userRole }: EventApprovalActionsProps) {
  const [loading, setLoading] = useState<"APPROVE" | "REJECT" | null>(null);
  const router = useRouter();

  if (currentStatus !== "PENDING" || userRole !== "ADMIN") return null;

  const handleUpdate = async (status: EventStatus) => {
    setLoading(status === "APPROVED" ? "APPROVE" : "REJECT");
    try {
      const res = await updateEventStatus(eventId, status);
      if (res.success) {
        notify(res.message, "success");
        router.refresh();
      } else {
        notify(res.message, "error");
      }
    } catch (error) {
      notify("حدث خطأ غير متوقع", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-9"
        onClick={() => handleUpdate(EventStatus.REJECTED)}
        disabled={!!loading}
      >
        {loading === "REJECT" ? (
          <Loader2 className="w-4 h-4 animate-spin ml-2" />
        ) : (
          <XCircle className="w-4 h-4 ml-2" />
        )}
        رفض الواقعة
      </Button>
      <Button
        className="bg-green-600 hover:bg-green-700 text-white h-9 shadow-lg shadow-green-100"
        onClick={() => handleUpdate(EventStatus.APPROVED)}
        disabled={!!loading}
      >
        {loading === "APPROVE" ? (
          <Loader2 className="w-4 h-4 animate-spin ml-2" />
        ) : (
          <CheckCircle2 className="w-4 h-4 ml-2" />
        )}
        اعتماد الواقعة
      </Button>
    </div>
  );
}
