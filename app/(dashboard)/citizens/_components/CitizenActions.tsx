"use client";

import { Button } from "@/components/ui/button";
import { exportCitizensToXlsx } from "@/lib/exportXlsx";
import { Download, Plus } from "lucide-react";
import Link from "next/link";

interface CitizenActionsProps {
  citizens: any[];
}

export default function CitizenActions({ citizens }: CitizenActionsProps) {
  const handleExport = () => {
    exportCitizensToXlsx(citizens);
  };

  return (
    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
      <Link href="/citizens/new-citizen" className="w-full sm:w-auto">
        <Button title="إضافة مواطن جديد" aria-label="إضافة مواطن جديد" className="w-full h-9 px-3 sm:px-4 rounded-md bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:opacity-90 flex items-center justify-center gap-1.5">
          <Plus className="w-4 h-4 shrink-0" /> 
          <span className="inline sm:inline">إضافة مواطن</span>
        </Button>
      </Link>
      <Button
        title="تصدير XLSX"
        aria-label="تصدير XLSX"
        onClick={handleExport}
        variant="outline"
        className="flex-1 sm:flex-none h-9 px-3 sm:px-4 rounded-md border text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:bg-secondary/50"
      >
        <Download className="w-4 h-4 shrink-0" /> 
        <span className="hidden sm:inline">تصدير XLSX</span>
      </Button>
    </div>
  );
}
