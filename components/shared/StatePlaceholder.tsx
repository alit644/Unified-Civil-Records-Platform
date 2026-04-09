import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: "error" | "empty" | "default";
  action?: {
    label: string;
    icon?: LucideIcon;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function StatePlaceholder({
  title,
  description,
  icon: Icon,
  variant = "default",
  action,
  className,
}: StatePlaceholderProps) {
  const variantStyles = {
    default: "border-border bg-secondary/10 text-foreground",
    error: "border-dashed border-destructive/30 bg-destructive/5 text-destructive",
    empty: "border-dashed border-muted-foreground/30 bg-muted/10 text-muted-foreground",
  };

  const iconStyles = {
    default: "bg-secondary/50 text-foreground",
    error: "bg-destructive/10 text-destructive",
    empty: "bg-muted/20 text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 lg:p-16 text-center rounded-xl border-2 animate-in fade-in zoom-in duration-300",
        variantStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-4",
          iconStyles[variant]
        )}
      >
        <Icon className="w-8 h-8" />
      </div>
      
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      
      <p className="max-w-md mb-6 opacity-90 leading-relaxed text-sm lg:text-base">
        {description}
      </p>

      {/* عرض الزر فقط إذا تم تمرير الـ action */}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors",
              variant === "error"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors",
              variant === "error"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            {action.label}
          </button>
        )
      )}
    </div>
  );
}