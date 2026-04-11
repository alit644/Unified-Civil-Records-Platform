"use client";

import { useState } from "react";
import { Baby, Heart, Scale, Skull } from "lucide-react";
import { Column, DataTable } from "@/components/DataTable";
import { Events } from "@/types";
import Filters from "./Filters";
import EventDrawer from "./EventDrawer";
import { EventType } from "@/lib/generated/prisma/enums";


const eventTypes = [
  { label: "ولادة", value: EventType.BIRTH, icon: Baby },
  { label: "زواج", value: EventType.MARRIAGE, icon: Heart },
  { label: "طلاق", value: EventType.DIVORCE, icon: Scale },
  { label: "وفاة", value: EventType.DEATH, icon: Skull },
];

const typeFilter = ["الكل", "ولادة", "زواج", "طلاق", "وفاة"];

const typeBadge = (type: EventType) => {
  const map: Record<EventType, string> = { 
    [EventType.BIRTH]: "badge-blue", 
    [EventType.MARRIAGE]: "badge-active", 
    [EventType.DIVORCE]: "badge-orange", 
    [EventType.DEATH]: "badge-gray" 
  };
  return map[type] || "badge-gray";
};

const typeLabels: Record<EventType, string> = {
  [EventType.BIRTH]: "ولادة",
  [EventType.MARRIAGE]: "زواج",
  [EventType.DIVORCE]: "طلاق",
  [EventType.DEATH]: "وفاة",
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
      <span className={typeBadge(e.type as EventType)}>{typeLabels[e.type as EventType] || e.type}</span>
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
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  const [activeFilter, setActiveFilter] = useState("الكل");

  const filteredEvents = activeFilter === "الكل"
    ? initialEvents
    : initialEvents.filter(e => {
        const arabicLabel = typeLabels[e.type as EventType];
        return arabicLabel === activeFilter;
      });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Filters activeFilter={activeFilter} setActiveFilter={setActiveFilter} setDrawerOpen={setDrawerOpen} typeFilter={typeFilter}/>

      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm">
        <DataTable columns={columns} data={filteredEvents} />
      </div>
          
      {/* Drawer */}
      <EventDrawer 
        isOpen={drawerOpen} 
        onClose={() => { setDrawerOpen(false); setSelectedType(null); }}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        eventTypes={eventTypes}
      />
    </div>
  );
}
