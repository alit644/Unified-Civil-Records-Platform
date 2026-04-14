"use client"
import { format } from "date-fns";
import { DocumentBarcodes } from "./DocumentBarcodes";

interface CivilRecordPreviewProps {
  recordData: any;
  nationalId: string;
}

const GOV_COLORS = {
  black: "#1a1a1a",
  grayDark: "#666666",
  grayMuted: "#888888",
  grayBorder: "#bbbbbb",
  grayBg: "#eeeeee",
  grayBgLight: "#f9fafb",
  white: "#ffffff"
};

const statusTranslations: Record<string, string> = {
  "SINGLE": "أعزب",
  "MARRIED": "متزوج",
  "WIDOWED": "أرمل",
  "DIVORCED": "مطلق",
  "SEPARATED": "منفصل",
  "UNKNOWN": "غير معروف"
};

export function CivilRecordPreview({ recordData, nationalId }: CivilRecordPreviewProps) {
  const documentId = recordData.documentId;

  return (
    <div className="p-8 flex justify-center overflow-x-auto bg-zinc-300">
      <div
        className="bg-white w-[210mm] min-h-[297mm] p-12 relative shadow-xl text-right leading-normal"
        dir="rtl"
        style={{ color: GOV_COLORS.black, backgroundColor: GOV_COLORS.white, fontFamily: 'Arial, sans-serif' }}
      >
        {/* العلامات المائية */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-[-30deg]">
          <h1 className="text-8xl font-black whitespace-nowrap" style={{ color: GOV_COLORS.grayDark }}>السجل المدني السوري</h1>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
          <img src="/emblem.png" alt="" className="w-96 h-96 object-contain" />
        </div>

        {/* الترويسة */}
        <div className="relative z-10 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-24 h-24 flex items-center justify-center p-1">
              <img src="/emblem.png" alt="شعار الدولة" className="w-full h-full object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black mb-1">بيان قيد مدني فردي</h1>
              <p className="text-[9px] font-bold uppercase" style={{ color: GOV_COLORS.grayDark }}>INDIVIDUAL CIVIL REGISTRY STATEMENT • مستخرج إلكترونياً</p>
            </div>
            <div className="text-[11px] font-bold leading-relaxed">
              الجمهورية العربية السورية<br />
              وزارة الداخلية<br />
              المديرية العامة للشؤون المدنية
            </div>
          </div>
          <div className="flex justify-between border-y py-2 text-[10px] font-bold" style={{ borderColor: GOV_COLORS.grayBorder }}>
            <span>رقم الوثيقة: {documentId}</span>
            <span>تاريخ الإصدار: {format(new Date(), "yyyy/MM/dd — HH:mm")}</span>
            <span>صالح لمدة: 3 أشهر من تاريخ الإصدار</span>
          </div>
        </div>

        {/* البيانات والـ QR */}
        <div className="flex gap-6 mb-8 relative z-10 text-right">
          <div className="flex-1">
            <div className="flex border" style={{ direction: 'rtl', borderColor: GOV_COLORS.grayBorder }}>
              <MetaBox label="الرقم الوطني" value={recordData?.personalInfo.nationalId} />
              <MetaBox label="رقم الطلب" value={`REQ-${Date.now().toString().slice(-4)}`} />
              <MetaBox label="مكتب الإصدار" value={`أمانة ${recordData?.personalInfo.registryDetails.split(" ")[1]} المركزية`} />
            </div>
          </div>

          <DocumentBarcodes
            nationalId={nationalId}
            documentId={documentId}
            size={70}
          />

          <div className="w-20 h-24 border flex items-center justify-center text-center p-2" style={{ backgroundColor: GOV_COLORS.grayBgLight, borderColor: GOV_COLORS.grayBorder }}>
            <span className="text-[8px] font-bold leading-tight opacity-40">صورة<br />شخصية</span>
          </div>
        </div>

        {/* المعلومات الشخصية */}
        <div className="mb-8 relative z-10">
          <h3 className="text-xs font-black mb-2 px-1">أولاً: المعلومات الشخصية / PERSONAL INFORMATION</h3>
          <table className="w-full border-collapse border text-[11px]" style={{ borderColor: GOV_COLORS.grayBorder }}>
            <tbody>
              <tr>
                <TableLabel text="الاسم الكامل والكنية" />
                <TableValue text={recordData?.personalInfo.fullName} />
                <TableLabel text="اسم الأب" width="130px" />
                <TableValue text={recordData?.personalInfo.fatherName} />
              </tr>
              <tr>
                <TableLabel text="اسم الأم ونسبتها" />
                <TableValue text={recordData?.personalInfo.motherName} />
                <TableLabel text="الجنس" />
                <TableValue text={recordData?.personalInfo.gender} />
              </tr>
              <tr>
                <TableLabel text="مكان وتاريخ الولادة" />
                <TableValue text={`${recordData?.personalInfo.placeOfBirth} — ${recordData?.personalInfo.birthDate}`} />
                <TableLabel text="الحالة الاجتماعية" />
                <TableValue text={statusTranslations[recordData?.personalInfo.maritalStatus.toUpperCase()] || recordData?.personalInfo.maritalStatus} />
              </tr>
              <tr>
                <TableLabel text="أمانة القيد - الرقم" />
                <TableValue text={recordData?.personalInfo.registryDetails} />
                <TableLabel text="فئة القيد" />
                <TableValue text="أصلي" />
              </tr>
            </tbody>
          </table>
        </div>

        {/* السجل التاريخي */}
        <div className="mb-8 relative z-10">
          <h3 className="text-xs font-black mb-2 px-1">ثانياً: سجل القيود والواقعات / CIVIL EVENTS RECORD</h3>
          <table className="w-full border-collapse border text-[10px]" style={{ borderColor: GOV_COLORS.grayBorder }}>
            <thead className="font-bold" style={{ backgroundColor: GOV_COLORS.grayBgLight }}>
              <tr className="border-b" style={{ borderColor: GOV_COLORS.grayBorder }}>
                <th className="p-2 border-l text-right w-[90px]" style={{ borderColor: GOV_COLORS.grayBorder }}>نوع الواقعة</th>
                <th className="p-2 border-l text-right w-[100px]" style={{ borderColor: GOV_COLORS.grayBorder }}>التاريخ</th>
                <th className="p-2 border-l text-right" style={{ borderColor: GOV_COLORS.grayBorder }}>تفاصيل الواقعة</th>
                <th className="p-2 text-right w-[80px]">رقم السجل</th>
              </tr>
            </thead>
            <tbody>
              {recordData?.eventsHistory.map((event: any, idx: number) => (
                <tr key={idx} className="border-b last:border-0" style={{ borderColor: GOV_COLORS.grayBorder }}>
                  <td className="p-2 border-l font-bold text-right" style={{ borderColor: GOV_COLORS.grayBorder }}>{event.eventType}</td>
                  <td className="p-2 border-l text-right" style={{ borderColor: GOV_COLORS.grayBorder }}>{format(new Date(event.eventDate), "yyyy/MM/dd")}</td>
                  <td className="p-2 border-l text-right" style={{ borderColor: GOV_COLORS.grayBorder, color: GOV_COLORS.grayDark }}>
                    {event.secondaryCitizen ? `الطرف الآخر: ${event.secondaryCitizen.firstName} ${event.secondaryCitizen.lastName}` : (event.location || "مركز الشؤون المدنية")}
                  </td>
                  <td className="p-2 text-right font-mono text-[9px]">{`${idx + 1}/${nationalId.slice(-3)}`}</td>
                </tr>
              ))}
              {recordData?.eventsHistory.length === 0 && (
                <tr className="text-right">
                  <td colSpan={4} className="p-6 text-center italic" style={{ color: GOV_COLORS.grayMuted }}>لا توجد واقعات أخرى مسجلة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* التذييل والتصديق - مستقر بالأسفل */}
        <div className="absolute bottom-12 left-12 right-12">
          <div className="mb-6 p-4 border text-[10px] leading-relaxed relative z-10 text-justify" style={{ borderColor: GOV_COLORS.grayBorder }}>
            <strong>بيان إخلاء مسؤولية قانوني: </strong>
            تُقرّ المديرية العامة للشؤون المدنية بأن هذه البيانات مستخرجة من المركز الرقمي للبيانات الوطنية وتُعدّ مطابقة للسجلات الرسمية حتى تاريخ إصدار هذه الوثيقة. أيّ تعديل في محتوى هذه الوثيقة يعرّض حامله للملاحقة الجزائية والقانونية.
          </div>

          <div className="flex justify-between items-end relative z-10">
            <div className="flex flex-col gap-2">
              <div className="border p-2 bg-white flex flex-col items-center" style={{ borderColor: GOV_COLORS.grayBorder }}>
                <div className="h-4 w-32 opacity-10" style={{ backgroundColor: GOV_COLORS.black }} />
                <span className="font-mono text-[8px] tracking-[0.2em]" style={{ color: GOV_COLORS.grayMuted }}>SC-{nationalId}</span>
              </div>
            </div>

            <div className="text-center group relative">
              <p className="text-[10px] font-bold mb-1">تصديق أمين السجل</p>
              <div className="w-32 border-b mb-2 mx-auto" style={{ borderColor: GOV_COLORS.grayDark }} />
              <div className="absolute top-[-20px] left-[-30px] w-24 h-24 border-4 border-double rounded-full flex items-center justify-center rotate-12 -z-10 opacity-10" style={{ borderColor: GOV_COLORS.black }}>
                <span className="text-[9px] font-black text-center">صدق أصولاً</span>
              </div>
            </div>

            <div className="text-left text-[9px] leading-relaxed" style={{ color: GOV_COLORS.grayDark }}>
              <p className="font-bold text-black">المديرية العامة للشؤون المدنية</p>
              <p>الجمهورية العربية السورية</p>
              <p className="font-mono">www.civil.gov.sy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
function MetaBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex-1 p-2 text-right border-l last:border-l-0" style={{ borderColor: GOV_COLORS.grayBorder }}>
      <div className="text-[8px] font-bold uppercase leading-none mb-1" style={{ color: GOV_COLORS.grayMuted }}>{label}</div>
      <div className="text-[10px] font-bold text-black truncate">{value || "---"}</div>
    </div>
  )
}

function TableLabel({ text, width }: { text: string, width?: string }) {
  return (
    <td className="p-2 border-l border-b font-bold text-right" style={{ width, backgroundColor: GOV_COLORS.grayBgLight, borderColor: GOV_COLORS.grayBorder }}>{text}</td>
  )
}

function TableValue({ text }: { text: string }) {
  return (
    <td className="p-2 border-l border-b text-right" style={{ borderColor: GOV_COLORS.grayBorder }}>{text || "---"}</td>
  )
}
