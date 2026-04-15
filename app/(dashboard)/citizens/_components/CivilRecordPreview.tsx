"use client";

import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import CivilRecordPDF from "./CivilRecordPDF";
import { Loader2 } from "lucide-react";
import QRCode from "qrcode";

interface CivilRecordPreviewProps {
  recordData: any;
  nationalId: string;
}

export function CivilRecordPreview({ recordData, nationalId }: CivilRecordPreviewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);

    // توليد باركود التحقق داخلياً بشكل آمن بدون الاعتماد على API خارجي
    if (recordData?.documentId) {
      const verificationUrl = `${window.location.origin}/verify/${nationalId}?doc=${recordData?.documentId}`;
      QRCode.toDataURL(verificationUrl, {
        margin: 1,
        width: 200,
        color: { dark: '#000000', light: '#ffffff' }
      })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error("QR Generation Error", err));
    }
  }, [nationalId, recordData]);

  // Show a loading spinner during SSR / early hydration phase
  if (!isMounted || !qrCodeUrl) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[800px] bg-zinc-300 rounded-lg">
         <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
         <p className="text-sm font-medium text-muted-foreground">جاري تجهيز وعرض الوثيقة المشفّرة...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-[800px] bg-zinc-300 p-2 sm:p-4 rounded-lg overflow-hidden border relative z-10">
      <PDFViewer style={{ width: '100%', height: '100%', minHeight: '800px', border: 'none', borderRadius: '0.5rem', backgroundColor: '#d4d4d8' }} showToolbar={true}>
        <CivilRecordPDF data={recordData} qrCodeUrl={qrCodeUrl} />
      </PDFViewer>
    </div>
  );
}
