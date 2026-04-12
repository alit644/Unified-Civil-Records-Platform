"use client";

import { useState } from "react";
import { Baby, Heart, Scale, Skull } from "lucide-react";
import { Column, DataTable } from "@/components/DataTable";
import { Events } from "@/types";
import Link from "next/link";
import Filters from "./Filters";
import EventDrawer from "./EventDrawer";
import { EventType } from "@/lib/generated/prisma/enums";
import { StatusBadge } from "@/components/shared/StatusBadge";
import MPagination from "@/components/shared/MPagination";
import { useEventFilters } from "@/hooks/use-event-filters";

const eventTypes = [
  { label: "ولادة", value: EventType.BIRTH, icon: Baby },
  { label: "زواج", value: EventType.MARRIAGE, icon: Heart },
  { label: "طلاق", value: EventType.DIVORCE, icon: Scale },
  { label: "وفاة", value: EventType.DEATH, icon: Skull },
];

const typeFilterOptions = [
  { label: "ولادة", value: EventType.BIRTH },
  { label: "زواج", value: EventType.MARRIAGE },
  { label: "طلاق", value: EventType.DIVORCE },
  { label: "وفاة", value: EventType.DEATH },
];

interface EventContentProps {
  initialEvents: Events[];
  totalPages: number;
  currentPage: number;
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
      <StatusBadge value={e.type} category="event_type" />
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
    key: "status",
    header: "الحالة",
    render: (e) => (
      <StatusBadge value={e.status} category="event_status" />
    ),
  },
  {
    key: "actions",
    header: "خيارات",
    render: (e) => (
      <Link href={`/events/${e.id}`}>
        <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50 transition-colors">عرض</button>
      </Link>
    ),
  },
]

export default function EventContent({ initialEvents, totalPages, currentPage }: EventContentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  
  const { isPending, setPage } = useEventFilters();

  return (
    <div className="space-y-6">
      <Filters
        setDrawerOpen={setDrawerOpen}
        typeFilter={typeFilterOptions}
      />

      <div className={`bg-card rounded-lg border shadow-sm overflow-hidden transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        <DataTable columns={columns} data={initialEvents} />
        {totalPages > 1 && (
            <MPagination 
                totalPages={totalPages} 
                currentPage={currentPage} 
                onPageChange={setPage} 
            />
        )}
      </div>

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
