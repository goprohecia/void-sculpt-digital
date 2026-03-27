export interface MockEnterprise {
  id: string;
  nom: string;
  email: string;
  plan: string;
  users: number;
  modules: string[];
  mrr: number;
  statut: string;
  date: string;
  sector: string;
  swapsRemaining: number;
  deblocages: number;
}

export interface SwapDeblocage {
  id: string;
  date: string;
  supportId: string;
  raison: string;
  swapsOctroyes: number;
}

export const MOCK_ENTERPRISES: MockEnterprise[] = [
  { id: "1", nom: "TechVision SAS", email: "contact@techvision.fr", plan: "enterprise", users: 12, modules: ["clients-dossiers", "facturation", "messagerie", "relances", "support", "emails", "rendez-vous", "stock", "analyse", "pipeline", "ia"], mrr: 400, statut: "actif", date: "2025-09-15", sector: "developpeur", swapsRemaining: 2, deblocages: 0 },
  { id: "2", nom: "Studio Créatif", email: "hello@studiocrea.com", plan: "business", users: 5, modules: ["clients-dossiers", "facturation", "messagerie", "relances", "support"], mrr: 250, statut: "actif", date: "2025-11-02", sector: "designer", swapsRemaining: 1, deblocages: 1 },
  { id: "3", nom: "BTP Renov", email: "info@btprenov.fr", plan: "starter", users: 2, modules: ["clients-dossiers", "facturation"], mrr: 150, statut: "actif", date: "2026-01-10", sector: "btp", swapsRemaining: 0, deblocages: 3 },
  { id: "4", nom: "Immo+", email: "contact@immoplus.fr", plan: "business", users: 8, modules: ["clients-dossiers", "facturation", "messagerie", "emails", "rendez-vous"], mrr: 250, statut: "actif", date: "2025-10-20", sector: "immobilier", swapsRemaining: 2, deblocages: 0 },
  { id: "5", nom: "CleanPro", email: "admin@cleanpro.fr", plan: "enterprise", users: 15, modules: ["clients-dossiers", "facturation", "messagerie", "relances", "support", "stock", "analyse", "taches", "automatisations"], mrr: 400, statut: "actif", date: "2025-08-05", sector: "conciergerie-nettoyage", swapsRemaining: 2, deblocages: 0 },
  { id: "6", nom: "DigitalCraft", email: "team@digitalcraft.io", plan: "starter", users: 1, modules: ["clients-dossiers", "facturation"], mrr: 150, statut: "essai", date: "2026-02-28", sector: "community-manager", swapsRemaining: 2, deblocages: 0 },
  { id: "7", nom: "EventPro", email: "contact@eventpro.fr", plan: "business", users: 4, modules: ["clients-dossiers", "facturation", "messagerie", "support"], mrr: 250, statut: "actif", date: "2026-01-15", sector: "evenementiel", swapsRemaining: 0, deblocages: 4 },
  { id: "8", nom: "CoachFit", email: "hello@coachfit.com", plan: "starter", users: 1, modules: ["clients-dossiers", "facturation"], mrr: 150, statut: "actif", date: "2026-02-01", sector: "coach-sportif", swapsRemaining: 1, deblocages: 0 },
];

export const MOCK_DEBLOCAGES: Record<string, SwapDeblocage[]> = {
  "2": [
    { id: "d1", date: "2026-02-15", supportId: "SA-001", raison: "Client en phase de migration, besoin exceptionnel", swapsOctroyes: 1 },
  ],
  "3": [
    { id: "d2", date: "2026-02-05", supportId: "SA-001", raison: "Erreur de swap par le client", swapsOctroyes: 1 },
    { id: "d3", date: "2026-02-18", supportId: "SA-002", raison: "Demande urgente validée par le commercial", swapsOctroyes: 1 },
    { id: "d4", date: "2026-03-02", supportId: "SA-001", raison: "Client VIP — geste commercial", swapsOctroyes: 1 },
  ],
  "7": [
    { id: "d5", date: "2026-01-20", supportId: "SA-002", raison: "Phase de test modules événementiels", swapsOctroyes: 1 },
    { id: "d6", date: "2026-02-03", supportId: "SA-001", raison: "Reconfiguration post-formation", swapsOctroyes: 1 },
    { id: "d7", date: "2026-02-22", supportId: "SA-002", raison: "Swap bloqué par bug — compensation", swapsOctroyes: 1 },
    { id: "d8", date: "2026-03-05", supportId: "SA-001", raison: "Besoin exceptionnel validé", swapsOctroyes: 1 },
  ],
};
