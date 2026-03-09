import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Créneau" },
  { label: "Formulaire" },
  { label: "Récapitulatif" },
  { label: "Confirmation" },
];

interface BookingStepperProps {
  currentStep: number;
  skipForm?: boolean;
}

export function BookingStepper({ currentStep, skipForm }: BookingStepperProps) {
  const steps = skipForm ? STEPS.filter((_, i) => i !== 1) : STEPS;
  
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {steps.map((step, idx) => {
        const stepNumber = idx + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;
        
        return (
          <div key={step.label} className="flex items-center gap-2">
            {idx > 0 && (
              <div className={cn("h-px w-6 sm:w-10", isDone ? "bg-primary" : "bg-border")} />
            )}
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                isDone && "bg-primary text-primary-foreground",
                isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                !isDone && !isActive && "bg-muted text-muted-foreground"
              )}>
                {isDone ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <span className={cn(
                "text-[10px] sm:text-xs font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
