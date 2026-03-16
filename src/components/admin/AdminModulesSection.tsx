import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Puzzle, ArrowRightLeft, Lock, TrendingUp, Sparkles, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { ALL_ADMIN_MODULES, ALL_CLIENT_MODULES, ALL_EMPLOYEE_MODULES } from "@/hooks/use-app-settings";
import { useDemoPlan, ALL_MODULE_KEYS, DEFAULT_PLAN_MODULES, SOCLE_FIXE } from "@/contexts/DemoPlanContext";
import { ModuleSwapWizard } from "@/components/client/ModuleSwapWizard";
import { SwapWarningScreen } from "@/components/client/SwapWarningScreen";
import { SwapUpgradeBanner } from "@/components/client/SwapUpgradeBanner";
import { UpgradeBanner } from "@/components/admin/UpgradeBanner";
import { format, addMonths, startOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { SubscriptionPlan } from "@/hooks/use-subscription";

interface AdminModulesSectionProps {
  plan: SubscriptionPlan;
  modulesLimit: number | null;
  enabledModules: string[];
  clientVisibleModules: string[];
  employeeVisibleModules: string[];
  getModuleLabel: (key: string) => string;
  updateSetting: { mutate: (args: { key: string; value: unknown }) => void };
  canCustomizeSpaces: boolean;
}

const SYSTEM_MODULES = ["overview", "parametres"];
const ALWAYS_INCLUDED = ["overview", "parametres", "analyse"];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const NEXT_PLAN: Record<string, SubscriptionPlan | null> = {
  starter: "business",
  business: "enterprise",
  enterprise: null,
};

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  starter: "Starter",
  business: "Business",
  enterprise: "Enterprise",
};

export function AdminModulesSection({
  plan,
  modulesLimit,
  enabledModules,
  clientVisibleModules,
  employeeVisibleModules,
  getModuleLabel,
  updateSetting,
  canCustomizeSpaces,
}: AdminModulesSectionProps) {
  const { demoPlan, planModules } = useDemoPlan();
  const isEnterprise = demoPlan === "enterprise";

  // Swap state
  const [swapsRemaining, setSwapsRemaining] = useState(2);
  const [showWarning, setShowWarning] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  const activeModules = useMemo(
    () => enabledModules.filter((m) => !SYSTEM_MODULES.includes(m)),
    [enabledModules]
  );

  const availableModules = useMemo(
    () => ALL_MODULE_KEYS.filter((m) => !enabledModules.includes(m) && !SYSTEM_MODULES.includes(m)),
    [enabledModules]
  );

  // Modules only in enabled list (what's in the sidebar)
  const enabledAdminModules = useMemo(
    () => ALL_ADMIN_MODULES.filter((mod) => enabledModules.includes(mod.key)),
    [enabledModules]
  );

  // Modules available in the next plan but not in current
  const nextPlan = NEXT_PLAN[demoPlan] as SubscriptionPlan | null;
  const upsellModules = useMemo(() => {
    if (!nextPlan || isEnterprise) return [];
    const nextPlanMods = planModules[nextPlan];
    const nextKeys = nextPlanMods === "all"
      ? ALL_MODULE_KEYS
      : nextPlanMods;
    // Modules in next plan that are NOT in current enabled + not system
    return ALL_ADMIN_MODULES.filter(
      (mod) =>
        !enabledModules.includes(mod.key) &&
        !ALWAYS_INCLUDED.includes(mod.key) &&
        nextKeys.includes(mod.key)
    );
  }, [demoPlan, enabledModules, nextPlan, isEnterprise, planModules]);

  // For enterprise, also show modules not yet in next plan (all remaining)
  const allRemainingModules = useMemo(() => {
    if (nextPlan !== "enterprise" || isEnterprise) return [];
    return ALL_ADMIN_MODULES.filter(
      (mod) =>
        !enabledModules.includes(mod.key) &&
        !ALWAYS_INCLUDED.includes(mod.key) &&
        !upsellModules.find((u) => u.key === mod.key)
    );
  }, [enabledModules, nextPlan, isEnterprise, upsellModules]);

  const isBlocked = swapsRemaining <= 0;
  const showSwapSystem = !isEnterprise && modulesLimit !== null;

  const handleSwapComplete = (removed: string, added: string) => {
    const next = enabledModules.filter((m) => m !== removed).concat(added);
    updateSetting.mutate({ key: "enabled_modules", value: next });
    setSwapsRemaining((prev) => Math.max(0, prev - 1));
    toast.success(`Module "${capitalize(getModuleLabel(removed))}" retiré → "${capitalize(getModuleLabel(added))}" activé`);
  };

  return (
    <div className="space-y-6">
      {/* Swap system for non-enterprise plans */}
      {showSwapSystem && (
        <>
          <SwapUpgradeBanner />

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Swaps de modules</span>
                </div>
                <Badge variant={isBlocked ? "destructive" : "default"} className="text-xs">
                  {swapsRemaining} / 2 restants
                </Badge>
              </div>
              <Progress value={(swapsRemaining / 2) * 100} className="h-2" />

              {isBlocked && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Vos swaps se rechargent le <strong>1er {format(startOfMonth(addMonths(new Date(), 1)), "MMMM", { locale: fr })}</strong> à minuit
                  </p>
                  <div className="flex items-center gap-2 p-3 rounded-md bg-primary/5 border border-primary/20">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <p className="text-sm">
                      Vous voulez plus de swaps ?{" "}
                      <a href="/admin/upgrade" className="text-primary font-medium underline hover:no-underline">
                        Passez à l'offre supérieure
                      </a>
                    </p>
                  </div>
                </div>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={() => setShowWarning(true)}
                        disabled={isBlocked}
                        className="w-full gap-2"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                        Swaper un module
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {isBlocked && (
                    <TooltipContent>
                      <p>Swaps épuisés — rechargement le 1er {format(startOfMonth(addMonths(new Date(), 1)), "MMMM", { locale: fr })}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        </>
      )}

      {/* Active admin modules (only those currently enabled) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Puzzle className="h-4 w-4 text-primary" /> Vos modules actifs
          </CardTitle>
          <CardDescription>
            Les modules actuellement activés dans votre espace admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {enabledAdminModules.map((mod) => {
            const isAlwaysOn = SYSTEM_MODULES.includes(mod.key);
            return (
              <div key={mod.key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />
                  <p className="text-sm font-medium">{capitalize(getModuleLabel(mod.key))}</p>
                  {ALWAYS_INCLUDED.includes(mod.key) && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-gray-400 border-gray-200">
                      Inclus
                    </Badge>
                  )}
                </div>
                <Switch
                  checked={true}
                  disabled={isAlwaysOn}
                  onCheckedChange={(v) => {
                    if (!v) {
                      const next = enabledModules.filter((k) => k !== mod.key);
                      updateSetting.mutate({ key: "enabled_modules", value: next });
                      toast.success(`Module "${capitalize(getModuleLabel(mod.key))}" désactivé`);
                    }
                  }}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Upsell: modules available in next plan */}
      {!isEnterprise && nextPlan && (upsellModules.length > 0 || allRemainingModules.length > 0) && (
        <Card className="border-[#16a34a]/20 bg-[#f0fdf4]/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#16a34a]" />
              Modules disponibles avec le plan {PLAN_LABELS[nextPlan]}
            </CardTitle>
            <CardDescription>
              Passez au plan supérieur pour débloquer ces modules et enrichir votre espace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upsellModules.map((mod) => (
              <div key={mod.key} className="flex items-center justify-between py-2 border-b border-[#16a34a]/10 last:border-0">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-500">{capitalize(getModuleLabel(mod.key))}</p>
                  <Badge className="text-[10px] px-1.5 py-0 bg-[#16a34a]/10 text-[#16a34a] border-0 hover:bg-[#16a34a]/10">
                    {PLAN_LABELS[nextPlan]}
                  </Badge>
                </div>
              </div>
            ))}
            {allRemainingModules.map((mod) => (
              <div key={mod.key} className="flex items-center justify-between py-2 border-b border-[#16a34a]/10 last:border-0">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-500">{capitalize(getModuleLabel(mod.key))}</p>
                  <Badge className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-500 border-0 hover:bg-gray-100">
                    Enterprise
                  </Badge>
                </div>
              </div>
            ))}
            <div className="pt-3">
              <Button asChild size="sm" className="gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white">
                <Link to="/admin/upgrade">
                  Voir les offres
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee-visible modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Modules visibles côté salarié</CardTitle>
          <CardDescription>Configurez les onglets accessibles dans l'espace salarié.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ALL_EMPLOYEE_MODULES.map((mod) => {
            const isOn = employeeVisibleModules.includes(mod.key);
            const adminKeyMap: Record<string, string> = { calendrier: "rendez-vous" };
            const adminKey = adminKeyMap[mod.key] || mod.key;
            const adminHasIt = enabledModules.includes(adminKey) || ["overview","profil"].includes(mod.key);
            return (
              <div key={mod.key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${!adminHasIt ? "text-muted-foreground" : ""}`}>{capitalize(getModuleLabel(mod.key))}</p>
                  {!adminHasIt && <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30">Désactivé côté admin</Badge>}
                </div>
                <Switch checked={isOn} disabled={!adminHasIt} onCheckedChange={(v) => {
                  const next = v ? [...employeeVisibleModules, mod.key] : employeeVisibleModules.filter((k) => k !== mod.key);
                  updateSetting.mutate({ key: "employee_visible_modules", value: next });
                }} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Client-visible modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Modules visibles côté client</CardTitle>
          <CardDescription>Configurez les onglets accessibles dans l'espace client.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ALL_CLIENT_MODULES.map((mod) => {
            const isOn = clientVisibleModules.includes(mod.key);
            const adminHasIt = enabledModules.includes(mod.key) || ["overview","profil","parametres","demandes","devis","factures"].includes(mod.key);
            return (
              <div key={mod.key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${!adminHasIt ? "text-muted-foreground" : ""}`}>{capitalize(getModuleLabel(mod.key))}</p>
                  {!adminHasIt && <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30">Désactivé côté admin</Badge>}
                </div>
                <Switch checked={isOn} disabled={!adminHasIt} onCheckedChange={(v) => {
                  const next = v ? [...clientVisibleModules, mod.key] : clientVisibleModules.filter((k) => k !== mod.key);
                  updateSetting.mutate({ key: "client_visible_modules", value: next });
                }} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {canCustomizeSpaces ? null : (
        <UpgradeBanner currentPlan={plan} requiredPlan="enterprise" feature="Espaces personnalisés & renommage de modules" />
      )}

      {/* Swap warning & wizard */}
      {showWarning && (
        <SwapWarningScreen
          onAccept={() => { setShowWarning(false); setWizardOpen(true); }}
          onCancel={() => setShowWarning(false)}
        />
      )}

      <ModuleSwapWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        activeModules={activeModules}
        availableModules={availableModules}
        getModuleLabel={getModuleLabel}
        onSwapComplete={handleSwapComplete}
      />
    </div>
  );
}
