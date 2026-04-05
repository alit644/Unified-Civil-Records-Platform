"use client";

import { useState } from "react";
import { Baby, Heart, Scale, Skull } from "lucide-react";
import { Column, DataTable } from "@/components/DataTable";
import { Events } from "@/types";
import Filters from "./Filters";
import Drawer from "./Drawer";

const eventTypes = [
  { label: "ولادة", icon: Baby },
  { label: "زواج", icon: Heart },
  { label: "طلاق", icon: Scale },
  { label: "وفاة", icon: Skull },
];

const typeFilter = ["الكل", "ولادة", "زواج", "طلاق", "وفاة"];

const typeBadge = (type: string) => {
  const map: Record<string, string> = { ولادة: "badge-blue", زواج: "badge-active", طلاق: "badge-orange", وفاة: "badge-gray" };
  return map[type] || "badge-gray";
};

const statusBadge = (s: string) => {
  if (s === "مقبول") return "badge-active";
  if (s === "بانتظار التدقيق") return "badge-pending";
  if (s === "مرفوض") return "badge-danger";
  return "badge-gray";
};

interface Event {
  id: string;
  type: string;
  citizen: string;
  eventDate: string;
  regDate: string;
  deadline: string;
  status: string;
  urgent?: boolean;
}

interface EventContentProps {
  initialEvents: Event[];
}

const columns: Column<Events>[] = [
  {
    key: "id",
    header: "رقم الواقعة",
    render: (e) => (
      <span className="font-mono text-xs text-muted-foreground">{e.id}</span>
    ),
  },
  {
    key: "type",
    header: "النوع",
    render: (e) => (
      <span className={typeBadge(e.type)}>{e.type}</span>
    ),
  },
  {
    key: "citizen",
    header: "المواطن الرئيسي",
    render: (e) => (
      <span className="font-medium">{e.citizen}</span>
    ),
  },
  {
    key: "eventDate",
    header: "تاريخ الواقعة",
    render: (e) => (
      <span className="text-muted-foreground">{e.eventDate}</span>
    ),
  },
  {
    key: "regDate",
    header: "تاريخ التسجيل",
    render: (e) => (
      <span className="text-muted-foreground">{e.regDate}</span>
    ),
  },
  {
    key: "deadline",
    header: "الموعد النهائي",
    render: (e) => (
      <span className="text-muted-foreground">{e.deadline}</span>
    ),
  },
  {
    key: "status",
    header: "الحالة",
    render: (e) => (
      <span className={statusBadge(e.status)}>{e.status}</span>
    ),
  },
  {
    key: "urgent",
    header: "خيارات",
    render: (e) => (
      <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50">عرض</button>
    ),
  },
]

export default function EventContent({ initialEvents }: EventContentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("الكل");

  const filteredEvents = activeFilter === "الكل"
    ? initialEvents
    : initialEvents.filter(e => e.type === activeFilter);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Filters activeFilter={activeFilter} setActiveFilter={setActiveFilter} setDrawerOpen={setDrawerOpen} typeFilter={typeFilter}/>

      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm">
        <DataTable columns={columns} data={filteredEvents} />
      </div>
          
      {/* Drawer */}
      <Drawer 
        isOpen={drawerOpen} 
        onClose={() => { setDrawerOpen(false); setSelectedType(null); }}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        eventTypes={eventTypes}
      />
    </div>
  );
}
