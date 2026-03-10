import { CONSULTANT_STEPS } from "@/data/mockConsultantData";
import { Check, Target, Send, FileSignature, PlayCircle, FileOutput, FileCheck, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

const STEP_ICONS = [Target, Send, FileSignature, PlayCircle, FileOutput, FileCheck, Flag];

interface Props { currentStep: number; }

export function ConsultantStepper({ currentStep }: Props) {
  return (
    <div className="flex items-center gap-1 w-full overflow-x-auto py-2">
      {CONSULTANT_STEPS.map((step, idx) => {
        const Icon = STEP_ICONS[idx] || Target;
        const done = idx < currentStep;
        const active = idx === currentStep;
        return (
          <div key={step} className="flex items-center gap-1 min-w-0">
            <div className="flex flex-col items-center gap-1 min-w-[68px]">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                done && "bg-primary border-primary text-primary-foreground",
                active && "border-primary text-primary bg-primary/10",
                !done && !active && "border-muted-foreground/30 text-muted-foreground/50",
              )}>
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
              </div>
              <span className={cn(
                "text-[10px] text-center leading-tight",
                (done || active) ? "text-foreground font-medium" : "text-muted-foreground",
              )}>{step}</span>
            </div>
            {idx < CONSULTANT_STEPS.length - 1 && (
              <div className={cn("h-0.5 w-5 flex-shrink-0", done ? "bg-primary" : "bg-muted-foreground/20")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
