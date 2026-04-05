"use client";

import { useState } from "react";
import { FileText, Edit, Printer } from "lucide-react";

interface CitizenProfileContentProps {
  events: any[];
  documents: any[];
  auditLog: any[];
}

const tabs = ["الواقعات المدنية", "الوثائق الصادرة", "سجل التعديلات"];

export default function CitizenProfileContent({ events, documents, auditLog }: CitizenProfileContentProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6">
      {/* Profile header Actions (Inside the main card usually, but I'll place them as part of the overall interactive UI) */}
      {/* The upper actions need to be here or the entire upper card needs to be here if it's too tied.
          Actually, let's keep the header in the server component for basic info, but put the actions in a client component?
          Or just make a 'ProfileHeaderActions' component.
      */}

      {/* Since the user asked to separate client parts, the tabs and their content are the main client-heavy parts. */}

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="border-b flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === i
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
              }`}
            >
              {tab}
              {activeTab === i && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-1px_4px_rgba(var(--primary),0.3)]" />
              )}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {events.map((e, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border bg-secondary/5 hover:border-primary/30 transition-colors">
                  <span className="text-3xl bg-background w-12 h-12 flex items-center justify-center rounded-lg shadow-sm border">{e.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm tracking-tight">{e.type}</span>
                      <span className="badge-active text-[10px] py-0.5 px-2">{e.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5 font-medium">
                      <span>{e.date}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{e.employee}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 1 && (
            <div className="overflow-x-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 text-muted-foreground text-[10px] uppercase tracking-wider">
                    <th className="text-right p-4 font-bold">نوع الوثيقة</th>
                    <th className="text-right p-4 font-bold">تاريخ الإصدار</th>
                    <th className="text-right p-4 font-bold">أصدرها</th>
                    <th className="text-right p-4 font-bold"></th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((d, i) => (
                    <tr key={i} className="border-t hover:bg-secondary/10 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary/60" />
                          <span className="font-semibold">{d.type}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground font-medium">{d.date}</td>
                      <td className="p-4 text-muted-foreground">{d.employee}</td>
                      <td className="p-4 text-left">
                        <button className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
                          <Printer className="w-3.5 h-3.5" /> طباعة نسخة
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 2 && (
            <div className="overflow-x-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 text-muted-foreground text-[10px] uppercase tracking-wider">
                    <th className="text-right p-4 font-bold">التاريخ والوقت</th>
                    <th className="text-right p-4 font-bold">الموظف</th>
                    <th className="text-right p-4 font-bold">الإجراء</th>
                    <th className="text-right p-4 font-bold">الحقل</th>
                    <th className="text-right p-4 font-bold">القيمة القديمة</th>
                    <th className="text-right p-4 font-bold">القيمة الجديدة</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((a, i) => (
                    <tr key={i} className="border-t hover:bg-secondary/10 transition-colors">
                      <td className="p-4 text-muted-foreground font-mono text-[10px]">{a.date}</td>
                      <td className="p-4 font-medium">{a.employee}</td>
                      <td className="p-4"><span className="badge-blue text-[10px]">{a.action}</span></td>
                      <td className="p-4 font-semibold text-xs">{a.field}</td>
                      <td className="p-4 text-muted-foreground line-through decoration-muted-foreground/40 text-xs px-2">{a.oldVal}</td>
                      <td className="p-4 font-bold text-xs text-primary/80 bg-primary/5 rounded px-2">{a.newVal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
