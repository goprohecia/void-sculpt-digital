import { useState } from "react";
import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useDemoPlan, ALL_MODULE_KEYS } from "@/contexts/DemoPlanContext";
import { Save, Layers, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SubscriptionPlan } from "@/hooks/use-subscription";

const MODULE_LABELS: Record<string, string> = {
  overview: "Vue d'ensemble",
  clients: "Clients",
  employees: "Salariés",
  dossiers: "Dossiers",
  pipeline: "Pipeline CRM",
  facturation: "Facturation",
  relances: "Relances",
  stock: "Stock",
  messagerie: "Messagerie",
  emails: "Emails",
  "rendez-vous": "Rendez-vous",
  agenda: "Agenda",
  taches: "Tâches",
  support: "Support",
  notes: "Notes",
  analyse: "Analyse",
  rapports: "Rapports",
  documents: "Documents",
  temps: "Suivi du temps",
  automatisations: "Automatisations",
  ia: "Intelligence IA",
  parametres: "Paramètres",
};

const PLAN_COLORS: Record<SubscriptionPlan, string> = {
  starter: "border-muted-foreground/30",
  business: "border-neon-blue/40",
  enterprise: "border-amber-400/40",
};

const PLAN_ACCENT: Record<SubscriptionPlan, string> = {
  starter: "text-muted-foreground",
  business: "text-neon-blue",
  enterprise: "text-amber-400",
};

// Always-visible modules that don't count toward limit
const ALWAYS_INCLUDED = ["overview", "parametres"];
// Selectable modules (excluding always-included)
const SELECTABLE_MODULES = ALL_MODULE_KEYS.filter((k) => !ALWAYS_INCLUDED.includes(k));

export default function SuperAdminFormules() {
  const { planModules, setPlanModules, planPrices, setPlanPrices } = useDemoPlan();
  const { toast } = useToast();

  // Local editable state
  const [localModules, setLocalModules] = useState<Record<SubscriptionPlan, string[] | "all">>({ ...planModules });
  const [localPrices, setLocalPrices] = useState<Record<SubscriptionPlan, number>>({ ...planPrices });
  const [localLimits, setLocalLimits] = useState<Record<SubscriptionPlan, number | null>>({
    starter: planModules.starter === "all" ? null : (planModules.starter as string[]).length,
    business: planModules.business === "all" ? null : (planModules.business as string[]).length,
    enterprise: null,
  });

  const plans: SubscriptionPlan[] = ["starter", "business", "enterprise"];

  const getModulesArray = (plan: SubscriptionPlan): string[] => {
    const m = localModules[plan];
    return m === "all" ? SELECTABLE_MODULES : m;
  };

  const toggleModule = (plan: SubscriptionPlan, moduleKey: string) => {
    if (plan === "enterprise") return; // enterprise = all
    const current = getModulesArray(plan);
    const limit = localLimits[plan];
    if (current.includes(moduleKey)) {
      setLocalModules((prev) => ({ ...prev, [plan]: current.filter((k) => k !== moduleKey) }));
    } else {
      if (limit !== null && current.length >= limit) return;
      setLocalModules((prev) => ({ ...prev, [plan]: [...current, moduleKey] }));
    }
  };

  const handleSave = () => {
    setPlanModules(localModules);
    setPlanPrices(localPrices);
    toast({ title: "Formules mises à jour", description: "Les changements ont été appliqués avec succès." });
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              Gestion des formules
            </h1>
            <p className="text-muted-foreground text-sm">Configurez les plans MBA, les prix et les modules inclus</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isEnterprise = plan === "enterprise";
            const selectedModules = getModulesArray(plan);
            const limit = localLimits[plan];

            return (
              <Card key={plan} className={`glass-card border ${PLAN_COLORS[plan]}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className={`text-lg font-bold uppercase ${PLAN_ACCENT[plan]}`}>{plan}</span>
                    <Badge variant="outline" className={PLAN_ACCENT[plan]}>
                      {isEnterprise ? "Illimité" : `${selectedModules.length}/${limit ?? "∞"} modules`}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Prix */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Prix mensuel (€)</label>
                    <Input
                      type="number"
                      value={localPrices[plan]}
                      onChange={(e) => setLocalPrices((prev) => ({ ...prev, [plan]: Number(e.target.value) }))}
                      className="glass-input border-0 h-9"
                    />
                  </div>

                  {/* Limite modules */}
                  {!isEnterprise && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Limite de modules</label>
                      <Input
                        type="number"
                        value={limit ?? ""}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setLocalLimits((prev) => ({ ...prev, [plan]: v > 0 ? v : null }));
                        }}
                        className="glass-input border-0 h-9"
                        min={1}
                        max={SELECTABLE_MODULES.length}
                      />
                    </div>
                  )}

                  {/* Modules */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Modules inclus {isEnterprise && "(tous)"}
                    </label>
                    <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
                      {SELECTABLE_MODULES.map((key) => {
                        const checked = isEnterprise || selectedModules.includes(key);
                        const disabled = isEnterprise || (!checked && limit !== null && selectedModules.length >= limit);

                        return (
                          <label
                            key={key}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                              checked ? "bg-primary/5" : "hover:bg-muted/30"
                            } ${disabled && !checked ? "opacity-40 cursor-not-allowed" : ""}`}
                          >
                            <Checkbox
                              checked={checked}
                              disabled={isEnterprise || disabled}
                              onCheckedChange={() => toggleModule(plan, key)}
                            />
                            <span className="text-sm">{MODULE_LABELS[key] || key}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Always included info */}
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Toujours inclus</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {ALWAYS_INCLUDED.map((k) => (
                        <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {MODULE_LABELS[k]}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
