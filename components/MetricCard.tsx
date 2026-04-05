import { LucideIcon } from "lucide-react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  sub?: string          
  showArrow?: boolean   
  variant?: "default" | "warning"  
  size?: "sm" | "md"             
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  showArrow = false,
  variant = "default",
  size = "md",
}: MetricCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-lg border shadow-sm",
      size === "sm" ? "p-4" : "p-5"
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "text-muted-foreground",
          size === "sm" ? "text-xs" : "text-sm"
        )}>
          {label}
        </span>
        <Icon className={cn(
          "text-muted-foreground/50",
          size === "sm" ? "w-4 h-4" : "w-5 h-5"
        )} />
      </div>

      <p className={cn(
        "text-2xl font-bold",
        variant === "warning" &&
          "text-[hsl(var(--status-amber-text))]"
      )}>
        {value}
      </p>

      {sub && (
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          {showArrow && (
            <ArrowUp className="w-3 h-3 text-[hsl(var(--status-green-text))]" />
          )}
          {sub}
        </p>
      )}
    </div>
  )
}