"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface Employee {
  name: string;
  username: string;
  role: string;
  status: string;
  events: string;
  docs: string;
}

const roleBadge = (r: string) => {
  if (r === "مشرف") return "badge-blue";
  if (r === "مدقق") return "badge-orange";
  return "badge-gray";
};

interface EmployeeManagerProps {
  initialEmployees: Employee[];
}

export default function EmployeeManager({ initialEmployees }: EmployeeManagerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);

  const toggleStatus = (index: number) => {
    const updated = [...employees];
    updated[index].status = updated[index].status === "نشط" ? "موقوف" : "نشط";
    setEmployees(updated);
  };

  return (
    <div className="space-y-6">
      {/* Table Section */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-5 border-b flex items-center justify-between">
          <h4 className="font-bold">الموظفون</h4>
          <button 
            onClick={() => setDrawerOpen(true)} 
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> إضافة موظف جديد
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground text-xs">
                <th className="text-right p-3 font-medium">الموظف</th>
                <th className="text-right p-3 font-medium">اسم المستخدم</th>
                <th className="text-right p-3 font-medium">الدور</th>
                <th className="text-right p-3 font-medium">حالة الحساب</th>
                <th className="text-right p-3 font-medium">واقعات اليوم</th>
                <th className="text-right p-3 font-medium">وثائق اليوم</th>
                <th className="text-right p-3 font-medium">خيارات</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e, i) => (
                <tr key={i} className={`border-t hover:bg-secondary/20 transition-colors ${i % 2 === 1 ? "bg-secondary/10" : ""}`}>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {e.name.charAt(0)}
                      </div>
                      <span className="font-medium">{e.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{e.username}</td>
                  <td className="p-3"><span className={roleBadge(e.role)}>{e.role}</span></td>
                  <td className="p-3"><span className={e.status === "نشط" ? "badge-active" : "badge-danger"}>{e.status}</span></td>
                  <td className="p-3 text-center">{e.events}</td>
                  <td className="p-3 text-center">{e.docs}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50 transition-colors">تعديل الدور</button>
                      <button 
                        onClick={() => toggleStatus(i)}
                        className={`px-2 py-1 rounded border text-xs hover:bg-secondary/50 transition-colors ${e.status === "نشط" ? "text-[hsl(var(--status-red-text))]" : "text-primary"}`}
                      >
                        {e.status === "نشط" ? "تعطيل" : "تفعيل"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          <div className="flex-1 bg-foreground/30 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)} />
          <div className="w-full max-w-md bg-card shadow-xl border-r overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">إضافة موظف جديد</h3>
              <button 
                onClick={() => setDrawerOpen(false)} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <InputField label="الاسم الكامل" placeholder="أدخل اسم الموظف" />
              <InputField label="اسم المستخدم" placeholder="أدخل اسم المستخدم" />
              <InputField label="كلمة المرور المؤقتة" placeholder="أدخل كلمة مرور مؤقتة" />
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">الدور</label>
                <select className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-all">
                  <option>مدخل بيانات</option>
                  <option>مدقق</option>
                  <option>مشرف</option>
                  <option>مدير</option>
                </select>
              </div>
              <button 
                className="w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 mt-4 transition-opacity shadow-lg shadow-primary/20"
              >
                إنشاء الحساب
              </button>
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
      <input 
        className="w-full h-10 px-3 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" 
        placeholder={placeholder} 
      />
    </div>
  );
}
