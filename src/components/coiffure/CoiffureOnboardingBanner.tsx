import { Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CoiffureOnboardingBanner() {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">
          Offre Business 250€/mois — recommandée pour les salons
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Modules : Clients & Dossiers, Calendrier RDV, Messagerie, Acomptes en ligne, Stock produits, Relances automatiques
        </p>
        <p className="text-xs text-primary mt-1 italic">
          "RDV + acompte + stock = les 3 douleurs principales d'un salon résolues d'un coup."
        </p>
      </div>
      <Link to="/contact?subject=Upgrade%20Business%20Salon" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline shrink-0">
        Découvrir <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
