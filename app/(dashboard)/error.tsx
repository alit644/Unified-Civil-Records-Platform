"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCcw, Home, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    console.error("Dashboard Error Caught:", error);
  }, [error]);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      reset();
      setIsResetting(false);
    }, 600);
  };

  return (
    <div
      dir="rtl"
      className="min-h-[70vh] flex items-center justify-center p-6"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-destructive/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-lg w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Error code pill */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono font-bold tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            SYSTEM ERROR
            {error.digest && (
              <span className="text-destructive/60">· {error.digest}</span>
            )}
          </span>
        </div>

        {/* Main card */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-l from-destructive via-orange-500 to-yellow-500" />

          <div className="p-8 md:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center rotate-3 absolute inset-0 blur-sm" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-destructive/20 to-orange-500/20 border border-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-destructive" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                حدث خطأ غير متوقع
              </h1>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {error.message && error.message !== "هذا خطأ اختباري للتأكد من عمل صفحة error.tsx!"
                  ? error.message
                  : "تعذّر تحميل هذه الصفحة. قد تكون المشكلة مؤقتة، يرجى المحاولة مرة أخرى."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold transition-all hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <RefreshCcw
                  className={`w-4 h-4 transition-transform ${isResetting ? "animate-spin" : ""}`}
                />
                {isResetting ? "جاري المحاولة..." : "إعادة المحاولة"}
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold transition-all hover:bg-secondary/80 active:scale-95"
              >
                <Home className="w-4 h-4" />
                الصفحة الرئيسية
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 md:px-12 py-4 bg-muted/30 border-t border-border/50">
            <p className="text-center text-xs text-muted-foreground">
              إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني
              {error.digest && (
                <span className="font-mono text-muted-foreground/60 mr-1">
                  — رمز الخطأ: {error.digest}
                </span>
              )}
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