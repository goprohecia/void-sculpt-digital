import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldAlert, ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Dynamic extra warnings per module.
 * Displayed below the main warning body when the user has not yet
 * chosen a module (generic list) — the ModuleSwapWizard will later
 * show the specific one once a module is selected.
 */
const MODULE_EXTRA_WARNINGS: Record<string, string> = {
  facturation:
    "Vos factures existantes ne seront plus consultables.",
  dossiers:
    "Vos dossiers clients en cours ne seront plus accessibles.",
  pipeline:
    "Vos dossiers clients en cours ne seront plus accessibles.",
  agenda:
    "Vos RDV passés et futurs ne seront plus visibles.",
  "rendez-vous":
    "Vos RDV passés et futurs ne seront plus visibles.",
  messagerie:
    "Toutes vos conversations et messages seront définitivement perdus.",
  documents:
    "Tous vos documents stockés ne seront plus accessibles.",
  stock:
    "Tout votre inventaire et historique de mouvements ne sera plus accessible.",
};

export { MODULE_EXTRA_WARNINGS };

interface SwapWarningScreenProps {
  onAccept: () => void;
  onCancel: () => void;
}

export function SwapWarningScreen({ onAccept, onCancel }: SwapWarningScreenProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-destructive/95 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-auto px-6 py-10 space-y-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-background/10 flex items-center justify-center ring-4 ring-background/20">
            <ShieldAlert className="h-10 w-10 text-background" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-background tracking-tight">
          Attention — Perte de contenu
        </h1>

        {/* Body */}
        <div className="space-y-4 text-background/90">
          <p className="text-base leading-relaxed text-center max-w-lg mx-auto">
            Les données associées au module que vous allez retirer ne seront plus
            accessibles depuis votre espace après ce swap. Un backup peut être
            demandé au support Impartial dans les 30 jours suivants, mais ne sera
            pas disponible directement.
          </p>

          {/* Dynamic module-specific warnings */}
          <div className="rounded-lg bg-background/10 border border-background/20 p-4 space-y-2">
            <p className="text-sm font-semibold text-background/80 uppercase tracking-wider">
              Exemples de données concernées :
            </p>
            <ul className="space-y-1.5">
              {Object.entries(MODULE_EXTRA_WARNINGS)
                .filter(([key]) => ["facturation", "dossiers", "agenda"].includes(key))
                .map(([key, msg]) => (
                  <li key={key} className="text-sm flex items-start gap-2">
                    <span className="text-background/60 mt-0.5">•</span>
                    <span>{msg}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-background/10 border border-background/20 max-w-lg mx-auto">
          <Checkbox
            id="swap-warning-accept"
            checked={accepted}
            onCheckedChange={(v) => setAccepted(v === true)}
            className="mt-0.5 border-background/50 data-[state=checked]:bg-background data-[state=checked]:text-destructive"
          />
          <label
            htmlFor="swap-warning-accept"
            className="text-sm text-background/90 cursor-pointer leading-relaxed select-none"
          >
            J'ai compris que les données de ce module ne seront plus accessibles
            après le swap.
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="gap-1.5 text-background/80 hover:text-background hover:bg-background/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Annuler
          </Button>
          <Button
            onClick={onAccept}
            disabled={!accepted}
            className="gap-1.5 bg-background text-destructive hover:bg-background/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
