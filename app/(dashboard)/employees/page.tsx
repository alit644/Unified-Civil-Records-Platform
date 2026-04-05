import EmployeeStats from "./_components/EmployeeStats";
import EmployeeManager from "./_components/EmployeeManager";

const employees = [
  { name: "أحمد الخالدي", username: "a.khalidi", role: "مشرف", status: "نشط", events: "٥", docs: "١٢" },
  { name: "سارة الحسن", username: "s.hasan", role: "مدخل بيانات", status: "نشط", events: "٨", docs: "٢٣" },
  { name: "نور العلي", username: "n.ali", role: "مدقق", status: "نشط", events: "٠", docs: "١٥" },
  { name: "خالد العمري", username: "k.omari", role: "مدخل بيانات", status: "موقوف", events: "٠", docs: "٠" },
  { name: "ريم الصالح", username: "r.saleh", role: "مدخل بيانات", status: "نشط", events: "٣", docs: "٩" },
];

export default function EmployeeManagementPage() {
  return (
    <div className="space-y-6">
      <EmployeeStats />
      <EmployeeManager initialEmployees={employees} />
    </div>
  );
}
