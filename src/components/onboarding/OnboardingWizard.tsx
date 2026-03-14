import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTORS, type SectorKey } from "@/contexts/DemoPlanContext";
import { SECTOR_ONBOARDING_ROLES, STRUCTURE_EXTRA_ROLES, DEFAULT_ROLE_PERMISSIONS } from "@/data/onboardingRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronLeft, ChevronRight, Rocket, Users, Building2, Briefcase, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TeamSize = "solo" | "small" | "medium" | "structure";

const TEAM_SIZES: { key: TeamSize; label: string; desc: string; icon: string }[] = [
  { key: "solo", label: "Solo", desc: "1 personne", icon: "👤" },
  { key: "small", label: "Petite équipe", desc: "2 – 5 personnes", icon: "👥" },
  { key: "medium", label: "Équipe moyenne", desc: "6 – 20 personnes", icon: "🏢" },
  { key: "structure", label: "Structure", desc: "20+ personnes", icon: "🏗️" },
];

interface OnboardingWizardProps {
  onComplete: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [sector, setSector] = useState<SectorKey | null>(null);
  const [teamSize, setTeamSize] = useState<TeamSize | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<{ key: string; label: string }[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [generating, setGenerating] = useState(false);

  // When sector or team size changes, rebuild available roles
  const availableRoles = (() => {
    if (!sector) return [];
    const base = SECTOR_ONBOARDING_ROLES[sector] || [];
    if (teamSize === "structure") {
      const existing = new Set(base.map((r) => r.key));
      const extras = STRUCTURE_EXTRA_ROLES.filter((r) => !existing.has(r.key));
      return [...base, ...extras];
    }
    return base;
  })();

  // Reset roles when sector/team changes
  useEffect(() => {
    if (step === 2) {
      setSelectedRoles(availableRoles.map((r) => ({ ...r })));
    }
  }, [step]);

  const toggleRole = (role: { key: string; label: string }) => {
    setSelectedRoles((prev) => {
      const exists = prev.find((r) => r.key === role.key);
      if (exists) return prev.filter((r) => r.key !== role.key);
      return [...prev, role];
    });
  };

  const canNext = () => {
    switch (step) {
      case 0: return !!sector;
      case 1: return !!teamSize;
      case 2: return selectedRoles.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const handleGenerate = async () => {
    if (!sector) return;
    setGenerating(true);
    try {
      const { error } = await supabase.functions.invoke("generate-account-structure", {
        body: {
          sector,
          teamSize,
          roles: selectedRoles.map((r) => ({
            key: r.key,
            label: r.label,
            permissions: DEFAULT_ROLE_PERMISSIONS[r.key] || DEFAULT_ROLE_PERMISSIONS["_default"] || [],
          })),
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

  const stepTitles = [
    "Quel est votre corps de métier ?",
    "Quelle est la taille de votre équipe ?",
    "Quels rôles sont présents ?",
    "Récapitulatif de votre structure",
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div className={`h-2 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`} />
            </div>
          ))}
        </div>

        {/* Step title */}
        <motion.h2
          key={`title-${step}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center mb-2"
        >
          {stepTitles[step]}
        </motion.h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Étape {step + 1} sur 4
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 0: Sector */}
            {step === 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {SECTORS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSector(s.key)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                      sector === s.key
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border/40 hover:border-border"
                    }`}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-xs font-medium text-center leading-tight">{s.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 1: Team size */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {TEAM_SIZES.map((ts) => (
                  <button
                    key={ts.key}
                    onClick={() => setTeamSize(ts.key)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                      teamSize === ts.key
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border/40 hover:border-border"
                    }`}
                  >
                    <span className="text-3xl">{ts.icon}</span>
                    <span className="text-sm font-semibold">{ts.label}</span>
                    <span className="text-xs text-muted-foreground">{ts.desc}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Roles */}
            {step === 2 && (
              <div className="space-y-3 max-w-lg mx-auto">
                {availableRoles.map((role) => {
                  const isSelected = selectedRoles.some((r) => r.key === role.key);
                  return (
                    <button
                      key={role.key}
                      onClick={() => toggleRole(role)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-border"
                      }`}
                    >
                      <Checkbox checked={isSelected} className="pointer-events-none" />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{role.label}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })}
                <p className="text-xs text-muted-foreground text-center pt-2">
                  {selectedRoles.length} rôle{selectedRoles.length > 1 ? "s" : ""} sélectionné{selectedRoles.length > 1 ? "s" : ""}
                </p>
              </div>
            )}

            {/* Step 3: Recap */}
            {step === 3 && (
              <div className="space-y-4 max-w-lg mx-auto">
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">Métier</p>
                        <p className="text-xs text-muted-foreground">{sectorLabel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">Équipe</p>
                        <p className="text-xs text-muted-foreground">
                          {TEAM_SIZES.find((t) => t.key === teamSize)?.label} — {TEAM_SIZES.find((t) => t.key === teamSize)?.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">Rôles à créer</p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-8">
                      {selectedRoles.map((role, idx) => (
                        <div key={role.key} className="flex items-center gap-2">
                          {editingIdx === idx ? (
                            <Input
                              autoFocus
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              onBlur={() => {
                                if (editLabel.trim()) {
                                  setSelectedRoles((prev) =>
                                    prev.map((r, i) => (i === idx ? { ...r, label: editLabel.trim() } : r))
                                  );
                                }
                                setEditingIdx(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                              }}
                              className="h-8 text-sm max-w-[200px]"
                            />
                          ) : (
                            <>
                              <Badge variant="secondary" className="text-xs">
                                {role.label}
                              </Badge>
                              <button
                                onClick={() => {
                                  setEditingIdx(idx);
                                  setEditLabel(role.label);
                                }}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-border/30">
                      <p className="text-xs text-muted-foreground">
                        Chaque rôle sera créé avec des permissions par défaut adaptées. Vous pourrez les modifier à tout moment dans Paramètres &gt; Rôles &amp; Droits.
                      </p>
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
              disabled={generating}
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
