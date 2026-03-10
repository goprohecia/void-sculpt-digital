import { Check, CalendarCheck, CreditCard, UserCheck, Scissors, CheckCircle, Star } from "lucide-react";
import { COIFFURE_STEPS, COIFFURE_STEP_COLORS } from "@/data/mockCoiffureData";
import { Button } from "@/components/ui/button";

const STEP_ICONS = [CalendarCheck, CreditCard, UserCheck, Scissors, CheckCircle, Star];

interface CoiffureStepperProps {
  currentStep: number;
  isEditable?: boolean;
  onAdvance?: () => void;
}

export function CoiffureStepper({ currentStep, isEditable, onAdvance }: CoiffureStepperProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {COIFFURE_STEPS.map((step, i) => {
          const Icon = STEP_ICONS[i];
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={step} className="flex items-center gap-1 shrink-0">
              <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                done ? "bg-muted text-muted-foreground" : active ? `${COIFFURE_STEP_COLORS[i]} text-white shadow-lg` : "bg-muted/50 text-muted-foreground/50"
              }`}>
                {done ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                <span className="hidden sm:inline">{step}</span>
              </div>
              {i < COIFFURE_STEPS.length - 1 && (
                <div className={`w-4 h-px ${done ? "bg-muted-foreground/40" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
      {isEditable && currentStep < COIFFURE_STEPS.length - 1 && (
        <Button size="sm" onClick={onAdvance} className="mt-1">
          Passer à « {COIFFURE_STEPS[currentStep + 1]} »
        </Button>
      )}
    </div>
  );
}
