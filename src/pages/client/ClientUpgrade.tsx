import { Check, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { useDemoPlan, DEFAULT_PLAN_MODULES, DEFAULT_PLAN_PRICES, ALL_MODULE_KEYS, SOCLE_FIXE, QUOTA_LIMITS, type SubscriptionPlan } from "@/contexts/DemoPlanContext";
import { GENERIC_MODULE_LABELS } from "@/data/sectorModules";
import { toast } from "sonner";

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  starter: "Starter",
  business: "Business",
  enterprise: "Enterprise",
};

const PLAN_ORDER: SubscriptionPlan[] = ["starter", "business", "enterprise"];

const SWAPS_PER_PLAN: Record<SubscriptionPlan, string> = {
  starter: "2 swaps / mois",
  business: "2 swaps / mois",
  enterprise: "Illimité — tous les modules inclus",
};

export default function ClientUpgrade() {
  const { demoPlan, getModuleLabel } = useDemoPlan();

  const getAdditionalModules = (plan: SubscriptionPlan): string[] => {
    const m = DEFAULT_PLAN_MODULES[plan];
    if (m === "all") return ALL_MODULE_KEYS.filter((k) => !SOCLE_FIXE.includes(k));
    return m;
  };

  const socleModules = SOCLE_FIXE.filter((k) => k !== "overview" && k !== "parametres");

  const currentIdx = PLAN_ORDER.indexOf(demoPlan);

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Changer d'offre</h1>
          <p className="text-muted-foreground">Comparez les formules et choisissez celle qui correspond à vos besoins.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLAN_ORDER.map((plan, idx) => {
            const isCurrent = plan === demoPlan;
            const isUpgrade = idx > currentIdx;
            const additionalModules = getAdditionalModules(plan);
            const quota = QUOTA_LIMITS[plan];

            return (
              <Card key={plan} className={isCurrent ? "border-2 border-primary shadow-lg" : ""}>
                <CardHeader className="text-center space-y-2">
                  {isCurrent && (
                    <Badge className="mx-auto w-fit bg-primary/10 text-primary border-primary/30" variant="outline">
                      Votre offre actuelle
                    </Badge>
                  )}
                  <CardTitle className="text-xl">{PLAN_LABELS[plan]}</CardTitle>
                  <p className="text-3xl font-bold">
                    {DEFAULT_PLAN_PRICES[plan]}&nbsp;€
                    <span className="text-sm font-normal text-muted-foreground"> / mois</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{SWAPS_PER_PLAN[plan]}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Socle fixe */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      <p className="text-xs font-semibold text-primary">Socle fixe inclus</p>
                    </div>
                    {socleModules.map((m) => (
                      <div key={m} className="flex items-center gap-2 text-sm text-muted-foreground pl-5">
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{getModuleLabel(m)}</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 border-primary/30 text-primary">
                          Toujours inclus
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Additional modules */}
                  <div className="border-t pt-3 space-y-1.5">
                    <p className="text-sm font-medium">
                      {quota === null
                        ? `+ Tous les modules (${additionalModules.length})`
                        : `+ ${quota} modules au choix`}
                    </p>
                    <ul className="space-y-1.5 max-h-56 overflow-y-auto">
                      {additionalModules.map((m) => (
                        <li key={m} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                          {GENERIC_MODULE_LABELS[m] || m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isCurrent ? (
                    <Button disabled className="w-full" variant="outline">
                      Offre actuelle
                    </Button>
                  ) : isUpgrade ? (
                    <Button
                      className="w-full"
                      onClick={() => toast.info("Contactez le support pour changer d'offre.")}
                    >
                      Choisir cette offre
                    </Button>
                  ) : (
                    <Button disabled variant="ghost" className="w-full">
                      —
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </ClientLayout>
  );
}
