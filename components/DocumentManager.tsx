"use client";

import { useState } from "react";
import { Search, Printer, Download } from "lucide-react";
import { generateDocPdf } from "@/lib/generateDocPdf";

const docTypes = ["سند إقامة", "شهادة ميلاد", "شهادة زواج", "قيد عائلي", "قيد فردي"];

const docColors: Record<string, string> = {
  "سند إقامة": "#064e3b",
  "شهادة ميلاد": "#1e40af",
  "شهادة زواج": "#7c2d12",
  "قيد عائلي": "#4a1d6e",
  "قيد فردي": "#374151",
};

const docIcons: Record<string, string> = {
  "سند إقامة": "🏠",
  "شهادة ميلاد": "👶",
  "شهادة زواج": "💍",
  "قيد عائلي": "👨‍👩‍👧‍👦",
  "قيد فردي": "📋",
};

const specificFieldsMap: Record<string, [string, string][]> = {
  "شهادة ميلاد": [
    ["تاريخ الميلاد", "١٥/٠٣/١٩٩٨"],
    ["مكان الميلاد", "عمّان"],
    ["الجنس", "ذكر"],
  ],
  "شهادة زواج": [
    ["اسم الزوجة", "فاطمة أحمد العبادي"],
    ["تاريخ الزواج", "٠١/٠٦/٢٠٢٠"],
  ],
  "قيد عائلي": [
    ["عدد أفراد الأسرة", "٤"],
    ["رب الأسرة", "محمد سامر الشمري"],
  ],
};

interface RecentDoc {
  type: string;
  citizen: string;
  nid: string;
  time: string;
  employee: string;
}

interface DocumentManagerProps {
  recentDocs: RecentDoc[];
}

export default function DocumentManager({ recentDocs }: DocumentManagerProps) {
  const [selectedDoc, setSelectedDoc] = useState("سند إقامة");
  const [issued, setIssued] = useState(false);
  const [citizenFound, setCitizenFound] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const accentColor = docColors[selectedDoc] || "#064e3b";

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      await generateDocPdf({
        type: selectedDoc,
        citizenName: "محمد سامر يوسف الشمري",
        nid: "٩٩٨١٢٣٤٥٦٧",
        address: "الجبيهة — شارع الجامعة ٤٥",
        neighborhood: "الجبيهة",
        issueDate: "٢٠/١١/٢٠٢٤",
        employee: "م. أحمد الخالدي",
        refNumber: "DOC-2024-00187",
      });
    } catch (e) {
      console.error("PDF generation error:", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadRecentPdf = async (doc: RecentDoc) => {
    try {
      await generateDocPdf({
        type: doc.type,
        citizenName: doc.citizen,
        nid: doc.nid,
        address: "الجبيهة — شارع الجامعة ٤٥",
        neighborhood: "الجبيهة",
        issueDate: "٢٠/١١/٢٠٢٤",
        employee: doc.employee,
        refNumber: `DOC-2024-${Math.floor(Math.random() * 99999).toString().padStart(5, "0")}`,
      });
    } catch (e) {
      console.error("PDF generation error:", e);
    }
  };

  const baseFields: [string, string][] = [
    ["الاسم الكامل", "محمد سامر يوسف الشمري"],
    ["الرقم الوطني", "٩٩٨١٢٣٤٥٦٧"],
    ["العنوان", "الجبيهة — شارع الجامعة ٤٥"],
    ["الحي", "الجبيهة"],
  ];

  const extraFields = specificFieldsMap[selectedDoc] || [];
  const allFields = [...baseFields, ...extraFields, ["تاريخ الإصدار", "٢٠/١١/٢٠٢٤"]];

  return (
    <div className="space-y-6">
      {/* Quick Issue */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h4 className="font-bold mb-4">إصدار وثيقة سريعة</h4>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="ابحث عن المواطن بالاسم أو الرقم الوطني..."
              className="w-full h-11 pr-10 pl-4 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              onFocus={() => setCitizenFound(true)}
            />
          </div>

          {citizenFound && (
            <div className="p-3 rounded-md bg-secondary/50 border flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">م.ش</div>
              <div>
                <p className="font-medium text-sm">محمد سامر الشمري</p>
                <p className="text-xs text-muted-foreground font-mono">٩٩٨١٢٣٤٥٦٧ — الجبيهة</p>
              </div>
              <span className="badge-active mr-auto">نشط</span>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground mb-2">نوع الوثيقة</p>
            <div className="flex flex-wrap gap-2">
              {docTypes.map((d) => (
                <button
                  key={d}
                  onClick={() => { setSelectedDoc(d); setIssued(false); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedDoc === d ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIssued(true)}
            className="h-11 px-8 rounded-md bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
          >
            إصدار الوثيقة
          </button>
        </div>
      </div>

      {/* Print Preview — unique design per type */}
      {issued && (
        <div className="space-y-4">
          <div
            className="bg-card rounded-lg shadow-sm max-w-2xl mx-auto overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
            style={{ border: `3px solid ${accentColor}` }}
          >
            {/* Top accent bar */}
            <div style={{ height: 6, background: accentColor }} />

            <div className="p-8">
              {/* Header */}
              <div className="text-center border-b pb-6 mb-6" style={{ borderColor: `${accentColor}30` }}>
                <div className="text-4xl mb-3">{docIcons[selectedDoc] || "🏛"}</div>
                <h3 className="text-lg font-bold" style={{ color: accentColor }}>المملكة الأردنية الهاشمية</h3>
                <p className="text-sm text-muted-foreground">دائرة الأحوال المدنية والجوازات</p>
                <div
                  className="mt-4 inline-block px-6 py-2 rounded text-white font-bold text-lg"
                  style={{ background: accentColor }}
                >
                  {selectedDoc}
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-0 text-sm">
                {allFields.map(([label, val], i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-dashed" style={{ borderColor: "#e2e8f0" }}>
                    <span className="text-muted-foreground">{label}:</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 flex justify-between items-end text-xs text-muted-foreground" style={{ borderTop: `1.5px solid ${accentColor}30` }}>
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

            {/* Bottom accent bar */}
            <div style={{ height: 4, background: accentColor }} />
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Download className="w-4 h-4" />
              {downloading ? "جارٍ التحميل..." : "تحميل PDF"}
            </button>
            <button
              onClick={() => window.print()}
              className="h-10 px-6 rounded-md border text-sm font-medium flex items-center gap-2 hover:bg-secondary/50 transition-colors"
            >
              <Printer className="w-4 h-4" /> طباعة
            </button>
          </div>
        </div>
      )}

      {/* Recent docs */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-5 border-b">
          <h4 className="font-bold">أحدث الوثائق الصادرة اليوم</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground text-xs">
                <th className="text-right p-3 font-medium">نوع الوثيقة</th>
                <th className="text-right p-3 font-medium">المواطن</th>
                <th className="text-right p-3 font-medium">الرقم الوطني</th>
                <th className="text-right p-3 font-medium">وقت الإصدار</th>
                <th className="text-right p-3 font-medium">أصدرها</th>
                <th className="text-right p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {recentDocs.map((d, i) => (
                <tr key={i} className="border-t hover:bg-secondary/20 transition-colors">
                  <td className="p-3"><span className="badge-blue">{d.type}</span></td>
                  <td className="p-3 font-medium">{d.citizen}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{d.nid}</td>
                  <td className="p-3 text-muted-foreground">{d.time}</td>
                  <td className="p-3 text-muted-foreground">{d.employee}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadRecentPdf(d)}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </button>
                      <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Printer className="w-3 h-3" /> طباعة
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
