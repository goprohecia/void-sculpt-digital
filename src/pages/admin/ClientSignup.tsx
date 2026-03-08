import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { CompleteProfileDialog } from "@/components/CompleteProfileDialog";
import { useDemoPlan, ALL_MODULE_KEYS, SECTORS, type SectorKey } from "@/contexts/DemoPlanContext";
import { getModuleLabel as getSectorModuleLabel, isModuleHidden } from "@/data/sectorModules";
import { GENERIC_MODULE_LABELS } from "@/data/sectorModules";
import type { SubscriptionPlan } from "@/hooks/use-subscription";

const ALWAYS_INCLUDED = ["overview", "parametres"];
const SELECTABLE_MODULES = ALL_MODULE_KEYS.filter((k) => !ALWAYS_INCLUDED.includes(k));

const STEP_LABELS = ["Formule", "Secteur", "Modules", "Compte"];

export default function ClientSignup() {
  const [step, setStep] = useState<"plan" | "sector" | "modules" | "form">("plan");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedSector, setSelectedSector] = useState<SectorKey | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [googleUserId, setGoogleUserId] = useState("");
  const navigate = useNavigate();
  const { planModules, planPrices, sectorRecommendations } = useDemoPlan();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles").select("nom").eq("user_id", session.user.id).single();
        if (profile && (!profile.nom || profile.nom === "")) {
          setGoogleUserId(session.user.id);
          setShowCompleteProfile(true);
        } else {
          navigate("/client", { replace: true });
        }
      }
    };
    checkSession();
  }, [navigate]);

  const getModuleLimit = (plan: SubscriptionPlan): number | null => {
    const modules = planModules[plan];
    return modules === "all" ? null : modules.length;
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setSelectedSector(null);
    setSelectedModules([]);
    setStep("sector");
  };

  const handleSelectSector = (sector: SectorKey) => {
    setSelectedSector(sector);
    if (!selectedPlan) return;

    const recommendations = sectorRecommendations[sector] || [];
    const limit = getModuleLimit(selectedPlan);

    if (selectedPlan === "enterprise") {
      // Enterprise: pre-select all recommended, go to modules for optional deselection
      setSelectedModules(SELECTABLE_MODULES);
      setStep("modules");
    } else {
      // Starter/Business: pre-select the top N recommended modules
      const count = limit ?? recommendations.length;
      const preSelected = recommendations.slice(0, count);
      setSelectedModules(preSelected);
      setStep("modules");
    }
  };

  const toggleModule = (key: string) => {
    if (!selectedPlan) return;
    const limit = getModuleLimit(selectedPlan);
    if (selectedModules.includes(key)) {
      setSelectedModules((prev) => prev.filter((m) => m !== key));
    } else {
      if (limit !== null && selectedModules.length >= limit) return;
      setSelectedModules((prev) => [...prev, key]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nom.trim()) { setError("Le nom est requis"); return; }
    if (password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères"); return; }
    if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas"); return; }

    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("send-signup-confirmation", {
        body: { email, password, nom: nom.trim(), telephone: telephone.trim(), plan: selectedPlan, modules: selectedModules, sector: selectedSector },
      });
      setLoading(false);
      if (fnError) { setError("Erreur lors de la création du compte"); }
      else if (data?.error) { setError(data.error); }
      else { setSuccess(true); }
    } catch {
      setLoading(false);
      setError("Erreur lors de la création du compte");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/signup",
    });
    if (error) setError("Erreur lors de la connexion avec Google");
  };

  const currentStepIndex = ["plan", "sector", "modules", "form"].indexOf(step);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Inscription réussie !</h1>
          <p className="text-muted-foreground">
            Un email de confirmation a été envoyé à <strong>{email}</strong>.
            Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte.
          </p>
          <Button variant="outline" onClick={() => navigate("/client/login")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold">
            {step === "plan" ? "Choisissez votre formule" :
             step === "sector" ? "Quel est votre secteur d'activité ?" :
             step === "modules" ? "Sélectionnez vos modules" :
             "Créer votre compte"}
          </h1>
          <p className="text-sm text-muted-foreground">My Business Assistant</p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-1">
                <div className={`h-1.5 rounded-full transition-all ${i === currentStepIndex ? "w-8 bg-primary" : i < currentStepIndex ? "w-6 bg-primary/50" : "w-4 bg-muted"}`} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground pt-1">
            {STEP_LABELS.map((label, i) => (
              <span key={label} className={i === currentStepIndex ? "text-primary font-medium" : ""}>{label}</span>
            ))}
          </div>
        </div>

        {/* Step 1: Plan selection */}
        {step === "plan" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(["starter", "business", "enterprise"] as SubscriptionPlan[]).map((plan) => {
              const modules = planModules[plan];
              const moduleCount = modules === "all" ? SELECTABLE_MODULES.length : modules.length;
              const price = planPrices[plan];
              const colors: Record<SubscriptionPlan, string> = {
                starter: "border-muted-foreground/30 hover:border-muted-foreground/60",
                business: "border-neon-blue/30 hover:border-neon-blue/60",
                enterprise: "border-amber-400/30 hover:border-amber-400/60",
              };
              const accents: Record<SubscriptionPlan, string> = {
                starter: "text-muted-foreground",
                business: "text-neon-blue",
                enterprise: "text-amber-400",
              };

              return (
                <button
                  key={plan}
                  onClick={() => handleSelectPlan(plan)}
                  className={`glass-card p-5 border ${colors[plan]} text-left space-y-3 transition-all cursor-pointer`}
                >
                  <div>
                    <h3 className={`text-lg font-bold uppercase ${accents[plan]}`}>{plan}</h3>
                    <p className="text-2xl font-bold mt-1">{price}€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{modules === "all" ? "Tous les modules" : `${moduleCount} modules inclus`}</p>
                    {modules !== "all" && (
                      <div className="flex flex-wrap gap-1">
                        {modules.map((m) => (
                          <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">{GENERIC_MODULE_LABELS[m] || m}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`text-sm font-medium ${accents[plan]} flex items-center gap-1`}>
                    Choisir <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Sector selection */}
        {step === "sector" && (
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep("plan")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Retour
              </button>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium uppercase">
                {selectedPlan}
              </span>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Nous vous recommanderons les modules les plus adaptés à votre activité.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SECTORS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSelectSector(s.key)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer text-center"
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Module selection */}
        {step === "modules" && selectedPlan && (
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep("sector")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Retour
              </button>
              <span className="text-xs text-muted-foreground">
                {selectedModules.length}/{getModuleLimit(selectedPlan) ?? "∞"} modules sélectionnés
              </span>
            </div>

            {selectedSector && sectorRecommendations[selectedSector] && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Modules pré-sélectionnés selon votre secteur <strong className="text-foreground">{SECTORS.find(s => s.key === selectedSector)?.label}</strong>. Vous pouvez ajuster.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SELECTABLE_MODULES.filter((k) => !isModuleHidden(k, selectedSector)).map((key) => {
                const isSelected = selectedModules.includes(key);
                const limit = getModuleLimit(selectedPlan);
                const disabled = !isSelected && limit !== null && selectedModules.length >= limit;
                const isRecommended = selectedSector ? (sectorRecommendations[selectedSector] || []).includes(key) : false;

                return (
                  <label
                    key={key}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors border ${
                      isSelected ? "border-primary/30 bg-primary/5" : "border-transparent hover:bg-muted/30"
                    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      onCheckedChange={() => toggleModule(key)}
                    />
                    <span className="text-sm">{getSectorModuleLabel(key, selectedSector)}</span>
                    {isRecommended && !isSelected && (
                      <Sparkles className="h-3 w-3 text-primary/50 ml-auto" />
                    )}
                  </label>
                );
              })}
            </div>

            <Button onClick={() => setStep("form")} className="w-full gap-2" disabled={selectedModules.length === 0}>
              Continuer <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 4: Account form */}
        {step === "form" && (
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep("modules")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Retour
              </button>
              <div className="flex items-center gap-2">
                {selectedSector && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {SECTORS.find(s => s.key === selectedSector)?.label}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium uppercase">
                  {selectedPlan}
                </span>
              </div>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 h-10 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors text-sm font-medium"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              S'inscrire avec Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">ou</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Nom complet *</label>
                  <Input type="text" placeholder="Jean Dupont" value={nom} onChange={(e) => setNom(e.target.value)} className="glass-input border-0 h-10" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Téléphone</label>
                  <Input type="tel" placeholder="+33 6 12 34 56 78" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="glass-input border-0 h-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email *</label>
                <Input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input border-0 h-10" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Mot de passe *</label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input border-0 h-10 pr-10" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Confirmer *</label>
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="glass-input border-0 h-10" required minLength={6} />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full h-10 gap-2" disabled={loading}>
                <UserPlus className="h-4 w-4" />
                {loading ? "Création en cours..." : "Créer mon compte"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Déjà un compte ?{" "}
                <Link to="/client/login" className="text-primary hover:underline font-medium">Se connecter</Link>
              </p>
            </div>
          </div>
        )}

        {step === "plan" && (
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Déjà un compte ?{" "}
              <Link to="/client/login" className="text-primary hover:underline font-medium">Se connecter</Link>
            </p>
          </div>
        )}
      </div>

      <CompleteProfileDialog
        open={showCompleteProfile}
        userId={googleUserId}
        onComplete={() => { setShowCompleteProfile(false); navigate("/client", { replace: true }); }}
      />
    </div>
  );
}
