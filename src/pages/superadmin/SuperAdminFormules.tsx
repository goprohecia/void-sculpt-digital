import { useState } from "react";
import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useDemoPlan, ALL_MODULE_KEYS, SECTORS, SOCLE_FIXE, QUOTA_LIMITS, type SectorKey } from "@/contexts/DemoPlanContext";
import { GENERIC_MODULE_LABELS, SECTOR_MODULE_OVERRIDES, type SectorModulesConfig } from "@/data/sectorModules";
import { Save, Layers, ChevronDown, ChevronRight, Sparkles, ArrowUp, ArrowDown, Puzzle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SubscriptionPlan } from "@/hooks/use-subscription";

const MODULE_LABELS = GENERIC_MODULE_LABELS;

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

const ALWAYS_INCLUDED = SOCLE_FIXE;
const SELECTABLE_MODULES = ALL_MODULE_KEYS.filter((k) => !ALWAYS_INCLUDED.includes(k));

export default function SuperAdminFormules() {
  const { planModules, setPlanModules, planPrices, setPlanPrices, sectorRecommendations, setSectorRecommendations, sectorModuleOverrides, setSectorModuleOverrides } = useDemoPlan();
  const { toast } = useToast();

  const [localModules, setLocalModules] = useState<Record<SubscriptionPlan, string[] | "all">>({ ...planModules });
  const [localPrices, setLocalPrices] = useState<Record<SubscriptionPlan, number>>({ ...planPrices });
  const [localLimits, setLocalLimits] = useState<Record<SubscriptionPlan, number | null>>({
    starter: planModules.starter === "all" ? null : (planModules.starter as string[]).length,
    business: planModules.business === "all" ? null : (planModules.business as string[]).length,
    enterprise: null,
  });
  const [localSectorRecs, setLocalSectorRecs] = useState<Record<SectorKey, string[]>>({ ...sectorRecommendations });
  const [expandedSector, setExpandedSector] = useState<SectorKey | null>(null);
  const [localOverrides, setLocalOverrides] = useState<Record<string, SectorModulesConfig>>({ ...sectorModuleOverrides });
  const [expandedOverrideSector, setExpandedOverrideSector] = useState<SectorKey | null>(null);

  const plans: SubscriptionPlan[] = ["starter", "business", "enterprise"];

  const getModulesArray = (plan: SubscriptionPlan): string[] => {
    const m = localModules[plan];
    return m === "all" ? SELECTABLE_MODULES : m;
  };

  const toggleModule = (plan: SubscriptionPlan, moduleKey: string) => {
    if (plan === "enterprise") return;
    const current = getModulesArray(plan);
    const limit = localLimits[plan];
    if (current.includes(moduleKey)) {
      setLocalModules((prev) => ({ ...prev, [plan]: current.filter((k) => k !== moduleKey) }));
    } else {
      if (limit !== null && current.length >= limit) return;
      setLocalModules((prev) => ({ ...prev, [plan]: [...current, moduleKey] }));
    }
  };

  const toggleSectorModule = (sector: SectorKey, moduleKey: string) => {
    const current = localSectorRecs[sector] || [];
    if (current.includes(moduleKey)) {
      setLocalSectorRecs((prev) => ({ ...prev, [sector]: current.filter((k) => k !== moduleKey) }));
    } else {
      setLocalSectorRecs((prev) => ({ ...prev, [sector]: [...current, moduleKey] }));
    }
  };

  const moveSectorModule = (sector: SectorKey, moduleKey: string, direction: "up" | "down") => {
    const current = [...(localSectorRecs[sector] || [])];
    const idx = current.indexOf(moduleKey);
    if (idx < 0) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= current.length) return;
    [current[idx], current[newIdx]] = [current[newIdx], current[idx]];
    setLocalSectorRecs((prev) => ({ ...prev, [sector]: current }));
  };

  const updateOverrideLabel = (sector: string, moduleKey: string, label: string) => {
    setLocalOverrides((prev) => {
      const sectorCfg = { ...prev[sector] };
      sectorCfg[moduleKey] = { ...sectorCfg[moduleKey], label: label || MODULE_LABELS[moduleKey] || moduleKey };
      return { ...prev, [sector]: sectorCfg };
    });
  };

  const toggleOverrideHidden = (sector: string, moduleKey: string) => {
    setLocalOverrides((prev) => {
      const sectorCfg = { ...prev[sector] };
      const current = sectorCfg[moduleKey];
      if (current) {
        sectorCfg[moduleKey] = { ...current, hidden: !current.hidden };
      } else {
        sectorCfg[moduleKey] = { label: MODULE_LABELS[moduleKey] || moduleKey, hidden: true };
      }
      return { ...prev, [sector]: sectorCfg };
    });
  };

  const handleSave = () => {
    setPlanModules(localModules);
    setPlanPrices(localPrices);
    setSectorRecommendations(localSectorRecs);
    setSectorModuleOverrides(localOverrides);
    toast({ title: "Formules mises à jour", description: "Les changements ont été appliqués avec succès." });
  };

  const starterLimit = localLimits.starter ?? 3;
  const businessLimit = localLimits.business ?? 8;

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              Gestion des formules
            </h1>
            <p className="text-muted-foreground text-sm">Configurez les plans MBA, les prix, modules et recommandations secteur</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
        </div>

        {/* Plan cards */}
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
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Prix mensuel (€)</label>
                    <Input
                      type="number"
                      value={localPrices[plan]}
                      onChange={(e) => setLocalPrices((prev) => ({ ...prev, [plan]: Number(e.target.value) }))}
                      className="glass-input border-0 h-9"
                    />
                  </div>

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

        {/* Sector recommendations */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommandations par secteur
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ordonnez les modules par priorité pour chaque secteur. Les {starterLimit} premiers = Starter, les {businessLimit} premiers = Business.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {SECTORS.map((sector) => {
              const isExpanded = expandedSector === sector.key;
              const recs = localSectorRecs[sector.key] || [];

              return (
                <div key={sector.key} className="border border-border/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSector(isExpanded ? null : sector.key)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors text-left"
                  >
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-lg">{sector.icon}</span>
                    <span className="text-sm font-medium flex-1">{sector.label}</span>
                    <span className="text-xs text-muted-foreground">{recs.length} modules</span>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      <p className="text-[10px] text-muted-foreground">
                        Les modules sont triés par priorité. Position 1–{starterLimit} = <span className="text-muted-foreground font-medium">Starter</span>, 1–{businessLimit} = <span className="text-neon-blue font-medium">Business</span>, tous = <span className="text-amber-400 font-medium">Enterprise</span>.
                      </p>

                      {/* Selected modules in order */}
                      <div className="space-y-1">
                        {recs.map((key, idx) => (
                          <div
                            key={key}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                              idx < starterLimit ? "bg-muted/30" : idx < businessLimit ? "bg-neon-blue/5" : "bg-amber-400/5"
                            }`}
                          >
                            <span className="w-5 text-xs text-muted-foreground font-mono">{idx + 1}</span>
                            <span className="flex-1">{MODULE_LABELS[key] || key}</span>
                            <button onClick={() => moveSectorModule(sector.key, key, "up")} disabled={idx === 0} className="p-0.5 hover:text-primary disabled:opacity-20">
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button onClick={() => moveSectorModule(sector.key, key, "down")} disabled={idx === recs.length - 1} className="p-0.5 hover:text-primary disabled:opacity-20">
                              <ArrowDown className="h-3 w-3" />
                            </button>
                            <button onClick={() => toggleSectorModule(sector.key, key)} className="text-xs text-destructive hover:underline ml-1">✕</button>
                          </div>
                        ))}
                      </div>

                      {/* Add modules */}
                      {SELECTABLE_MODULES.filter((k) => !recs.includes(k)).length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2 border-t border-border/30">
                          {SELECTABLE_MODULES.filter((k) => !recs.includes(k)).map((key) => (
                            <button
                              key={key}
                              onClick={() => toggleSectorModule(sector.key, key)}
                              className="text-[10px] px-2 py-1 rounded bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              + {MODULE_LABELS[key] || key}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Sector Module Overrides */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="h-5 w-5 text-primary" />
              Modules par secteur
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Personnalisez les labels et la visibilité des modules pour chaque secteur d'activité.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {SECTORS.map((sector) => {
              const isExpanded = expandedOverrideSector === sector.key;
              const overrides = localOverrides[sector.key] || {};
              const overrideCount = Object.keys(overrides).filter((k) => overrides[k]?.label !== MODULE_LABELS[k] || overrides[k]?.hidden).length;

              return (
                <div key={sector.key} className="border border-border/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedOverrideSector(isExpanded ? null : sector.key)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors text-left"
                  >
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-lg">{sector.icon}</span>
                    <span className="text-sm font-medium flex-1">{sector.label}</span>
                    {overrideCount > 0 && (
                      <Badge variant="secondary" className="text-[10px]">{overrideCount} personnalisé{overrideCount > 1 ? "s" : ""}</Badge>
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-1">
                        <span>Module générique</span>
                        <span>Label secteur</span>
                        <span>Visible</span>
                      </div>
                      {SELECTABLE_MODULES.map((key) => {
                        const override = overrides[key];
                        const isHidden = override?.hidden === true;
                        const customLabel = override?.label || "";
                        const genericLabel = MODULE_LABELS[key] || key;

                        return (
                          <div key={key} className={`grid grid-cols-[1fr_1fr_auto] gap-2 items-center px-1 py-1.5 rounded-md ${isHidden ? "opacity-50" : ""}`}>
                            <span className="text-sm text-muted-foreground">{genericLabel}</span>
                            <Input
                              value={customLabel}
                              onChange={(e) => updateOverrideLabel(sector.key, key, e.target.value)}
                              placeholder={genericLabel}
                              className="glass-input border-0 h-8 text-sm"
                            />
                            <Switch
                              checked={!isHidden}
                              onCheckedChange={() => toggleOverrideHidden(sector.key, key)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
