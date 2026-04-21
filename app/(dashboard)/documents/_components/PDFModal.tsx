"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import GenericDocumentPDF, { GenericDocData } from "./GenericDocumentPDF";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  docData: GenericDocData | null;
}

export default function PDFModal({ isOpen, onClose, docData }: PDFModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !docData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0"
              onClick={onClose}
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </Button>

            <DialogTitle className="text-right font-bold text-lg flex-1">
              معاينة الوثيقة ({docData.documentTitle})
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 w-full bg-muted/50 overflow-hidden min-h-0">
          {isOpen && (
            <PDFViewer style={{ width: "100%", height: "100%", border: "none" }} showToolbar={true}>
              <GenericDocumentPDF data={docData} />
            </PDFViewer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
