// [MBA] Redesign onboarding — minimaliste, professionnel, applicatif
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
// [MBA] Dropdown secteur
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  UserPlus, Eye, EyeOff, ArrowLeft, ArrowRight, Check, Lock, X,
  Wrench, Handshake, Palette, ShoppingBag, Scale, GraduationCap, Heart,
  Car, Smartphone, HardHat, BrainCircuit, Dumbbell, Users, BookOpen, Calculator,
  Paintbrush, Camera, Music, PartyPopper, Share2,
  Store, Home, SprayCan, ChefHat, Scissors,
  Gavel, Building2, Code,
  CarFront, Moon, Trophy, Gem,
} from "lucide-react";
import { CompleteProfileDialog } from "@/components/CompleteProfileDialog";
import { useDemoPlan, ALL_MODULE_KEYS, SECTORS, SOCLE_FIXE, QUOTA_LIMITS, type SectorKey } from "@/contexts/DemoPlanContext";
import { getModuleLabel as getSectorModuleLabel, isModuleHidden, GENERIC_MODULE_LABELS } from "@/data/sectorModules";
import { SECTOR_CATEGORIES } from "@/data/sectorCategories";
import type { SectorCategory } from "@/data/sectorCategories";
import type { SubscriptionPlan } from "@/hooks/use-subscription";
import logoMba from "@/assets/logo-mba.png";

// [MBA] Redesign onboarding — constantes
const SELECTABLE_MODULES = ALL_MODULE_KEYS.filter((k) => !SOCLE_FIXE.includes(k));
// [MBA] Dropdown secteur — 4 étapes (secteur + métier fusionnés sur une page)
const STEP_LABELS = ["Formule", "Secteur", "Modules", "Compte"];

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Reparation & Technique": Wrench, "Accompagnement & Conseil": Handshake,
  "Creatif & Evenementiel": Palette, "Commerce & Services": ShoppingBag,
  "Juridique & Administratif": Scale, "Education & Formation": GraduationCap,
  "Mariage & Haute Couture": Heart,
};
// [MBA] Map avec accents pour lookup
const getCategoryIcon = (title: string) => {
  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    "Réparation & Technique": Wrench, "Accompagnement & Conseil": Handshake,
    "Créatif & Événementiel": Palette, "Commerce & Services": ShoppingBag,
    "Juridique & Administratif": Scale, "Éducation & Formation": GraduationCap,
    "Mariage & Haute Couture": Heart,
  };
  return map[title] || ShoppingBag;
};

const SECTOR_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  garages: Car, reparateur: Smartphone, btp: HardHat,
  consultant: BrainCircuit, "coach-sportif": Dumbbell, "cabinet-recrutement": Users,
  formateur: BookOpen, "expert-comptable": Calculator,
  designer: Paintbrush, photographe: Camera, "dj-animateur": Music,
  evenementiel: PartyPopper, "community-manager": Share2,
  boutique: Store, conciergerie: Home, nettoyage: SprayCan,
  traiteur: ChefHat, coiffure: Scissors,
  "cabinet-avocats": Gavel, immobilier: Building2, developpeur: Code,
  "auto-ecole": CarFront, "centre-islamique": Moon, "association-sportive": Trophy,
  mariage: Gem,
};

const SECTOR_DESCRIPTIONS: Record<string, string> = {
  garages: "Réparation auto, carrosserie, entretien",
  reparateur: "Téléphones, tablettes, ordinateurs",
  btp: "Construction, rénovation, artisanat",
  consultant: "Conseil, audit, accompagnement",
  "coach-sportif": "Coaching, remise en forme, programmes",
  "cabinet-recrutement": "Recrutement, sourcing, placement",
  formateur: "Formation professionnelle, ateliers",
  "expert-comptable": "Comptabilité, fiscalité, conseil",
  designer: "Graphisme, identité visuelle, web design",
  photographe: "Shooting, retouche, événementiel",
  "dj-animateur": "Animation, musique, événements",
  evenementiel: "Organisation, coordination, logistique",
  "community-manager": "Réseaux sociaux, contenu, stratégie",
  boutique: "Vente, stock, fidélisation",
  conciergerie: "Location saisonnière, Airbnb, gestion",
  nettoyage: "Entretien, propreté, contrats B2B",
  traiteur: "Cuisine, livraison, événements",
  coiffure: "Coiffure, beauté, soins",
  "cabinet-avocats": "Droit, contentieux, conseil juridique",
  immobilier: "Transaction, gestion, mandats",
  developpeur: "Développement web, apps, digital",
  "auto-ecole": "Permis, code, heures de conduite",
  "centre-islamique": "Coran, arabe, sciences islamiques",
  "association-sportive": "Club, licences, compétitions",
  mariage: "Robes, retouches, haute couture",
};

// [MBA] Redesign onboarding — style inputs commun
const inputClass = "h-10 text-sm bg-white border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all duration-200";

export default function ClientSignup() {
  // [MBA] Dropdown secteur — plus de step "category", tout sur "sector"
  const [step, setStep] = useState<"plan" | "sector" | "modules" | "form">("plan");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SectorCategory | null>(null);
  const [selectedSector, setSelectedSector] = useState<SectorKey | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [googleUserId, setGoogleUserId] = useState("");
  const [upsellModule, setUpsellModule] = useState<string | null>(null);
  const navigate = useNavigate();
  const { planPrices, sectorRecommendations } = useDemoPlan();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("nom").eq("user_id", session.user.id).single();
        if (profile && (!profile.nom || profile.nom === "")) { setGoogleUserId(session.user.id); setShowCompleteProfile(true); }
        else { navigate("/client", { replace: true }); }
      }
    };
    checkSession();
  }, [navigate]);

  const getModuleLimit = (plan: SubscriptionPlan): number | null => QUOTA_LIMITS[plan];
  const getPlanDisplayName = (plan: SubscriptionPlan) => ({ starter: "Starter", business: "Business", enterprise: "Enterprise" })[plan];
  const getRequiredPlanForModule = (plan: SubscriptionPlan): SubscriptionPlan | null => {
    if (plan === "starter") return "business";
    if (plan === "business") return "enterprise";
    return null;
  };

  // [MBA] Dropdown secteur — plan → sector (page unique dropdown + cartes métier)
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan); setSelectedCategory(null); setSelectedSector(null); setSelectedModules([]); setStep("sector");
  };
  const handleSelectSector = (sector: SectorKey) => {
    setSelectedSector(sector);
    if (!selectedPlan) return;
    const recs = sectorRecommendations[sector] || [];
    const limit = getModuleLimit(selectedPlan);
    setSelectedModules(selectedPlan === "enterprise" ? SELECTABLE_MODULES : recs.slice(0, limit ?? recs.length));
    setStep("modules");
  };
  const toggleModule = (key: string) => {
    if (!selectedPlan) return;
    const limit = getModuleLimit(selectedPlan);
    if (selectedModules.includes(key)) { setSelectedModules((p) => p.filter((m) => m !== key)); }
    else if (limit === null || selectedModules.length < limit) { setSelectedModules((p) => [...p, key]); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!nom.trim()) { setError("Le nom est requis"); return; }
    if (!prenom.trim()) { setError("Le prénom est requis"); return; }
    if (!entreprise.trim()) { setError("Le nom de l'entreprise est requis"); return; }
    if (password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères"); return; }
    if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas"); return; }
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("send-signup-confirmation", {
        body: { email, password, nom: nom.trim(), prenom: prenom.trim(), entreprise: entreprise.trim(), plan: selectedPlan, modules: selectedModules, sector: selectedSector },
      });
      setLoading(false);
      if (fnError) setError("Erreur lors de la création du compte");
      else if (data?.error) setError(data.error);
      else setSuccess(true);
    } catch { setLoading(false); setError("Erreur lors de la création du compte"); }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/signup" });
    if (error) setError("Erreur lors de la connexion avec Google");
  };

  // [MBA] Dropdown secteur — 4 étapes
  const currentStepIndex = ["plan", "sector", "modules", "form"].indexOf(step);

  // [MBA] Redesign onboarding — écran de succès minimaliste
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#EDE9E3]">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center"><img src={logoMba} alt="MBA" className="h-16 mx-auto" /></div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 space-y-5 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Inscription réussie</h1>
            <p className="text-sm text-gray-500">
              Un email de confirmation a été envoyé à <strong className="text-gray-900">{email}</strong>. Vérifiez votre boîte de réception.
            </p>
            <Button variant="outline" onClick={() => navigate("/client/login")} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#EDE9E3]">
      <div className="w-full max-w-xl space-y-6">
        {/* [MBA] Redesign — header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <img src={logoMba} alt="MBA" className="h-10" />
        </div>

        {/* [MBA] Redesign — indicateur de progression épuré */}
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {STEP_LABELS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= currentStepIndex ? "bg-green-500" : "bg-gray-200"}`} />
            ))}
          </div>
          <div className="flex justify-between px-0.5">
            {STEP_LABELS.map((label, i) => (
              <span key={label} className={`text-[10px] transition-colors ${i === currentStepIndex ? "text-green-600 font-medium" : "text-gray-400"}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* [MBA] Redesign — Étape 1 : Formule */}
        {step === "plan" && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">Choisissez votre formule</h2>
              <p className="text-sm text-gray-500">Sélectionnez le plan adapté à vos besoins</p>
            </div>

            <div className="space-y-3">
              {(["starter", "business", "enterprise"] as SubscriptionPlan[]).map((plan) => {
                const quota = QUOTA_LIMITS[plan];
                const price = planPrices[plan];
                const isBusiness = plan === "business";
                return (
                  <button key={plan} onClick={() => handleSelectPlan(plan)}
                    className={`relative w-full bg-white rounded-xl border p-5 text-left transition-all duration-200 cursor-pointer hover:shadow-md ${isBusiness ? "border-green-500 shadow-md" : "border-gray-200 hover:border-green-500"}`}
                  >
                    {isBusiness && (
                      <span className="absolute -top-2.5 right-4 text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                        Recommande
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-gray-900 capitalize">{plan}</h3>
                      <p className="text-lg font-semibold text-gray-900">{price}<span className="text-sm font-normal text-gray-400">/mois</span></p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {quota === null ? "Tous les modules inclus" : `Socle fixe + ${quota} modules au choix`}
                    </p>
                    <div className="mt-3 flex items-center text-sm font-medium text-green-600 gap-1">
                      Choisir <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-xs text-gray-400">
              Clients & Dossiers et Analyse inclus dans toutes les offres
            </p>
            <p className="text-center text-xs text-gray-400">
              Deja un compte ? <Link to="/client/login" className="text-green-600 hover:underline">Se connecter</Link>
            </p>
          </div>
        )}

        {/* [MBA] Dropdown secteur — page unique : dropdown catégorie + cartes métiers */}
        {step === "sector" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep("plan")} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Retour
              </button>
              <span className="text-xs text-gray-400 capitalize">{selectedPlan}</span>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">Secteur d'activite</h2>
              <p className="text-sm text-gray-500">Choisissez votre categorie puis votre metier</p>
            </div>

            {/* [MBA] Dropdown secteur — Select shadcn/ui */}
            <div className="max-w-md mx-auto">
              <Select
                value={selectedCategory?.title || ""}
                onValueChange={(val) => {
                  const cat = SECTOR_CATEGORIES.find((c) => c.title === val);
                  if (cat) setSelectedCategory(cat);
                }}
              >
                <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 rounded-lg text-sm">
                  <SelectValue placeholder="Selectionnez votre secteur d'activite" />
                </SelectTrigger>
                <SelectContent>
                  {SECTOR_CATEGORIES.map((cat) => {
                    const IconComp = getCategoryIcon(cat.title);
                    return (
                      <SelectItem key={cat.title} value={cat.title} className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <IconComp className="h-4 w-4 text-gray-500 shrink-0" />
                          <span className="text-sm">{cat.title}</span>
                          <span className="text-xs text-gray-400 ml-auto">{cat.sectors.length} metier{cat.sectors.length > 1 ? "s" : ""}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* [MBA] Dropdown secteur — cartes métiers visibles après sélection */}
            {selectedCategory && (
              <div className="space-y-2.5 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                {selectedCategory.sectors.map((s) => {
                  const SectorIcon = SECTOR_ICONS[s.key] || Wrench;
                  return (
                    <button key={s.key} onClick={() => handleSelectSector(s.key)}
                      className="w-full flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md text-left transition-all duration-200 cursor-pointer group"
                    >
                      <div className="shrink-0 h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                        <SectorIcon className="h-5 w-5 text-gray-600 group-hover:text-green-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900">{s.label}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{SECTOR_DESCRIPTIONS[s.key] || ""}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{s.roles}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-green-500 transition-colors shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* [MBA] Redesign — Étape 3 : Modules */}
        {step === "modules" && selectedPlan && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep("sector")} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Retour
              </button>
              <span className="text-xs text-gray-500">
                {selectedModules.length}/{getModuleLimit(selectedPlan) ?? "\u221e"} modules selectionnes
              </span>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">Selectionnez vos modules</h2>
              <p className="text-sm text-gray-500">Personnalisez votre espace de gestion</p>
            </div>

            {/* [MBA] Redesign — socle fixe discret */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Toujours inclus</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SOCLE_FIXE.filter((k) => k !== "overview" && k !== "parametres").map((key) => (
                  <div key={key} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200">
                    <Check className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-600">{getSectorModuleLabel(key, selectedSector)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* [MBA] Redesign — modules au choix */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Modules au choix</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SELECTABLE_MODULES.filter((k) => !isModuleHidden(k, selectedSector)).map((key) => {
                  const isSelected = selectedModules.includes(key);
                  const limit = getModuleLimit(selectedPlan);
                  const isQuotaReached = !isSelected && limit !== null && selectedModules.length >= limit;
                  const requiredPlan = isQuotaReached ? getRequiredPlanForModule(selectedPlan!) : null;
                  const isRecommended = selectedSector ? (sectorRecommendations[selectedSector] || []).includes(key) : false;

                  if (isQuotaReached && requiredPlan) {
                    return (
                      <button key={key} type="button" onClick={() => setUpsellModule(key)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 bg-white opacity-50 cursor-pointer hover:opacity-70 text-left transition-all duration-200"
                      >
                        <Lock className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                        <span className="text-xs text-gray-400">{getSectorModuleLabel(key, selectedSector)}</span>
                        <span className="ml-auto text-[9px] text-gray-400">{getPlanDisplayName(requiredPlan)}+</span>
                      </button>
                    );
                  }

                  return (
                    <label key={key}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer border transition-all duration-200 ${isSelected ? "border-green-500 bg-green-50/50" : "border-gray-200 bg-white hover:border-gray-300"}`}
                    >
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleModule(key)} />
                      <span className={`text-xs ${isSelected ? "text-gray-900" : "text-gray-600"}`}>{getSectorModuleLabel(key, selectedSector)}</span>
                      {isRecommended && <span className="ml-auto text-[9px] text-green-600">Recommande</span>}
                    </label>
                  );
                })}
              </div>
            </div>

            <Button onClick={() => setStep("form")} className="w-full h-11 gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white" disabled={selectedModules.length === 0}>
              Continuer <ArrowRight className="h-4 w-4" />
            </Button>

            {/* [MBA] Redesign — modal upsell minimaliste */}
            {upsellModule && selectedPlan && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setUpsellModule(null)}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-sm w-full mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Module indisponible</h3>
                    <button onClick={() => setUpsellModule(null)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>{getSectorModuleLabel(upsellModule, selectedSector)}</strong> necessite l'offre <strong className="text-green-600">{getPlanDisplayName(getRequiredPlanForModule(selectedPlan)!)}</strong> ou superieure.
                  </p>
                  <p className="text-xs text-gray-400">
                    Votre offre {getPlanDisplayName(selectedPlan)} est limitee a {QUOTA_LIMITS[selectedPlan]} modules.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setUpsellModule(null)} className="flex-1 rounded-lg text-sm">Fermer</Button>
                    <Button onClick={() => { setUpsellModule(null); setStep("plan"); }} className="flex-1 rounded-lg text-sm bg-green-600 hover:bg-green-700 text-white">Changer d'offre</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* [MBA] Redesign — Étape 4 : Compte */}
        {step === "form" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep("modules")} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Retour
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {selectedSector && <span>{SECTORS.find(s => s.key === selectedSector)?.label}</span>}
                <span className="capitalize">{selectedPlan}</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">Creez votre compte</h2>
              <p className="text-sm text-gray-500">Finalisez votre inscription</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-5">
              <button onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2.5 h-11 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 text-sm font-medium text-gray-700"
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
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-gray-400">ou</span></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600">Nom</label>
                    <Input type="text" placeholder="Dupont" value={nom} onChange={(e) => setNom(e.target.value)} className={inputClass} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600">Prenom</label>
                    <Input type="text" placeholder="Jean" value={prenom} onChange={(e) => setPrenom(e.target.value)} className={inputClass} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Nom de l'entreprise</label>
                  <Input type="text" placeholder="Mon Entreprise" value={entreprise} onChange={(e) => setEntreprise(e.target.value)} className={inputClass} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Email</label>
                  <Input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600">Mot de passe</label>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="6 caracteres min." value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-9`} required minLength={6} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600">Confirmer</label>
                    <Input type={showPassword ? "text" : "password"} placeholder="Confirmer" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required minLength={6} />
                  </div>
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <Button type="submit" className="w-full h-11 gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm" disabled={loading}>
                  <UserPlus className="h-4 w-4" />
                  {loading ? "Creation en cours..." : "Creer mon compte"}
                </Button>
              </form>

              <p className="text-center text-xs text-gray-400">
                Deja un compte ? <Link to="/client/login" className="text-green-600 hover:underline">Se connecter</Link>
              </p>
            </div>
          </div>
        )}
      </div>

      <CompleteProfileDialog open={showCompleteProfile} userId={googleUserId}
        onComplete={() => { setShowCompleteProfile(false); navigate("/client", { replace: true }); }}
      />
    </div>
  );
}
