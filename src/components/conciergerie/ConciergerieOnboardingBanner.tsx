import { Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ConciergerieOnboardingBanner() {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">
          Offre Enterprise 500€/mois — recommandée pour la Conciergerie
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Modules : Clients & Dossiers, Calendrier multi-biens, Messagerie, Facturation, Stock fournitures, Relances automatiques
        </p>
        <p className="text-xs text-primary mt-1 italic">
          "L'espace propriétaire complet + abonnement récurrent automatique = produit premium qui se vend plus cher."
        </p>
      </div>
      <Link to="/contact?subject=Upgrade%20Enterprise%20Conciergerie" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline shrink-0">
        Découvrir <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
