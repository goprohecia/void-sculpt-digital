import { useState } from "react";
import { X, Sparkles, Check } from "lucide-react";

const MODULES = [
  "Clients & Dossiers",
  "Rendez-vous + Acompte",
  "Facturation",
  "Stock / Pièces",
  "Messagerie",
  "Relances automatiques",
];

export function GarageOnboardingBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-5 relative">
      <button onClick={() => setVisible(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/20 p-2 shrink-0">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-2">
          <div>
            <p className="font-semibold text-sm">Offre recommandée : <span className="text-primary">Business — 250€/mois</span></p>
            <p className="text-xs text-muted-foreground mt-1">
              Ces 6 modules couvrent 90% des besoins d'un garage. Le suivi véhicule en espace client élimine les appels.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {MODULES.map((m) => (
              <span key={m} className="inline-flex items-center gap-1 text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                <Check className="h-3 w-3" /> {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
