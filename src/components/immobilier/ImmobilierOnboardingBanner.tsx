import { useState } from "react";
import { X, Star, Building2 } from "lucide-react";

const MODULES = [
  "Clients & Dossiers",
  "Calendrier RDV",
  "Messagerie",
  "Signature électronique",
  "Facturation",
  "Relances automatiques",
];

export function ImmobilierOnboardingBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="glass-card p-5 border-primary/30 relative mb-2">
      <button onClick={() => setDismissed(true)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="rounded-xl p-2.5 bg-primary/15 text-primary shrink-0">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Offre recommandée : Business 250 €/mois</h3>
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MODULES.map((m) => (
              <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                ✓ {m}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            La signature électronique + dossiers + espace propriétaire éliminent 80 % des allers-retours.
          </p>
        </div>
      </div>
    </div>
  );
}
