"use client"
import { getCivilRecordExtract } from "@/actions/citizens";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notify";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { CivilRecordPreview } from "./CivilRecordPreview";

export default function RecordExtractAction({ nationalId }: { nationalId: string }) {
  const [isPending, startTransition] = useTransition();
  const [recordData, setRecordData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleExtractRecord = async () => {
    startTransition(async () => {
      try {
        const res = await getCivilRecordExtract(nationalId);
        if (res.success) {
          setRecordData(res.data);
          setIsOpen(true);
        } else {
          notify(res.message, "error");
        }
      } catch (error) {
        notify("حدث خطأ في الاتصال بالخادم.", "error");
      }
    });
  }

  return (
    <>
      <Button onClick={handleExtractRecord} disabled={isPending} variant="outline" size="sm" className="bg-secondary/10 px-2 py-1 rounded border border-primary/20 text-primary text-[10px] sm:text-xs">
        {isPending ? "جاري الاستخراج..." : "بيان قيد فردي"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl w-[95vw] flex flex-col p-0 border-none bg-zinc-200 overflow-y-auto max-h-[95vh]">
          <DialogHeader className="p-4 bg-white border-b print:hidden flex-row justify-between items-center sticky top-0 z-50">
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <FileText className="w-4 h-4" /> معاينة بيان القيد الرسمي
            </DialogTitle>
          </DialogHeader>

          {recordData && (
            <CivilRecordPreview recordData={recordData} nationalId={nationalId} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
