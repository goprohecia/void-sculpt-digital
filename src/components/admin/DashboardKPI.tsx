import { type LucideIcon, ArrowUpRight } from "lucide-react";
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
  isHero?: boolean;
}

const colorMap = {
  emerald: { bg: "bg-[#dcfce7]", text: "text-[#15803d]" },
  blue: { bg: "bg-[#dbeafe]", text: "text-[#1d4ed8]" },
  violet: { bg: "bg-[#ede9fe]", text: "text-[#6d28d9]" },
  amber: { bg: "bg-[#fef3c7]", text: "text-[#b45309]" },
  rose: { bg: "bg-[#ffe4e6]", text: "text-[#be123c]" },
  primary: { bg: "bg-mba-green-100", text: "text-primary" },
};

function AnimatedValue({ value }: { value: string | number }) {
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    const str = String(value);
    const match = str.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!match) { setDisplay(str); return; }
    const prefix = match[1];
    const num = parseFloat(match[2]);
    const suffix = match[3];
    const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
    const controls = animate(0, num, {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [value]);

  return <>{display}</>;
}

export function DashboardKPI({ title, value, icon: Icon, trend, iconColor = "primary", className, isHero = false }: DashboardKPIProps) {
  const colors = colorMap[iconColor];

  if (isHero) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "p-6 rounded-[var(--radius-xl)] relative overflow-hidden cursor-default bg-mba-green-900 text-white",
          className
        )}
      >
        <div className="absolute top-4 right-4">
          <div className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="rounded-xl p-2.5 bg-white/10 w-fit">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm text-white/70">{title}</p>
          <p className="text-4xl font-extrabold tracking-tight">
            <AnimatedValue value={value} />
          </p>
          {trend && (
            <span className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              "bg-white/15 text-white"
            )}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "p-6 rounded-[var(--radius-xl)] relative overflow-hidden cursor-default",
        "bg-card border border-border shadow-[var(--shadow-md)]",
        "hover:shadow-[var(--shadow-lg)] transition-shadow duration-200",
        className
      )}
    >
      <div className="absolute top-4 right-4">
        <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center">
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[13px] text-muted-foreground">{title}</p>
          <p className="text-[32px] font-extrabold tracking-tight text-foreground">
            <AnimatedValue value={value} />
          </p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-[#15803d]" : "text-destructive"
            )}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.35, type: "spring", stiffness: 200 }}
          className={cn("rounded-xl p-3", colors.bg)}
        >
          <Icon className={cn("h-6 w-6", colors.text)} />
        </motion.div>
      </div>
    </motion.div>
  );
}
