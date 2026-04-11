import prisma from "../db";

const GOVERNORATE_CODES: Record<string, string> = {
  "دمشق": "01",
  "حلب": "02",
  "ريف دمشق": "03",
  "حمص": "04",
  "حماة": "05",
  "طرطوس": "06",
  "اللاذقية": "07",
  "إدلب": "08",
  "الرقة": "09",
  "دير الزور": "10",
  "الحسكة": "11",
  "درعا": "12",
  "السويداء": "13",
  "القنيطرة": "14"
};
// دالة لاستخراج رمز المحافظة من مكان الولادة
export function extractGovernorateCode(registryPlace: string): string {
  // استخدام regex للتقسيم بناءً على علامات مختلفة مثل - أو / أو الفاصلة (العربية والأجنبية)
  const govName = registryPlace.split(/[-/،,]/)[0].trim();
  return GOVERNORATE_CODES[govName] || "99";
}
// دالة لتوليد الرقم الوطني
export function generateNationalId(birthDate: string, governorateCode: string = "01"): string {
  // 1. استخراج آخر رقمين من سنة الولادة (مثال: 1995 -> "95")
  const birthYear = new Date(birthDate).getFullYear().toString().slice(-2);
  const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
  const baseId = `${governorateCode}${birthYear}${randomPart}`;
  // 4. حساب رقم التحقق (Checksum) بجمع الأرقام وأخذ باقي القسمة على 10
  let sum = 0;
  for (let i = 0; i < baseId.length; i++) {
    sum += parseInt(baseId[i], 10);
  }
  const checksum = (sum % 10).toString();
  return `${baseId}${checksum}`;
}
// هذه الدالة تتأكد من قاعدة البيانات أن الرقم غير مكرر
export async function getUniqueNationalId(birthDate: string, govCode: string = "01"): Promise<string> {
  let isUnique = false;
  let newId = "";

  while (!isUnique) {
    newId = generateNationalId(birthDate, govCode);
    const existing = await prisma.citizen.findUnique({
      where: { nationalId: newId },
      select: { id: true }
    });
    if (!existing) isUnique = true;
  }
  return newId;
}