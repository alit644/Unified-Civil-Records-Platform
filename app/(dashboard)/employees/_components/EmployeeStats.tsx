import { EmployeeStatsData } from "@/components/data";
import { MetricCard } from "@/components/MetricCard";



export default function EmployeeStats() {
  return (
    <>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {EmployeeStatsData.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>
    </>

  );
}
