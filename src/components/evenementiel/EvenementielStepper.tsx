import { EVENEMENTIEL_STEPS } from "@/data/mockEvenementielData";
import { Check } from "lucide-react";

interface Props {
  currentStep: number;
  showPercentage?: boolean;
}

export function EvenementielStepper({ currentStep, showPercentage }: Props) {
  const pct = Math.round((currentStep / EVENEMENTIEL_STEPS.length) * 100);

  return (
    <div className="space-y-3">
      {showPercentage && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Avancement</span>
          <span className="font-semibold text-primary">{pct}%</span>
        </div>
      )}
      <div className="flex items-center gap-1">
        {EVENEMENTIEL_STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={step} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                    ? "border-primary text-primary bg-primary/10"
                    : "border-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`text-[10px] text-center leading-tight ${done || active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
