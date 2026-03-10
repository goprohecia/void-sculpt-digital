import { CheckCircle2, Circle, Heart } from "lucide-react";
import { MARIAGE_STEPS } from "@/data/mockMariageData";

interface MariageStepperProps {
  currentStep: number;
  compact?: boolean;
}

export function MariageStepper({ currentStep, compact }: MariageStepperProps) {
  return (
    <div className={compact ? "flex items-center gap-1 flex-wrap" : "space-y-2"}>
      {MARIAGE_STEPS.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        if (compact) {
          return (
            <div key={step} className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${done ? "bg-primary" : active ? "bg-primary/60 animate-pulse" : "bg-muted"}`} />
              <span className={`text-[10px] ${done ? "text-primary" : active ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
              {i < MARIAGE_STEPS.length - 1 && <span className="text-muted-foreground/30 mx-0.5">›</span>}
            </div>
          );
        }
        return (
          <div key={step} className="flex items-center gap-3">
            {done ? (
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            ) : active ? (
              <Heart className="h-5 w-5 text-primary shrink-0 animate-pulse" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
            )}
            <span className={`text-sm ${done ? "text-primary font-medium" : active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
