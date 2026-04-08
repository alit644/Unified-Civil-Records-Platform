import EmployeeStats from "./_components/EmployeeStats";
import EmployeeManager from "./_components/EmployeeManager";
import prisma from "@/lib/db";
import { startOfDay } from "date-fns";


//TODO: add pagination and search functionality to employee management page
//TODO: عرض جدول الارشيف + جعل تصميم متجاوب 

export default async function EmployeeManagementPage() {
  const todayStart = startOfDay(new Date());

  const [
    employee,
    totalEmployees,
    activeEmployees,
    pendingAudits
  ] = await Promise.all([

    prisma.employee.findMany({
      include: {
        _count: {
          select: {
            documents: true,
            civilEvents: true,
          }
        }
      },
      orderBy:{
        createdAt: "desc"
      }
    }),

    // 2. إجمالي الموظفين
    prisma.employee.count(),

    // 3. الموظفون النشطون
    prisma.employee.count({
      where: {
        isActive: true,
      }
    }),

    // 4. طلبات بانتظار التدقيق اليوم 
    prisma.civilEvent.count({
      where: {
        status: "PENDING",
          registrationDate: {
            gte: todayStart,
          }
      }

    })
  ]);
  return (
    <div className="space-y-6">
      <EmployeeStats activeEmployees={activeEmployees} pendingAudits={pendingAudits} totalEmployees={totalEmployees} />
      <EmployeeManager initialEmployees={employee} />
    
    </div>
  );
}
