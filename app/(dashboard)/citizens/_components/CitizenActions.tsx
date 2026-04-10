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
    <div className="flex gap-2">
      <Link href="/citizens/new-citizen">
        <Button title="إضافة مواطن جديد" aria-label="إضافة مواطن جديد" className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 flex items-center gap-1">
          <Plus className="w-4 h-4" /> إضافة مواطن جديد
        </Button>
      </Link>
      <Button
        title="تصدير XLSX"
        aria-label="تصدير XLSX"
        onClick={handleExport}
        variant="outline"
        className="h-9 px-4 rounded-md border text-sm flex items-center gap-1 hover:bg-secondary/50"
      >
        <Download className="w-4 h-4" /> تصدير XLSX
      </Button>
    </div>
  );
}
