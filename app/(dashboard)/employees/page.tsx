import EmployeeStats from "./_components/EmployeeStats";
import EmployeeManager from "./_components/EmployeeManager";
import { Employee } from "@/types";
import prisma from "@/lib/db";


export default async function EmployeeManagementPage() {

  // GET : All Employees
  const employee = await prisma.employee.findMany({
    include: {
      _count: {
        select: {
          documents: true,
          civilEvents: true,
        }
      }
    }
  })
  return (
    <div className="space-y-6">
      <EmployeeStats />
      <EmployeeManager initialEmployees={employee} />
    </div>
  );
}
