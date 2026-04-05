import EmployeeStats from "./_components/EmployeeStats";
import EmployeeManager from "./_components/EmployeeManager";
import { Column } from "@/components/DataTable";
import { Employee } from "@/types";

const employees: Employee[] = [
  { id: "1", name: "أحمد الخالدي", username: "a.khalidi", role: "مشرف", status: "نشط", events: "٥", docs: "١٢" },
  { id: "2", name: "سارة الحسن", username: "s.hasan", role: "مدخل بيانات", status: "نشط", events: "٨", docs: "٢٣" },
  { id: "3", name: "نور العلي", username: "n.ali", role: "مدقق", status: "نشط", events: "٠", docs: "١٥" },
  { id: "4", name: "خالد العمري", username: "k.omari", role: "مدخل بيانات", status: "موقوف", events: "٠", docs: "٠" },
  { id: "5", name: "ريم الصالح", username: "r.saleh", role: "مدخل بيانات", status: "نشط", events: "٣", docs: "٩" },
];
export default function EmployeeManagementPage() {
  return (
    <div className="space-y-6">
      <EmployeeStats />
      <EmployeeManager initialEmployees={employees} />
    </div>
  );
}
