import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  hint?: string;
  className?: string;
}

export function AdminEmptyState({ icon: Icon, title, description, hint, className = "" }: AdminEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="relative mb-6">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl scale-150" />
        <div className="relative h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="h-7 w-7 text-primary/60" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed">{description}</p>
      {hint && (
        <p className="text-[11px] text-muted-foreground/60 mt-3 max-w-[240px] italic">{hint}</p>
      )}
    </motion.div>
  );
}
