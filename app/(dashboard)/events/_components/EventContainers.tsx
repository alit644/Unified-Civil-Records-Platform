import { getEventsData, getEventsStats, EventFilters } from "@/lib/services/event.service";
import EventStats from "./EventStats";
import EventContent from "./EventContent";

export async function StatsContainer() {
  const stats = await getEventsStats();
  return <EventStats stats={stats} />;
}

export async function ListContainer({ filters }: { filters: EventFilters }) {
  const { events, totalPages, currentPage } = await getEventsData(filters);
  return (
    <EventContent 
      initialEvents={events} 
      totalPages={totalPages} 
      currentPage={currentPage}
    />
  );
}
