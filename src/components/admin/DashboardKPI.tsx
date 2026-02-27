import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardKPIProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  iconColor?: "emerald" | "blue" | "violet" | "amber" | "rose" | "primary";
  className?: string;
}

const colorMap = {
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  blue: { bg: "bg-blue-500/15", text: "text-blue-400" },
  violet: { bg: "bg-violet-500/15", text: "text-violet-400" },
  amber: { bg: "bg-amber-500/15", text: "text-amber-400" },
  rose: { bg: "bg-rose-500/15", text: "text-rose-400" },
  primary: { bg: "bg-primary/10", text: "text-primary" },
};

export function DashboardKPI({ title, value, icon: Icon, trend, iconColor = "primary", className }: DashboardKPIProps) {
  const colors = colorMap[iconColor];

  return (
    <div className={cn("glass-card p-4 sm:p-6 relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-emerald-400" : "text-rose-400"
            )}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-2.5 sm:p-3", colors.bg)}>
          <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", colors.text)} />
        </div>
      </div>
    </div>
  );
}
