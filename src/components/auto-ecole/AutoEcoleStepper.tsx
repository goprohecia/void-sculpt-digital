import { CheckCircle2, Circle } from "lucide-react";
import { AUTO_ECOLE_STEPS } from "@/data/mockAutoEcoleData";

interface AutoEcoleStepperProps {
  currentStep: number;
  compact?: boolean;
}

export function AutoEcoleStepper({ currentStep, compact }: AutoEcoleStepperProps) {
  return (
    <div className={compact ? "flex items-center gap-1 flex-wrap" : "space-y-2"}>
      {AUTO_ECOLE_STEPS.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        if (compact) {
          return (
            <div key={step} className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${done ? "bg-primary" : active ? "bg-primary/60 animate-pulse" : "bg-muted"}`} />
              <span className={`text-[10px] ${done ? "text-primary" : active ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
              {i < AUTO_ECOLE_STEPS.length - 1 && <span className="text-muted-foreground/30 mx-0.5">›</span>}
            </div>
          );
        }
        return (
          <div key={step} className="flex items-center gap-3">
            {done ? (
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            ) : (
              <Circle className={`h-5 w-5 shrink-0 ${active ? "text-primary animate-pulse" : "text-muted-foreground/40"}`} />
            )}
            <span className={`text-sm ${done ? "text-primary font-medium" : active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
