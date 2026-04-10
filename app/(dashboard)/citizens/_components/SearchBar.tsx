"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { citizenStatusOptions, genderOptions } from "@/lib/constants";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get("q") || "";
  const initialGender = searchParams.get("gender") || "all";
  const initialStatus = searchParams.get("status") || "all";

  const [q, setQ] = useState(initialQ);
  const [gender, setGender] = useState(initialGender);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setGender(searchParams.get("gender") || "all");
    setStatus(searchParams.get("status") || "all");
  }, [searchParams]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    const normalizedQ = q.trim().replace(/\s+/g, ' ');
    if (normalizedQ) params.set("q", normalizedQ);
    else params.delete("q");

    if (gender !== "all") params.set("gender", gender);
    else params.delete("gender");

    if (status !== "all") params.set("status", status);
    else params.delete("status");

    // Reset pagination to page 1 on new search
    params.set("page", "1");

    router.push(`/citizens?${params.toString()}`);
  };

  const handleReset = () => {
    setQ("");
    setGender("all");
    setStatus("all");
    router.push("/citizens");
  };

  return (
    <form onSubmit={handleSearch} className="bg-card rounded-2xl border p-4 sm:p-6 shadow-sm space-y-5 transition-all">
      {/* 1. Main Search Entry */}
    <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              placeholder="ابحث بالاسم الكامل أو الرقم الوطني أو رقم دفتر العائلة..."
              className="pr-10 h-14 text-base focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* 2. Scrollable Filters Group */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest bg-secondary/30 px-2 py-1 rounded-md">الفلترة:</span>
          </div>

          <div className="min-w-[140px] shrink-0">
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="h-10 bg-background border-secondary/50 rounded-lg text-sm font-semibold">
                <div className="flex gap-2 items-center">
                  <span className="text-muted-foreground font-normal">الجنس:</span>
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
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 bg-background border-secondary/50 rounded-lg text-sm font-semibold">
                <div className="flex gap-2 items-center">
                  <span className="text-muted-foreground font-normal">الحالة:</span>
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
            className="text-muted-foreground hover:text-foreground h-10 px-4 text-sm font-bold"
          >
            إعادة تعيين
          </Button>
          <Button type="submit" className="h-10 px-8 font-black text-sm rounded-lg shadow-lg shadow-primary/20 flex gap-2">
            تحديث النتائج
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;