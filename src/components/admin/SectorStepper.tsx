// [MBA] Composant générique remplaçant les 24 steppers spécifiques par secteur
// Utilise getDefaultStepsForSector() de sectorTimelines.ts
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDefaultStepsForSector } from "@/data/sectorTimelines";
import { useDemoPlan } from "@/contexts/DemoPlanContext";

interface SectorStepperProps {
  currentStep: number;
  /** Override sector (defaults to demoSector from context) */
  sector?: string | null;
  /** Show advance button */
  isEditable?: boolean;
  onAdvance?: () => void;
  /** Optional sub-label (e.g. agent name) */
  subLabel?: string;
}

export function SectorStepper({ currentStep, sector, isEditable, onAdvance, subLabel }: SectorStepperProps) {
  const { demoSector } = useDemoPlan();
  const sectorKey = sector ?? demoSector ?? "generic";
  const steps = getDefaultStepsForSector(sectorKey);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {steps.map((step, i) => {
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
              <span
                className={`text-[10px] text-center leading-tight ${
                  done || active ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
      {subLabel && (
        <p className="text-xs text-muted-foreground">{subLabel}</p>
      )}
      {isEditable && currentStep < steps.length - 1 && (
        <Button size="sm" onClick={onAdvance} className="mt-1">
          Passer à « {steps[currentStep + 1]} »
        </Button>
      )}
    </div>
  );
}
