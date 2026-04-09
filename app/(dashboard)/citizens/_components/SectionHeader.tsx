
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  color = "blue",
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  color?: "blue" | "emerald" | "violet" | "amber" | "rose";
}) => {
  const colorMap = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-600 dark:text-blue-400",
    emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    violet: "from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-600 dark:text-violet-400",
    amber: "from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-600 dark:text-amber-400",
    rose: "from-rose-500/10 to-rose-600/5 border-rose-500/20 text-rose-600 dark:text-rose-400",
  };
  const iconBgMap = {
    blue: "bg-blue-500/10",
    emerald: "bg-emerald-500/10",
    violet: "bg-violet-500/10",
    amber: "bg-amber-500/10",
    rose: "bg-rose-500/10",
  };
    return (
    <div
      className={`flex items-center gap-3 rounded-xl border bg-linear-to-r px-4 py-3 ${colorMap[color]}`}
    >
      <div className={`rounded-lg p-2 ${iconBgMap[color]}`}>
        <Icon className="size-4" />
      </div>
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default SectionHeader;
