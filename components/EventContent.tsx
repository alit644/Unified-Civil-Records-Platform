"use client";

import { useState } from "react";
import { Plus, Baby, Heart, Scale, Skull, X } from "lucide-react";

const eventTypes = [
  { label: "ولادة", icon: Baby },
  { label: "زواج", icon: Heart },
  { label: "طلاق", icon: Scale },
  { label: "وفاة", icon: Skull },
];

const typeFilter = ["الكل", "ولادة", "زواج", "طلاق", "وفاة"];

const typeBadge = (type: string) => {
  const map: Record<string, string> = { ولادة: "badge-blue", زواج: "badge-active", طلاق: "badge-orange", وفاة: "badge-gray" };
  return map[type] || "badge-gray";
};

const statusBadge = (s: string) => {
  if (s === "مقبول") return "badge-active";
  if (s === "بانتظار التدقيق") return "badge-pending";
  if (s === "مرفوض") return "badge-danger";
  return "badge-gray";
};

interface Event {
  id: string;
  type: string;
  citizen: string;
  eventDate: string;
  regDate: string;
  deadline: string;
  status: string;
  urgent?: boolean;
}

interface EventContentProps {
  initialEvents: Event[];
}

export default function EventContent({ initialEvents }: EventContentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("الكل");

  const filteredEvents = activeFilter === "الكل" 
    ? initialEvents 
    : initialEvents.filter(e => e.type === activeFilter);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card rounded-lg border p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {typeFilter.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <select className="h-9 px-3 rounded-md border bg-background text-sm mr-auto focus:outline-none focus:ring-1 focus:ring-ring">
          <option>جميع الحالات</option>
          <option>بانتظار التدقيق</option>
          <option>مقبول</option>
          <option>مرفوض</option>
        </select>
        <button 
          onClick={() => setDrawerOpen(true)} 
          className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> تسجيل واقعة جديدة
        </button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50 text-muted-foreground text-xs">
              <th className="text-right p-3 font-medium">رقم الواقعة</th>
              <th className="text-right p-3 font-medium">النوع</th>
              <th className="text-right p-3 font-medium">المواطن الرئيسي</th>
              <th className="text-right p-3 font-medium">تاريخ الواقعة</th>
              <th className="text-right p-3 font-medium">تاريخ التسجيل</th>
              <th className="text-right p-3 font-medium">الموعد النهائي</th>
              <th className="text-right p-3 font-medium">الحالة</th>
              <th className="text-right p-3 font-medium">خيارات</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((e, i) => (
              <tr key={i} className={`border-t hover:bg-secondary/20 ${i % 2 === 1 ? "bg-secondary/10" : ""}`}>
                <td className="p-3 font-mono text-xs text-muted-foreground">{e.id}</td>
                <td className="p-3"><span className={typeBadge(e.type)}>{e.type}</span></td>
                <td className="p-3 font-medium">{e.citizen}</td>
                <td className="p-3 text-muted-foreground">{e.eventDate}</td>
                <td className="p-3 text-muted-foreground">{e.regDate}</td>
                <td className={`p-3 ${e.urgent ? "text-[hsl(var(--status-red-text))] font-medium" : "text-muted-foreground"}`}>{e.deadline}</td>
                <td className="p-3"><span className={statusBadge(e.status)}>{e.status}</span></td>
                <td className="p-3">
                  <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">عرض</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-foreground/30" onClick={() => { setDrawerOpen(false); setSelectedType(null); }} />
          <div className="w-full max-w-md bg-card shadow-xl border-r overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">تسجيل واقعة مدنية جديدة</h3>
              <button onClick={() => { setDrawerOpen(false); setSelectedType(null); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm font-medium mb-3">نوع الواقعة</p>
                <div className="grid grid-cols-2 gap-3">
                  {eventTypes.map((et) => (
                    <button
                      key={et.label}
                      onClick={() => setSelectedType(et.label)}
                      className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        selectedType === et.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <et.icon className={`w-6 h-6 mx-auto mb-2 ${selectedType === et.label ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm font-medium">{et.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedType && (
                <div className="space-y-4">
                  <p className="text-sm font-medium">بيانات الواقعة</p>
                  {selectedType === "ولادة" && (
                    <>
                      <InputField label="اسم المولود" placeholder="أدخل اسم المولود الكامل" />
                      <InputField label="تاريخ الولادة" placeholder="يوم/شهر/سنة" />
                      <InputField label="مكان الولادة" placeholder="المستشفى أو المكان" />
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1.5">الجنس</label>
                        <select className="w-full h-10 px-3 rounded-md border bg-background text-sm">
                          <option>ذكر</option>
                          <option>أنثى</option>
                        </select>
                      </div>
                      <InputField label="بحث عن الأب" placeholder="ابحث بالاسم أو الرقم الوطني" />
                      <InputField label="بحث عن الأم" placeholder="ابحث بالاسم أو الرقم الوطني" />
                    </>
                  )}
                  {selectedType === "زواج" && (
                    <>
                      <InputField label="بحث عن الزوج" placeholder="ابحث بالاسم أو الرقم الوطني" />
                      <InputField label="بحث عن الزوجة" placeholder="ابحث بالاسم أو الرقم الوطني" />
                      <InputField label="تاريخ الزواج" placeholder="يوم/شهر/سنة" />
                      <InputField label="رقم وثيقة الزواج" placeholder="أدخل رقم الوثيقة" />
                      <InputField label="مكان الزواج" placeholder="المدينة أو المكان" />
                    </>
                  )}
                  {selectedType === "طلاق" && (
                    <>
                      <InputField label="بحث عن الزوج" placeholder="ابحث بالاسم أو الرقم الوطني" />
                      <InputField label="بحث عن الزوجة" placeholder="ابحث بالاسم أو الرقم الوطني" />
                      <InputField label="تاريخ الطلاق" placeholder="يوم/شهر/سنة" />
                      <InputField label="رقم حكم المحكمة" placeholder="أدخل رقم الحكم" />
                    </>
                  )}
                  {selectedType === "وفاة" && (
                    <>
                      <InputField label="بحث عن المتوفى" placeholder="ابحث بالاسم أو الرقم الوطني" />
                      <InputField label="تاريخ الوفاة" placeholder="يوم/شهر/سنة" />
                      <InputField label="مكان الوفاة" placeholder="المستشفى أو المكان" />
                      <InputField label="سبب الوفاة" placeholder="أدخل سبب الوفاة" />
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">إرسال للتدقيق</button>
                <button onClick={() => { setDrawerOpen(false); setSelectedType(null); }} className="flex-1 h-10 rounded-md border text-sm hover:bg-secondary/50">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
      <input className="w-full h-10 px-3 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder={placeholder} />
    </div>
  );
}
