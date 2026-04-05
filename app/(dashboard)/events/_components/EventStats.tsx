import { EventStatsData } from "@/components/data";
import { MetricCard } from "@/components/MetricCard";


export default function EventStats() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {EventStatsData.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>
    </>
  );
}
