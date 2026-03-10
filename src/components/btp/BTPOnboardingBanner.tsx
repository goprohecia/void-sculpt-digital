import { useState } from "react";
import { X, Star, HardHat } from "lucide-react";

const MODULES = [
  "Clients & Dossiers",
  "Facturation",
  "Relances automatiques",
  "Stock / Matériaux",
  "Calendrier",
  "Messagerie",
];

export function BTPOnboardingBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="glass-card p-5 border-primary/30 relative mb-2">
      <button onClick={() => setDismissed(true)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="rounded-xl p-2.5 bg-primary/15 text-primary shrink-0">
          <HardHat className="h-5 w-5" />
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
            Facturation + relances automatiques = le nerf de la guerre pour un artisan. ROI immédiat.
          </p>
        </div>
      </div>
    </div>
  );
}
