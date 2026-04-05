import { Plus } from "lucide-react";

interface FiltersProps {
  typeFilter: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  setDrawerOpen: (open: boolean) => void;
}

const Filters = ({ typeFilter, activeFilter, setActiveFilter, setDrawerOpen }: FiltersProps) => {
  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm flex flex-wrap items-center gap-3">
      <div className="flex gap-1">
        {typeFilter.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <select className="h-9 px-3 rounded-md border bg-background text-sm mr-auto focus:outline-none focus:ring-1 focus:ring-ring">
        <option>جميع الحالات</option>
        <option>بانتظار التدقيق</option>
        <option>مقبول</option>
        <option>مرفوض</option>
      </select>
      <button
        onClick={() => setDrawerOpen(true)}
        className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90"
      >
        <Plus className="w-4 h-4" /> تسجيل واقعة جديدة
      </button>
    </div>
  );
};

export default Filters;
