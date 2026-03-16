import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SECTORS,
  SOCLE_FIXE,
  QUOTA_LIMITS,
  ALL_MODULE_KEYS,
  DEFAULT_PLAN_PRICES,
  DEFAULT_SECTOR_RECOMMENDATIONS,
  type SubscriptionPlan,
  type SectorKey,
} from "@/contexts/DemoPlanContext";
import { GENERIC_MODULE_LABELS } from "@/data/sectorModules";
import { SECTOR_CATEGORIES } from "@/data/sectorCategories";
import { DEFAULT_ROLE_PERMISSIONS, SECTOR_ONBOARDING_ROLES } from "@/data/onboardingRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Crown,
  Star,
  Zap,
  Lock,
  Eye,
  Mail,
  User,
  Building2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OnboardingWizardProps {
  onComplete: () => void;
}

const STEP_TITLES = [
  "Choisissez votre formule",
  "Quel est votre secteur d'activité ?",
  "Sélectionnez vos modules",
  "Créez votre compte",
];

const PLAN_FEATURES: Record<SubscriptionPlan, string[]> = {
  starter: [
    "Gestion de base clients & dossiers",
    "Facturation et relances",
    "Messagerie intégrée",
  ],
  business: [
    "Tout Starter + emails & RDV",
    "Support client intégré",
    "Statistiques avancées",
  ],
  enterprise: [
    "Tous les modules sans limite",
    "Automatisations & IA",
    "Support prioritaire dédié",
  ],
};

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  starter: "Starter",
  business: "Business",
  enterprise: "Enterprise",
};

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<SubscriptionPlan>("business");
  const [sector, setSector] = useState<SectorKey | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    company: "",
  });
  const [generating, setGenerating] = useState(false);

  // Pre-select recommended modules when entering step 2
  useEffect(() => {
    if (step === 2 && sector) {
      const recommended = DEFAULT_SECTOR_RECOMMENDATIONS[sector] || [];
      const quota = QUOTA_LIMITS[plan];
      const filtered = recommended.filter((m) => !SOCLE_FIXE.includes(m));
      setSelectedModules(quota === null ? filtered : filtered.slice(0, quota));
    }
  }, [step]);

  const selectableModules = ALL_MODULE_KEYS.filter((m) => !SOCLE_FIXE.includes(m));
  const quota = QUOTA_LIMITS[plan];

  const toggleModule = (mod: string) => {
    setSelectedModules((prev) => {
      if (prev.includes(mod)) return prev.filter((m) => m !== mod);
      if (quota !== null && prev.length >= quota) return prev;
      return [...prev, mod];
    });
  };

  const canNext = () => {
    switch (step) {
      case 0: return true; // plan always selected
      case 1: return !!sector;
      case 2: return selectedModules.length > 0;
      case 3:
        return (
          formData.firstName.trim() &&
          formData.lastName.trim() &&
          formData.email.trim() &&
          formData.password.trim() &&
          formData.company.trim()
        );
      default: return false;
    }
  };

  const handleGenerate = async () => {
    if (!sector) return;
    setGenerating(true);
    try {
      const roles = (SECTOR_ONBOARDING_ROLES[sector] || []).map((r) => ({
        key: r.key,
        label: r.label,
        permissions: DEFAULT_ROLE_PERMISSIONS[r.key] || DEFAULT_ROLE_PERMISSIONS["_default"] || [],
      }));

      const { error } = await supabase.functions.invoke("generate-account-structure", {
        body: {
          sector,
          plan,
          modules: [...SOCLE_FIXE, ...selectedModules],
          roles,
          company: formData.company,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        },
      });
      if (error) throw error;
      toast.success("Structure de votre compte générée avec succès !");
      onComplete();
    } catch (err: any) {
      console.error("Onboarding error:", err);
      toast.error("Erreur lors de la génération : " + (err.message || "Veuillez réessayer"));
    } finally {
      setGenerating(false);
    }
  };

  const sectorLabel = SECTORS.find((s) => s.key === sector)?.label || sector;
  const progressValue = ((step + 1) / 4) * 100;

  const getModuleLabel = (key: string) => GENERIC_MODULE_LABELS[key] || key;

  // Which plan would unlock a module beyond current quota
  const getUpgradeBadge = (modIndex: number): string | null => {
    if (plan === "enterprise") return null;
    const starterQuota = QUOTA_LIMITS["starter"]!;
    const businessQuota = QUOTA_LIMITS["business"]!;
    if (plan === "starter" && modIndex >= starterQuota && modIndex < businessQuota)
      return "Business";
    if (plan === "starter" && modIndex >= businessQuota) return "Enterprise";
    if (plan === "business" && modIndex >= businessQuota) return "Enterprise";
    return null;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl my-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            {STEP_TITLES.map((title, i) => (
              <span
                key={i}
                className={`hidden sm:inline ${i <= step ? "text-primary font-medium" : ""}`}
              >
                {i + 1}. {title}
              </span>
            ))}
          </div>
          <Progress value={progressValue} className="h-2" />
          <p className="text-center text-foreground/70 text-sm mt-2">
            Étape {step + 1} sur 4
          </p>
        </div>

        {/* Step title */}
        <motion.h2
          key={`title-${step}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center mb-8 text-primary"
        >
          {STEP_TITLES[step]}
        </motion.h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            {/* ─── STEP 0: Plan selection ─── */}
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["starter", "business", "enterprise"] as SubscriptionPlan[]).map((p) => {
                  const isSelected = plan === p;
                  const isBusiness = p === "business";
                  return (
                    <button
                      key={p}
                      onClick={() => setPlan(p)}
                      className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border/40 hover:border-border"
                      } ${isBusiness ? "ring-2 ring-primary/20" : ""}`}
                    >
                      {isBusiness && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                          <Star className="h-3 w-3 mr-1" /> Recommandée
                        </Badge>
                      )}
                      <h3 className="text-lg font-bold mb-1">{PLAN_LABELS[p]}</h3>
                      <p className="text-3xl font-extrabold text-primary mb-3">
                        {DEFAULT_PLAN_PRICES[p]}€
                        <span className="text-sm font-normal text-muted-foreground">/mois</span>
                      </p>
                      <Badge variant="secondary" className="mb-3 text-xs w-fit">
                        Socle fixe inclus : Clients & Dossiers + Analyse
                      </Badge>
                      <p className="text-sm font-semibold text-primary mb-3">
                        {QUOTA_LIMITS[p] === null
                          ? "+ Tous les modules"
                          : `+ ${QUOTA_LIMITS[p]} modules au choix`}
                      </p>
                      <ul className="space-y-2 flex-1">
                        {PLAN_FEATURES[p].map((f, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      {isSelected && (
                        <div className="mt-4 text-center">
                          <Badge className="bg-primary text-primary-foreground">
                            <Check className="h-3 w-3 mr-1" /> Sélectionnée
                          </Badge>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ─── STEP 1: Sector by category ─── */}
            {step === 1 && (
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {SECTOR_CATEGORIES.map((cat) => (
                  <div key={cat.title}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <span className="text-lg">{cat.emoji}</span> {cat.title}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {cat.sectors.map((s) => {
                        const isSelected = sector === s.key;
                        return (
                          <button
                            key={s.key}
                            onClick={() => setSector(s.key)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all hover:scale-[1.02] text-center ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-border/40 hover:border-border"
                            }`}
                          >
                            <span className="text-xl">{s.icon}</span>
                            <span className="text-xs font-medium leading-tight">{s.label}</span>
                            <span className="text-[10px] text-muted-foreground leading-tight">
                              ({s.roles})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── STEP 2: Module selection ─── */}
            {step === 2 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Socle fixe */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" /> Toujours inclus
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {SOCLE_FIXE.filter((m) => m !== "overview" && m !== "parametres").map((m) => (
                      <div
                        key={m}
                        className="flex items-center gap-3 p-3 rounded-xl border-2 border-primary/20 bg-primary/5"
                      >
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{getModuleLabel(m)}</span>
                        <Badge variant="secondary" className="ml-auto text-[10px]">
                          Inclus
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional modules */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" /> Modules additionnels
                    </h3>
                    <Badge variant="outline">
                      {selectedModules.length}/{quota === null ? "∞" : quota} sélectionnés
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectableModules.map((mod, idx) => {
                      const isChecked = selectedModules.includes(mod);
                      const isDisabled =
                        !isChecked && quota !== null && selectedModules.length >= quota;
                      return (
                        <button
                          key={mod}
                          onClick={() => !isDisabled && toggleModule(mod)}
                          disabled={isDisabled && !isChecked}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                            isChecked
                              ? "border-primary bg-primary/5"
                              : isDisabled
                              ? "border-border/20 opacity-50"
                              : "border-border/40 hover:border-border"
                          }`}
                        >
                          <Checkbox checked={isChecked} className="pointer-events-none" />
                          <span className="text-sm font-medium flex-1">{getModuleLabel(mod)}</span>
                          {isDisabled && !isChecked && (
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {plan === "starter" ? "Business" : "Enterprise"}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-center mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(0)}
                      className="text-xs text-muted-foreground"
                    >
                      Modifier ma formule
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 3: Account creation ─── */}
            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Prénom</label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData((d) => ({ ...d, firstName: e.target.value }))
                        }
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nom</label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData((d) => ({ ...d, lastName: e.target.value }))
                        }
                        placeholder="Dupont"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((d) => ({ ...d, email: e.target.value }))
                      }
                      placeholder="jean@entreprise.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Mot de passe</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((d) => ({ ...d, password: e.target.value }))
                      }
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nom de l'entreprise</label>
                    <Input
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((d) => ({ ...d, company: e.target.value }))
                      }
                      placeholder="Mon Entreprise"
                    />
                  </div>
                </div>

                {/* Recap */}
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-semibold text-sm">Récapitulatif</h3>
                    <div className="flex items-center gap-3">
                      <Crown className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{PLAN_LABELS[plan]}</p>
                        <p className="text-xs text-muted-foreground">
                          {DEFAULT_PLAN_PRICES[plan]}€/mois
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-primary" />
                      <p className="text-sm">{sectorLabel}</p>
                    </div>
                    <div className="border-t border-border/30 pt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Modules actifs
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {SOCLE_FIXE.filter((m) => m !== "overview" && m !== "parametres").map(
                          (m) => (
                            <Badge key={m} variant="secondary" className="text-[10px]">
                              {getModuleLabel(m)}
                            </Badge>
                          )
                        )}
                        {selectedModules.map((m) => (
                          <Badge key={m} className="text-[10px]">
                            {getModuleLabel(m)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Précédent
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="gap-2"
            >
              Suivant <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={generating || !canNext()}
              className="gap-2"
            >
              {generating ? (
                <>Génération en cours...</>
              ) : (
                <>
                  <Rocket className="h-4 w-4" /> Valider et démarrer
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
