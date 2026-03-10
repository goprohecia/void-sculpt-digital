import { TRAITEUR_STEPS } from "@/data/mockTraiteurData";
import { Check } from "lucide-react";

interface Props { currentStep: number; }

export function TraiteurStepper({ currentStep }: Props) {
  return (
    <div className="flex items-center gap-1">
      {TRAITEUR_STEPS.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={step} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${done ? "bg-primary border-primary text-primary-foreground" : active ? "border-primary text-primary bg-primary/10" : "border-muted text-muted-foreground"}`}>
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`text-[10px] text-center leading-tight ${done || active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
