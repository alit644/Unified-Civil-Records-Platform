"use client";

import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // افترض وجود shadcn button
import { Card, CardContent } from "@/components/ui/card"; // افترض وجود shadcn card

export default function UnauthorizedPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-xl space-y-8 text-center">
        {/* بطاقة الرسالة */}
        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12 space-y-6">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold font-cairo text-foreground">
                وصول غير مصرح به{" "}
              </h1>
              <div className=" bg-destructive w-12 h-12 p-2 rounded-full border-4 border-emerald-950">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="w-20 h-1 bg-destructive mx-auto rounded-full" />

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-cairo max-w-md mx-auto">
              عذراً، الحساب الحالي لا يملك الصلاحيات الكافية للوصول إلى هذه
              الصفحة. يرجى مراجعة مسؤول النظام في الدائرة لتعديل صلاحياتك إذا
              كنت تعتقد أن هذا خطأ.
            </p>

            <div className="pt-6 border-t border-border space-y-4">
              <p className="text-xs text-muted-foreground">
                قد يكون حسابك موقوفاً مؤقتاً أو أن رتبتك الوظيفية لا تسمح بدخول
                هذا القسم الحساس.
              </p>

              {/* أزرار الإجراءات */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button
                  asChild
                  variant="default"
                  className="w-full sm:w-auto h-12 gap-2 font-semibold"
                >
                  <Link href="/">
                    العودة للرئيسية
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto h-12 gap-2"
                >
                  <Link href="/login">تسجيل دخول بحساب آخر</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* التذييل الرسمي */}
        <p className="text-center text-xs text-white/50 font-cairo">
          دائرة الأحوال المدنية والجوازات — نظام السجل المدني الرقمي الموحد
        </p>
      </div>
    </div>
  );
}
