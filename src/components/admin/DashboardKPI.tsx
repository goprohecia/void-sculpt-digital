import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";

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

function AnimatedValue({ value }: { value: string | number }) {
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    const str = String(value);
    const match = str.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!match) {
      setDisplay(str);
      return;
    }

    const prefix = match[1];
    const num = parseFloat(match[2]);
    const suffix = match[3];
    const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;

    const controls = animate(0, num, {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => {
        setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [value]);

  return <>{display}</>;
}

export function DashboardKPI({ title, value, icon: Icon, trend, iconColor = "primary", className }: DashboardKPIProps) {
  const colors = colorMap[iconColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "glass-card p-4 sm:p-6 relative overflow-hidden cursor-default",
        "hover:shadow-[0_8px_30px_hsl(var(--primary)/0.15)] hover:border-primary/30 transition-[box-shadow,border-color] duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">
            <AnimatedValue value={value} />
          </p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-emerald-400" : "text-rose-400"
            )}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.35, type: "spring", stiffness: 200 }}
          className={cn("rounded-xl p-2.5 sm:p-3", colors.bg)}
        >
          <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", colors.text)} />
        </motion.div>
      </div>
    </motion.div>
  );
}
