import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Layers, Users, FolderKanban, Receipt, MessageSquare, MailWarning,
  Headphones, Calendar, ListTodo, BarChart3, FileText,
  Clock, Zap, Bot, Settings, PieChart, PackageSearch,
  ArrowRightLeft, Lock, TrendingUp, CheckCircle2,
} from "lucide-react";
import { useDemoPlan, ALL_MODULE_KEYS } from "@/contexts/DemoPlanContext";
import { ModuleSwapWizard } from "@/components/client/ModuleSwapWizard";
import { SwapWarningScreen } from "@/components/client/SwapWarningScreen";
import { format, addMonths, startOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

const MODULE_ICONS: Record<string, LucideIcon> = {
  overview: Layers, clients: Users, employees: Users, dossiers: FolderKanban,
  pipeline: PieChart, facturation: Receipt, relances: MailWarning, stock: PackageSearch,
  messagerie: MessageSquare, emails: FileText, "rendez-vous": Calendar, agenda: Calendar,
  taches: ListTodo, support: Headphones, notes: FileText, analyse: BarChart3,
  rapports: PieChart, documents: FileText, temps: Clock, automatisations: Zap,
  ia: Bot, parametres: Settings,
};

// Non-swappable system modules
const SYSTEM_MODULES = ["overview", "parametres"];

export function ModulesTab() {
  const { demoPlan, planModules, getModuleLabel } = useDemoPlan();
  const [swapsRemaining, setSwapsRemaining] = useState(2);
  const [showWarning, setShowWarning] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  // Compute active modules from plan config
  const planModuleKeys = planModules[demoPlan];
  const [localActiveModules, setLocalActiveModules] = useState<string[]>(() => {
    if (planModuleKeys === "all") return [...ALL_MODULE_KEYS];
    return [...SYSTEM_MODULES, ...planModuleKeys];
  });

  const activeModules = useMemo(
    () => localActiveModules.filter((m) => !SYSTEM_MODULES.includes(m)),
    [localActiveModules]
  );

  const availableModules = useMemo(
    () => ALL_MODULE_KEYS.filter((m) => !localActiveModules.includes(m) && !SYSTEM_MODULES.includes(m)),
    [localActiveModules]
  );

  const isBlocked = swapsRemaining <= 0;
  const nextResetDate = useMemo(() => {
    const next = startOfMonth(addMonths(new Date(), 1));
    return format(next, "d MMMM yyyy", { locale: fr });
  }, []);

  const handleSwapComplete = (removed: string, added: string) => {
    setLocalActiveModules((prev) => prev.filter((m) => m !== removed).concat(added));
    setSwapsRemaining((prev) => Math.max(0, prev - 1));
    toast.success(`Module "${getModuleLabel(removed)}" retiré → "${getModuleLabel(added)}" activé`);
  };

  const renderIcon = (key: string, className?: string) => {
    const Icon = MODULE_ICONS[key] || Layers;
    return <Icon className={className || "h-5 w-5"} />;
  };

  return (
    <div className="space-y-6">
      {/* Swap counter */}
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
                  <a href="/client/paiement" className="text-primary font-medium underline hover:no-underline">
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
                    onClick={() => setWizardOpen(true)}
                    disabled={isBlocked || planModuleKeys === "all"}
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
              {planModuleKeys === "all" && !isBlocked && (
                <TooltipContent>
                  <p>Tous les modules sont déjà activés avec votre offre Enterprise</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Active modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Modules actifs
            <Badge variant="secondary" className="ml-auto text-xs">{activeModules.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {activeModules.map((key) => (
              <Card key={key} className="p-3 bg-primary/5 border-primary/20">
                <div className="flex flex-col items-center gap-2 text-center">
                  {renderIcon(key, "h-6 w-6 text-primary")}
                  <span className="text-xs font-medium leading-tight">{getModuleLabel(key)}</span>
                  <Badge className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20" variant="outline">
                    Actif
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available modules */}
      {availableModules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              Modules disponibles dans mon offre
              <Badge variant="outline" className="ml-auto text-xs">{availableModules.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableModules.map((key) => (
                <Card key={key} className="p-3 opacity-60">
                  <div className="flex flex-col items-center gap-2 text-center">
                    {renderIcon(key, "h-6 w-6 text-muted-foreground")}
                    <span className="text-xs font-medium text-muted-foreground leading-tight">{getModuleLabel(key)}</span>
                    <Badge variant="outline" className="text-[10px]">Inactif</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
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
