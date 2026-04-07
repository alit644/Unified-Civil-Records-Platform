import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "./lib/generated/prisma/enums";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. القائمة البيضاء: المسارات التي يجب ألا يفحصها الـ Middleware أبداً
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isPublicRoute = isAuthRoute || pathname === "/unauthorized";

  // 2. جلب الجلسة
  const { data: session } = await betterFetch<{
    session: Session;
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      isActive: boolean;
    };
  }>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") ?? "",
    },
  });

  // --- منطق التوجيه الذكي (Smart Routing) ---

  // أ. إذا لم يسجل دخول ويحاول دخول صفحة خاصة -> اذهب للـ login
  if (!session) {
    if (isPublicRoute) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ب. إذا سجل دخول ويحاول دخول صفحة الـ login -> اذهب للرئيسية
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ج. فحص الموظف الموقوف (فقط إذا لم يكن في صفحة "غير مصرح")
  if (!session.user.isActive && pathname !== "/unauthorized") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // د. حماية صفحات الإدارة (للمدراء فقط)
  if (pathname.startsWith("/employees") && session.user.role !== Role.ADMIN) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // هـ. حماية سجل التدقيق (للمدراء والمدققين فقط)
  if (pathname.startsWith("/audit") && session.user.role === Role.OFFICER) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // استثناء ملفات النظام والـ API لضمان الأداء وعدم التعارض
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
