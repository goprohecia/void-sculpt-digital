import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ShieldAlert, ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";

/**
 * Dynamic extra warnings per module.
 */
const MODULE_EXTRA_WARNINGS: Record<string, string> = {
  facturation: "Vos factures existantes ne seront plus consultables.",
  dossiers: "Vos dossiers clients en cours ne seront plus accessibles.",
  pipeline: "Vos dossiers clients en cours ne seront plus accessibles.",
  agenda: "Vos RDV passés et futurs ne seront plus visibles.",
  "rendez-vous": "Vos RDV passés et futurs ne seront plus visibles.",
  messagerie: "Toutes vos conversations et messages seront définitivement perdus.",
  documents: "Tous vos documents stockés ne seront plus accessibles.",
  stock: "Tout votre inventaire et historique de mouvements ne sera plus accessible.",
};

export { MODULE_EXTRA_WARNINGS };

interface SwapWarningScreenProps {
  onAccept: () => void;
  onCancel: () => void;
}

export function SwapWarningScreen({ onAccept, onCancel }: SwapWarningScreenProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden border-gray-200 shadow-xl">
        {/* Warning header band */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <DialogHeader className="p-0 space-y-1">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Attention — Perte de contenu
              </DialogTitle>
              <DialogDescription className="text-sm text-amber-700">
                Cette action est irréversible. Lisez attentivement avant de continuer.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <p className="text-sm text-gray-600 leading-relaxed">
            Les données associées au module que vous allez retirer ne seront plus
            accessibles depuis votre espace après ce swap. Un backup peut être
            demandé au support dans les 30 jours suivants, mais ne sera
            pas disponible directement.
          </p>

          {/* Data examples */}
          <div className="rounded-lg bg-amber-50/80 border border-amber-200/60 p-4 space-y-2.5">
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Exemples de données concernées
            </p>
            <ul className="space-y-1.5">
              {Object.entries(MODULE_EXTRA_WARNINGS)
                .filter(([key]) => ["facturation", "dossiers", "agenda"].includes(key))
                .map(([key, msg]) => (
                  <li key={key} className="text-sm flex items-start gap-2 text-gray-700">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{msg}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Checkbox acknowledgment */}
          <label
            htmlFor="swap-warning-accept"
            className="flex items-start gap-3 p-3.5 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:border-gray-300 transition-colors"
          >
            <Checkbox
              id="swap-warning-accept"
              checked={accepted}
              onCheckedChange={(v) => setAccepted(v === true)}
              className="mt-0.5"
            />
            <span className="text-sm text-gray-700 leading-relaxed select-none">
              J'ai compris que les données de ce module ne seront plus accessibles
              après le swap.
            </span>
          </label>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-row gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Annuler
          </Button>
          <Button
            onClick={onAccept}
            disabled={!accepted}
            className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
