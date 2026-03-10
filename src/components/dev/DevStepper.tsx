import { DEV_STEPS } from "@/data/mockDevData";
import { Check, FileText, FileSignature, Layers, Code, Bug, PenTool, Rocket, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

const STEP_ICONS = [FileText, FileSignature, Layers, Code, Bug, PenTool, Rocket, Flag];

interface Props { currentStep: number; }

export function DevStepper({ currentStep }: Props) {
  return (
    <div className="flex items-center gap-1 w-full overflow-x-auto py-2">
      {DEV_STEPS.map((step, idx) => {
        const Icon = STEP_ICONS[idx] || FileText;
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
            {idx < DEV_STEPS.length - 1 && (
              <div className={cn("h-0.5 w-4 flex-shrink-0", done ? "bg-primary" : "bg-muted-foreground/20")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
