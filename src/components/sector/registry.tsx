// [MBA] Registre centralisé des composants sectoriels
// Élimine les 70+ imports et les chaînes de if/else dans les pages consommateur
// Chaque secteur enregistre ses composants (dashboard, clientView, employeeView)
// Les secteurs non enregistrés utilisent le fallback générique (null)

import { lazy, type ComponentType } from "react";
import type { SectorKey } from "@/contexts/DemoPlanContext";

interface SectorComponents {
  Dashboard?: ComponentType;
  ClientView?: ComponentType;
  EmployeeView?: ComponentType;
  /** Some sectors have multiple client views (e.g. immobilier: proprietaire + acheteur) */
  ClientViews?: { label: string; component: ComponentType }[];
  /** Some sectors have multiple employee views (e.g. mariage: conseillère + retoucheuse) */
  EmployeeViews?: { label: string; component: ComponentType }[];
}

// [MBA] Lazy-loaded sector component registry
// Components are only loaded when the sector is active
const SECTOR_REGISTRY: Partial<Record<SectorKey, SectorComponents>> = {
  garages: {
    Dashboard: lazy(() => import("@/components/garage/GarageDashboard").then(m => ({ default: m.GarageDashboard }))),
    ClientView: lazy(() => import("@/components/garage/GarageClientView").then(m => ({ default: m.GarageClientView }))),
    EmployeeView: lazy(() => import("@/components/garage/GarageMechanicView").then(m => ({ default: m.GarageMechanicView }))),
  },
  immobilier: {
    Dashboard: lazy(() => import("@/components/immobilier/ImmobilierDashboard").then(m => ({ default: m.ImmobilierDashboard }))),
    ClientViews: [
      { label: "Espace Propriétaire", component: lazy(() => import("@/components/immobilier/ImmobilierProprietaireView").then(m => ({ default: m.ImmobilierProprietaireView }))) },
      { label: "Espace Acheteur", component: lazy(() => import("@/components/immobilier/ImmobilierAcheteurView").then(m => ({ default: m.ImmobilierAcheteurView }))) },
    ],
    EmployeeView: lazy(() => import("@/components/immobilier/ImmobilierAgentView").then(m => ({ default: m.ImmobilierAgentView }))),
  },
  btp: {
    Dashboard: lazy(() => import("@/components/btp/BTPDashboard").then(m => ({ default: m.BTPDashboard }))),
    ClientView: lazy(() => import("@/components/btp/BTPClientView").then(m => ({ default: m.BTPClientView }))),
    EmployeeView: lazy(() => import("@/components/btp/BTPOuvrierView").then(m => ({ default: m.BTPOuvrierView }))),
  },
  // [MBA] Restructuration conciergerie — 3 métiers distincts
  // conciergerie-immo hérite des composants existants (ConciergerieDashboard, ProprietaireView, AgentView)
  "conciergerie-immo": {
    Dashboard: lazy(() => import("@/components/conciergerie/ConciergerieDashboard").then(m => ({ default: m.ConciergerieDashboard }))),
    ClientView: lazy(() => import("@/components/conciergerie/ConciergerieProprietaireView").then(m => ({ default: m.ConciergerieProprietaireView }))),
    EmployeeView: lazy(() => import("@/components/conciergerie/ConciergerieAgentView").then(m => ({ default: m.ConciergerieAgentView }))),
  },
  // conciergerie-nettoyage et conciergerie-auto — pas de composants spécifiques pour l'instant
  // Ils utilisent le fallback générique (AdminDossiers standard)
  coiffure: {
    Dashboard: lazy(() => import("@/components/coiffure/CoiffureDashboard").then(m => ({ default: m.CoiffureDashboard }))),
    ClientView: lazy(() => import("@/components/coiffure/CoiffureClientView").then(m => ({ default: m.CoiffureClientView }))),
    EmployeeView: lazy(() => import("@/components/coiffure/CoiffurePraticienView").then(m => ({ default: m.CoiffurePraticienView }))),
  },
  "cabinet-recrutement": {
    Dashboard: lazy(() => import("@/components/recrutement/RecrutementDashboard").then(m => ({ default: m.RecrutementDashboard }))),
    ClientViews: [
      { label: "Espace Client Entreprise", component: lazy(() => import("@/components/recrutement/RecrutementClientView").then(m => ({ default: m.RecrutementClientView }))) },
      { label: "Espace Candidat", component: lazy(() => import("@/components/recrutement/RecrutementCandidatView").then(m => ({ default: m.RecrutementCandidatView }))) },
    ],
    EmployeeView: lazy(() => import("@/components/recrutement/RecrutementChargeView").then(m => ({ default: m.RecrutementChargeView }))),
  },
  "auto-ecole": {
    Dashboard: lazy(() => import("@/components/auto-ecole/AutoEcoleDashboard").then(m => ({ default: m.AutoEcoleDashboard }))),
    ClientView: lazy(() => import("@/components/auto-ecole/AutoEcoleEleveView").then(m => ({ default: m.AutoEcoleEleveView }))),
    EmployeeView: lazy(() => import("@/components/auto-ecole/AutoEcoleMoniteurView").then(m => ({ default: m.AutoEcoleMoniteurView }))),
  },
  mariage: {
    Dashboard: lazy(() => import("@/components/mariage/MariageDashboard").then(m => ({ default: m.MariageDashboard }))),
    ClientView: lazy(() => import("@/components/mariage/MariageClientView").then(m => ({ default: m.MariageClientView }))),
    EmployeeViews: [
      { label: "Espace Conseillère", component: lazy(() => import("@/components/mariage/MariageConseillerView").then(m => ({ default: m.MariageConseillerView }))) },
      { label: "Espace Retoucheuse", component: lazy(() => import("@/components/mariage/MariageRetoucheuseView").then(m => ({ default: m.MariageRetoucheuseView }))) },
    ],
  },
  "cabinet-avocats": {
    Dashboard: lazy(() => import("@/components/avocat/AvocatDashboard").then(m => ({ default: m.AvocatDashboard }))),
    ClientView: lazy(() => import("@/components/avocat/AvocatClientView").then(m => ({ default: m.AvocatClientView }))),
    EmployeeView: lazy(() => import("@/components/avocat/AvocatCollaborateurView").then(m => ({ default: m.AvocatCollaborateurView }))),
  },
  "expert-comptable": {
    Dashboard: lazy(() => import("@/components/comptable/ComptableDashboard").then(m => ({ default: m.ComptableDashboard }))),
    ClientView: lazy(() => import("@/components/comptable/ComptableClientView").then(m => ({ default: m.ComptableClientView }))),
    EmployeeView: lazy(() => import("@/components/comptable/ComptableCollaborateurView").then(m => ({ default: m.ComptableCollaborateurView }))),
  },
  boutique: {
    Dashboard: lazy(() => import("@/components/boutique/BoutiqueDashboard").then(m => ({ default: m.BoutiqueDashboard }))),
    ClientView: lazy(() => import("@/components/boutique/BoutiqueClientView").then(m => ({ default: m.BoutiqueClientView }))),
    EmployeeView: lazy(() => import("@/components/boutique/BoutiqueVendeurView").then(m => ({ default: m.BoutiqueVendeurView }))),
  },
  "coach-sportif": {
    Dashboard: lazy(() => import("@/components/sport/SportDashboard").then(m => ({ default: m.SportDashboard }))),
    ClientView: lazy(() => import("@/components/sport/SportMembreView").then(m => ({ default: m.SportMembreView }))),
    EmployeeView: lazy(() => import("@/components/sport/SportCoachView").then(m => ({ default: m.SportCoachView }))),
  },
  "community-manager": {
    Dashboard: lazy(() => import("@/components/cm/CMDashboard").then(m => ({ default: m.CMDashboard }))),
    ClientView: lazy(() => import("@/components/cm/CMClientView").then(m => ({ default: m.CMClientView }))),
    EmployeeView: lazy(() => import("@/components/cm/CMChargeView").then(m => ({ default: m.CMChargeView }))),
  },
  consultant: {
    Dashboard: lazy(() => import("@/components/consultant/ConsultantDashboard").then(m => ({ default: m.ConsultantDashboard }))),
    ClientView: lazy(() => import("@/components/consultant/ConsultantClientView").then(m => ({ default: m.ConsultantClientView }))),
    EmployeeView: lazy(() => import("@/components/consultant/ConsultantConsultantView").then(m => ({ default: m.ConsultantConsultantView }))),
  },
  designer: {
    Dashboard: lazy(() => import("@/components/designer/DesignerDashboard").then(m => ({ default: m.DesignerDashboard }))),
    ClientView: lazy(() => import("@/components/designer/DesignerClientView").then(m => ({ default: m.DesignerClientView }))),
    EmployeeView: lazy(() => import("@/components/designer/DesignerDesignerView").then(m => ({ default: m.DesignerDesignerView }))),
  },
  developpeur: {
    Dashboard: lazy(() => import("@/components/dev/DevDashboard").then(m => ({ default: m.DevDashboard }))),
    ClientView: lazy(() => import("@/components/dev/DevClientView").then(m => ({ default: m.DevClientView }))),
    EmployeeView: lazy(() => import("@/components/dev/DevDevView").then(m => ({ default: m.DevDevView }))),
  },
  "dj-animateur": {
    Dashboard: lazy(() => import("@/components/dj/DJDashboard").then(m => ({ default: m.DJDashboard }))),
    ClientView: lazy(() => import("@/components/dj/DJClientView").then(m => ({ default: m.DJClientView }))),
    EmployeeView: lazy(() => import("@/components/dj/DJAssistantView").then(m => ({ default: m.DJAssistantView }))),
  },
  evenementiel: {
    Dashboard: lazy(() => import("@/components/evenementiel/EvenementielDashboard").then(m => ({ default: m.EvenementielDashboard }))),
    ClientView: lazy(() => import("@/components/evenementiel/EvenementielClientView").then(m => ({ default: m.EvenementielClientView }))),
    EmployeeView: lazy(() => import("@/components/evenementiel/EvenementielChefProjetView").then(m => ({ default: m.EvenementielChefProjetView }))),
  },
  formateur: {
    Dashboard: lazy(() => import("@/components/formateur/FormateurDashboard").then(m => ({ default: m.FormateurDashboard }))),
    ClientView: lazy(() => import("@/components/formateur/FormateurStagiaireView").then(m => ({ default: m.FormateurStagiaireView }))),
    EmployeeView: lazy(() => import("@/components/formateur/FormateurFormateurView").then(m => ({ default: m.FormateurFormateurView }))),
  },
  nettoyage: {
    Dashboard: lazy(() => import("@/components/nettoyage/NettoyageDashboard").then(m => ({ default: m.NettoyageDashboard }))),
    ClientView: lazy(() => import("@/components/nettoyage/NettoyageClientView").then(m => ({ default: m.NettoyageClientView }))),
    EmployeeView: lazy(() => import("@/components/nettoyage/NettoyageAgentView").then(m => ({ default: m.NettoyageAgentView }))),
  },
  photographe: {
    Dashboard: lazy(() => import("@/components/photographe/PhotographeDashboard").then(m => ({ default: m.PhotographeDashboard }))),
    ClientView: lazy(() => import("@/components/photographe/PhotographeClientView").then(m => ({ default: m.PhotographeClientView }))),
    EmployeeView: lazy(() => import("@/components/photographe/PhotographeRetoucheurView").then(m => ({ default: m.PhotographeRetoucheurView }))),
  },
  reparateur: {
    Dashboard: lazy(() => import("@/components/reparateur/ReparateurDashboard").then(m => ({ default: m.ReparateurDashboard }))),
    ClientView: lazy(() => import("@/components/reparateur/ReparateurClientView").then(m => ({ default: m.ReparateurClientView }))),
    EmployeeView: lazy(() => import("@/components/reparateur/ReparateurTechnicienView").then(m => ({ default: m.ReparateurTechnicienView }))),
  },
  traiteur: {
    Dashboard: lazy(() => import("@/components/traiteur/TraiteurDashboard").then(m => ({ default: m.TraiteurDashboard }))),
    ClientView: lazy(() => import("@/components/traiteur/TraiteurClientView").then(m => ({ default: m.TraiteurClientView }))),
    EmployeeView: lazy(() => import("@/components/traiteur/TraiteurEquipeView").then(m => ({ default: m.TraiteurEquipeView }))),
  },
};

// [MBA] Public API

export function getSectorDashboard(sector: SectorKey | null): ComponentType | null {
  if (!sector) return null;
  return SECTOR_REGISTRY[sector]?.Dashboard ?? null;
}

export function getSectorClientView(sector: SectorKey | null): ComponentType | null {
  if (!sector) return null;
  return SECTOR_REGISTRY[sector]?.ClientView ?? null;
}

export function getSectorClientViews(sector: SectorKey | null): { label: string; component: ComponentType }[] | null {
  if (!sector) return null;
  return SECTOR_REGISTRY[sector]?.ClientViews ?? null;
}

export function getSectorEmployeeView(sector: SectorKey | null): ComponentType | null {
  if (!sector) return null;
  return SECTOR_REGISTRY[sector]?.EmployeeView ?? null;
}

export function getSectorEmployeeViews(sector: SectorKey | null): { label: string; component: ComponentType }[] | null {
  if (!sector) return null;
  return SECTOR_REGISTRY[sector]?.EmployeeViews ?? null;
}
