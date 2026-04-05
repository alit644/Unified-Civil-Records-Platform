import * as XLSX from "xlsx";

interface CitizenRow {
  name: string;
  nid: string;
  gender: string;
  neighborhood: string;
  marital: string;
  status: string;
  updated: string;
}

export function exportCitizensToXlsx(citizens: CitizenRow[]) {
  const headers = ["الاسم الكامل", "الرقم الوطني", "الجنس", "الحي", "الحالة المدنية", "حالة السجل", "آخر تحديث"];
  const data = citizens.map((c) => [c.name, c.nid, c.gender, c.neighborhood, c.marital, c.status, c.updated]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // Set column widths
  ws["!cols"] = [
    { wch: 28 }, { wch: 14 }, { wch: 8 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "المواطنين");
  XLSX.writeFile(wb, `سجل_المواطنين_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
