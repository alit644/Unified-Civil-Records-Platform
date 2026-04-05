"use client";

import { exportCitizensToXlsx } from "@/lib/exportXlsx";
import { Download, Plus } from "lucide-react";

interface CitizenActionsProps {
  citizens: any[];
}

export default function CitizenActions({ citizens }: CitizenActionsProps) {
  const handleExport = () => {
    exportCitizensToXlsx(citizens);
  };

  return (
    <div className="flex gap-2">
      <button className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 flex items-center gap-1">
        <Plus className="w-4 h-4" /> إضافة مواطن جديد
      </button>
      <button
        onClick={handleExport}
        className="h-9 px-4 rounded-md border text-sm flex items-center gap-1 hover:bg-secondary/50"
      >
        <Download className="w-4 h-4" /> تصدير XLSX
      </button>
    </div>
  );
}
