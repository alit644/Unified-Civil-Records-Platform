import { MBreadcrumbs } from "@/components/shared/MBreadcrumbs";
import { Archive, Wrench, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DigitalArchiveMaintenance() {
  return (
    <div className="space-y-6">
      <MBreadcrumbs paths={[{ label: "الأرشيف الرقمي" }]} />

      <div className="flex flex-col items-center justify-center py-10 px-4 min-h-[70vh]">
        <div className="max-w-2xl w-full bg-card rounded-2xl border border-border/60 shadow-xl overflow-hidden relative p-8 md:p-12 flex flex-col items-center text-center">
          {/* Decorative Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-primary/10 rounded-full blur-2xl -z-10" />

          {/* Under Construction Graphic */}
          <div className="relative flex justify-center items-center mb-8">
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-primary/30 animate-spin [animation-duration:15s]" />
            <div className="absolute w-20 h-20 rounded-full bg-primary/5 animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative shadow-inner">
              <Archive className="w-8 h-8" />
              <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-md animate-bounce">
                <Wrench className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 mb-4 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>قريباً | تحت التطوير والصيانة</span>
          </div>

          {/* Typography */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 tracking-tight">
            بوابة الأرشيف الرقمي
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-8">
            نعمل حالياً على تجهيز منصة الأرشيف الرقمي لتوفير وصول سريع وآمن لكافة المستندات والوثائق المدنية المؤرشفة. سنكون جاهزين لإطلاق الخدمة في القريب العاجل لتقديم أفضل تجربة للمستفيدين.
          </p>

          {/* Ready Indicator (Progress Bar) */}
          <div className="w-full max-w-md mx-auto mb-8 bg-secondary/50 rounded-xl p-4 border border-border/40">
            <div className="flex justify-between items-center text-xs font-medium text-muted-foreground mb-2">
              <span>نسبة جاهزية النظام</span>
              <span className="text-primary font-bold">٨٥٪ (قيد اللمسات الأخيرة)</span>
            </div>
            <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[85%] transition-all duration-1000 ease-out" />
            </div>
          </div>

          {/* Feature Sneak Peek */}
          <div className="w-full max-w-md mx-auto border-t border-border/60 pt-6 mb-8 text-right">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              ماذا سيقدم الأرشيف الرقمي؟
            </h4>
            <ul className="space-y-3">
              {[
                "البحث الذكي والسريع برقم الأرشيف، اسم المواطن أو الرقم الوطني",
                "تحميل وحفظ الوثائق الرسمية بصيغة PDF عالية الجودة ومحمية",
                "أرشفة إلكترونية فورية وتلقائية لجميع السجلات المدنية الجديدة",
                "سجل تدقيق أمني متكامل لمتابعة حركات الوصول والتحميل وحماية البيانات"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-md">
            <Button asChild className="w-full sm:w-auto min-w-[160px]" variant="default">
              <Link href="/">
                العودة للوحة التحكم
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto min-w-[160px]">
              <Link href="/documents">
                استعراض المعاملات الجارية
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

