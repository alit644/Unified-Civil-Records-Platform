"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import GenericDocumentPDF, { GenericDocData } from "./GenericDocumentPDF";
import { useEffect, useState } from "react";

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
      <DialogContent className="max-w-5xl w-[95vw]  flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-right font-bold text-xl">
            معاينة الوثيقة ({docData.documentTitle})
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 w-full bg-muted/50 rounded-lg overflow-hidden border mt-2">
          {isOpen && (
            <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
              <GenericDocumentPDF data={docData} />
            </PDFViewer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
