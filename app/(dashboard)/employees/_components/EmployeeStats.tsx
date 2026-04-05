import { Users, UserCheck, ClipboardList } from "lucide-react";

const stats = [
  { icon: Users, label: "إجمالي الموظفين", value: "١٨" },
  { icon: UserCheck, label: "موظفون نشطون", value: "١٦" },
  { icon: ClipboardList, label: "طلبات بانتظار التدقيق اليوم", value: "٢٣" },
];

export default function EmployeeStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-card rounded-lg border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{s.label}</span>
            <s.icon className="w-5 h-5 text-muted-foreground/50" />
          </div>
          <p className="text-2xl font-bold">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
