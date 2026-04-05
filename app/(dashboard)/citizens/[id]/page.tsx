import CitizenProfileContent from "./_components/CitizenProfileContent";
import ProfileHeaderActions from "./_components/ProfileHeaderActions";

const events = [
  { type: "ولادة", date: "١٥/٠٣/١٩٩٠", status: "مقبول", employee: "خالد العمري", icon: "👶" },
  { type: "زواج", date: "١٠/٠٦/٢٠١٥", status: "مقبول", employee: "سارة الحسن", icon: "💍" },
];

const documents = [
  { type: "سند إقامة", date: "١٥/١١/٢٠٢٤", employee: "م. أحمد" },
  { type: "شهادة ميلاد", date: "٢٠/٠٣/١٩٩٠", employee: "خالد العمري" },
  { type: "شهادة زواج", date: "١٢/٠٦/٢٠١٥", employee: "سارة الحسن" },
];

const auditLog = [
  { date: "١٥/١١/٢٠٢٤ ١٠:٣٢", employee: "م. أحمد", action: "تعديل بيانات", field: "العنوان", oldVal: "شارع المدينة ١٢", newVal: "شارع الجامعة ٤٥" },
  { date: "١٠/٠٨/٢٠٢٤ ١٤:١٥", employee: "سارة الحسن", action: "إصدار وثيقة", field: "سند إقامة", oldVal: "—", newVal: "تم الإصدار" },
];

export default function CitizenProfilePage() {
  return (
    <div className="space-y-6">
      {/* Profile header (Server component part for branding/static info) */}
      <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-wrap items-center justify-between gap-6 overflow-hidden relative group">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-2xl font-black shadow-inner border border-primary/10">
            م.ش
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground tracking-tight">محمد سامر الشمري</h3>
            <div className="flex items-center gap-3 mt-1.5 font-mono text-sm">
              <span className="text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded leading-none">٩٩٨١٢٣٤٥٦٧</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="font-bold text-emerald-600 text-xs uppercase tracking-widest">نشط</span>
            </div>
          </div>
        </div>
        
        <ProfileHeaderActions />
      </div>

      {/* Info cards (Static data) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow">
          <h4 className="font-bold mb-5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> البيانات الشخصية
          </h4>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            {[
              ["الاسم الكامل", "محمد سامر يوسف الشمري"],
              ["الرقم الوطني", "٩٩٨١٢٣٤٥٦٧"],
              ["تاريخ الميلاد", "١٥/٠٣/١٩٩٠"],
              ["مكان الميلاد", "عمّان"],
              ["الجنس", "ذكر"],
              ["الحالة الاجتماعية", "متزوج"],
            ].map(([label, value], i) => (
              <div key={i} className="group">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{label}</p>
                <p className="font-semibold text-sm text-foreground/90 group-hover:text-primary transition-colors">{value}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card rounded-xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow">
          <h4 className="font-bold mb-5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> بيانات الإقامة
          </h4>
          <div className="space-y-6">
            {[
              ["الحي", "الجبيهة"],
              ["العنوان الكامل", "شارع الجامعة ٤٥، بناية الأمل، الطابق الثالث"],
              ["رقم دفتر العائلة", "٠٠١٢٣٤"],
              ["اسم رب الأسرة", "سامر يوسف الشمري"],
            ].map(([label, value], i) => (
              <div key={i} className="group border-b border-secondary/50 pb-2 last:border-0 last:pb-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{label}</p>
                <p className="font-semibold text-sm text-foreground/90 group-hover:text-primary transition-colors">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CitizenProfileContent 
        events={events} 
        documents={documents} 
        auditLog={auditLog} 
      />
    </div>
  );
}
