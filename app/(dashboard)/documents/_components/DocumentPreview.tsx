import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { docColors, docIcons, baseFields, specificFieldsMap } from "./constants";

interface DocumentPreviewProps {
  selectedDoc: string;
  downloading: boolean;
  onDownload: () => void;
}

export const DocumentPreview = ({ selectedDoc, downloading, onDownload }: DocumentPreviewProps) => {
  const accentColor = docColors[selectedDoc] || "#064e3b";
  const extraFields = specificFieldsMap[selectedDoc] || [];
  const allFields = [...baseFields, ...extraFields, ["تاريخ الإصدار", "٢٠/١١/٢٠٢٤"]];

  return (
    <div className="space-y-4">
      <div
        className="bg-card rounded-lg shadow-sm max-w-2xl mx-auto overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
        style={{ border: `3px solid ${accentColor}` }}
      >
        <div style={{ height: 6, background: accentColor }} />

        <div className="p-8">
          <div className="text-center border-b pb-6 mb-6" style={{ borderColor: `${accentColor}30` }}>
            <div className="text-4xl mb-3">{docIcons[selectedDoc] || "🏛"}</div>
            <h3 className="text-lg font-bold" style={{ color: accentColor }}>
              المملكة الأردنية الهاشمية
            </h3>
            <p className="text-sm text-muted-foreground">دائرة الأحوال المدنية والجوازات</p>
            <div
              className="mt-4 inline-block px-6 py-2 rounded text-white font-bold text-lg"
              style={{ background: accentColor }}
            >
              {selectedDoc}
            </div>
          </div>

          <div className="space-y-0 text-sm">
            {allFields.map(([label, val], i) => (
              <div
                key={i}
                className="flex justify-between py-3 border-b border-dashed"
                style={{ borderColor: "#e2e8f0" }}
              >
                <span className="text-muted-foreground">{label}:</span>
                <span className="font-medium">{val}</span>
              </div>
            ))}
          </div>

          <div
            className="mt-8 pt-6 flex justify-between items-end text-xs text-muted-foreground"
            style={{ borderTop: `1.5px solid ${accentColor}30` }}
          >
            <div>
              <p>الموظف المُصدر: م. أحمد الخالدي</p>
              <p>الرقم المرجعي: DOC-2024-00187</p>
            </div>
            <div
              className="w-20 h-20 rounded flex items-center justify-center text-xs"
              style={{ border: `2px dashed ${accentColor}40`, color: `${accentColor}40` }}
            >
              ختم رسمي
            </div>
          </div>
        </div>

        <div style={{ height: 4, background: accentColor }} />
      </div>

      <div className="flex justify-center gap-3">
        <Button
          onClick={onDownload}
          disabled={downloading}
          className="h-10 px-6"
          variant="default"
        >
          <Download className="w-4 h-4 ml-2" />
          {downloading ? "جارٍ التحميل..." : "تحميل PDF"}
        </Button>
        <Button
          onClick={() => window.print()}
          variant="outline"
          className="h-10 px-6"
        >
          <Printer className="w-4 h-4 ml-2" /> طباعة
        </Button>
      </div>
    </div>
  );
};
