import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardKPIProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export function DashboardKPI({ title, value, icon: Icon, trend, className }: DashboardKPIProps) {
  return (
    <div className={cn("glass-card p-4 sm:p-6 relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-[hsl(155,100%,65%)]" : "text-[hsl(0,84%,70%)]"
            )}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-primary/10 p-2 sm:p-3">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
