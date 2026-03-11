import { Link } from "react-router-dom";
import { Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDemoPlan, type SubscriptionPlan } from "@/contexts/DemoPlanContext";

const PLAN_MESSAGES: Record<Exclude<SubscriptionPlan, "enterprise">, string> = {
  starter: "Passez à Business : 3 modules actifs → 6 modules, aucune perte de contenu.",
  business: "Passez à Enterprise : accédez à tous les modules sans restriction.",
};

export function SwapUpgradeBanner() {
  const { demoPlan } = useDemoPlan();

  if (demoPlan === "enterprise") return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="space-y-1">
          <p className="text-sm font-semibold leading-snug">
            Vous souhaitez ajouter un module sans en perdre un&nbsp;? Passez à l'offre supérieure.
          </p>
          <p className="text-sm text-muted-foreground">{PLAN_MESSAGES[demoPlan]}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-8">
        <Button asChild size="sm">
          <Link to="/admin/upgrade">Voir les offres</Link>
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-1 text-xs text-muted-foreground underline hover:text-foreground">
              <Info className="h-3.5 w-3.5" />
              En savoir plus sur le swap
            </button>
          </PopoverTrigger>
          <PopoverContent className="max-w-xs text-sm" side="bottom" align="start">
            <p className="font-semibold mb-1">Comment fonctionne le swap ?</p>
            <p className="text-muted-foreground">
              Le swap vous permet d'échanger un module actif contre un module inactif.
              Vous disposez de 2 swaps par mois, réinitialisés le 1er du mois.
              Attention : les données du module retiré ne seront plus directement accessibles.
            </p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
