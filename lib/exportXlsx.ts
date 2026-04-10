import * as XLSX from "xlsx";
import { Citizen } from "@/types";


export function exportCitizensToXlsx(citizens: Citizen[]) {
  const headers = ["الاسم الكامل", "الرقم الوطني", "الجنس", "الحي", "الحالة المدنية", "حالة السجل", "آخر تحديث"];
  const data = citizens.map((c) => [`${c.firstName} ${c.fatherName} ${c.lastName}`, c.nationalId, c.gender, c.currentAddress?.split(" ").slice(0, 2).join(" "), c.maritalStatus, c.status, c.updatedAt.toISOString().split("T")[0]]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // Set column widths
  ws["!cols"] = [
    { wch: 28 }, { wch: 14 }, { wch: 8 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "المواطنين");
  XLSX.writeFile(wb, `سجل_المواطنين_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
