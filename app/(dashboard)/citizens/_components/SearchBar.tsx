"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { citizenStatusOptions, genderOptions } from "@/lib/constants";
import { useCitizenFilters } from "@/hooks/use-citizen-filters";

const SearchBar = () => {
  const { filters, setSearch, setGender, setStatus, setPage, isPending } = useCitizenFilters();

  const handleReset = () => {
    setSearch("");
    setGender("all");
    setStatus("all");
  };

  return (
    <div className="bg-card rounded-2xl border p-4 sm:p-6 shadow-sm space-y-5 transition-all">
      {/* 1. Main Search Entry */}
      <div className="relative">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          {isPending ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <Input
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم الكامل أو الرقم الوطني أو رقم دفتر العائلة..."
          className="pr-12 h-14 text-base focus-visible:ring-1 focus-visible:ring-primary rounded-xl bg-background shadow-sm"
        />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* 2. Scrollable Filters Group */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest bg-secondary/30 px-2 py-1 rounded-md">الفلترة:</span>
          </div>

          <div className="min-w-[140px] shrink-0">
            <Select value={filters.gender} onValueChange={setGender}>
              <SelectTrigger className="h-10 bg-background border-secondary/50 rounded-lg text-sm font-semibold">
                <div className="flex gap-2 items-center">
                  <span className="text-muted-foreground font-normal text-xs">الجنس:</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[170px] shrink-0">
            <Select value={filters.status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 bg-background border-secondary/50 rounded-lg text-sm font-semibold">
                <div className="flex gap-2 items-center">
                  <span className="text-muted-foreground font-normal text-xs">الحالة:</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {citizenStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="text-muted-foreground hover:text-foreground h-10 px-4 text-sm font-bold rounded-lg"
          >
            إعادة تعيين
          </Button>
          <Button 
            disabled={isPending}
            className="h-10 px-8 font-black text-sm rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {isPending ? "جاري التحديث..." : "تحديث النتائج"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;