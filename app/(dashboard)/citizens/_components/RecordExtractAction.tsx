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
import { Printer, FileText, Download } from "lucide-react";
import { CivilRecordPreview } from "./CivilRecordPreview";

export default function RecordExtractAction({ nationalId }: { nationalId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleDownloadPDF = async () => {
    if (!recordData) return;
    setIsGenerating(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const QRCodeLib = await import('qrcode');
      const QRCode = QRCodeLib.default || QRCodeLib; 
      const CivilRecordPDF = (await import('./CivilRecordPDF')).default;
      
      // استخدام الرقم الرسمي المسجل في قاعدة البيانات
      const documentId = recordData.documentId;
      const verificationUrl = `${window.location.origin}/verify/${nationalId}?doc=${documentId}`;
      
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        margin: 1,
        width: 200,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      const blob = await pdf(<CivilRecordPDF data={recordData} qrCodeUrl={qrDataUrl} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Civil_Record_${nationalId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      notify("تم تحميل الملف بنجاح", "success");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      notify("فشل توليد ملف PDF عالي الجودة", "error");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <Button onClick={handleExtractRecord} disabled={isPending} variant="outline" size="sm" className="bg-secondary/10 px-2 py-1 rounded border border-primary/20 text-primary text-[10px] sm:text-xs">
        {isPending ? "جاري الاستخراج..." : "بيان قيد فردي"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[1000px] !w-[95vw] p-0 border-none bg-zinc-200 overflow-y-auto max-h-[95vh]">
          <DialogHeader className="p-4 bg-white border-b print:hidden flex-row justify-between items-center sticky top-0 z-50">
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <FileText className="w-4 h-4" /> معاينة بيان القيد الرسمي
            </DialogTitle>
            <div className="flex gap-2">
              <Button onClick={() => window.print()} variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-bold">
                <Printer className="w-3.5 h-3.5" /> طباعة
              </Button>
              
              {recordData && (
                <Button 
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  size="sm" 
                  className="h-8 gap-1.5 text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isGenerating ? "جاري التجهيز..." : "تحميل PDF عالي الجودة"}
                </Button>
              )}
            </div>
          </DialogHeader>

          {recordData && (
            <CivilRecordPreview recordData={recordData} nationalId={nationalId} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
