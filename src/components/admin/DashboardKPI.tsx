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
  violet: { bg: "bg-[#f3e8ff]", text: "text-[#7c3aed]" },
  amber: { bg: "bg-[#fff7ed]", text: "text-[#ea580c]" },
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
        whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(20,83,45,0.50)" }}
        transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        className={cn(
          "p-6 rounded-[var(--radius-xl)] relative overflow-hidden cursor-default",
          "bg-[#14532d] text-white shadow-[0_8px_32px_rgba(20,83,45,0.35)]",
          className
        )}
      >
        <div className="absolute top-4 right-4">
          <div className="h-8 w-8 rounded-full border-[1.5px] border-white/25 flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="rounded-xl p-2.5 bg-white/[0.12] w-fit">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <p className="text-[13px] text-white/[0.65]">{title}</p>
          <p className="text-[38px] font-extrabold tracking-[-1px]">
            <AnimatedValue value={value} />
          </p>
          {trend && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.15] text-white">
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
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        "p-6 rounded-[var(--radius-xl)] relative overflow-hidden cursor-default",
        "bg-card border border-border shadow-[0_2px_8px_rgba(20,83,45,0.06),0_1px_2px_rgba(0,0,0,0.04)]",
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
          <p className="text-[34px] font-extrabold tracking-tight text-foreground">
            <AnimatedValue value={value} />
          </p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-[#16a34a]" : "text-destructive"
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
