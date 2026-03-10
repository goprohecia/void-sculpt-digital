import { FileSignature, Camera, Users, HandCoins, FileCheck, Flag, Check, ChevronRight } from "lucide-react";
import { IMMO_STEPS } from "@/data/mockImmobilierData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEP_ICONS = [FileSignature, Camera, Users, HandCoins, FileCheck, Flag];

interface Props {
  currentStep: number;
  stepDates?: (string | null)[];
  agentNom?: string;
  isEditable?: boolean;
  onAdvance?: () => void;
}

export function ImmobilierMandatStepper({ currentStep, stepDates, agentNom, isEditable, onAdvance }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {IMMO_STEPS.map((step, i) => {
          const Icon = STEP_ICONS[i];
          const isPast = i < currentStep;
          const isActive = i === currentStep;
          const isFuture = i > currentStep;

          return (
            <div key={step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors shrink-0",
                    isPast && "bg-muted border-muted-foreground/30",
                    isActive && "bg-primary/20 border-primary shadow-[0_0_12px_hsl(var(--primary)/0.3)]",
                    isFuture && "border-border bg-background"
                  )}
                >
                  {isPast ? (
                    <Check className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground/50")} />
                  )}
                </div>
                {i < IMMO_STEPS.length - 1 && (
                  <div className={cn("w-0.5 h-6", isPast ? "bg-muted-foreground/30" : "bg-border")} />
                )}
              </div>

              <div className="pt-1.5">
                <p className={cn(
                  "text-sm font-medium leading-tight",
                  isPast && "text-muted-foreground",
                  isActive && "text-foreground",
                  isFuture && "text-muted-foreground/50"
                )}>
                  {step}
                </p>
                {stepDates?.[i] && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(stepDates[i]!).toLocaleDateString("fr-FR")}
                    {agentNom && isActive && ` · ${agentNom}`}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isEditable && currentStep < IMMO_STEPS.length - 1 && (
        <Button size="sm" onClick={onAdvance} className="gap-1.5">
          <ChevronRight className="h-3.5 w-3.5" />
          Avancer l'étape
        </Button>
      )}
    </div>
  );
}
