"use client"
import Link from "next/link";
import { FileQuestion, Home, ChevronLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-background p-6"
    >
      {/* Background decorative glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg w-full text-center">
        {/* 404 large number */}
        <div className="mb-6 select-none">
          <span className="text-[9rem] md:text-[12rem] font-black leading-none bg-gradient-to-b from-primary/30 to-primary/5 bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Icon + card */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden -mt-8">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-l from-primary/80 via-primary/50 to-primary/20" />

          <div className="p-8 md:p-10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-primary/10 blur-md" />
                <div className="relative w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <FileQuestion className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Text */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
              الصفحة غير موجودة
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
              يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها. تحقق من الرابط أو عُد للصفحة الرئيسية.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              >
                <Home className="w-4 h-4" />
                الصفحة الرئيسية
              </Link>
              <Link
                href="/citizens"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold transition-all hover:bg-secondary/80 active:scale-95"
              >
                <Search className="w-4 h-4" />
                البحث عن مواطن
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-muted/30 border-t border-border/50">
            <p className="text-center text-xs text-muted-foreground">
              النظام الرقمي الموحد للسجل المدني
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            العودة للصفحة السابقة
          </button>
        </div>
      </div>
    </div>
  );
}
