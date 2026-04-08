import { MetricCard } from "@/components/MetricCard";
import { ClipboardList, UserCheck, Users } from "lucide-react";

interface EmployeeStatsProps {
  totalEmployees: number;
  activeEmployees: number;
  pendingAudits: number;
}

export default function EmployeeStats({totalEmployees, activeEmployees, pendingAudits}: EmployeeStatsProps) {
  return (
    <>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard label="إجمالي الموظفين" value={totalEmployees.toString()} icon={Users}/>
          <MetricCard label="موظفون نشطون" value={activeEmployees.toString()} icon={UserCheck}/>
          <MetricCard label="طلبات بانتظار التدقيق اليوم" value={pendingAudits.toString()} icon={ClipboardList}/>
      </div>
    </>

  );
}
