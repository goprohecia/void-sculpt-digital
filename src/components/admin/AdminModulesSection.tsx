import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Puzzle, ArrowRightLeft, Lock, TrendingUp } from "lucide-react";
import { ALL_ADMIN_MODULES, ALL_CLIENT_MODULES, ALL_EMPLOYEE_MODULES } from "@/hooks/use-app-settings";
import { useDemoPlan, ALL_MODULE_KEYS } from "@/contexts/DemoPlanContext";
import { ModuleSwapWizard } from "@/components/client/ModuleSwapWizard";
import { SwapWarningScreen } from "@/components/client/SwapWarningScreen";
import { SwapUpgradeBanner } from "@/components/client/SwapUpgradeBanner";
import { UpgradeBanner } from "@/components/admin/UpgradeBanner";
import { format, addMonths, startOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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
  const planModuleKeys = planModules[demoPlan];

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

  const isBlocked = swapsRemaining <= 0;
  const showSwapSystem = !isEnterprise && modulesLimit !== null;

  const handleSwapComplete = (removed: string, added: string) => {
    // Update enabled modules via settings
    const next = enabledModules.filter((m) => m !== removed).concat(added);
    updateSetting.mutate({ key: "enabled_modules", value: next });
    setSwapsRemaining((prev) => Math.max(0, prev - 1));
    toast.success(`Module "${getModuleLabel(removed)}" retiré → "${getModuleLabel(added)}" activé`);
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

      {/* Admin modules toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Puzzle className="h-4 w-4 text-primary" /> Modules admin
          </CardTitle>
          <CardDescription>
            Choisissez les modules visibles dans votre navigation admin.
            {modulesLimit && (
              <span className="ml-1 font-medium text-primary">
                ({enabledModules.filter(k => !SYSTEM_MODULES.includes(k)).length}/{modulesLimit} utilisés)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ALL_ADMIN_MODULES.map((mod) => {
            const isAlwaysOn = SYSTEM_MODULES.includes(mod.key);
            const isOn = enabledModules.includes(mod.key);
            const activeCount = enabledModules.filter(k => !SYSTEM_MODULES.includes(k)).length;
            const atLimit = modulesLimit !== null && activeCount >= modulesLimit && !isOn && !isAlwaysOn;
            return (
              <div key={mod.key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${atLimit ? "text-muted-foreground" : ""}`}>{getModuleLabel(mod.key)}</p>
                  {atLimit && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30">
                      {showSwapSystem ? "Swap requis" : "Upgrade"}
                    </Badge>
                  )}
                </div>
                <Switch checked={isOn} disabled={isAlwaysOn || atLimit} onCheckedChange={(v) => {
                  const next = v ? [...enabledModules, mod.key] : enabledModules.filter((k) => k !== mod.key);
                  updateSetting.mutate({ key: "enabled_modules", value: next });
                  toast.success(`Module "${getModuleLabel(mod.key)}" ${v ? "activé" : "désactivé"}`);
                }} />
              </div>
            );
          })}
          {modulesLimit !== null && enabledModules.filter(k => !SYSTEM_MODULES.includes(k)).length >= modulesLimit && (
            <UpgradeBanner currentPlan={plan} requiredPlan={plan === "starter" ? "business" : "enterprise"} feature="Plus de modules" className="mt-4" />
          )}
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
                  <p className={`text-sm font-medium ${!adminHasIt ? "text-muted-foreground" : ""}`}>{getModuleLabel(mod.key)}</p>
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
                  <p className={`text-sm font-medium ${!adminHasIt ? "text-muted-foreground" : ""}`}>{getModuleLabel(mod.key)}</p>
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
