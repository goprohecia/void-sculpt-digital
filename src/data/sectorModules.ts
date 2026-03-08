// ── Sector Module Overrides ──
// Each sector can override generic module labels, descriptions, icons,
// or hide modules that aren't relevant to that industry.
// The underlying routes / pages stay the same — only the UI adapts.

import type { SectorKey } from "@/contexts/DemoPlanContext";

export interface SectorModuleOverride {
  label: string;
  icon?: string; // lucide icon name (for future use)
  description?: string;
  hidden?: boolean; // true = module is hidden for this sector
}

export type SectorModulesConfig = Partial<Record<string, SectorModuleOverride>>;

// ── Default generic labels (fallback) ──
export const GENERIC_MODULE_LABELS: Record<string, string> = {
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

// ── Sector-specific overrides ──
// Only keys that differ from generic need to be listed.

const DEVELOPPEUR_OVERRIDES: SectorModulesConfig = {
  dossiers: { label: "Projets", description: "Suivi de projets tech, stack et repos" },
  taches: { label: "Sprints & Tâches", description: "Organisation par sprints et kanban" },
  temps: { label: "Time Tracking", description: "Suivi horaire par projet et client" },
  documents: { label: "Livrables", description: "Fichiers et livrables clients" },
  pipeline: { label: "Pipeline Projets", description: "Funnel de prospection et projets dev" },
  analyse: { label: "Dashboard Dev", description: "KPIs dev : taux horaire, projets livrés" },
  support: { label: "Tickets Support", description: "Support technique et maintenance" },
  notes: { label: "Notes techniques", description: "Documentation interne et snippets" },
  stock: { label: "Stock", hidden: true },
};

// ── Master map — add new sectors here ──
export const SECTOR_MODULE_OVERRIDES: Record<string, SectorModulesConfig> = {
  developpeur: DEVELOPPEUR_OVERRIDES,
};

// ── Helpers ──

/**
 * Get the display label for a module, respecting sector overrides.
 * Falls back to the generic label.
 */
export function getModuleLabel(moduleKey: string, sectorKey?: string | null): string {
  if (sectorKey) {
    const override = SECTOR_MODULE_OVERRIDES[sectorKey]?.[moduleKey];
    if (override && !override.hidden) return override.label;
  }
  return GENERIC_MODULE_LABELS[moduleKey] || moduleKey;
}

/**
 * Get the description for a module (sector-specific or undefined).
 */
export function getModuleDescription(moduleKey: string, sectorKey?: string | null): string | undefined {
  if (sectorKey) {
    return SECTOR_MODULE_OVERRIDES[sectorKey]?.[moduleKey]?.description;
  }
  return undefined;
}

/**
 * Check if a module should be hidden for a given sector.
 */
export function isModuleHidden(moduleKey: string, sectorKey?: string | null): boolean {
  if (!sectorKey) return false;
  return SECTOR_MODULE_OVERRIDES[sectorKey]?.[moduleKey]?.hidden === true;
}

/**
 * Get all overrides for a given sector (for the SuperAdmin editor).
 */
export function getSectorOverrides(sectorKey: string): SectorModulesConfig {
  return SECTOR_MODULE_OVERRIDES[sectorKey] || {};
}
