// ========================================
// DONNÉES MOCK CENTRALISÉES - BACK-OFFICE DEMO
// ========================================

export type ClientStatus = "actif" | "inactif";
export type DossierStatus = "en_cours" | "termine" | "en_attente" | "annule";
export type FactureStatus = "payee" | "en_attente" | "en_retard";
export type RelanceStatus = "a_envoyer" | "envoyee" | "reponse_recue";
export type MessageRole = "admin" | "client";

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise: string;
  statut: ClientStatus;
  dateCreation: string;
  nombreDossiers: number;
}

export interface Dossier {
  id: string;
  reference: string;
  clientId: string;
  clientNom: string;
  typePrestation: string;
  montant: number;
  statut: DossierStatus;
  dateCreation: string;
  dateEcheance: string;
}

export interface Facture {
  id: string;
  reference: string;
  clientId: string;
  clientNom: string;
  dossierId: string;
  montant: number;
  statut: FactureStatus;
  dateEmission: string;
  dateEcheance: string;
}

export interface Relance {
  id: string;
  factureId: string;
  factureRef: string;
  clientId: string;
  clientNom: string;
  montant: number;
  statut: RelanceStatus;
  dateRelance: string;
  dateProchaine: string;
  type: string;
}

export interface Message {
  id: string;
  contenu: string;
  role: MessageRole;
  date: string;
}

export interface Conversation {
  id: string;
  clientId: string;
  clientNom: string;
  sujet: string;
  messages: Message[];
  nonLus: number;
  dernierMessage: string;
}

export interface Activite {
  id: string;
  type: "dossier" | "client" | "facture" | "message" | "relance";
  description: string;
  date: string;
}

export interface DonneesMensuelles {
  mois: string;
  objectif: number;
  caTotal: number;
  encaissements: number;
  dossiers: number;
  panierMoyen: number;
  conversion: number;
  nouveauxClients: number;
}

// ---- CLIENTS ----
export const clients: Client[] = [
  { id: "c1", nom: "Dupont", prenom: "Marie", email: "m.dupont@techsolutions.fr", telephone: "06 12 34 56 78", entreprise: "TechSolutions", statut: "actif", dateCreation: "2025-11-15", nombreDossiers: 3 },
  { id: "c2", nom: "Martin", prenom: "Lucas", email: "lucas.martin@greenleaf.fr", telephone: "06 23 45 67 89", entreprise: "GreenLeaf Bio", statut: "actif", dateCreation: "2025-12-02", nombreDossiers: 2 },
  { id: "c3", nom: "Bernard", prenom: "Sophie", email: "s.bernard@luxemode.com", telephone: "06 34 56 78 90", entreprise: "Luxe & Mode", statut: "actif", dateCreation: "2026-01-10", nombreDossiers: 4 },
  { id: "c4", nom: "Petit", prenom: "Thomas", email: "thomas.petit@archibat.fr", telephone: "06 45 67 89 01", entreprise: "ArchiBat", statut: "actif", dateCreation: "2026-01-18", nombreDossiers: 1 },
  { id: "c5", nom: "Robert", prenom: "Julie", email: "j.robert@foodlab.io", telephone: "06 56 78 90 12", entreprise: "FoodLab", statut: "actif", dateCreation: "2025-10-05", nombreDossiers: 2 },
  { id: "c6", nom: "Moreau", prenom: "Antoine", email: "a.moreau@digitalmind.fr", telephone: "06 67 89 01 23", entreprise: "DigitalMind", statut: "inactif", dateCreation: "2025-08-20", nombreDossiers: 1 },
  { id: "c7", nom: "Laurent", prenom: "Emma", email: "e.laurent@healthplus.fr", telephone: "06 78 90 12 34", entreprise: "HealthPlus", statut: "actif", dateCreation: "2026-02-01", nombreDossiers: 2 },
  { id: "c8", nom: "Simon", prenom: "Pierre", email: "p.simon@autoelec.com", telephone: "06 89 01 23 45", entreprise: "AutoElec", statut: "actif", dateCreation: "2025-09-12", nombreDossiers: 3 },
  { id: "c9", nom: "Michel", prenom: "Camille", email: "c.michel@artvisuel.fr", telephone: "06 90 12 34 56", entreprise: "ArtVisuel", statut: "inactif", dateCreation: "2025-07-30", nombreDossiers: 1 },
  { id: "c10", nom: "Leroy", prenom: "David", email: "d.leroy@sportnow.fr", telephone: "07 01 23 45 67", entreprise: "SportNow", statut: "actif", dateCreation: "2025-12-20", nombreDossiers: 2 },
  { id: "c11", nom: "Garcia", prenom: "Léa", email: "l.garcia@ecoshop.fr", telephone: "07 12 34 56 78", entreprise: "EcoShop", statut: "actif", dateCreation: "2026-01-25", nombreDossiers: 2 },
  { id: "c12", nom: "Roux", prenom: "Nicolas", email: "n.roux@immoplus.fr", telephone: "07 23 45 67 89", entreprise: "ImmoPlus", statut: "actif", dateCreation: "2025-11-08", nombreDossiers: 2 },
];

// ---- DOSSIERS ----
export const dossiers: Dossier[] = [
  { id: "d1", reference: "DOS-2026-001", clientId: "c1", clientNom: "TechSolutions", typePrestation: "Site web vitrine", montant: 4500, statut: "en_cours", dateCreation: "2026-01-05", dateEcheance: "2026-03-15" },
  { id: "d2", reference: "DOS-2026-002", clientId: "c1", clientNom: "TechSolutions", typePrestation: "Application mobile", montant: 12000, statut: "en_attente", dateCreation: "2026-01-20", dateEcheance: "2026-06-30" },
  { id: "d3", reference: "DOS-2026-003", clientId: "c1", clientNom: "TechSolutions", typePrestation: "Back-office", montant: 8000, statut: "termine", dateCreation: "2025-11-15", dateEcheance: "2026-01-30" },
  { id: "d4", reference: "DOS-2026-004", clientId: "c2", clientNom: "GreenLeaf Bio", typePrestation: "E-commerce", montant: 15000, statut: "en_cours", dateCreation: "2026-01-12", dateEcheance: "2026-04-20" },
  { id: "d5", reference: "DOS-2026-005", clientId: "c2", clientNom: "GreenLeaf Bio", typePrestation: "SEO / Référencement", montant: 3000, statut: "en_cours", dateCreation: "2026-02-01", dateEcheance: "2026-05-01" },
  { id: "d6", reference: "DOS-2026-006", clientId: "c3", clientNom: "Luxe & Mode", typePrestation: "Application 360°", montant: 25000, statut: "en_cours", dateCreation: "2025-12-10", dateEcheance: "2026-05-30" },
  { id: "d7", reference: "DOS-2026-007", clientId: "c3", clientNom: "Luxe & Mode", typePrestation: "Site web vitrine", montant: 6000, statut: "termine", dateCreation: "2025-10-01", dateEcheance: "2025-12-15" },
  { id: "d8", reference: "DOS-2026-008", clientId: "c3", clientNom: "Luxe & Mode", typePrestation: "Maintenance", montant: 2400, statut: "en_cours", dateCreation: "2026-01-01", dateEcheance: "2026-12-31" },
  { id: "d9", reference: "DOS-2026-009", clientId: "c3", clientNom: "Luxe & Mode", typePrestation: "Application mobile", montant: 18000, statut: "en_attente", dateCreation: "2026-02-05", dateEcheance: "2026-07-30" },
  { id: "d10", reference: "DOS-2026-010", clientId: "c4", clientNom: "ArchiBat", typePrestation: "Site web vitrine", montant: 5500, statut: "en_cours", dateCreation: "2026-01-22", dateEcheance: "2026-03-30" },
  { id: "d11", reference: "DOS-2026-011", clientId: "c5", clientNom: "FoodLab", typePrestation: "E-commerce", montant: 9000, statut: "termine", dateCreation: "2025-10-10", dateEcheance: "2025-12-20" },
  { id: "d12", reference: "DOS-2026-012", clientId: "c5", clientNom: "FoodLab", typePrestation: "Application mobile", montant: 14000, statut: "en_cours", dateCreation: "2026-01-15", dateEcheance: "2026-05-15" },
  { id: "d13", reference: "DOS-2026-013", clientId: "c6", clientNom: "DigitalMind", typePrestation: "Consulting", montant: 3500, statut: "annule", dateCreation: "2025-09-01", dateEcheance: "2025-10-15" },
  { id: "d14", reference: "DOS-2026-014", clientId: "c7", clientNom: "HealthPlus", typePrestation: "Application web", montant: 11000, statut: "en_cours", dateCreation: "2026-02-01", dateEcheance: "2026-05-30" },
  { id: "d15", reference: "DOS-2026-015", clientId: "c7", clientNom: "HealthPlus", typePrestation: "Back-office", montant: 7500, statut: "en_attente", dateCreation: "2026-02-05", dateEcheance: "2026-04-30" },
  { id: "d16", reference: "DOS-2026-016", clientId: "c8", clientNom: "AutoElec", typePrestation: "E-commerce", montant: 13000, statut: "en_cours", dateCreation: "2025-12-01", dateEcheance: "2026-03-15" },
  { id: "d17", reference: "DOS-2026-017", clientId: "c8", clientNom: "AutoElec", typePrestation: "SEO / Référencement", montant: 2500, statut: "termine", dateCreation: "2025-09-15", dateEcheance: "2025-11-30" },
  { id: "d18", reference: "DOS-2026-018", clientId: "c8", clientNom: "AutoElec", typePrestation: "Maintenance", montant: 1800, statut: "en_cours", dateCreation: "2026-01-01", dateEcheance: "2026-12-31" },
  { id: "d19", reference: "DOS-2026-019", clientId: "c9", clientNom: "ArtVisuel", typePrestation: "Site web vitrine", montant: 4000, statut: "annule", dateCreation: "2025-08-01", dateEcheance: "2025-09-30" },
  { id: "d20", reference: "DOS-2026-020", clientId: "c10", clientNom: "SportNow", typePrestation: "Application mobile", montant: 16000, statut: "en_cours", dateCreation: "2026-01-08", dateEcheance: "2026-05-08" },
  { id: "d21", reference: "DOS-2026-021", clientId: "c10", clientNom: "SportNow", typePrestation: "Back-office", montant: 6500, statut: "en_attente", dateCreation: "2026-02-03", dateEcheance: "2026-04-15" },
  { id: "d22", reference: "DOS-2026-022", clientId: "c11", clientNom: "EcoShop", typePrestation: "E-commerce", montant: 11500, statut: "en_cours", dateCreation: "2026-01-28", dateEcheance: "2026-04-28" },
  { id: "d23", reference: "DOS-2026-023", clientId: "c11", clientNom: "EcoShop", typePrestation: "SEO / Référencement", montant: 2800, statut: "en_cours", dateCreation: "2026-02-01", dateEcheance: "2026-05-01" },
  { id: "d24", reference: "DOS-2026-024", clientId: "c12", clientNom: "ImmoPlus", typePrestation: "Application web", montant: 9500, statut: "en_cours", dateCreation: "2025-12-15", dateEcheance: "2026-03-30" },
  { id: "d25", reference: "DOS-2026-025", clientId: "c12", clientNom: "ImmoPlus", typePrestation: "Application mobile", montant: 14500, statut: "en_attente", dateCreation: "2026-02-08", dateEcheance: "2026-06-30" },
];

// ---- FACTURES ----
export const factures: Facture[] = [
  { id: "f1", reference: "FAC-2026-001", clientId: "c1", clientNom: "TechSolutions", dossierId: "d3", montant: 8000, statut: "payee", dateEmission: "2026-01-30", dateEcheance: "2026-02-28" },
  { id: "f2", reference: "FAC-2026-002", clientId: "c1", clientNom: "TechSolutions", dossierId: "d1", montant: 2250, statut: "en_attente", dateEmission: "2026-02-01", dateEcheance: "2026-03-01" },
  { id: "f3", reference: "FAC-2026-003", clientId: "c2", clientNom: "GreenLeaf Bio", dossierId: "d4", montant: 7500, statut: "en_attente", dateEmission: "2026-02-05", dateEcheance: "2026-03-05" },
  { id: "f4", reference: "FAC-2026-004", clientId: "c3", clientNom: "Luxe & Mode", dossierId: "d7", montant: 6000, statut: "payee", dateEmission: "2025-12-15", dateEcheance: "2026-01-15" },
  { id: "f5", reference: "FAC-2026-005", clientId: "c3", clientNom: "Luxe & Mode", dossierId: "d6", montant: 12500, statut: "en_attente", dateEmission: "2026-01-15", dateEcheance: "2026-02-15" },
  { id: "f6", reference: "FAC-2026-006", clientId: "c5", clientNom: "FoodLab", dossierId: "d11", montant: 9000, statut: "payee", dateEmission: "2025-12-20", dateEcheance: "2026-01-20" },
  { id: "f7", reference: "FAC-2026-007", clientId: "c6", clientNom: "DigitalMind", dossierId: "d13", montant: 1750, statut: "en_retard", dateEmission: "2025-10-15", dateEcheance: "2025-11-15" },
  { id: "f8", reference: "FAC-2026-008", clientId: "c8", clientNom: "AutoElec", dossierId: "d17", montant: 2500, statut: "payee", dateEmission: "2025-11-30", dateEcheance: "2025-12-30" },
  { id: "f9", reference: "FAC-2026-009", clientId: "c8", clientNom: "AutoElec", dossierId: "d16", montant: 6500, statut: "en_attente", dateEmission: "2026-01-15", dateEcheance: "2026-02-15" },
  { id: "f10", reference: "FAC-2026-010", clientId: "c10", clientNom: "SportNow", dossierId: "d20", montant: 8000, statut: "en_attente", dateEmission: "2026-02-01", dateEcheance: "2026-03-01" },
  { id: "f11", reference: "FAC-2026-011", clientId: "c11", clientNom: "EcoShop", dossierId: "d22", montant: 5750, statut: "en_attente", dateEmission: "2026-02-05", dateEcheance: "2026-03-05" },
  { id: "f12", reference: "FAC-2026-012", clientId: "c12", clientNom: "ImmoPlus", dossierId: "d24", montant: 4750, statut: "en_retard", dateEmission: "2025-12-30", dateEcheance: "2026-01-30" },
  { id: "f13", reference: "FAC-2026-013", clientId: "c3", clientNom: "Luxe & Mode", dossierId: "d8", montant: 600, statut: "payee", dateEmission: "2026-01-31", dateEcheance: "2026-02-28" },
  { id: "f14", reference: "FAC-2026-014", clientId: "c7", clientNom: "HealthPlus", dossierId: "d14", montant: 5500, statut: "en_attente", dateEmission: "2026-02-08", dateEcheance: "2026-03-08" },
  { id: "f15", reference: "FAC-2026-015", clientId: "c4", clientNom: "ArchiBat", dossierId: "d10", montant: 2750, statut: "en_attente", dateEmission: "2026-02-06", dateEcheance: "2026-03-06" },
];

// ---- RELANCES ----
export const relances: Relance[] = [
  { id: "r1", factureId: "f7", factureRef: "FAC-2026-007", clientId: "c6", clientNom: "DigitalMind", montant: 1750, statut: "envoyee", dateRelance: "2025-12-01", dateProchaine: "2026-02-15", type: "Email" },
  { id: "r2", factureId: "f7", factureRef: "FAC-2026-007", clientId: "c6", clientNom: "DigitalMind", montant: 1750, statut: "envoyee", dateRelance: "2026-01-10", dateProchaine: "2026-02-20", type: "Courrier recommandé" },
  { id: "r3", factureId: "f12", factureRef: "FAC-2026-012", clientId: "c12", clientNom: "ImmoPlus", montant: 4750, statut: "envoyee", dateRelance: "2026-02-05", dateProchaine: "2026-02-20", type: "Email" },
  { id: "r4", factureId: "f5", factureRef: "FAC-2026-005", clientId: "c3", clientNom: "Luxe & Mode", montant: 12500, statut: "a_envoyer", dateRelance: "2026-02-16", dateProchaine: "2026-02-16", type: "Email" },
  { id: "r5", factureId: "f9", factureRef: "FAC-2026-009", clientId: "c8", clientNom: "AutoElec", montant: 6500, statut: "a_envoyer", dateRelance: "2026-02-16", dateProchaine: "2026-02-16", type: "Téléphone" },
  { id: "r6", factureId: "f2", factureRef: "FAC-2026-002", clientId: "c1", clientNom: "TechSolutions", montant: 2250, statut: "reponse_recue", dateRelance: "2026-02-08", dateProchaine: "", type: "Email" },
  { id: "r7", factureId: "f3", factureRef: "FAC-2026-003", clientId: "c2", clientNom: "GreenLeaf Bio", montant: 7500, statut: "a_envoyer", dateRelance: "2026-03-06", dateProchaine: "2026-03-06", type: "Email" },
  { id: "r8", factureId: "f10", factureRef: "FAC-2026-010", clientId: "c10", clientNom: "SportNow", montant: 8000, statut: "a_envoyer", dateRelance: "2026-03-02", dateProchaine: "2026-03-02", type: "Téléphone" },
];

// ---- CONVERSATIONS ----
export const conversations: Conversation[] = [
  {
    id: "conv1", clientId: "c3", clientNom: "Luxe & Mode", sujet: "Avancement Application 360°", nonLus: 2, dernierMessage: "2026-02-09",
    messages: [
      { id: "m1", contenu: "Bonjour, pourriez-vous nous faire un point sur l'avancement du projet 360° ?", role: "client", date: "2026-02-08 09:15" },
      { id: "m2", contenu: "Bonjour Sophie, le développement avance bien. Nous terminons la phase de maquettage cette semaine.", role: "admin", date: "2026-02-08 10:30" },
      { id: "m3", contenu: "Parfait ! Pouvons-nous planifier une démo pour la semaine prochaine ?", role: "client", date: "2026-02-09 08:45" },
      { id: "m4", contenu: "Nous aimerions aussi discuter de l'intégration du module paiement.", role: "client", date: "2026-02-09 08:47" },
    ],
  },
  {
    id: "conv2", clientId: "c1", clientNom: "TechSolutions", sujet: "Facture DOS-2026-001", nonLus: 0, dernierMessage: "2026-02-07",
    messages: [
      { id: "m5", contenu: "Bonjour, j'ai bien reçu la facture d'acompte pour le site vitrine.", role: "client", date: "2026-02-06 14:20" },
      { id: "m6", contenu: "Le paiement sera effectué d'ici la fin de la semaine.", role: "client", date: "2026-02-06 14:21" },
      { id: "m7", contenu: "Merci Marie, nous en prenons bonne note. N'hésitez pas si vous avez des questions.", role: "admin", date: "2026-02-07 09:00" },
    ],
  },
  {
    id: "conv3", clientId: "c2", clientNom: "GreenLeaf Bio", sujet: "Modifications e-commerce", nonLus: 1, dernierMessage: "2026-02-09",
    messages: [
      { id: "m8", contenu: "Bonjour, serait-il possible d'ajouter un module de click & collect sur le site ?", role: "client", date: "2026-02-08 16:00" },
      { id: "m9", contenu: "Bonjour Lucas, c'est tout à fait faisable. Nous allons chiffrer cette fonctionnalité et revenir vers vous.", role: "admin", date: "2026-02-09 09:30" },
      { id: "m10", contenu: "Super, j'attends votre proposition. Merci !", role: "client", date: "2026-02-09 10:15" },
    ],
  },
  {
    id: "conv4", clientId: "c7", clientNom: "HealthPlus", sujet: "Cahier des charges", nonLus: 0, dernierMessage: "2026-02-06",
    messages: [
      { id: "m11", contenu: "Voici le cahier des charges mis à jour avec nos dernières remarques.", role: "client", date: "2026-02-05 11:00" },
      { id: "m12", contenu: "Merci Emma, nous l'avons bien reçu et allons l'analyser. Retour prévu sous 48h.", role: "admin", date: "2026-02-06 10:00" },
    ],
  },
  {
    id: "conv5", clientId: "c10", clientNom: "SportNow", sujet: "Délai application mobile", nonLus: 1, dernierMessage: "2026-02-09",
    messages: [
      { id: "m13", contenu: "Bonjour, est-il possible d'accélérer le développement ? Nous aimerions lancer avant l'été.", role: "client", date: "2026-02-09 07:30" },
    ],
  },
  {
    id: "conv6", clientId: "c8", clientNom: "AutoElec", sujet: "Bug page produit", nonLus: 0, dernierMessage: "2026-02-05",
    messages: [
      { id: "m14", contenu: "Nous avons détecté un bug sur la page produit : les images ne s'affichent pas sur Safari.", role: "client", date: "2026-02-04 15:45" },
      { id: "m15", contenu: "Merci pour le signalement Pierre. Nous avons identifié le problème et corrigé. Pouvez-vous vérifier ?", role: "admin", date: "2026-02-05 11:20" },
      { id: "m16", contenu: "C'est bon, tout fonctionne maintenant. Merci pour la réactivité !", role: "client", date: "2026-02-05 14:00" },
    ],
  },
  {
    id: "conv7", clientId: "c4", clientNom: "ArchiBat", sujet: "Demande de devis", nonLus: 0, dernierMessage: "2026-02-03",
    messages: [
      { id: "m17", contenu: "Bonjour, nous envisageons une refonte complète. Pouvez-vous nous envoyer un devis ?", role: "client", date: "2026-02-02 10:00" },
      { id: "m18", contenu: "Bonjour Thomas, avec plaisir. Pouvez-vous nous préciser vos besoins et votre budget indicatif ?", role: "admin", date: "2026-02-03 09:15" },
    ],
  },
  {
    id: "conv8", clientId: "c11", clientNom: "EcoShop", sujet: "Livraison phase 1", nonLus: 1, dernierMessage: "2026-02-09",
    messages: [
      { id: "m19", contenu: "La phase 1 du e-commerce est-elle toujours prévue pour fin février ?", role: "client", date: "2026-02-09 11:00" },
    ],
  },
  {
    id: "conv9", clientId: "c12", clientNom: "ImmoPlus", sujet: "Paiement facture", nonLus: 0, dernierMessage: "2026-02-04",
    messages: [
      { id: "m20", contenu: "Concernant la facture FAC-2026-012, nous rencontrons un problème de trésorerie. Serait-il possible d'étaler le paiement ?", role: "client", date: "2026-02-03 16:30" },
      { id: "m21", contenu: "Nous comprenons David. Nous vous proposons un échelonnement en 3 fois. Nous vous envoyons la proposition.", role: "admin", date: "2026-02-04 10:00" },
    ],
  },
  {
    id: "conv10", clientId: "c5", clientNom: "FoodLab", sujet: "Nouvelles fonctionnalités", nonLus: 0, dernierMessage: "2026-02-01",
    messages: [
      { id: "m22", contenu: "Nous aimerions ajouter un programme de fidélité à l'app. Est-ce dans le périmètre actuel ?", role: "client", date: "2026-01-31 13:00" },
      { id: "m23", contenu: "Ce n'est pas dans le scope actuel mais nous pouvons le chiffrer en option. Je vous prépare un avenant.", role: "admin", date: "2026-02-01 09:45" },
    ],
  },
];

// ---- ACTIVITES RECENTES ----
export const activites: Activite[] = [
  { id: "a1", type: "dossier", description: "Nouveau dossier DOS-2026-025 créé pour ImmoPlus", date: "2026-02-08 16:30" },
  { id: "a2", type: "facture", description: "Facture FAC-2026-015 émise pour ArchiBat (2 750 €)", date: "2026-02-06 14:00" },
  { id: "a3", type: "client", description: "Nouveau client HealthPlus ajouté", date: "2026-02-01 10:00" },
  { id: "a4", type: "message", description: "Nouveau message de Luxe & Mode concernant le projet 360°", date: "2026-02-09 08:47" },
  { id: "a5", type: "facture", description: "Facture FAC-2026-014 émise pour HealthPlus (5 500 €)", date: "2026-02-08 11:00" },
  { id: "a6", type: "relance", description: "Relance envoyée à ImmoPlus pour FAC-2026-012", date: "2026-02-05 09:00" },
  { id: "a7", type: "dossier", description: "Dossier DOS-2026-003 (TechSolutions) marqué terminé", date: "2026-01-30 17:00" },
  { id: "a8", type: "message", description: "Réponse envoyée à GreenLeaf Bio sur le click & collect", date: "2026-02-09 09:30" },
];

// ---- DONNÉES ANALYTIQUES MENSUELLES 2026 ----
export const donneesMensuelles: DonneesMensuelles[] = [
  { mois: "Jan", objectif: 30000, caTotal: 28500, encaissements: 23100, dossiers: 6, panierMoyen: 4750, conversion: 72, nouveauxClients: 2 },
  { mois: "Fév", objectif: 32000, caTotal: 35200, encaissements: 26600, dossiers: 8, panierMoyen: 4400, conversion: 78, nouveauxClients: 3 },
  { mois: "Mar", objectif: 35000, caTotal: 33800, encaissements: 30200, dossiers: 7, panierMoyen: 4829, conversion: 75, nouveauxClients: 2 },
  { mois: "Avr", objectif: 35000, caTotal: 38500, encaissements: 34100, dossiers: 9, panierMoyen: 4278, conversion: 80, nouveauxClients: 4 },
  { mois: "Mai", objectif: 38000, caTotal: 41200, encaissements: 37500, dossiers: 10, panierMoyen: 4120, conversion: 82, nouveauxClients: 3 },
  { mois: "Jun", objectif: 38000, caTotal: 36800, encaissements: 33200, dossiers: 8, panierMoyen: 4600, conversion: 76, nouveauxClients: 2 },
  { mois: "Jul", objectif: 30000, caTotal: 25600, encaissements: 22800, dossiers: 5, panierMoyen: 5120, conversion: 68, nouveauxClients: 1 },
  { mois: "Aoû", objectif: 25000, caTotal: 18900, encaissements: 16500, dossiers: 4, panierMoyen: 4725, conversion: 65, nouveauxClients: 1 },
  { mois: "Sep", objectif: 35000, caTotal: 37200, encaissements: 33800, dossiers: 8, panierMoyen: 4650, conversion: 79, nouveauxClients: 3 },
  { mois: "Oct", objectif: 38000, caTotal: 42100, encaissements: 38500, dossiers: 11, panierMoyen: 3827, conversion: 84, nouveauxClients: 4 },
  { mois: "Nov", objectif: 40000, caTotal: 44500, encaissements: 40200, dossiers: 12, panierMoyen: 3708, conversion: 86, nouveauxClients: 3 },
  { mois: "Déc", objectif: 35000, caTotal: 31800, encaissements: 28600, dossiers: 7, panierMoyen: 4543, conversion: 74, nouveauxClients: 2 },
];

// ---- HELPERS ----
export const getClientById = (id: string) => clients.find((c) => c.id === id);
export const getDossiersByClient = (clientId: string) => dossiers.filter((d) => d.clientId === clientId);
export const getFacturesByClient = (clientId: string) => factures.filter((f) => f.clientId === clientId);
export const getRelancesByFacture = (factureId: string) => relances.filter((r) => r.factureId === factureId);
export const getConversationsByClient = (clientId: string) => conversations.filter((c) => c.clientId === clientId);

export const totalNonLus = conversations.reduce((acc, c) => acc + c.nonLus, 0);

export const statsFactures = {
  total: factures.reduce((acc, f) => acc + f.montant, 0),
  payees: factures.filter((f) => f.statut === "payee").reduce((acc, f) => acc + f.montant, 0),
  enAttente: factures.filter((f) => f.statut === "en_attente").reduce((acc, f) => acc + f.montant, 0),
  enRetard: factures.filter((f) => f.statut === "en_retard").reduce((acc, f) => acc + f.montant, 0),
};
