import { createContext, useContext, useState, type ReactNode } from "react";
import type { SubscriptionPlan } from "@/hooks/use-subscription";
import {
  SECTOR_MODULE_OVERRIDES,
  getModuleLabel as _getModuleLabel,
  getModuleDescription as _getModuleDescription,
  isModuleHidden as _isModuleHidden,
  type SectorModulesConfig,
} from "@/data/sectorModules";

// All available module keys in the system
export const ALL_MODULE_KEYS = [
  "overview", "clients", "employees", "dossiers", "pipeline",
  "facturation", "relances", "stock", "messagerie", "emails",
  "rendez-vous", "agenda", "taches", "support", "notes",
  "analyse", "rapports", "documents", "temps", "automatisations",
  "ia", "parametres",
];

// Default plan module configuration
export const DEFAULT_PLAN_MODULES: Record<SubscriptionPlan, string[] | "all"> = {
  starter: ["clients", "dossiers", "facturation"],
  business: ["clients", "dossiers", "facturation", "messagerie", "relances", "support", "emails", "rendez-vous"],
  enterprise: "all",
};

export const DEFAULT_PLAN_PRICES: Record<SubscriptionPlan, number> = {
  starter: 150,
  business: 250,
  enterprise: 400,
};

// ── Sectors aligned with landing page sector pages ──
export const SECTORS = [
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
] as const;

export type SectorKey = (typeof SECTORS)[number]["key"];

// Ordered list of recommended modules per sector (most important first)
export const DEFAULT_SECTOR_RECOMMENDATIONS: Record<SectorKey, string[]> = {
  conciergerie: ["dossiers", "clients", "facturation", "messagerie", "support", "rendez-vous", "relances", "taches"],
  btp: ["dossiers", "clients", "facturation", "stock", "relances", "taches", "documents", "temps"],
  boutique: ["stock", "clients", "facturation", "relances", "analyse", "emails", "pipeline", "support"],
  cabinets: ["dossiers", "clients", "facturation", "documents", "rendez-vous", "emails", "temps", "analyse"],
  "coach-sportif": ["clients", "rendez-vous", "facturation", "messagerie", "dossiers", "emails", "agenda", "support"],
  coiffure: ["clients", "rendez-vous", "facturation", "messagerie", "relances", "emails", "analyse", "taches"],
  "community-manager": ["clients", "dossiers", "facturation", "taches", "messagerie", "emails", "analyse", "temps"],
  consultant: ["clients", "dossiers", "facturation", "rendez-vous", "emails", "analyse", "pipeline", "temps"],
  designer: ["dossiers", "clients", "facturation", "messagerie", "taches", "documents", "temps", "pipeline"],
  developpeur: ["dossiers", "clients", "facturation", "taches", "messagerie", "temps", "documents", "support"],
  "dj-animateur": ["clients", "rendez-vous", "facturation", "messagerie", "dossiers", "emails", "relances", "agenda"],
  evenementiel: ["dossiers", "clients", "facturation", "rendez-vous", "taches", "messagerie", "stock", "documents"],
  formateur: ["clients", "rendez-vous", "facturation", "dossiers", "emails", "messagerie", "documents", "analyse"],
  garages: ["clients", "dossiers", "facturation", "stock", "rendez-vous", "relances", "support", "taches"],
  immobilier: ["clients", "dossiers", "facturation", "rendez-vous", "pipeline", "messagerie", "emails", "documents"],
  mariage: ["dossiers", "clients", "facturation", "rendez-vous", "taches", "messagerie", "emails", "documents"],
  nettoyage: ["clients", "dossiers", "facturation", "relances", "taches", "rendez-vous", "messagerie", "support"],
  photographe: ["clients", "dossiers", "facturation", "rendez-vous", "messagerie", "taches", "emails", "pipeline"],
  reparateur: ["clients", "dossiers", "facturation", "stock", "support", "relances", "rendez-vous", "taches"],
  traiteur: ["clients", "dossiers", "facturation", "stock", "rendez-vous", "taches", "relances", "messagerie"],
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

  return (
    <DemoPlanContext.Provider value={{ demoPlan, setDemoPlan, planModules, setPlanModules, planPrices, setPlanPrices, sectorRecommendations, setSectorRecommendations }}>
      {children}
    </DemoPlanContext.Provider>
  );
}

export function useDemoPlan() {
  const ctx = useContext(DemoPlanContext);
  if (!ctx) throw new Error("useDemoPlan must be used within DemoPlanProvider");
  return ctx;
}
