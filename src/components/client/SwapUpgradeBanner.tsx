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
    <div className="flex flex-col gap-4 rounded-xl border border-[#16a34a]/30 bg-[#f0fdf4] p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-[#16a34a]/15 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="h-4.5 w-4.5 text-[#16a34a]" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold leading-snug text-gray-900">
            Vous souhaitez ajouter un module sans en perdre un&nbsp;? Passez à l'offre supérieure.
          </p>
          <p className="text-sm text-gray-500">{PLAN_MESSAGES[demoPlan]}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-12">
        <Button asChild size="sm" className="bg-[#16a34a] hover:bg-[#15803d] text-white shadow-sm">
          <Link to="/admin/upgrade">Voir les offres</Link>
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-1 text-xs text-gray-500 underline hover:text-gray-700">
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
