// ── Mock data for Développeur / Studio dev sector ──
import { getDefaultStepsForSector } from "./sectorTimelines";

export const DEV_STEPS = getDefaultStepsForSector("developpeur");

export type DevTicketStatus = "a_faire" | "en_cours" | "a_livrer" | "termine";

export interface DevProjet {
  id: string;
  clientNom: string;
  devAssigne: string;
  nom: string;
  description: string;
  etape: number;
  prochaineLivraison: string;
  montantTotal: number;
  jalons: DevJalon[];
  sprints: DevSprint[];
  tempsTotal: number; // heures
}

export interface DevJalon {
  id: string;
  label: string;
  montant: number;
  statut: "a_facturer" | "facture" | "paye";
}

export interface DevSprint {
  id: string;
  nom: string;
  scope: string;
  dateDebut: string;
  dateFin: string;
  statut: "en_cours" | "recette" | "valide" | "refuse";
  lienDemo?: string;
  pvSigne?: boolean;
}

export interface DevTicket {
  id: string;
  projetId: string;
  titre: string;
  description: string;
  priorite: "haute" | "moyenne" | "basse";
  sprintCible: string;
  tempsEstime: number; // heures
  statut: DevTicketStatus;
}

export const MOCK_DEV_PROJETS: DevProjet[] = [
  {
    id: "prj1", clientNom: "MediSanté", devAssigne: "Alex Morel", nom: "Plateforme de téléconsultation",
    description: "Application web de téléconsultation avec visio, dossier patient et facturation.",
    etape: 3, prochaineLivraison: "2026-03-20", montantTotal: 24000, tempsTotal: 187,
    jalons: [
      { id: "j1", label: "Cahier des charges + maquettes", montant: 6000, statut: "paye" },
      { id: "j2", label: "Sprint 1 — Authentification + Dashboard", montant: 6000, statut: "facture" },
      { id: "j3", label: "Sprint 2 — Visio + Dossiers", montant: 6000, statut: "a_facturer" },
      { id: "j4", label: "Mise en production + formation", montant: 6000, statut: "a_facturer" },
    ],
    sprints: [
      { id: "s1", nom: "Sprint 1", scope: "Auth, dashboard patient, dashboard médecin", dateDebut: "2026-02-01", dateFin: "2026-02-28", statut: "valide", lienDemo: "https://demo.medisante.dev/sprint1", pvSigne: true },
      { id: "s2", nom: "Sprint 2", scope: "Module visio, dossier patient, notifications", dateDebut: "2026-03-01", dateFin: "2026-03-20", statut: "en_cours", lienDemo: "https://demo.medisante.dev/sprint2" },
    ],
  },
  {
    id: "prj2", clientNom: "GreenLogistics", devAssigne: "Alex Morel", nom: "Dashboard logistique",
    description: "Tableau de bord de suivi de flotte et d'optimisation des itinéraires.",
    etape: 4, prochaineLivraison: "2026-03-15", montantTotal: 15000, tempsTotal: 112,
    jalons: [
      { id: "j5", label: "Spécifications + architecture", montant: 3750, statut: "paye" },
      { id: "j6", label: "Sprint 1 — Carte + tracking", montant: 3750, statut: "paye" },
      { id: "j7", label: "Sprint 2 — Rapports + alertes", montant: 3750, statut: "facture" },
      { id: "j8", label: "Déploiement + documentation", montant: 3750, statut: "a_facturer" },
    ],
    sprints: [
      { id: "s3", nom: "Sprint 1", scope: "Carte interactive, suivi GPS temps réel", dateDebut: "2026-01-15", dateFin: "2026-02-15", statut: "valide", lienDemo: "https://demo.greenlog.dev/sprint1", pvSigne: true },
      { id: "s4", nom: "Sprint 2", scope: "Rapports automatiques, alertes retard, export CSV", dateDebut: "2026-02-16", dateFin: "2026-03-15", statut: "recette", lienDemo: "https://demo.greenlog.dev/sprint2" },
    ],
  },
  {
    id: "prj3", clientNom: "ArtisanBio", devAssigne: "Clara Vidal", nom: "E-commerce artisanal",
    description: "Boutique en ligne avec gestion de stock, paiement Stripe et click & collect.",
    etape: 1, prochaineLivraison: "2026-04-01", montantTotal: 9000, tempsTotal: 24,
    jalons: [
      { id: "j9", label: "Cahier des charges", montant: 2250, statut: "facture" },
      { id: "j10", label: "Développement MVP", montant: 4500, statut: "a_facturer" },
      { id: "j11", label: "Tests + MEP", montant: 2250, statut: "a_facturer" },
    ],
    sprints: [],
  },
];

export const MOCK_DEV_TICKETS: DevTicket[] = [
  { id: "t1", projetId: "prj1", titre: "Intégration API visio", description: "Connecter le module de visioconférence via WebRTC", priorite: "haute", sprintCible: "Sprint 2", tempsEstime: 16, statut: "en_cours" },
  { id: "t2", projetId: "prj1", titre: "Dossier patient PDF", description: "Générer un récapitulatif patient en PDF téléchargeable", priorite: "moyenne", sprintCible: "Sprint 2", tempsEstime: 8, statut: "a_faire" },
  { id: "t3", projetId: "prj1", titre: "Notifications email", description: "Envoyer des rappels de RDV par email au patient", priorite: "basse", sprintCible: "Sprint 2", tempsEstime: 4, statut: "a_faire" },
  { id: "t4", projetId: "prj1", titre: "Tests unitaires auth", description: "Couvrir le module d'authentification à 80%", priorite: "moyenne", sprintCible: "Sprint 2", tempsEstime: 6, statut: "a_livrer" },
  { id: "t5", projetId: "prj1", titre: "Fix responsive dashboard", description: "Corriger l'affichage mobile du dashboard médecin", priorite: "haute", sprintCible: "Sprint 2", tempsEstime: 3, statut: "termine" },
  { id: "t6", projetId: "prj2", titre: "Export rapports CSV", description: "Permettre l'export des rapports de flotte en CSV", priorite: "haute", sprintCible: "Sprint 2", tempsEstime: 5, statut: "en_cours" },
  { id: "t7", projetId: "prj2", titre: "Alertes retard livraison", description: "Déclencher une alerte si un véhicule dépasse le délai prévu", priorite: "haute", sprintCible: "Sprint 2", tempsEstime: 8, statut: "a_livrer" },
  { id: "t8", projetId: "prj2", titre: "Filtre par zone géographique", description: "Ajouter un filtre par zone sur la carte", priorite: "moyenne", sprintCible: "Sprint 2", tempsEstime: 4, statut: "termine" },
];

export const MOCK_DEV_EQUIPE = [
  { id: "dev1", nom: "Alex Morel", poste: "Fullstack Senior", projetsActifs: 2, tempsHebdo: 38, tauxHoraire: 85 },
  { id: "dev2", nom: "Clara Vidal", poste: "Frontend Dev", projetsActifs: 1, tempsHebdo: 22, tauxHoraire: 65 },
];

export const DEV_KPIS = {
  projetsActifs: 3,
  projetsLivres: 0,
  caTotal: 48000,
  aFacturer: 22500,
  tempsTotal: 323,
};

export const KANBAN_COLUMNS: { key: DevTicketStatus; label: string; color: string }[] = [
  { key: "a_faire", label: "À faire", color: "border-muted-foreground/30" },
  { key: "en_cours", label: "En cours", color: "border-blue-500/40" },
  { key: "a_livrer", label: "À livrer", color: "border-amber-500/40" },
  { key: "termine", label: "Terminé", color: "border-green-500/40" },
];

export const PRIORITE_COLORS: Record<string, string> = {
  haute: "bg-destructive/15 text-destructive",
  moyenne: "bg-amber-500/15 text-amber-500",
  basse: "bg-muted text-muted-foreground",
};
