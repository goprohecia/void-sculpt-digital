import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  SECTOR_MODULE_OVERRIDES,
  GENERIC_MODULE_LABELS,
  type SectorModulesConfig,
} from "@/data/sectorModules";

// SubscriptionPlan is defined here (single source of truth) to avoid circular deps
export type SubscriptionPlan = "starter" | "business" | "enterprise";

// All available module keys in the system
// "clients-dossiers" is the fused module (replaces separate "clients" and "dossiers")
export const ALL_MODULE_KEYS = [
  "overview", "clients-dossiers", "employees", "pipeline",
  "facturation", "relances", "stock", "messagerie", "emails",
  "rendez-vous", "agenda", "taches", "support", "notes",
  "analyse", "rapports", "documents", "temps", "automatisations",
  "ia", "parametres",
];

// Socle fixe — always included, never counted in quota
export const SOCLE_FIXE = ["overview", "parametres", "analyse", "clients-dossiers"];

// Quota limits per plan (additional modules beyond socle fixe)
export const QUOTA_LIMITS: Record<SubscriptionPlan, number | null> = {
  starter: 3,
  business: 6,
  enterprise: null,
};

// Default plan module configuration (additional modules beyond socle fixe)
export const DEFAULT_PLAN_MODULES: Record<SubscriptionPlan, string[] | "all"> = {
  starter: ["facturation", "relances", "messagerie"],
  business: ["facturation", "relances", "messagerie", "support", "emails", "rendez-vous"],
  enterprise: "all",
};

export const DEFAULT_PLAN_PRICES: Record<SubscriptionPlan, number> = {
  starter: 150,
  business: 250,
  enterprise: 500,
};

// ── Sectors aligned with landing page sector pages ──
export const SECTORS = [
  { key: "auto-ecole", label: "Auto-École", icon: "🚗" },
  { key: "conciergerie", label: "Conciergerie", icon: "🏠" },
  { key: "btp", label: "BTP", icon: "🏗️" },
  { key: "boutique", label: "Boutique", icon: "🛍️" },
  { key: "cabinets", label: "Cabinets", icon: "⚖️" },
  { key: "coach-sportif", label: "Coach sportif", icon: "💪" },
  { key: "coiffure", label: "Coiffure", icon: "✂️" },
  { key: "community-manager", label: "Community Manager", icon: "📱" },
  { key: "consultant", label: "Consultant", icon: "📊" },
  { key: "designer", label: "Designer", icon: "🎨" },
  { key: "developpeur", label: "Développeur", icon: "💻" },
  { key: "dj-animateur", label: "DJ / Animateur", icon: "🎧" },
  { key: "evenementiel", label: "Événementiel", icon: "🎉" },
  { key: "formateur", label: "Formateur", icon: "📚" },
  { key: "garages", label: "Garages", icon: "🔧" },
  { key: "immobilier", label: "Immobilier", icon: "🏢" },
  { key: "mariage", label: "Mariage", icon: "💍" },
  { key: "nettoyage", label: "Nettoyage", icon: "🧹" },
  { key: "photographe", label: "Photographe", icon: "📷" },
  { key: "reparateur", label: "Réparateur", icon: "🛠️" },
  { key: "traiteur", label: "Traiteur", icon: "🍽️" },
  { key: "cabinet-recrutement", label: "Cabinet de Recrutement", icon: "🎯" },
  { key: "cabinet-avocats", label: "Cabinet d'Avocats", icon: "⚖️" },
  { key: "expert-comptable", label: "Expert-Comptable", icon: "🧮" },
] as const;

export type SectorKey = (typeof SECTORS)[number]["key"];

// Ordered list of recommended ADDITIONAL modules per sector (socle fixe excluded)
export const DEFAULT_SECTOR_RECOMMENDATIONS: Record<SectorKey, string[]> = {
  "auto-ecole": ["rendez-vous", "facturation", "stock", "relances", "analyse", "employees"],
  conciergerie: ["facturation", "messagerie", "support", "rendez-vous", "relances", "taches"],
  btp: ["facturation", "stock", "relances", "taches", "documents", "temps"],
  boutique: ["stock", "facturation", "relances", "analyse", "emails", "pipeline", "support"],
  cabinets: ["facturation", "documents", "rendez-vous", "emails", "temps", "analyse"],
  "coach-sportif": ["rendez-vous", "facturation", "messagerie", "emails", "agenda", "support"],
  coiffure: ["rendez-vous", "facturation", "messagerie", "relances", "emails", "analyse", "taches"],
  "community-manager": ["facturation", "taches", "messagerie", "emails", "analyse", "temps"],
  consultant: ["facturation", "rendez-vous", "emails", "analyse", "pipeline", "temps"],
  designer: ["facturation", "messagerie", "taches", "documents", "temps", "pipeline"],
  developpeur: ["facturation", "taches", "messagerie", "temps", "documents", "support"],
  "dj-animateur": ["rendez-vous", "facturation", "messagerie", "emails", "relances", "agenda"],
  evenementiel: ["facturation", "rendez-vous", "taches", "messagerie", "stock", "documents"],
  formateur: ["rendez-vous", "facturation", "emails", "messagerie", "documents", "analyse"],
  garages: ["facturation", "stock", "rendez-vous", "relances", "support", "taches"],
  immobilier: ["facturation", "rendez-vous", "pipeline", "messagerie", "emails", "documents"],
  mariage: ["facturation", "rendez-vous", "taches", "messagerie", "emails", "documents"],
  nettoyage: ["facturation", "relances", "taches", "rendez-vous", "messagerie", "support"],
  photographe: ["facturation", "rendez-vous", "messagerie", "taches", "emails", "pipeline"],
  reparateur: ["facturation", "stock", "support", "relances", "rendez-vous", "taches"],
  traiteur: ["facturation", "stock", "rendez-vous", "taches", "relances", "messagerie"],
  "cabinet-recrutement": ["facturation", "pipeline", "rendez-vous", "messagerie", "analyse", "taches"],
  "cabinet-avocats": ["facturation", "documents", "rendez-vous", "messagerie", "temps", "analyse"],
  "expert-comptable": ["facturation", "documents", "rendez-vous", "temps", "analyse", "emails"],
};

interface DemoPlanContextType {
  demoPlan: SubscriptionPlan;
  setDemoPlan: (plan: SubscriptionPlan) => void;
  planModules: Record<SubscriptionPlan, string[] | "all">;
  setPlanModules: (modules: Record<SubscriptionPlan, string[] | "all">) => void;
  planPrices: Record<SubscriptionPlan, number>;
  setPlanPrices: (prices: Record<SubscriptionPlan, number>) => void;
  sectorRecommendations: Record<SectorKey, string[]>;
  setSectorRecommendations: (r: Record<SectorKey, string[]>) => void;
  // Sector module overrides (editable by SuperAdmin)
  sectorModuleOverrides: Record<string, SectorModulesConfig>;
  setSectorModuleOverrides: (o: Record<string, SectorModulesConfig>) => void;
  // Current demo sector (set during signup or demo)
  demoSector: SectorKey | null;
  setDemoSector: (s: SectorKey | null) => void;
  // Helpers
  getModuleLabel: (moduleKey: string) => string;
  isModuleHidden: (moduleKey: string) => boolean;
  getModuleDescription: (moduleKey: string) => string | undefined;
}

const DemoPlanContext = createContext<DemoPlanContextType | null>(null);

export function DemoPlanProvider({ children }: { children: ReactNode }) {
  const [demoPlan, setDemoPlan] = useState<SubscriptionPlan>("enterprise");
  const [planModules, setPlanModules] = useState<Record<SubscriptionPlan, string[] | "all">>(DEFAULT_PLAN_MODULES);
  const [planPrices, setPlanPrices] = useState<Record<SubscriptionPlan, number>>(DEFAULT_PLAN_PRICES);
  const [sectorRecommendations, setSectorRecommendations] = useState<Record<SectorKey, string[]>>(DEFAULT_SECTOR_RECOMMENDATIONS);
  const [sectorModuleOverrides, setSectorModuleOverrides] = useState<Record<string, SectorModulesConfig>>(SECTOR_MODULE_OVERRIDES);
  const [demoSector, setDemoSector] = useState<SectorKey | null>("developpeur");

  // Helpers that use the current demo sector + live overrides from state
  const getModuleLabel = useCallback((moduleKey: string) => {
    if (demoSector) {
      const override = sectorModuleOverrides[demoSector]?.[moduleKey];
      if (override && !override.hidden) return override.label;
    }
    return GENERIC_MODULE_LABELS[moduleKey] || moduleKey;
  }, [demoSector, sectorModuleOverrides]);

  const isModuleHiddenFn = useCallback((moduleKey: string) => {
    if (!demoSector) return false;
    return sectorModuleOverrides[demoSector]?.[moduleKey]?.hidden === true;
  }, [demoSector, sectorModuleOverrides]);

  const getModuleDescriptionFn = useCallback((moduleKey: string) => {
    if (demoSector) {
      return sectorModuleOverrides[demoSector]?.[moduleKey]?.description;
    }
    return undefined;
  }, [demoSector, sectorModuleOverrides]);

  return (
    <DemoPlanContext.Provider value={{
      demoPlan, setDemoPlan,
      planModules, setPlanModules,
      planPrices, setPlanPrices,
      sectorRecommendations, setSectorRecommendations,
      sectorModuleOverrides, setSectorModuleOverrides,
      demoSector, setDemoSector,
      getModuleLabel,
      isModuleHidden: isModuleHiddenFn,
      getModuleDescription: getModuleDescriptionFn,
    }}>
      {children}
    </DemoPlanContext.Provider>
  );
}

export function useDemoPlan() {
  const ctx = useContext(DemoPlanContext);
  if (!ctx) throw new Error("useDemoPlan must be used within DemoPlanProvider");
  return ctx;
}
