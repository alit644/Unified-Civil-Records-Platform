import { Baby, Heart, Scale, Skull } from "lucide-react";

export const stats = [
  { label: "ولادات هذا الشهر", value: "٨٩", icon: Baby },
  { label: "زيجات هذا الشهر", value: "٤٣", icon: Heart },
  { label: "طلاق هذا الشهر", value: "١٢", icon: Scale },
  { label: "وفيات هذا الشهر", value: "٢٨", icon: Skull },
];

export default function EventStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <s.icon className="w-4 h-4 text-muted-foreground/50" />
          </div>
          <p className="text-2xl font-bold">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
