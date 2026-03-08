import { createContext, useContext, useState, type ReactNode } from "react";
import type { SubscriptionPlan } from "@/hooks/use-subscription";

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

interface DemoPlanContextType {
  demoPlan: SubscriptionPlan;
  setDemoPlan: (plan: SubscriptionPlan) => void;
  planModules: Record<SubscriptionPlan, string[] | "all">;
  setPlanModules: (modules: Record<SubscriptionPlan, string[] | "all">) => void;
  planPrices: Record<SubscriptionPlan, number>;
  setPlanPrices: (prices: Record<SubscriptionPlan, number>) => void;
}

const DemoPlanContext = createContext<DemoPlanContextType | null>(null);

export function DemoPlanProvider({ children }: { children: ReactNode }) {
  const [demoPlan, setDemoPlan] = useState<SubscriptionPlan>("enterprise");
  const [planModules, setPlanModules] = useState<Record<SubscriptionPlan, string[] | "all">>(DEFAULT_PLAN_MODULES);
  const [planPrices, setPlanPrices] = useState<Record<SubscriptionPlan, number>>(DEFAULT_PLAN_PRICES);

  return (
    <DemoPlanContext.Provider value={{ demoPlan, setDemoPlan, planModules, setPlanModules, planPrices, setPlanPrices }}>
      {children}
    </DemoPlanContext.Provider>
  );
}

export function useDemoPlan() {
  const ctx = useContext(DemoPlanContext);
  if (!ctx) throw new Error("useDemoPlan must be used within DemoPlanProvider");
  return ctx;
}
