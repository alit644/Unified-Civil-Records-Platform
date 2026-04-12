import { getEmployeesList, getEmployeeStats, EmployeeFilters } from "@/lib/services/employee.service";
import EmployeeStats from "./EmployeeStats";
import EmployeeManager from "./EmployeeManager";

export async function EmployeeStatsContainer() {
  const stats = await getEmployeeStats();
  return (
    <EmployeeStats
      activeEmployees={stats.activeEmployees}
      pendingAudits={stats.pendingAudits}
      totalEmployees={stats.totalEmployees}
    />
  );
}

export async function EmployeeListContainer({ filters }: { filters: EmployeeFilters }) {
  const { employees, totalPages, currentPage } = await getEmployeesList(filters);
  return (
    <EmployeeManager
      initialEmployees={employees}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
