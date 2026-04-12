import { MetricCard } from "@/components/MetricCard";
import { Baby, Heart, Scale, Skull } from "lucide-react";

interface EventStatsProps {
  stats: {
    births: number;
    marriages: number;
    divorces: number;
    deaths: number;
  }
}

export default function EventStats({ stats }: EventStatsProps) {
  const data = [
    { label: "ولادات هذا الشهر", value: stats.births.toLocaleString('ar-EG'), icon: Baby },
    { label: "زيجات هذا الشهر", value: stats.marriages.toLocaleString('ar-EG'), icon: Heart },
    { label: "طلاق هذا الشهر", value: stats.divorces.toLocaleString('ar-EG'), icon: Scale },
    { label: "وفيات هذا الشهر", value: stats.deaths.toLocaleString('ar-EG'), icon: Skull },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((m, i) => (
        <MetricCard key={i} {...m} />
      ))}
    </div>
  );
}
