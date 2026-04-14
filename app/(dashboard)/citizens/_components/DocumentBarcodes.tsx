"use client"
import { QRCodeSVG } from 'qrcode.react';

interface DocumentBarcodesProps {
  nationalId: string;
  documentId: string;
  className?: string;
  size?: number;
}

export function DocumentBarcodes({ 
  nationalId, 
  documentId, 
  className = "", 
  size = 64 
}: DocumentBarcodesProps) {
  
  // الرابط الذي سيتم توجيه المستخدم إليه عند مسح الكود
  // نستخدم مساراً نسبياً ليعمل في أي بيئة (تطوير أو إنتاج)
  const verificationUrl = `${window.location.origin}/verify/${nationalId}?doc=${documentId}`;

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {/* برواز الكود */}
      <div className="p-1.5 bg-white border border-zinc-300 shadow-sm rounded-sm">
        <QRCodeSVG 
          value={verificationUrl}
          size={size}
          level="H" 
          includeMargin={false}
          imageSettings={{
            src: "/emblem.png", 
            x: undefined,
            y: undefined,
            height: size * 0.2,
            width: size * 0.2,
            excavate: true,
          }}
        />
      </div>
      
      {/* معرف الوثيقة الأمني */}
      <span className="text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
        {documentId}
      </span>
    </div>
  );
}
