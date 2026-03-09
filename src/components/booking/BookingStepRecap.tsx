import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, CreditCard, ShieldAlert } from "lucide-react";
import type { TimeSlot } from "./BookingStepSlot";
import type { BookingFormField } from "./BookingStepForm";

const JOURS_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

interface BookingStepRecapProps {
  slot: TimeSlot;
  formData: Record<string, string>;
  formFields: BookingFormField[];
  showForm: boolean;
  acompteType: "fixe" | "pourcentage";
  acompteMontant: number;
  prixPrestation: number;
  cancellationMessage: string;
  onConfirm: () => void;
  onBack: () => void;
}

export function BookingStepRecap({
  slot, formData, formFields, showForm,
  acompteType, acompteMontant, prixPrestation,
  onConfirm, onBack,
}: BookingStepRecapProps) {
  const montantAcompte = acompteType === "fixe"
    ? acompteMontant
    : Math.round(prixPrestation * acompteMontant / 100);

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Récapitulatif</h2>
        <p className="text-sm text-muted-foreground">Vérifiez les informations avant de confirmer</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-3">
            <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Créneau réservé</p>
              <p className="text-sm text-muted-foreground">
                {JOURS_FULL[slot.jour]} à {slot.heure}
              </p>
            </div>
          </div>

          {showForm && formFields.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Vos informations</p>
                {formFields.map(f => (
                  <div key={f.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-medium text-right max-w-[60%] truncate">{formData[f.id] || "—"}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Acompte à régler</p>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xs text-muted-foreground">
                  {acompteType === "fixe" ? "Montant fixe" : `${acompteMontant}% de ${prixPrestation} €`}
                </span>
                <span className="text-xl font-bold text-primary">{montantAcompte} €</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        En cliquant sur "Payer l'acompte", vous acceptez les conditions générales de vente et la politique d'annulation.
      </p>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button onClick={onConfirm} className="gap-2">
          <CreditCard className="h-4 w-4" />
          Payer l'acompte — {montantAcompte} €
        </Button>
      </div>
    </div>
  );
}
