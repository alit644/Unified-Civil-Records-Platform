"use client";

import { Plus, Search as SearchIcon } from "lucide-react";
import { useEventFilters } from "@/hooks/use-event-filters";

interface FiltersProps {
  typeFilter: { label: string; value: string }[];
  setDrawerOpen: (open: boolean) => void;
}

const Filters = ({ typeFilter, setDrawerOpen }: FiltersProps) => {
  const { filters, isPending, setType, setStatus, setSearch } = useEventFilters();

  return (
    <div className="bg-card rounded-xl border p-4 shadow-sm flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="flex gap-1 overflow-x-auto pb-2 lg:pb-0 no-scrollbar select-none">
        <button
          onClick={() => setType("الكل")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
            filters.type === "الكل"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          الكل
        </button>
        {typeFilter.map((f) => (
          <button
            key={f.value}
            onClick={() => setType(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
              filters.type === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 w-full">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <input 
            type="text"
            placeholder="ابحث بالاسم أو رقم الواقعة..."
            className="w-full h-10 pr-9 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
          {isPending && (
             <div className="absolute left-3 top-3">
               <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             </div>
          )}
        </div>

        {/* Status Filter */}
        <select 
          value={filters.status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 w-full sm:w-40 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <option value="الكل">كل الحالات</option>
          <option value="PENDING">بانتظار التدقيق</option>
          <option value="APPROVED">مقبول</option>
          <option value="REJECTED">مرفوض</option>
        </select>

        {/* New Event Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="h-10 w-full sm:w-auto px-5 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> تسجيل واقعة
        </button>
      </div>
    </div>
  );
};

export default Filters;
