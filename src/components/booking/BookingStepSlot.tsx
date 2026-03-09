import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type SlotStatus = "disponible" | "indisponible" | "verrouille" | "reserve";

export interface TimeSlot {
  id: string;
  jour: number;
  heure: string;
  status: SlotStatus;
}

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const HEURES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

export function generateSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let id = 1;
  for (let jour = 0; jour < 7; jour++) {
    for (const heure of HEURES) {
      const rand = Math.random();
      let status: SlotStatus = "disponible";
      if (jour >= 5 && (heure === "09:00" || heure === "17:00")) status = "indisponible";
      else if (rand < 0.2) status = "indisponible";
      else if (rand < 0.25) status = "reserve";
      slots.push({ id: `slot-${id++}`, jour, heure, status });
    }
  }
  return slots;
}

interface BookingStepSlotProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
  onNext: () => void;
}

export function BookingStepSlot({ slots, selectedSlot, onSelect, onNext }: BookingStepSlotProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

  const weekDates = JOURS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Choisissez un créneau</h2>
        <p className="text-sm text-muted-foreground">Sélectionnez la date et l'heure de votre rendez-vous</p>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setWeekOffset(w => w - 1)} disabled={weekOffset <= 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Semaine préc.
        </Button>
        <span className="text-sm font-medium">
          {weekDates[0].toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} — {weekDates[6].toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <Button variant="ghost" size="sm" onClick={() => setWeekOffset(w => w + 1)}>
          Semaine suiv. <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 min-w-[600px]">
          <div />
          {JOURS.map((j, i) => (
            <div key={j} className="text-center py-2">
              <p className="text-xs font-semibold text-muted-foreground">{j}</p>
              <p className="text-sm font-medium">{weekDates[i].getDate()}</p>
            </div>
          ))}

          {HEURES.map(heure => (
            <>
              <div key={`label-${heure}`} className="flex items-center pr-2">
                <span className="text-xs text-muted-foreground font-mono">{heure}</span>
              </div>
              {JOURS.map((_, jourIdx) => {
                const slot = slots.find(s => s.jour === jourIdx && s.heure === heure);
                if (!slot) return <div key={`${heure}-${jourIdx}`} />;
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    disabled={slot.status !== "disponible" && !isSelected}
                    onClick={() => slot.status === "disponible" && onSelect(slot)}
                    className={cn(
                      "rounded-md p-2 text-xs font-medium transition-all border",
                      slot.status === "disponible" && !isSelected &&
                        "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
                      slot.status === "indisponible" &&
                        "border-border bg-muted/50 text-muted-foreground line-through cursor-not-allowed opacity-50",
                      slot.status === "verrouille" && !isSelected &&
                        "border-amber-300 bg-amber-50 text-amber-600 cursor-not-allowed dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
                      slot.status === "reserve" &&
                        "border-primary bg-primary text-primary-foreground cursor-not-allowed",
                      isSelected &&
                        "border-primary bg-primary text-primary-foreground ring-2 ring-primary/30"
                    )}
                  >
                    {slot.status === "reserve" && !isSelected ? (
                      <Check className="h-3 w-3 mx-auto" />
                    ) : slot.status === "verrouille" && !isSelected ? (
                      "En cours..."
                    ) : (
                      heure
                    )}
                  </button>
                );
              })}
            </>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-100 border border-emerald-300" /> Disponible</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-muted/50 border border-border" /> Indisponible</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-100 border border-amber-300" /> En cours</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary border border-primary" /> Réservé</span>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedSlot}>
          Continuer
        </Button>
      </div>
    </div>
  );
}
