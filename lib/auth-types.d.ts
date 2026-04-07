import { auth } from "./auth"; // مسار ملف الـ auth الخاص بك
import { Role } from "./generated/prisma/enums";

type Session = typeof auth.$Infer.Session;

declare module "better-auth/types" {
    interface User {
        role: Role; // أضف الرتب التي عرفتها في Prisma
    }
}