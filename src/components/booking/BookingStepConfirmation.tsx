import { CheckCircle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimeSlot } from "./BookingStepSlot";

const JOURS_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

interface BookingStepConfirmationProps {
  slot: TimeSlot;
  businessName: string;
}

export function BookingStepConfirmation({ slot, businessName }: BookingStepConfirmationProps) {
  return (
    <div className="text-center space-y-6 py-8 max-w-md mx-auto">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Rendez-vous confirmé !</h2>
        <p className="text-muted-foreground">
          Votre paiement a été accepté et votre rendez-vous est confirmé.
        </p>
      </div>

      <div className="inline-flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <CalendarDays className="h-6 w-6 text-primary" />
        <div className="text-left">
          <p className="font-semibold">{JOURS_FULL[slot.jour]} à {slot.heure}</p>
          <p className="text-sm text-muted-foreground">chez {businessName}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Un email de confirmation vous a été envoyé. Vous pouvez annuler jusqu'à 24h avant le rendez-vous.
      </p>

      <Button variant="outline" onClick={() => window.location.reload()}>
        Prendre un autre rendez-vous
      </Button>
    </div>
  );
}
