import prisma from "../db";

export function generateNationalId(birthYear: number, governorateCode: string = "01"): string {
  // 1. استخراج آخر رقمين من سنة الولادة (مثال: 1995 -> "95")
  const yearStr = birthYear.toString().slice(-2);
  const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
  // 3. دمج الجزء الأساسي (10 أرقام)
  const baseId = `${governorateCode}${yearStr}${randomPart}`;
  // 4. حساب رقم التحقق (Checksum) بجمع الأرقام وأخذ باقي القسمة على 10
  let sum = 0;
  for (let i = 0; i < baseId.length; i++) {
    sum += parseInt(baseId[i], 10);
  }
  const checksum = (sum % 10).toString();

  // 5. الرقم النهائي (11 خانة)
  return `${baseId}${checksum}`;
}

// هذه الدالة تتأكد من قاعدة البيانات أن الرقم غير مكرر
export async function getUniqueNationalId(birthYear: number, govCode: string = "01"): Promise<string> {
  let isUnique = false;
  let newId = "";

  while (!isUnique) {
    newId = generateNationalId(birthYear, govCode);
    const existing = await prisma.citizen.findUnique({
      where: { nationalId: newId },
      select: { id: true }
    });
    if (!existing) isUnique = true;
  }
  return newId;
}