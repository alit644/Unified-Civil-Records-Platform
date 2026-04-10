"use client";

import { Edit, FileText } from "lucide-react";
import { useState } from "react";
import EditCitizenDrawer from "../../_components/EditCitizenDrawer";

export default function ProfileHeaderActions({ citizen }: { citizen: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <button 
          onClick={() => setIsEditOpen(true)}
          className="h-9 px-4 rounded-md border text-sm font-semibold flex items-center gap-1.5 hover:bg-secondary/50 transition-colors"
        >
          <Edit className="w-4 h-4 text-muted-foreground" /> تعديل البيانات
        </button>
        <button className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
          <FileText className="w-4 h-4" /> إصدار وثيقة
        </button>
      </div>

      {citizen && (
        <EditCitizenDrawer 
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={citizen}
        />
      )}
    </>
  );
}
