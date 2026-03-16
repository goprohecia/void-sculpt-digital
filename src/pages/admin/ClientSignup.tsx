import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { CompleteProfileDialog } from "@/components/CompleteProfileDialog";
import { useDemoPlan, ALL_MODULE_KEYS, SECTORS, SOCLE_FIXE, QUOTA_LIMITS, type SectorKey } from "@/contexts/DemoPlanContext";
import { getModuleLabel as getSectorModuleLabel, isModuleHidden } from "@/data/sectorModules";
import { GENERIC_MODULE_LABELS } from "@/data/sectorModules";
import type { SubscriptionPlan } from "@/hooks/use-subscription";
import logoMba from "@/assets/logo-mba.png";

const SELECTABLE_MODULES = ALL_MODULE_KEYS.filter((k) => !SOCLE_FIXE.includes(k));

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
    return QUOTA_LIMITS[plan];
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
      setSelectedModules(SELECTABLE_MODULES);
    } else {
      const count = limit ?? recommendations.length;
      setSelectedModules(recommendations.slice(0, count));
    }
    setStep("modules");
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f0f2ec" }}>
        <div className="w-full max-w-[400px] space-y-5">
          <div className="text-center space-y-1.5">
            <img src={logoMba} alt="MBA" className="h-20 mx-auto" />
          </div>
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#e4e8df] p-7 space-y-5 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#f0fdf4]">
              <CheckCircle className="h-7 w-7 text-[#22c55e]" />
            </div>
            <h1 className="text-lg font-bold text-[#1a2318]">Inscription réussie !</h1>
            <p className="text-sm text-[#9ca3af]">
              Un email de confirmation a été envoyé à <strong className="text-[#1a2318]">{email}</strong>.
              Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte.
            </p>
            <Button variant="outline" onClick={() => navigate("/client/login")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f0f2ec" }}>
      <div className="w-full max-w-[520px] space-y-5">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour au site
        </Link>

        {/* Logo */}
        <div className="text-center space-y-1.5">
          <img src={logoMba} alt="MBA" className="h-20 mx-auto" />
          <p className="text-xs text-[#9ca3af] tracking-wide">My Business Assistant</p>
        </div>

        {/* Step indicator */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            {STEP_LABELS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentStepIndex ? "w-8 bg-[#22c55e]" : i < currentStepIndex ? "w-6 bg-[#22c55e]/40" : "w-4 bg-[#e4e8df]"}`} />
            ))}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-[#9ca3af]">
            {STEP_LABELS.map((label, i) => (
              <span key={label} className={i === currentStepIndex ? "text-[#22c55e] font-medium" : ""}>{label}</span>
            ))}
          </div>
        </div>

        {/* Step 1: Plan selection */}
        {step === "plan" && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#e4e8df] p-5 space-y-3">
              <div className="text-center space-y-0.5">
                <h2 className="text-lg font-bold text-[#1a2318]">Choisissez votre formule</h2>
                <p className="text-xs text-[#9ca3af]">Sélectionnez le plan adapté à vos besoins</p>
              </div>

              <div className="space-y-2.5">
                {(["starter", "business", "enterprise"] as SubscriptionPlan[]).map((plan) => {
                  const quota = QUOTA_LIMITS[plan];
                  const price = planPrices[plan];
                  const socleDisplay = SOCLE_FIXE.filter((k) => k !== "overview" && k !== "parametres");
                  const borderColors: Record<SubscriptionPlan, string> = {
                    starter: "border-[#e4e8df] hover:border-[#9ca3af]",
                    business: "border-[#e4e8df] hover:border-[#22c55e]",
                    enterprise: "border-[#e4e8df] hover:border-[#eab308]",
                  };
                  const accents: Record<SubscriptionPlan, string> = {
                    starter: "text-[#4a5e46]",
                    business: "text-[#22c55e]",
                    enterprise: "text-[#eab308]",
                  };

                  return (
                    <button
                      key={plan}
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full bg-[#f7f8f5] rounded-xl border ${borderColors[plan]} p-4 text-left space-y-2 transition-all cursor-pointer hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={`text-base font-bold uppercase ${accents[plan]}`}>{plan}</h3>
                        <p className="text-lg font-bold text-[#1a2318]">{price}€<span className="text-xs font-normal text-[#9ca3af]">/mois</span></p>
                      </div>
                      <div className="space-y-1.5">
                        {/* Socle fixe */}
                        <p className="text-[11px] text-[#4a5e46] font-medium">Socle fixe inclus :</p>
                        <div className="flex flex-wrap gap-1">
                          {socleDisplay.map((m) => (
                            <span key={m} className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary font-medium">
                              {GENERIC_MODULE_LABELS[m] || m}
                              <span className="ml-1 text-[8px] opacity-70">✓</span>
                            </span>
                          ))}
                        </div>
                        {/* Additional modules */}
                        <p className="text-[11px] text-[#9ca3af]">
                          {quota === null ? "+ Tous les modules" : `+ ${quota} modules au choix`}
                        </p>
                      </div>
                      <div className={`text-xs font-medium ${accents[plan]} flex items-center gap-1`}>
                        Choisir <ArrowRight className="h-3 w-3" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-xs text-[#9ca3af]">
              Déjà un compte ?{" "}
              <Link to="/client/login" className="text-[#22c55e] hover:underline font-medium">Se connecter</Link>
            </p>
          </div>
        )}

        {/* Step 2: Sector selection */}
        {step === "sector" && (
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#e4e8df] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep("plan")} className="text-xs text-[#9ca3af] hover:text-[#1a2318] flex items-center gap-1 transition-colors">
                <ArrowLeft className="h-3 w-3" /> Retour
              </button>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#22c55e] font-medium uppercase border border-[#bbf7d0]">
                {selectedPlan}
              </span>
            </div>

            <div className="text-center space-y-0.5">
              <h2 className="text-lg font-bold text-[#1a2318]">Votre secteur d'activité</h2>
              <p className="text-xs text-[#9ca3af]">Nous vous recommanderons les modules adaptés</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SECTORS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSelectSector(s.key)}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#f7f8f5] border border-[#e4e8df] hover:border-[#22c55e] hover:bg-[#f0fdf4] transition-all cursor-pointer text-center"
                >
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-[10px] font-medium text-[#4a5e46] leading-tight">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Module selection */}
        {step === "modules" && selectedPlan && (
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#e4e8df] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep("sector")} className="text-xs text-[#9ca3af] hover:text-[#1a2318] flex items-center gap-1 transition-colors">
                <ArrowLeft className="h-3 w-3" /> Retour
              </button>
              <span className="text-[11px] text-[#9ca3af]">
                {selectedModules.length}/{getModuleLimit(selectedPlan) ?? "∞"} modules
              </span>
            </div>

            <div className="text-center space-y-0.5">
              <h2 className="text-lg font-bold text-[#1a2318]">Sélectionnez vos modules</h2>
              <p className="text-xs text-[#9ca3af]">Personnalisez votre espace de gestion</p>
            </div>

            {selectedSector && sectorRecommendations[selectedSector] && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]">
                <Sparkles className="h-4 w-4 text-[#22c55e] shrink-0" />
                <p className="text-[11px] text-[#4a5e46]">
                  Modules pré-sélectionnés pour <strong className="text-[#1a2318]">{SECTORS.find(s => s.key === selectedSector)?.label}</strong>
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
                      isSelected ? "border-[#22c55e] bg-[#f0fdf4]" : "border-[#e4e8df] bg-[#f7f8f5] hover:bg-white"
                    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      onCheckedChange={() => toggleModule(key)}
                    />
                    <span className="text-xs text-[#1a2318]">{getSectorModuleLabel(key, selectedSector)}</span>
                    {isRecommended && !isSelected && (
                      <Sparkles className="h-3 w-3 text-[#22c55e]/50 ml-auto" />
                    )}
                  </label>
                );
              })}
            </div>

            <Button onClick={() => setStep("form")} className="w-full gap-2 rounded-xl" disabled={selectedModules.length === 0}>
              Continuer <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 4: Account form */}
        {step === "form" && (
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#e4e8df] p-7 space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep("modules")} className="text-xs text-[#9ca3af] hover:text-[#1a2318] flex items-center gap-1 transition-colors">
                <ArrowLeft className="h-3 w-3" /> Retour
              </button>
              <div className="flex items-center gap-2">
                {selectedSector && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f7f8f5] text-[#4a5e46] border border-[#e4e8df]">
                    {SECTORS.find(s => s.key === selectedSector)?.label}
                  </span>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#22c55e] font-medium uppercase border border-[#bbf7d0]">
                  {selectedPlan}
                </span>
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <h2 className="text-lg font-bold text-[#1a2318]">Créer votre compte</h2>
              <p className="text-xs text-[#9ca3af]">Finalisez votre inscription</p>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2.5 h-10 rounded-full border border-[#e4e8df] bg-white hover:shadow-md transition-all text-sm font-medium text-[#1a2318]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              S'inscrire avec Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#e4e8df]" /></div>
              <div className="relative flex justify-center text-[10px]"><span className="bg-white px-2 text-[#9ca3af]">ou</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#4a5e46]">Nom complet *</label>
                  <Input type="text" placeholder="Jean Dupont" value={nom} onChange={(e) => setNom(e.target.value)} className="h-9 text-sm bg-[#f7f8f5] border border-[#e4e8df] rounded-lg focus:border-[#22c55e] focus:ring-2 focus:ring-[rgba(34,197,94,0.12)]" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#4a5e46]">Téléphone</label>
                  <Input type="tel" placeholder="+33 6 12 34 56 78" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="h-9 text-sm bg-[#f7f8f5] border border-[#e4e8df] rounded-lg focus:border-[#22c55e] focus:ring-2 focus:ring-[rgba(34,197,94,0.12)]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#4a5e46]">Email *</label>
                <Input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-sm bg-[#f7f8f5] border border-[#e4e8df] rounded-lg focus:border-[#22c55e] focus:ring-2 focus:ring-[rgba(34,197,94,0.12)]" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#4a5e46]">Mot de passe *</label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-9 text-sm bg-[#f7f8f5] border border-[#e4e8df] rounded-lg pr-9 focus:border-[#22c55e] focus:ring-2 focus:ring-[rgba(34,197,94,0.12)]" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a2318]">
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#4a5e46]">Confirmer *</label>
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-9 text-sm bg-[#f7f8f5] border border-[#e4e8df] rounded-lg focus:border-[#22c55e] focus:ring-2 focus:ring-[rgba(34,197,94,0.12)]" required minLength={6} />
                </div>
              </div>
              {error && <p className="text-xs text-[#dc2626]">{error}</p>}
              <Button type="submit" className="w-full h-10 gap-2 text-sm rounded-xl" disabled={loading}>
                <UserPlus className="h-3.5 w-3.5" />
                {loading ? "Création en cours..." : "Créer mon compte"}
              </Button>
            </form>

            <p className="text-center text-xs text-[#9ca3af]">
              Déjà un compte ?{" "}
              <Link to="/client/login" className="text-[#22c55e] hover:underline font-medium">Se connecter</Link>
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
