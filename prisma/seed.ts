// prisma/seed.ts
import prisma from "../lib/db";
import { Role } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";



async function main() {
  console.log("🌱 بدء الـ seed...");

  // حذف البيانات القديمة بالترتيب الصحيح
  await prisma.auditLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.civilEvent.deleteMany();
  await prisma.citizen.deleteMany();
  await prisma.employee.deleteMany();

  // -------- الموظفون --------
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: "أحمد الخالدي",
        username: "a.khalidi",
        passwordHash: await bcrypt.hash("admin1234", 10),
        role: Role.ADMIN,
        isActive: true,
      },
    }),
    prisma.employee.create({
      data: {
        name: "سارة الحسن",
        username: "s.hasan",
        passwordHash: await bcrypt.hash("officer1234", 10),
        role: Role.OFFICER,
        isActive: true,
      },
    }),
    prisma.employee.create({
      data: {
        name: "نور العلي",
        username: "n.ali",
        passwordHash: await bcrypt.hash("auditor1234", 10),
        role: Role.AUDITOR,
        isActive: true,
      },
    }),
    prisma.employee.create({
      data: {
        name: "خالد العمري",
        username: "k.omari",
        passwordHash: await bcrypt.hash("officer1234", 10),
        role: Role.OFFICER,
        isActive: false, // موقوف — من الصور
      },
    }),
    prisma.employee.create({
      data: {
        name: "ريم الصالح",
        username: "r.saleh",
        passwordHash: await bcrypt.hash("officer1234", 10),
        role: Role.OFFICER,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${employees.length} موظفين`);
}

main()
  .catch((e) => {
    console.error("❌ خطأ في الـ seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });