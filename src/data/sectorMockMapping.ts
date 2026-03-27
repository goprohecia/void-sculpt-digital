// [MBA] Mapping secteur → données mock conformes aux types génériques
// Chaque secteur fournit clients, dossiers, factures, devis, notifications, teamMembers, assignments
// Les secteurs non définis ici utilisent le fallback (mockData.ts générique)

import type { Client, Dossier, Facture, Devis, Notification, TeamMember, DossierAssignment } from "@/data/mockData";
import type { SectorKey } from "@/contexts/DemoPlanContext";

// [MBA] Demande type inline pour éviter import circulaire avec DemoDataContext
export interface SectorDemande {
  id: string;
  reference: string;
  clientId: string;
  clientNom: string;
  titre: string;
  typePrestation: string;
  description: string;
  budget?: string;
  statut: "nouvelle" | "en_revue" | "validee" | "refusee";
  dateCreation: string;
  dateMiseAJour: string;
}

export interface SectorMockData {
  clients: Client[];
  dossiers: Dossier[];
  factures: Facture[];
  devis: Devis[];
  notifications: Notification[];
  teamMembers: TeamMember[];
  assignments: Record<string, DossierAssignment[]>;
  // [MBA] Demandes spécifiques au secteur
  demandes?: SectorDemande[];
}

// ── CONCIERGERIE ──
const conciergerieMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Benali", prenom: "Rachid", email: "r.benali@gmail.com", telephone: "06 12 34 56 78", entreprise: "Appartement T3 Marseille", statut: "actif", dateCreation: "2025-11-15", nombreDossiers: 3 },
    { id: "c2", nom: "Duval", prenom: "Christine", email: "c.duval@orange.fr", telephone: "06 23 45 67 89", entreprise: "Villa Cap Ferret", statut: "actif", dateCreation: "2025-12-02", nombreDossiers: 2 },
    { id: "c3", nom: "Moretti", prenom: "Luca", email: "luca.moretti@gmail.com", telephone: "06 34 56 78 90", entreprise: "Studio Cannes", statut: "actif", dateCreation: "2026-01-10", nombreDossiers: 2 },
    { id: "c4", nom: "Fournier", prenom: "Isabelle", email: "i.fournier@free.fr", telephone: "06 45 67 89 01", entreprise: "Loft Paris 11e", statut: "actif", dateCreation: "2026-01-18", nombreDossiers: 1 },
    { id: "c5", nom: "Sanchez", prenom: "Miguel", email: "m.sanchez@hotmail.com", telephone: "06 56 78 90 12", entreprise: "Maison Biarritz", statut: "actif", dateCreation: "2025-10-05", nombreDossiers: 2 },
  ],
  dossiers: [
    { id: "d1", reference: "DOS-2026-001", clientId: "c1", clientNom: "Benali — T3 Marseille", typePrestation: "Séjour Airbnb", montant: 850, statut: "en_cours", dateCreation: "2026-02-10", dateEcheance: "2026-02-17" },
    { id: "d2", reference: "DOS-2026-002", clientId: "c1", clientNom: "Benali — T3 Marseille", typePrestation: "Ménage post-séjour", montant: 120, statut: "en_cours", dateCreation: "2026-02-17", dateEcheance: "2026-02-18" },
    { id: "d3", reference: "DOS-2026-003", clientId: "c2", clientNom: "Duval — Villa Cap Ferret", typePrestation: "Séjour haute saison", montant: 2400, statut: "en_attente", dateCreation: "2026-03-01", dateEcheance: "2026-07-15" },
    { id: "d4", reference: "DOS-2026-004", clientId: "c3", clientNom: "Moretti — Studio Cannes", typePrestation: "Check-in/Check-out", montant: 180, statut: "en_cours", dateCreation: "2026-02-20", dateEcheance: "2026-02-25" },
    { id: "d5", reference: "DOS-2026-005", clientId: "c4", clientNom: "Fournier — Loft Paris 11e", typePrestation: "Gestion locative mensuelle", montant: 450, statut: "en_cours", dateCreation: "2026-01-01", dateEcheance: "2026-12-31" },
    { id: "d6", reference: "DOS-2026-006", clientId: "c5", clientNom: "Sanchez — Maison Biarritz", typePrestation: "Séjour week-end", montant: 680, statut: "termine", dateCreation: "2026-01-20", dateEcheance: "2026-01-22" },
    { id: "d7", reference: "DOS-2026-007", clientId: "c1", clientNom: "Benali — T3 Marseille", typePrestation: "Maintenance plomberie", montant: 250, statut: "termine", dateCreation: "2026-01-05", dateEcheance: "2026-01-08" },
  ],
  factures: [
    { id: "f1", reference: "FAC-2026-001", clientId: "c1", clientNom: "Benali", dossierId: "d1", montant: 850, statut: "en_attente", dateEmission: "2026-02-10", dateEcheance: "2026-03-10" },
    { id: "f2", reference: "FAC-2026-002", clientId: "c2", clientNom: "Duval", dossierId: "d3", montant: 1200, statut: "en_attente", dateEmission: "2026-03-01", dateEcheance: "2026-04-01" },
    { id: "f3", reference: "FAC-2026-003", clientId: "c5", clientNom: "Sanchez", dossierId: "d6", montant: 680, statut: "payee", dateEmission: "2026-01-22", dateEcheance: "2026-02-22" },
    { id: "f4", reference: "FAC-2026-004", clientId: "c4", clientNom: "Fournier", dossierId: "d5", montant: 450, statut: "en_attente", dateEmission: "2026-02-01", dateEcheance: "2026-03-01" },
    { id: "f5", reference: "FAC-2026-005", clientId: "c3", clientNom: "Moretti", dossierId: "d4", montant: 180, statut: "en_attente", dateEmission: "2026-02-20", dateEcheance: "2026-03-20" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-2026-001", clientId: "c2", clientNom: "Duval", dossierId: "d3", titre: "Gestion saison estivale — Villa Cap Ferret", montant: 4800, statut: "en_attente", dateEmission: "2026-02-15", dateValidite: "2026-03-15" },
    { id: "dv2", reference: "DEV-2026-002", clientId: "c4", clientNom: "Fournier", dossierId: "d5", titre: "Forfait gestion annuelle — Loft Paris", montant: 5400, statut: "accepte", dateEmission: "2025-12-20", dateValidite: "2026-01-20" },
    { id: "dv3", reference: "DEV-2026-003", clientId: "c1", clientNom: "Benali", titre: "Rénovation salle de bain T3 Marseille", montant: 3200, statut: "en_attente", dateEmission: "2026-02-25", dateValidite: "2026-03-25" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Nouveau séjour", description: "Réservation confirmée — T3 Marseille (Benali), arrivée le 10/02", date: "2026-02-08 09:00", lu: false, lien: "/admin/dossiers", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Paiement reçu", description: "Sanchez a réglé la facture FAC-2026-003 (680 €)", date: "2026-01-25 14:00", lu: true, lien: "/admin/facturation", destinataire: "admin" },
    { id: "n3", type: "message", titre: "Message propriétaire", description: "Duval demande des infos sur la saison estivale", date: "2026-02-09 10:15", lu: false, lien: "/admin/messagerie", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Check-out effectué", description: "Le check-out du Studio Cannes (Moretti) est terminé", date: "2026-02-25 11:00", lu: false, lien: "/admin/dossiers", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Bouazza", prenom: "Fatima", poste: "Agent d'entretien", statut: "disponible", couleur: "#6366f1", capaciteMax: 8 },
    { id: "demo-emp-2", nom: "Lahmidi", prenom: "Karim", poste: "Agent d'entretien", statut: "disponible", couleur: "#f59e0b", capaciteMax: 6 },
    { id: "demo-emp-3", nom: "Roche", prenom: "Marie", poste: "Responsable accueil", statut: "disponible", couleur: "#10b981", capaciteMax: 10 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-10" }],
    d4: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-02-20" }],
    d5: [
      { employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-01-01" },
      { employeeId: "demo-emp-1", role: "renfort", dateAssignation: "2026-01-01" },
    ],
  },
};

// ── RÉPARATEUR ──
const reparateurMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Dupont", prenom: "Marc", email: "m.dupont@gmail.com", telephone: "06 12 34 56 78", entreprise: "", statut: "actif", dateCreation: "2026-01-10", nombreDossiers: 2 },
    { id: "c2", nom: "Leblanc", prenom: "Sarah", email: "s.leblanc@hotmail.com", telephone: "06 23 45 67 89", entreprise: "", statut: "actif", dateCreation: "2026-01-15", nombreDossiers: 1 },
    { id: "c3", nom: "Nguyen", prenom: "Thierry", email: "t.nguyen@gmail.com", telephone: "06 34 56 78 90", entreprise: "Nguyen Électronique", statut: "actif", dateCreation: "2025-12-05", nombreDossiers: 3 },
    { id: "c4", nom: "Garcia", prenom: "Elena", email: "e.garcia@orange.fr", telephone: "06 45 67 89 01", entreprise: "", statut: "actif", dateCreation: "2026-02-01", nombreDossiers: 1 },
    { id: "c5", nom: "Petit", prenom: "Julien", email: "j.petit@free.fr", telephone: "06 56 78 90 12", entreprise: "", statut: "inactif", dateCreation: "2025-09-20", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "REP-2026-001", clientId: "c1", clientNom: "Dupont Marc", typePrestation: "iPhone 14 — Écran cassé", montant: 189, statut: "en_cours", dateCreation: "2026-02-15", dateEcheance: "2026-02-18" },
    { id: "d2", reference: "REP-2026-002", clientId: "c1", clientNom: "Dupont Marc", typePrestation: "iPad Air — Batterie", montant: 129, statut: "en_attente", dateCreation: "2026-02-20", dateEcheance: "2026-02-25" },
    { id: "d3", reference: "REP-2026-003", clientId: "c2", clientNom: "Leblanc Sarah", typePrestation: "Samsung S23 — Connecteur charge", montant: 89, statut: "en_cours", dateCreation: "2026-02-18", dateEcheance: "2026-02-20" },
    { id: "d4", reference: "REP-2026-004", clientId: "c3", clientNom: "Nguyen Thierry", typePrestation: "MacBook Pro — Clavier", montant: 350, statut: "en_cours", dateCreation: "2026-02-10", dateEcheance: "2026-02-17" },
    { id: "d5", reference: "REP-2026-005", clientId: "c3", clientNom: "Nguyen Thierry", typePrestation: "iPhone 13 — Caméra arrière", montant: 159, statut: "termine", dateCreation: "2026-01-20", dateEcheance: "2026-01-23" },
    { id: "d6", reference: "REP-2026-006", clientId: "c4", clientNom: "Garcia Elena", typePrestation: "Huawei P40 — Écran + Batterie", montant: 220, statut: "en_attente", dateCreation: "2026-02-22", dateEcheance: "2026-02-28" },
    { id: "d7", reference: "REP-2026-007", clientId: "c5", clientNom: "Petit Julien", typePrestation: "iPhone 12 — Bouton Home", montant: 79, statut: "termine", dateCreation: "2025-10-01", dateEcheance: "2025-10-03" },
  ],
  factures: [
    { id: "f1", reference: "FAC-2026-001", clientId: "c3", clientNom: "Nguyen Thierry", dossierId: "d5", montant: 159, statut: "payee", dateEmission: "2026-01-23", dateEcheance: "2026-02-23" },
    { id: "f2", reference: "FAC-2026-002", clientId: "c1", clientNom: "Dupont Marc", dossierId: "d1", montant: 189, statut: "en_attente", dateEmission: "2026-02-18", dateEcheance: "2026-03-18" },
    { id: "f3", reference: "FAC-2026-003", clientId: "c5", clientNom: "Petit Julien", dossierId: "d7", montant: 79, statut: "payee", dateEmission: "2025-10-03", dateEcheance: "2025-11-03" },
    { id: "f4", reference: "FAC-2026-004", clientId: "c3", clientNom: "Nguyen Thierry", dossierId: "d4", montant: 350, statut: "en_attente", dateEmission: "2026-02-17", dateEcheance: "2026-03-17" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-2026-001", clientId: "c1", clientNom: "Dupont Marc", dossierId: "d1", titre: "Remplacement écran iPhone 14", montant: 189, statut: "accepte", dateEmission: "2026-02-15", dateValidite: "2026-03-15" },
    { id: "dv2", reference: "DEV-2026-002", clientId: "c4", clientNom: "Garcia Elena", dossierId: "d6", titre: "Réparation écran + batterie Huawei P40", montant: 220, statut: "en_attente", dateEmission: "2026-02-22", dateValidite: "2026-03-22" },
    { id: "dv3", reference: "DEV-2026-003", clientId: "c3", clientNom: "Nguyen Thierry", dossierId: "d4", titre: "Remplacement clavier MacBook Pro", montant: 350, statut: "accepte", dateEmission: "2026-02-10", dateValidite: "2026-03-10" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Nouvel appareil reçu", description: "iPhone 14 de Dupont Marc — diagnostic en cours", date: "2026-02-15 10:00", lu: false, lien: "/admin/dossiers", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Paiement reçu", description: "Nguyen a réglé la facture FAC-2026-001 (159 €)", date: "2026-01-25 14:30", lu: true, lien: "/admin/facturation", destinataire: "admin" },
    { id: "n3", type: "dossier", titre: "Réparation terminée", description: "iPhone 13 de Nguyen — prêt à récupérer", date: "2026-01-23 16:00", lu: true, lien: "/admin/dossiers", destinataire: "admin" },
    { id: "n4", type: "devis", titre: "Nouveau devis", description: "Devis envoyé à Garcia pour Huawei P40 (220 €)", date: "2026-02-22 11:00", lu: false, lien: "/admin/dossiers", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Martin", prenom: "Kevin", poste: "Technicien", statut: "disponible", couleur: "#6366f1", capaciteMax: 10 },
    { id: "demo-emp-2", nom: "Rousseau", prenom: "Thomas", poste: "Technicien", statut: "disponible", couleur: "#f59e0b", capaciteMax: 8 },
    { id: "demo-emp-3", nom: "Faure", prenom: "Nadia", poste: "Accueil / Réception", statut: "disponible", couleur: "#10b981", capaciteMax: null },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-15" }],
    d3: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-18" }],
    d4: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-10" }],
  },
};

// [MBA] ── CENTRE ISLAMIQUE ── bible v3 section 6.6
// Client = "Élève", Employé = "Professeur"
// Messagerie groupée obligatoire : professeur → classe
const centreIslamiqueMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Benali", prenom: "Youssef", email: "y.benali@gmail.com", telephone: "06 12 34 56 78", entreprise: "", statut: "actif", dateCreation: "2025-09-01", nombreDossiers: 1 },
    { id: "c2", nom: "Haddad", prenom: "Amina", email: "a.haddad@hotmail.com", telephone: "06 23 45 67 89", entreprise: "", statut: "actif", dateCreation: "2025-09-01", nombreDossiers: 1 },
    { id: "c3", nom: "Cherif", prenom: "Ibrahim", email: "i.cherif@gmail.com", telephone: "06 34 56 78 90", entreprise: "", statut: "actif", dateCreation: "2025-10-10", nombreDossiers: 1 },
    { id: "c4", nom: "Mansouri", prenom: "Fatima-Zahra", email: "fz.mansouri@orange.fr", telephone: "06 45 67 89 01", entreprise: "", statut: "actif", dateCreation: "2025-09-01", nombreDossiers: 1 },
    { id: "c5", nom: "Khelifi", prenom: "Mohamed", email: "m.khelifi@free.fr", telephone: "06 56 78 90 12", entreprise: "", statut: "actif", dateCreation: "2026-01-15", nombreDossiers: 1 },
    { id: "c6", nom: "Touré", prenom: "Aïcha", email: "a.toure@gmail.com", telephone: "06 67 89 01 23", entreprise: "", statut: "inactif", dateCreation: "2024-09-01", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "INS-2025-001", clientId: "c1", clientNom: "Benali Youssef", typePrestation: "Coran — Niveau 2 (Hizb 5-10)", montant: 120, statut: "en_cours", dateCreation: "2025-09-01", dateEcheance: "2026-06-30" },
    { id: "d2", reference: "INS-2025-002", clientId: "c2", clientNom: "Haddad Amina", typePrestation: "Arabe — Niveau débutant", montant: 100, statut: "en_cours", dateCreation: "2025-09-01", dateEcheance: "2026-06-30" },
    { id: "d3", reference: "INS-2025-003", clientId: "c3", clientNom: "Cherif Ibrahim", typePrestation: "Coran — Niveau 3 (Hizb 11-20)", montant: 120, statut: "en_cours", dateCreation: "2025-10-10", dateEcheance: "2026-06-30" },
    { id: "d4", reference: "INS-2025-004", clientId: "c4", clientNom: "Mansouri Fatima-Zahra", typePrestation: "Fiqh + Aqida — Niveau intermédiaire", montant: 150, statut: "en_cours", dateCreation: "2025-09-01", dateEcheance: "2026-06-30" },
    { id: "d5", reference: "INS-2026-005", clientId: "c5", clientNom: "Khelifi Mohamed", typePrestation: "Coran — Niveau 1 (Juz Amma)", montant: 100, statut: "en_attente", dateCreation: "2026-01-15", dateEcheance: "2026-06-30" },
    { id: "d6", reference: "INS-2024-006", clientId: "c6", clientNom: "Touré Aïcha", typePrestation: "Arabe — Niveau avancé", montant: 120, statut: "termine", dateCreation: "2024-09-01", dateEcheance: "2025-06-30" },
  ],
  factures: [
    { id: "f1", reference: "COT-CI-001", clientId: "c1", clientNom: "Benali Youssef", dossierId: "d1", montant: 60, statut: "payee", dateEmission: "2025-09-01", dateEcheance: "2025-10-01", description: "Cotisation 1er semestre" },
    { id: "f2", reference: "COT-CI-002", clientId: "c1", clientNom: "Benali Youssef", dossierId: "d1", montant: 60, statut: "en_attente", dateEmission: "2026-01-01", dateEcheance: "2026-02-01", description: "Cotisation 2e semestre" },
    { id: "f3", reference: "COT-CI-003", clientId: "c2", clientNom: "Haddad Amina", dossierId: "d2", montant: 100, statut: "payee", dateEmission: "2025-09-01", dateEcheance: "2025-10-01" },
    { id: "f4", reference: "COT-CI-004", clientId: "c3", clientNom: "Cherif Ibrahim", dossierId: "d3", montant: 120, statut: "payee", dateEmission: "2025-10-10", dateEcheance: "2025-11-10" },
    { id: "f5", reference: "COT-CI-005", clientId: "c4", clientNom: "Mansouri Fatima-Zahra", dossierId: "d4", montant: 75, statut: "en_attente", dateEmission: "2026-01-01", dateEcheance: "2026-02-01", description: "2e semestre" },
    { id: "f6", reference: "COT-CI-006", clientId: "c5", clientNom: "Khelifi Mohamed", dossierId: "d5", montant: 100, statut: "en_attente", dateEmission: "2026-01-15", dateEcheance: "2026-02-15" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-CI-001", clientId: "c5", clientNom: "Khelifi Mohamed", dossierId: "d5", titre: "Inscription Coran Niveau 1 — Année 2025/2026", montant: 100, statut: "accepte", dateEmission: "2026-01-10", dateValidite: "2026-02-10" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Nouvelle inscription", description: "Khelifi Mohamed — demande inscription Coran Niveau 1", date: "2026-01-15 09:00", lu: false, lien: "/admin/dossiers", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Cotisation impayée", description: "Mansouri Fatima-Zahra — cotisation 2e semestre en retard (75 €)", date: "2026-02-05 08:00", lu: false, lien: "/admin/facturation", destinataire: "admin" },
    { id: "n3", type: "message", titre: "Message élève", description: "Benali Youssef demande un changement de créneau", date: "2026-02-08 10:00", lu: false, lien: "/admin/messagerie", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Évaluation périodique", description: "Cherif Ibrahim — évaluation Hizb 15 programmée", date: "2026-03-01 08:00", lu: false, lien: "/admin/dossiers", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "El Amrani", prenom: "Sheikh Hassan", poste: "Professeur Coran", statut: "disponible", couleur: "#6366f1", capaciteMax: 20 },
    { id: "demo-emp-2", nom: "Bakri", prenom: "Oum Khalid", poste: "Professeure Arabe", statut: "disponible", couleur: "#f59e0b", capaciteMax: 15 },
    { id: "demo-emp-3", nom: "Siddiqui", prenom: "Imam Tariq", poste: "Professeur Fiqh & Aqida", statut: "disponible", couleur: "#10b981", capaciteMax: 25 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-09-01" }],
    d2: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-09-01" }],
    d3: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-10-10" }],
    d4: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2025-09-01" }],
    d5: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-15" }],
  },
};

// ── ASSOCIATION SPORTIVE ──
const associationSportiveMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Mbappé", prenom: "Yanis", email: "y.mbappe@gmail.com", telephone: "06 12 34 56 78", entreprise: "", statut: "actif", dateCreation: "2025-09-01", nombreDossiers: 1 },
    { id: "c2", nom: "Diallo", prenom: "Amadou", email: "a.diallo@hotmail.com", telephone: "06 23 45 67 89", entreprise: "", statut: "actif", dateCreation: "2025-09-01", nombreDossiers: 1 },
    { id: "c3", nom: "Lefebvre", prenom: "Emma", email: "e.lefebvre@gmail.com", telephone: "06 34 56 78 90", entreprise: "", statut: "actif", dateCreation: "2025-10-15", nombreDossiers: 1 },
    { id: "c4", nom: "Ben Saïd", prenom: "Karim", email: "k.bensaid@orange.fr", telephone: "06 45 67 89 01", entreprise: "", statut: "actif", dateCreation: "2025-09-01", nombreDossiers: 1 },
    { id: "c5", nom: "Fernandez", prenom: "Lucas", email: "l.fernandez@free.fr", telephone: "06 56 78 90 12", entreprise: "", statut: "actif", dateCreation: "2026-01-10", nombreDossiers: 1 },
    { id: "c6", nom: "Koné", prenom: "Fatou", email: "f.kone@gmail.com", telephone: "06 67 89 01 23", entreprise: "", statut: "inactif", dateCreation: "2025-09-01", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "ADH-2025-001", clientId: "c1", clientNom: "Mbappé Yanis", typePrestation: "Adhésion U17 — Saison 2025/2026", montant: 280, statut: "en_cours", dateCreation: "2025-09-01", dateEcheance: "2026-06-30" },
    { id: "d2", reference: "ADH-2025-002", clientId: "c2", clientNom: "Diallo Amadou", typePrestation: "Adhésion Seniors — Saison 2025/2026", montant: 350, statut: "en_cours", dateCreation: "2025-09-01", dateEcheance: "2026-06-30" },
    { id: "d3", reference: "ADH-2025-003", clientId: "c3", clientNom: "Lefebvre Emma", typePrestation: "Adhésion Féminines — Saison 2025/2026", montant: 280, statut: "en_cours", dateCreation: "2025-10-15", dateEcheance: "2026-06-30" },
    { id: "d4", reference: "ADH-2025-004", clientId: "c4", clientNom: "Ben Saïd Karim", typePrestation: "Adhésion Seniors — Saison 2025/2026", montant: 350, statut: "en_cours", dateCreation: "2025-09-01", dateEcheance: "2026-06-30" },
    { id: "d5", reference: "ADH-2026-005", clientId: "c5", clientNom: "Fernandez Lucas", typePrestation: "Adhésion U15 — Saison 2025/2026", montant: 250, statut: "en_attente", dateCreation: "2026-01-10", dateEcheance: "2026-06-30" },
    { id: "d6", reference: "ADH-2025-006", clientId: "c6", clientNom: "Koné Fatou", typePrestation: "Adhésion Féminines — Saison 2024/2025", montant: 260, statut: "termine", dateCreation: "2024-09-01", dateEcheance: "2025-06-30" },
  ],
  factures: [
    { id: "f1", reference: "COT-2025-001", clientId: "c1", clientNom: "Mbappé Yanis", dossierId: "d1", montant: 280, statut: "payee", dateEmission: "2025-09-01", dateEcheance: "2025-10-01" },
    { id: "f2", reference: "COT-2025-002", clientId: "c2", clientNom: "Diallo Amadou", dossierId: "d2", montant: 350, statut: "payee", dateEmission: "2025-09-01", dateEcheance: "2025-10-01" },
    { id: "f3", reference: "COT-2025-003", clientId: "c3", clientNom: "Lefebvre Emma", dossierId: "d3", montant: 280, statut: "payee", dateEmission: "2025-10-15", dateEcheance: "2025-11-15" },
    { id: "f4", reference: "COT-2025-004", clientId: "c4", clientNom: "Ben Saïd Karim", dossierId: "d4", montant: 175, statut: "en_attente", dateEmission: "2026-01-01", dateEcheance: "2026-02-01", description: "2e échéance cotisation" },
    { id: "f5", reference: "COT-2026-005", clientId: "c5", clientNom: "Fernandez Lucas", dossierId: "d5", montant: 250, statut: "en_attente", dateEmission: "2026-01-10", dateEcheance: "2026-02-10" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-2026-001", clientId: "c5", clientNom: "Fernandez Lucas", dossierId: "d5", titre: "Cotisation U15 — Saison 2025/2026 (arrivée en cours)", montant: 250, statut: "accepte", dateEmission: "2026-01-08", dateValidite: "2026-02-08" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Nouvelle adhésion", description: "Fernandez Lucas — demande d'adhésion U15", date: "2026-01-10 09:00", lu: false, lien: "/admin/dossiers", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Cotisation impayée", description: "Ben Saïd Karim — 2e échéance en retard (175 €)", date: "2026-02-05 08:00", lu: false, lien: "/admin/facturation", destinataire: "admin" },
    { id: "n3", type: "message", titre: "Message membre", description: "Diallo Amadou demande un certificat médical", date: "2026-02-09 10:00", lu: false, lien: "/admin/messagerie", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Dubois", prenom: "Cédric", poste: "Entraîneur Seniors", statut: "disponible", couleur: "#6366f1", capaciteMax: 25 },
    { id: "demo-emp-2", nom: "Traoré", prenom: "Moussa", poste: "Entraîneur U17/U15", statut: "disponible", couleur: "#f59e0b", capaciteMax: 20 },
    { id: "demo-emp-3", nom: "Garnier", prenom: "Sophie", poste: "Entraîneuse Féminines", statut: "disponible", couleur: "#10b981", capaciteMax: 20 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-09-01" }],
    d2: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-09-01" }],
    d3: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2025-10-15" }],
    d4: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-09-01" }],
    d5: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-01-10" }],
  },
};

// ── COACH SPORTIF ──
const coachSportifMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Lemaire", prenom: "Julie", email: "j.lemaire@gmail.com", telephone: "06 12 34 56 78", entreprise: "", statut: "actif", dateCreation: "2025-11-01", nombreDossiers: 1 },
    { id: "c2", nom: "Boucher", prenom: "Maxime", email: "m.boucher@hotmail.com", telephone: "06 23 45 67 89", entreprise: "", statut: "actif", dateCreation: "2025-12-10", nombreDossiers: 1 },
    { id: "c3", nom: "Rousseau", prenom: "Chloé", email: "c.rousseau@gmail.com", telephone: "06 34 56 78 90", entreprise: "", statut: "actif", dateCreation: "2026-01-05", nombreDossiers: 1 },
    { id: "c4", nom: "Dembélé", prenom: "Ibrahim", email: "i.dembele@orange.fr", telephone: "06 45 67 89 01", entreprise: "", statut: "actif", dateCreation: "2025-10-15", nombreDossiers: 1 },
    { id: "c5", nom: "Perrin", prenom: "Nathalie", email: "n.perrin@free.fr", telephone: "06 56 78 90 12", entreprise: "", statut: "actif", dateCreation: "2026-02-01", nombreDossiers: 1 },
    { id: "c6", nom: "Morel", prenom: "Antoine", email: "a.morel@gmail.com", telephone: "06 67 89 01 23", entreprise: "", statut: "inactif", dateCreation: "2025-06-01", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "SPO-2026-001", clientId: "c1", clientNom: "Lemaire Julie", typePrestation: "Abonnement Premium — Perte de poids", montant: 1200, statut: "en_cours", dateCreation: "2025-11-01", dateEcheance: "2026-04-30" },
    { id: "d2", reference: "SPO-2026-002", clientId: "c2", clientNom: "Boucher Maxime", typePrestation: "Pack Musculation 3 mois", montant: 600, statut: "en_cours", dateCreation: "2025-12-10", dateEcheance: "2026-03-10" },
    { id: "d3", reference: "SPO-2026-003", clientId: "c3", clientNom: "Rousseau Chloé", typePrestation: "Coaching individuel — Remise en forme", montant: 900, statut: "en_cours", dateCreation: "2026-01-05", dateEcheance: "2026-07-05" },
    { id: "d4", reference: "SPO-2026-004", clientId: "c4", clientNom: "Dembélé Ibrahim", typePrestation: "Abonnement annuel — Cross Training", montant: 1800, statut: "en_cours", dateCreation: "2025-10-15", dateEcheance: "2026-10-15" },
    { id: "d5", reference: "SPO-2026-005", clientId: "c5", clientNom: "Perrin Nathalie", typePrestation: "Bilan initial + Programme personnalisé", montant: 150, statut: "en_attente", dateCreation: "2026-02-01", dateEcheance: "2026-02-15" },
    { id: "d6", reference: "SPO-2025-006", clientId: "c6", clientNom: "Morel Antoine", typePrestation: "Pack 10 séances — Préparation marathon", montant: 450, statut: "termine", dateCreation: "2025-06-01", dateEcheance: "2025-09-30" },
  ],
  factures: [
    { id: "f1", reference: "FAC-2026-001", clientId: "c1", clientNom: "Lemaire Julie", dossierId: "d1", montant: 200, statut: "payee", dateEmission: "2026-02-01", dateEcheance: "2026-03-01", description: "Mensualité février" },
    { id: "f2", reference: "FAC-2026-002", clientId: "c2", clientNom: "Boucher Maxime", dossierId: "d2", montant: 600, statut: "payee", dateEmission: "2025-12-10", dateEcheance: "2026-01-10" },
    { id: "f3", reference: "FAC-2026-003", clientId: "c3", clientNom: "Rousseau Chloé", dossierId: "d3", montant: 150, statut: "en_attente", dateEmission: "2026-01-05", dateEcheance: "2026-02-05", description: "1ère mensualité" },
    { id: "f4", reference: "FAC-2026-004", clientId: "c4", clientNom: "Dembélé Ibrahim", dossierId: "d4", montant: 150, statut: "en_attente", dateEmission: "2026-02-15", dateEcheance: "2026-03-15", description: "Mensualité mars" },
    { id: "f5", reference: "FAC-2026-005", clientId: "c5", clientNom: "Perrin Nathalie", dossierId: "d5", montant: 150, statut: "en_attente", dateEmission: "2026-02-01", dateEcheance: "2026-03-01" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-2026-001", clientId: "c5", clientNom: "Perrin Nathalie", dossierId: "d5", titre: "Bilan initial + Programme 6 mois", montant: 900, statut: "en_attente", dateEmission: "2026-02-01", dateValidite: "2026-03-01" },
    { id: "dv2", reference: "DEV-2025-002", clientId: "c4", clientNom: "Dembélé Ibrahim", dossierId: "d4", titre: "Abonnement annuel Cross Training", montant: 1800, statut: "accepte", dateEmission: "2025-10-10", dateValidite: "2025-11-10" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Nouveau client", description: "Perrin Nathalie — demande bilan initial", date: "2026-02-01 09:00", lu: false, lien: "/admin/dossiers", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Mensualité payée", description: "Lemaire Julie a réglé sa mensualité février (200 €)", date: "2026-02-03 10:00", lu: true, lien: "/admin/facturation", destinataire: "admin" },
    { id: "n3", type: "message", titre: "Message client", description: "Boucher Maxime demande à changer d'horaire", date: "2026-02-09 08:30", lu: false, lien: "/admin/messagerie", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Bilan intermédiaire", description: "Dembélé Ibrahim — bilan à programmer (6 mois écoulés)", date: "2026-04-15 08:00", lu: false, lien: "/admin/dossiers", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Marchand", prenom: "Sophie", poste: "Coach", statut: "disponible", couleur: "#6366f1", capaciteMax: 15 },
    { id: "demo-emp-2", nom: "Da Silva", prenom: "Alexandre", poste: "Coach", statut: "disponible", couleur: "#f59e0b", capaciteMax: 15 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-11-01" }],
    d2: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-12-10" }],
    d3: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-05" }],
    d4: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-10-15" }],
    d5: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-01" }],
  },
};

// [MBA] ── NETTOYAGE ── bible v3 section 6.4 — B2B, syndics, contrats de nettoyage
const nettoyageMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Résidence Les Pins", prenom: "", email: "syndic.lespins@immo.fr", telephone: "04 91 23 45 67", entreprise: "Syndic Foncia", statut: "actif", dateCreation: "2025-09-01", nombreDossiers: 3 },
    { id: "c2", nom: "Cabinet Médical Pasteur", prenom: "", email: "contact@cabinet-pasteur.fr", telephone: "04 91 34 56 78", entreprise: "Dr. Morel & Associés", statut: "actif", dateCreation: "2025-10-15", nombreDossiers: 2 },
    { id: "c3", nom: "Hôtel Le Panoramic", prenom: "", email: "direction@hotel-panoramic.com", telephone: "04 93 45 67 89", entreprise: "SAS Panoramic", statut: "actif", dateCreation: "2025-11-20", nombreDossiers: 2 },
    { id: "c4", nom: "Boulangerie Martin", prenom: "", email: "martin.boulangerie@gmail.com", telephone: "06 12 34 56 78", entreprise: "SARL Martin", statut: "actif", dateCreation: "2026-01-05", nombreDossiers: 1 },
    { id: "c5", nom: "Copropriété Belvédère", prenom: "", email: "syndic.belvedere@nexity.fr", telephone: "04 91 56 78 90", entreprise: "Nexity Syndic", statut: "actif", dateCreation: "2025-08-10", nombreDossiers: 2 },
  ],
  dossiers: [
    { id: "d1", reference: "NET-2026-001", clientId: "c1", clientNom: "Résidence Les Pins", typePrestation: "Nettoyage parties communes", montant: 1200, statut: "en_cours", dateCreation: "2026-01-15", dateEcheance: "2026-12-31" },
    { id: "d2", reference: "NET-2026-002", clientId: "c2", clientNom: "Cabinet Médical Pasteur", typePrestation: "Nettoyage quotidien cabinet", montant: 890, statut: "en_cours", dateCreation: "2026-01-20", dateEcheance: "2026-06-30" },
    { id: "d3", reference: "NET-2026-003", clientId: "c3", clientNom: "Hôtel Le Panoramic", typePrestation: "Nettoyage chambres + espaces communs", montant: 3500, statut: "en_attente", dateCreation: "2026-02-01", dateEcheance: "2026-12-31" },
    { id: "d4", reference: "NET-2026-004", clientId: "c1", clientNom: "Résidence Les Pins", typePrestation: "Nettoyage vitres trimestriel", montant: 480, statut: "en_cours", dateCreation: "2026-02-10", dateEcheance: "2026-03-15" },
    { id: "d5", reference: "NET-2026-005", clientId: "c4", clientNom: "Boulangerie Martin", typePrestation: "Nettoyage de fond", montant: 350, statut: "termine", dateCreation: "2026-01-25", dateEcheance: "2026-01-27" },
    { id: "d6", reference: "NET-2026-006", clientId: "c5", clientNom: "Copropriété Belvédère", typePrestation: "Entretien espaces verts + parties communes", montant: 1800, statut: "en_cours", dateCreation: "2025-09-01", dateEcheance: "2026-08-31" },
    { id: "d7", reference: "NET-2026-007", clientId: "c5", clientNom: "Copropriété Belvédère", typePrestation: "Remise en état post-travaux", montant: 650, statut: "termine", dateCreation: "2026-01-10", dateEcheance: "2026-01-14" },
  ],
  factures: [
    { id: "f1", reference: "FAC-NET-001", clientId: "c1", clientNom: "Résidence Les Pins", dossierId: "d1", montant: 1200, statut: "en_attente", dateEmission: "2026-02-01", dateEcheance: "2026-03-01" },
    { id: "f2", reference: "FAC-NET-002", clientId: "c2", clientNom: "Cabinet Médical Pasteur", dossierId: "d2", montant: 890, statut: "payee", dateEmission: "2026-01-20", dateEcheance: "2026-02-20" },
    { id: "f3", reference: "FAC-NET-003", clientId: "c4", clientNom: "Boulangerie Martin", dossierId: "d5", montant: 350, statut: "payee", dateEmission: "2026-01-27", dateEcheance: "2026-02-27" },
    { id: "f4", reference: "FAC-NET-004", clientId: "c5", clientNom: "Copropriété Belvédère", dossierId: "d6", montant: 900, statut: "en_attente", dateEmission: "2026-02-01", dateEcheance: "2026-03-01" },
    { id: "f5", reference: "FAC-NET-005", clientId: "c5", clientNom: "Copropriété Belvédère", dossierId: "d7", montant: 650, statut: "payee", dateEmission: "2026-01-14", dateEcheance: "2026-02-14" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-NET-001", clientId: "c3", clientNom: "Hôtel Le Panoramic", dossierId: "d3", titre: "Contrat annuel nettoyage hôtelier", montant: 42000, statut: "en_attente", dateEmission: "2026-02-01", dateValidite: "2026-03-01" },
    { id: "dv2", reference: "DEV-NET-002", clientId: "c1", clientNom: "Résidence Les Pins", dossierId: "d4", titre: "Nettoyage vitres Q1 2026", montant: 480, statut: "accepte", dateEmission: "2026-02-05", dateValidite: "2026-03-05" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Nouvelle intervention", description: "Contrat nettoyage quotidien signé — Cabinet Médical Pasteur", date: "2026-01-20 08:30", lu: false, lien: "/admin/dossiers", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Paiement reçu", description: "Boulangerie Martin a réglé la facture FAC-NET-003 (350 €)", date: "2026-01-30 14:00", lu: true, lien: "/admin/facturation", destinataire: "admin" },
    { id: "n3", type: "dossier", titre: "Rapport envoyé", description: "Rapport d'intervention Copropriété Belvédère — remise en état terminée", date: "2026-01-14 17:00", lu: false, lien: "/admin/dossiers", destinataire: "admin" },
    { id: "n4", type: "message", titre: "Nouveau message", description: "Hôtel Le Panoramic demande un devis pour nettoyage événementiel", date: "2026-02-05 09:45", lu: false, lien: "/admin/messagerie", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Diallo", prenom: "Aminata", poste: "Agent de nettoyage", statut: "disponible", couleur: "#6366f1", capaciteMax: 8 },
    { id: "demo-emp-2", nom: "Pereira", prenom: "Carlos", poste: "Agent de nettoyage", statut: "disponible", couleur: "#f59e0b", capaciteMax: 8 },
    { id: "demo-emp-3", nom: "Blanc", prenom: "Sophie", poste: "Responsable de site", statut: "disponible", couleur: "#10b981", capaciteMax: 12 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-15" }],
    d2: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-01-20" }],
    d6: [
      { employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2025-09-01" },
      { employeeId: "demo-emp-1", role: "renfort", dateAssignation: "2025-09-01" },
    ],
  },
};

// ── GARAGES ──

const garagesMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Dupont", prenom: "Michel", email: "michel.dupont@orange.fr", telephone: "06 12 34 56 78", entreprise: "", statut: "actif", dateCreation: "2025-09-15", nombreDossiers: 2 },
    { id: "c2", nom: "Fernandez", prenom: "Carlos", email: "carlos.fernandez@gmail.com", telephone: "06 23 45 67 89", entreprise: "", statut: "actif", dateCreation: "2025-11-02", nombreDossiers: 1 },
    { id: "c3", nom: "Moreau", prenom: "Christine", email: "c.moreau@free.fr", telephone: "06 34 56 78 90", entreprise: "", statut: "actif", dateCreation: "2026-01-10", nombreDossiers: 2 },
    { id: "c4", nom: "Benali", prenom: "Karim", email: "k.benali@hotmail.fr", telephone: "06 45 67 89 01", entreprise: "Transports Benali", statut: "actif", dateCreation: "2026-02-05", nombreDossiers: 1 },
    { id: "c5", nom: "Leroy", prenom: "Nathalie", email: "nathalie.leroy@laposte.net", telephone: "06 56 78 90 12", entreprise: "", statut: "inactif", dateCreation: "2025-06-20", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "GAR-2026-001", clientId: "c1", clientNom: "Michel Dupont", typePrestation: "Vidange + filtres — Renault Clio IV", montant: 189, statut: "termine", dateCreation: "2026-01-20", dateEcheance: "2026-01-22" },
    { id: "d2", reference: "GAR-2026-002", clientId: "c1", clientNom: "Michel Dupont", typePrestation: "Remplacement plaquettes de frein — Peugeot 308", montant: 320, statut: "en_cours", dateCreation: "2026-03-10", dateEcheance: "2026-03-14" },
    { id: "d3", reference: "GAR-2026-003", clientId: "c2", clientNom: "Carlos Fernandez", typePrestation: "Carrosserie aile avant gauche — BMW X3", montant: 1450, statut: "en_cours", dateCreation: "2026-03-05", dateEcheance: "2026-03-25" },
    { id: "d4", reference: "GAR-2026-004", clientId: "c3", clientNom: "Christine Moreau", typePrestation: "Contrôle technique + réparations — Citroën C3", montant: 540, statut: "en_attente", dateCreation: "2026-03-18", dateEcheance: "2026-04-01" },
    { id: "d5", reference: "GAR-2026-005", clientId: "c3", clientNom: "Christine Moreau", typePrestation: "Climatisation recharge + diagnostic — Toyota Yaris", montant: 210, statut: "termine", dateCreation: "2026-02-12", dateEcheance: "2026-02-14" },
    { id: "d6", reference: "GAR-2026-006", clientId: "c4", clientNom: "Karim Benali", typePrestation: "Révision complète 100 000 km — Renault Master", montant: 890, statut: "en_cours", dateCreation: "2026-03-15", dateEcheance: "2026-03-28" },
    { id: "d7", reference: "GAR-2026-007", clientId: "c5", clientNom: "Nathalie Leroy", typePrestation: "Embrayage complet — Volkswagen Golf VII", montant: 1200, statut: "termine", dateCreation: "2025-10-05", dateEcheance: "2025-10-15" },
  ],
  factures: [
    { id: "f1", reference: "FAC-GAR-001", clientId: "c1", clientNom: "Michel Dupont", dossierId: "d1", montant: 189, statut: "payee", dateEmission: "2026-01-22", dateEcheance: "2026-02-22", description: "Vidange + filtres Renault Clio IV" },
    { id: "f2", reference: "FAC-GAR-002", clientId: "c3", clientNom: "Christine Moreau", dossierId: "d5", montant: 210, statut: "payee", dateEmission: "2026-02-14", dateEcheance: "2026-03-14", description: "Recharge climatisation Toyota Yaris" },
    { id: "f3", reference: "FAC-GAR-003", clientId: "c5", clientNom: "Nathalie Leroy", dossierId: "d7", montant: 1200, statut: "en_retard", dateEmission: "2025-10-15", dateEcheance: "2025-11-15", description: "Embrayage complet Volkswagen Golf VII" },
    { id: "f4", reference: "FAC-GAR-004", clientId: "c2", clientNom: "Carlos Fernandez", dossierId: "d3", montant: 725, statut: "en_attente", dateEmission: "2026-03-10", dateEcheance: "2026-04-10", description: "Acompte carrosserie BMW X3 (50%)" },
    { id: "f5", reference: "FAC-GAR-005", clientId: "c4", clientNom: "Karim Benali", dossierId: "d6", montant: 890, statut: "en_attente", dateEmission: "2026-03-20", dateEcheance: "2026-04-20", description: "Révision 100 000 km Renault Master" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-GAR-001", clientId: "c3", clientNom: "Christine Moreau", dossierId: "d4", titre: "Contrôle technique + réparations Citroën C3", montant: 540, statut: "en_attente", dateEmission: "2026-03-18", dateValidite: "2026-04-18" },
    { id: "dv2", reference: "DEV-GAR-002", clientId: "c2", clientNom: "Carlos Fernandez", dossierId: "d3", titre: "Réparation carrosserie aile AVG BMW X3", montant: 1450, statut: "accepte", dateEmission: "2026-03-05", dateValidite: "2026-04-05" },
    { id: "dv3", reference: "DEV-GAR-003", clientId: "c1", clientNom: "Michel Dupont", dossierId: "d2", titre: "Plaquettes + disques de frein Peugeot 308", montant: 320, statut: "accepte", dateEmission: "2026-03-10", dateValidite: "2026-04-10" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Véhicule prêt à récupérer", description: "La Renault Clio IV de M. Dupont est prête — vidange terminée.", date: "2026-01-22", lu: true, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n2", type: "devis", titre: "Devis en attente de validation", description: "Le devis pour le contrôle technique de Mme Moreau attend sa réponse.", date: "2026-03-18", lu: false, lien: "/admin/dossiers/d4", destinataire: "admin" },
    { id: "n3", type: "facture", titre: "Facture en retard", description: "La facture de Mme Leroy (embrayage Golf VII) est impayée depuis 4 mois.", date: "2026-03-15", lu: false, lien: "/admin/dossiers/d7", destinataire: "admin" },
    { id: "n4", type: "message", titre: "Nouveau message de M. Benali", description: "Karim Benali demande une mise à jour sur la révision de son Renault Master.", date: "2026-03-20", lu: false, lien: "/admin/dossiers/d6", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Morel", prenom: "Kevin", poste: "Mécanicien senior", statut: "disponible", couleur: "#3B82F6", capaciteMax: 5 },
    { id: "demo-emp-2", nom: "Da Silva", prenom: "Thomas", poste: "Mécanicien", statut: "disponible", couleur: "#10B981", capaciteMax: 4 },
    { id: "demo-emp-3", nom: "Boucher", prenom: "Jérôme", poste: "Carrossier", statut: "disponible", couleur: "#F59E0B", capaciteMax: 3 },
  ],
  assignments: {
    d2: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-03-10" }],
    d3: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-03-05" }],
    d4: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-18" }],
    d6: [
      { employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-03-15" },
      { employeeId: "demo-emp-2", role: "renfort", dateAssignation: "2026-03-16" },
    ],
  },
};

// ── BTP ──

const btpMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Lambert", prenom: "Pierre", email: "pierre.lambert@gmail.com", telephone: "06 11 22 33 44", entreprise: "", statut: "actif", dateCreation: "2025-10-01", nombreDossiers: 2 },
    { id: "c2", nom: "Rousseau", prenom: "Isabelle", email: "isabelle.rousseau@orange.fr", telephone: "06 22 33 44 55", entreprise: "", statut: "actif", dateCreation: "2025-12-15", nombreDossiers: 1 },
    { id: "c3", nom: "Garnier", prenom: "Jean-Marc", email: "jm.garnier@free.fr", telephone: "06 33 44 55 66", entreprise: "SCI Garnier", statut: "actif", dateCreation: "2026-01-08", nombreDossiers: 2 },
    { id: "c4", nom: "Petit", prenom: "Sylvie", email: "sylvie.petit@laposte.net", telephone: "06 44 55 66 77", entreprise: "", statut: "actif", dateCreation: "2026-02-20", nombreDossiers: 1 },
    { id: "c5", nom: "Durand", prenom: "François", email: "f.durand@hotmail.fr", telephone: "06 55 66 77 88", entreprise: "Restaurant Le Provençal", statut: "inactif", dateCreation: "2025-05-10", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "BTP-2026-001", clientId: "c1", clientNom: "Pierre Lambert", typePrestation: "Rénovation cuisine complète", montant: 12500, statut: "en_cours", dateCreation: "2026-01-15", dateEcheance: "2026-04-15" },
    { id: "d2", reference: "BTP-2026-002", clientId: "c1", clientNom: "Pierre Lambert", typePrestation: "Réfection salle de bain", montant: 8900, statut: "en_attente", dateCreation: "2026-03-01", dateEcheance: "2026-06-01" },
    { id: "d3", reference: "BTP-2026-003", clientId: "c2", clientNom: "Isabelle Rousseau", typePrestation: "Extension garage — 25 m²", montant: 22000, statut: "en_cours", dateCreation: "2025-12-20", dateEcheance: "2026-05-30" },
    { id: "d4", reference: "BTP-2026-004", clientId: "c3", clientNom: "Jean-Marc Garnier", typePrestation: "Ravalement façade immeuble", montant: 35000, statut: "en_cours", dateCreation: "2026-02-01", dateEcheance: "2026-07-01" },
    { id: "d5", reference: "BTP-2026-005", clientId: "c3", clientNom: "Jean-Marc Garnier", typePrestation: "Isolation combles — Lot 3", montant: 6200, statut: "en_attente", dateCreation: "2026-03-10", dateEcheance: "2026-04-30" },
    { id: "d6", reference: "BTP-2026-006", clientId: "c4", clientNom: "Sylvie Petit", typePrestation: "Terrasse bois + pergola", montant: 9800, statut: "en_cours", dateCreation: "2026-02-25", dateEcheance: "2026-04-25" },
    { id: "d7", reference: "BTP-2026-007", clientId: "c5", clientNom: "François Durand", typePrestation: "Mise aux normes cuisine professionnelle", montant: 18500, statut: "termine", dateCreation: "2025-06-01", dateEcheance: "2025-09-30" },
  ],
  factures: [
    { id: "f1", reference: "FAC-BTP-001", clientId: "c1", clientNom: "Pierre Lambert", dossierId: "d1", montant: 6250, statut: "payee", dateEmission: "2026-01-20", dateEcheance: "2026-02-20", description: "Acompte 50% — Rénovation cuisine" },
    { id: "f2", reference: "FAC-BTP-002", clientId: "c2", clientNom: "Isabelle Rousseau", dossierId: "d3", montant: 11000, statut: "payee", dateEmission: "2026-01-05", dateEcheance: "2026-02-05", description: "Acompte 50% — Extension garage" },
    { id: "f3", reference: "FAC-BTP-003", clientId: "c3", clientNom: "Jean-Marc Garnier", dossierId: "d4", montant: 10500, statut: "en_attente", dateEmission: "2026-03-01", dateEcheance: "2026-04-01", description: "1er appel de fonds 30% — Ravalement façade" },
    { id: "f4", reference: "FAC-BTP-004", clientId: "c5", clientNom: "François Durand", dossierId: "d7", montant: 18500, statut: "payee", dateEmission: "2025-10-01", dateEcheance: "2025-11-01", description: "Solde — Mise aux normes cuisine pro" },
    { id: "f5", reference: "FAC-BTP-005", clientId: "c4", clientNom: "Sylvie Petit", dossierId: "d6", montant: 4900, statut: "en_attente", dateEmission: "2026-03-01", dateEcheance: "2026-04-01", description: "Acompte 50% — Terrasse bois + pergola" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-BTP-001", clientId: "c1", clientNom: "Pierre Lambert", dossierId: "d2", titre: "Réfection complète salle de bain — Carrelage + plomberie", montant: 8900, statut: "en_attente", dateEmission: "2026-03-01", dateValidite: "2026-04-01" },
    { id: "dv2", reference: "DEV-BTP-002", clientId: "c3", clientNom: "Jean-Marc Garnier", dossierId: "d5", titre: "Isolation combles perdus — Laine soufflée 30 cm", montant: 6200, statut: "accepte", dateEmission: "2026-03-10", dateValidite: "2026-04-10" },
    { id: "dv3", reference: "DEV-BTP-003", clientId: "c4", clientNom: "Sylvie Petit", dossierId: "d6", titre: "Terrasse bois exotique 20 m² + pergola aluminium", montant: 9800, statut: "accepte", dateEmission: "2026-02-25", dateValidite: "2026-03-25" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Visite technique planifiée", description: "Visite technique chez Mme Rousseau pour l'extension garage prévue le 28 mars.", date: "2026-03-20", lu: false, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n2", type: "devis", titre: "Devis en attente — Salle de bain Lambert", description: "Le devis pour la salle de bain de M. Lambert n'a pas encore été validé.", date: "2026-03-15", lu: false, lien: "/admin/dossiers/d2", destinataire: "admin" },
    { id: "n3", type: "facture", titre: "Paiement reçu — Acompte extension", description: "Mme Rousseau a réglé l'acompte de 11 000 € pour l'extension garage.", date: "2026-01-10", lu: true, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Chantier terminé", description: "Le chantier de mise aux normes cuisine pro (Restaurant Le Provençal) est clôturé.", date: "2025-10-01", lu: true, lien: "/admin/dossiers/d7", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Brahim", prenom: "Youssef", poste: "Chef de chantier", statut: "disponible", couleur: "#3B82F6", capaciteMax: 4 },
    { id: "demo-emp-2", nom: "Martins", prenom: "Paulo", poste: "Ouvrier qualifié", statut: "disponible", couleur: "#10B981", capaciteMax: 3 },
    { id: "demo-emp-3", nom: "Fontaine", prenom: "Lucas", poste: "Plaquiste / Peintre", statut: "disponible", couleur: "#F59E0B", capaciteMax: 3 },
  ],
  assignments: {
    d1: [
      { employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-15" },
      { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-01" },
    ],
    d3: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-12-20" }],
    d4: [
      { employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-01" },
      { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-10" },
    ],
    d6: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-25" }],
  },
};

// ── BOUTIQUE ──

const boutiqueMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Martin", prenom: "Sophie", email: "sophie.martin@gmail.com", telephone: "06 10 20 30 40", entreprise: "", statut: "actif", dateCreation: "2025-08-10", nombreDossiers: 2 },
    { id: "c2", nom: "Bernard", prenom: "Élodie", email: "elodie.bernard@yahoo.fr", telephone: "06 20 30 40 50", entreprise: "", statut: "actif", dateCreation: "2025-11-25", nombreDossiers: 1 },
    { id: "c3", nom: "Girard", prenom: "Antoine", email: "a.girard@orange.fr", telephone: "06 30 40 50 60", entreprise: "Girard & Fils", statut: "actif", dateCreation: "2026-01-05", nombreDossiers: 2 },
    { id: "c4", nom: "Lefebvre", prenom: "Camille", email: "camille.lefebvre@free.fr", telephone: "06 40 50 60 70", entreprise: "", statut: "actif", dateCreation: "2026-02-14", nombreDossiers: 1 },
    { id: "c5", nom: "Roux", prenom: "Marc", email: "marc.roux@laposte.net", telephone: "06 50 60 70 80", entreprise: "", statut: "inactif", dateCreation: "2025-04-18", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "MAG-2026-001", clientId: "c1", clientNom: "Sophie Martin", typePrestation: "Commande spéciale — Robe de soirée sur mesure", montant: 380, statut: "en_cours", dateCreation: "2026-03-01", dateEcheance: "2026-03-20" },
    { id: "d2", reference: "MAG-2026-002", clientId: "c1", clientNom: "Sophie Martin", typePrestation: "Retouche manteau cachemire", montant: 65, statut: "termine", dateCreation: "2026-02-10", dateEcheance: "2026-02-17" },
    { id: "d3", reference: "MAG-2026-003", clientId: "c2", clientNom: "Élodie Bernard", typePrestation: "Commande grossiste — Accessoires été 2026", montant: 1250, statut: "en_attente", dateCreation: "2026-03-12", dateEcheance: "2026-04-15" },
    { id: "d4", reference: "MAG-2026-004", clientId: "c3", clientNom: "Antoine Girard", typePrestation: "Réparation sous garantie — Montre automatique", montant: 0, statut: "en_cours", dateCreation: "2026-03-05", dateEcheance: "2026-03-30" },
    { id: "d5", reference: "MAG-2026-005", clientId: "c3", clientNom: "Antoine Girard", typePrestation: "Gravure personnalisée — Bracelet argent", montant: 95, statut: "termine", dateCreation: "2026-02-14", dateEcheance: "2026-02-20" },
    { id: "d6", reference: "MAG-2026-006", clientId: "c4", clientNom: "Camille Lefebvre", typePrestation: "Commande spéciale — Sac en cuir italien", montant: 420, statut: "en_cours", dateCreation: "2026-03-10", dateEcheance: "2026-04-10" },
    { id: "d7", reference: "MAG-2026-007", clientId: "c5", clientNom: "Marc Roux", typePrestation: "Échange article — Costume 3 pièces", montant: 0, statut: "termine", dateCreation: "2025-05-01", dateEcheance: "2025-05-10" },
  ],
  factures: [
    { id: "f1", reference: "FAC-MAG-001", clientId: "c1", clientNom: "Sophie Martin", dossierId: "d2", montant: 65, statut: "payee", dateEmission: "2026-02-17", dateEcheance: "2026-03-17", description: "Retouche manteau cachemire" },
    { id: "f2", reference: "FAC-MAG-002", clientId: "c3", clientNom: "Antoine Girard", dossierId: "d5", montant: 95, statut: "payee", dateEmission: "2026-02-20", dateEcheance: "2026-03-20", description: "Gravure personnalisée bracelet argent" },
    { id: "f3", reference: "FAC-MAG-003", clientId: "c1", clientNom: "Sophie Martin", dossierId: "d1", montant: 190, statut: "en_attente", dateEmission: "2026-03-05", dateEcheance: "2026-04-05", description: "Acompte 50% — Robe de soirée sur mesure" },
    { id: "f4", reference: "FAC-MAG-004", clientId: "c4", clientNom: "Camille Lefebvre", dossierId: "d6", montant: 420, statut: "en_attente", dateEmission: "2026-03-10", dateEcheance: "2026-04-10", description: "Sac en cuir italien — commande spéciale" },
    { id: "f5", reference: "FAC-MAG-005", clientId: "c2", clientNom: "Élodie Bernard", dossierId: "d3", montant: 1250, statut: "en_attente", dateEmission: "2026-03-15", dateEcheance: "2026-04-15", description: "Commande grossiste accessoires été 2026" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-MAG-001", clientId: "c1", clientNom: "Sophie Martin", dossierId: "d1", titre: "Robe de soirée sur mesure — Tissu satin + retouches", montant: 380, statut: "accepte", dateEmission: "2026-02-25", dateValidite: "2026-03-25" },
    { id: "dv2", reference: "DEV-MAG-002", clientId: "c2", clientNom: "Élodie Bernard", dossierId: "d3", titre: "Lot accessoires été 2026 — 50 pièces", montant: 1250, statut: "en_attente", dateEmission: "2026-03-12", dateValidite: "2026-04-12" },
    { id: "dv3", reference: "DEV-MAG-003", clientId: "c4", clientNom: "Camille Lefebvre", dossierId: "d6", titre: "Sac cuir italien fait main — Modèle Florence", montant: 420, statut: "accepte", dateEmission: "2026-03-08", dateValidite: "2026-04-08" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Commande spéciale prête", description: "La gravure du bracelet pour M. Girard est terminée, prêt à récupérer.", date: "2026-02-20", lu: true, lien: "/admin/dossiers/d5", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Acompte reçu — Robe sur mesure", description: "Mme Martin a réglé l'acompte de 190 € pour la robe de soirée.", date: "2026-03-06", lu: true, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n3", type: "devis", titre: "Devis en attente — Commande grossiste", description: "Le devis pour la commande grossiste de Mme Bernard attend validation.", date: "2026-03-12", lu: false, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n4", type: "message", titre: "Message de Mme Lefebvre", description: "Camille Lefebvre demande un suivi sur sa commande de sac en cuir.", date: "2026-03-18", lu: false, lien: "/admin/dossiers/d6", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Duval", prenom: "Marie", poste: "Vendeuse senior", statut: "disponible", couleur: "#EC4899", capaciteMax: 6 },
    { id: "demo-emp-2", nom: "Chen", prenom: "Liwei", poste: "Vendeur", statut: "disponible", couleur: "#8B5CF6", capaciteMax: 5 },
    { id: "demo-emp-3", nom: "Fournier", prenom: "Jade", poste: "Responsable stock", statut: "disponible", couleur: "#14B8A6", capaciteMax: 4 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-03-01" }],
    d3: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-03-12" }],
    d4: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-05" }],
    d6: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-03-10" }],
  },
};

// ── COIFFURE ──

const coiffureMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Leclerc", prenom: "Aurélie", email: "aurelie.leclerc@gmail.com", telephone: "06 11 33 55 77", entreprise: "", statut: "actif", dateCreation: "2025-07-20", nombreDossiers: 2 },
    { id: "c2", nom: "Ndoye", prenom: "Fatou", email: "fatou.ndoye@hotmail.fr", telephone: "06 22 44 66 88", entreprise: "", statut: "actif", dateCreation: "2025-10-05", nombreDossiers: 1 },
    { id: "c3", nom: "Vasseur", prenom: "Céline", email: "celine.vasseur@orange.fr", telephone: "06 33 55 77 99", entreprise: "", statut: "actif", dateCreation: "2026-01-12", nombreDossiers: 1 },
    { id: "c4", nom: "Bouvier", prenom: "Laëtitia", email: "laetitia.bouvier@free.fr", telephone: "06 44 66 88 00", entreprise: "", statut: "actif", dateCreation: "2026-02-08", nombreDossiers: 2 },
    { id: "c5", nom: "Perrin", prenom: "Julien", email: "julien.perrin@yahoo.fr", telephone: "06 55 77 99 11", entreprise: "", statut: "inactif", dateCreation: "2025-03-15", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "COI-2026-001", clientId: "c1", clientNom: "Aurélie Leclerc", typePrestation: "Coloration complète + balayage", montant: 145, statut: "termine", dateCreation: "2026-02-20", dateEcheance: "2026-02-20" },
    { id: "d2", reference: "COI-2026-002", clientId: "c1", clientNom: "Aurélie Leclerc", typePrestation: "Coupe + brushing — RDV récurrent mensuel", montant: 55, statut: "en_cours", dateCreation: "2026-03-22", dateEcheance: "2026-03-22" },
    { id: "d3", reference: "COI-2026-003", clientId: "c2", clientNom: "Fatou Ndoye", typePrestation: "Tresses africaines — Modèle cornrows", montant: 120, statut: "en_cours", dateCreation: "2026-03-18", dateEcheance: "2026-03-18" },
    { id: "d4", reference: "COI-2026-004", clientId: "c3", clientNom: "Céline Vasseur", typePrestation: "Lissage brésilien", montant: 250, statut: "en_attente", dateCreation: "2026-03-25", dateEcheance: "2026-03-28" },
    { id: "d5", reference: "COI-2026-005", clientId: "c4", clientNom: "Laëtitia Bouvier", typePrestation: "Mariage — Coiffure + Maquillage", montant: 350, statut: "en_cours", dateCreation: "2026-02-01", dateEcheance: "2026-06-14" },
    { id: "d6", reference: "COI-2026-006", clientId: "c4", clientNom: "Laëtitia Bouvier", typePrestation: "Essai coiffure mariage", montant: 80, statut: "termine", dateCreation: "2026-03-10", dateEcheance: "2026-03-10" },
    { id: "d7", reference: "COI-2026-007", clientId: "c5", clientNom: "Julien Perrin", typePrestation: "Coupe homme + barbe", montant: 35, statut: "termine", dateCreation: "2025-04-01", dateEcheance: "2025-04-01" },
  ],
  factures: [
    { id: "f1", reference: "FAC-COI-001", clientId: "c1", clientNom: "Aurélie Leclerc", dossierId: "d1", montant: 145, statut: "payee", dateEmission: "2026-02-20", dateEcheance: "2026-03-20", description: "Coloration complète + balayage" },
    { id: "f2", reference: "FAC-COI-002", clientId: "c4", clientNom: "Laëtitia Bouvier", dossierId: "d6", montant: 80, statut: "payee", dateEmission: "2026-03-10", dateEcheance: "2026-04-10", description: "Essai coiffure mariage" },
    { id: "f3", reference: "FAC-COI-003", clientId: "c4", clientNom: "Laëtitia Bouvier", dossierId: "d5", montant: 175, statut: "en_attente", dateEmission: "2026-03-15", dateEcheance: "2026-04-15", description: "Acompte 50% — Coiffure + Maquillage mariage" },
    { id: "f4", reference: "FAC-COI-004", clientId: "c5", clientNom: "Julien Perrin", dossierId: "d7", montant: 35, statut: "payee", dateEmission: "2025-04-01", dateEcheance: "2025-05-01", description: "Coupe homme + barbe" },
    { id: "f5", reference: "FAC-COI-005", clientId: "c2", clientNom: "Fatou Ndoye", dossierId: "d3", montant: 120, statut: "en_attente", dateEmission: "2026-03-18", dateEcheance: "2026-04-18", description: "Tresses africaines cornrows" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-COI-001", clientId: "c3", clientNom: "Céline Vasseur", dossierId: "d4", titre: "Lissage brésilien — Cheveux longs", montant: 250, statut: "en_attente", dateEmission: "2026-03-20", dateValidite: "2026-04-20" },
    { id: "dv2", reference: "DEV-COI-002", clientId: "c4", clientNom: "Laëtitia Bouvier", dossierId: "d5", titre: "Forfait mariage — Coiffure mariée + maquillage + essai", montant: 350, statut: "accepte", dateEmission: "2026-02-01", dateValidite: "2026-03-01" },
    { id: "dv3", reference: "DEV-COI-003", clientId: "c2", clientNom: "Fatou Ndoye", dossierId: "d3", titre: "Tresses cornrows — Durée estimée 3h", montant: 120, statut: "accepte", dateEmission: "2026-03-15", dateValidite: "2026-04-15" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "RDV mariage confirmé", description: "L'essai coiffure de Mme Bouvier pour le mariage est confirmé le 10 mars.", date: "2026-03-08", lu: true, lien: "/admin/dossiers/d6", destinataire: "admin" },
    { id: "n2", type: "message", titre: "Demande de RDV — Mme Vasseur", description: "Céline Vasseur souhaite prendre RDV pour un lissage brésilien.", date: "2026-03-20", lu: false, lien: "/admin/dossiers/d4", destinataire: "admin" },
    { id: "n3", type: "facture", titre: "Acompte reçu — Mariage Bouvier", description: "Acompte de 175 € reçu pour le forfait mariage de Mme Bouvier.", date: "2026-03-16", lu: true, lien: "/admin/dossiers/d5", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Avis demandé", description: "Demande d'avis envoyée à Mme Leclerc après sa coloration.", date: "2026-02-21", lu: true, lien: "/admin/dossiers/d1", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Blanchard", prenom: "Noémie", poste: "Coiffeuse senior", statut: "disponible", couleur: "#EC4899", capaciteMax: 6 },
    { id: "demo-emp-2", nom: "Kaba", prenom: "Aminata", poste: "Coiffeuse / Tresseuse", statut: "disponible", couleur: "#8B5CF6", capaciteMax: 4 },
    { id: "demo-emp-3", nom: "Picard", prenom: "Raphaël", poste: "Coiffeur / Barbier", statut: "disponible", couleur: "#F59E0B", capaciteMax: 5 },
  ],
  assignments: {
    d2: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-03-22" }],
    d3: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-18" }],
    d5: [
      { employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-01" },
      { employeeId: "demo-emp-2", role: "renfort", dateAssignation: "2026-02-01" },
    ],
  },
};

// ── AUTO-ECOLE ──

const autoEcoleMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Hamidi", prenom: "Yasmina", email: "yasmina.hamidi@gmail.com", telephone: "06 10 11 12 13", entreprise: "", statut: "actif", dateCreation: "2025-09-01", nombreDossiers: 1 },
    { id: "c2", nom: "Lemaire", prenom: "Hugo", email: "hugo.lemaire@outlook.fr", telephone: "06 20 21 22 23", entreprise: "", statut: "actif", dateCreation: "2025-11-15", nombreDossiers: 2 },
    { id: "c3", nom: "Diallo", prenom: "Mamadou", email: "mamadou.diallo@yahoo.fr", telephone: "06 30 31 32 33", entreprise: "", statut: "actif", dateCreation: "2026-01-10", nombreDossiers: 1 },
    { id: "c4", nom: "Mercier", prenom: "Chloé", email: "chloe.mercier@free.fr", telephone: "06 40 41 42 43", entreprise: "", statut: "actif", dateCreation: "2026-02-05", nombreDossiers: 2 },
    { id: "c5", nom: "Fabre", prenom: "Théo", email: "theo.fabre@laposte.net", telephone: "06 50 51 52 53", entreprise: "", statut: "inactif", dateCreation: "2025-03-20", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "AE-2026-001", clientId: "c1", clientNom: "Yasmina Hamidi", typePrestation: "Permis B — Formation complète (Code + Conduite)", montant: 1350, statut: "en_cours", dateCreation: "2025-09-05", dateEcheance: "2026-06-30" },
    { id: "d2", reference: "AE-2026-002", clientId: "c2", clientNom: "Hugo Lemaire", typePrestation: "Permis B — Conduite accompagnée (AAC)", montant: 1100, statut: "en_cours", dateCreation: "2025-11-20", dateEcheance: "2026-11-20" },
    { id: "d3", reference: "AE-2026-003", clientId: "c2", clientNom: "Hugo Lemaire", typePrestation: "Code de la route — Forfait intensif", montant: 300, statut: "termine", dateCreation: "2025-11-20", dateEcheance: "2026-02-28" },
    { id: "d4", reference: "AE-2026-004", clientId: "c3", clientNom: "Mamadou Diallo", typePrestation: "Permis B — Formation accélérée 30 jours", montant: 1800, statut: "en_cours", dateCreation: "2026-02-01", dateEcheance: "2026-04-01" },
    { id: "d5", reference: "AE-2026-005", clientId: "c4", clientNom: "Chloé Mercier", typePrestation: "Permis B — Forfait 20 heures de conduite", montant: 950, statut: "en_attente", dateCreation: "2026-03-01", dateEcheance: "2026-09-01" },
    { id: "d6", reference: "AE-2026-006", clientId: "c4", clientNom: "Chloé Mercier", typePrestation: "Code de la route — Accès en ligne 6 mois", montant: 250, statut: "en_cours", dateCreation: "2026-02-10", dateEcheance: "2026-08-10" },
    { id: "d7", reference: "AE-2026-007", clientId: "c5", clientNom: "Théo Fabre", typePrestation: "Permis B — Formation complète", montant: 1350, statut: "termine", dateCreation: "2025-03-25", dateEcheance: "2025-10-30" },
  ],
  factures: [
    { id: "f1", reference: "FAC-AE-001", clientId: "c1", clientNom: "Yasmina Hamidi", dossierId: "d1", montant: 675, statut: "payee", dateEmission: "2025-09-05", dateEcheance: "2025-10-05", description: "Acompte 50% — Formation complète Permis B" },
    { id: "f2", reference: "FAC-AE-002", clientId: "c2", clientNom: "Hugo Lemaire", dossierId: "d3", montant: 300, statut: "payee", dateEmission: "2025-11-20", dateEcheance: "2025-12-20", description: "Forfait code intensif" },
    { id: "f3", reference: "FAC-AE-003", clientId: "c3", clientNom: "Mamadou Diallo", dossierId: "d4", montant: 1800, statut: "en_attente", dateEmission: "2026-02-01", dateEcheance: "2026-03-01", description: "Formation accélérée 30 jours — Paiement intégral" },
    { id: "f4", reference: "FAC-AE-004", clientId: "c4", clientNom: "Chloé Mercier", dossierId: "d6", montant: 250, statut: "payee", dateEmission: "2026-02-10", dateEcheance: "2026-03-10", description: "Accès code en ligne 6 mois" },
    { id: "f5", reference: "FAC-AE-005", clientId: "c5", clientNom: "Théo Fabre", dossierId: "d7", montant: 1350, statut: "payee", dateEmission: "2025-10-30", dateEcheance: "2025-11-30", description: "Solde formation complète Permis B" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-AE-001", clientId: "c4", clientNom: "Chloé Mercier", dossierId: "d5", titre: "Forfait 20 heures de conduite — Permis B", montant: 950, statut: "en_attente", dateEmission: "2026-03-01", dateValidite: "2026-04-01" },
    { id: "dv2", reference: "DEV-AE-002", clientId: "c1", clientNom: "Yasmina Hamidi", dossierId: "d1", titre: "Heures supplémentaires conduite (5h)", montant: 250, statut: "accepte", dateEmission: "2026-03-10", dateValidite: "2026-04-10" },
    { id: "dv3", reference: "DEV-AE-003", clientId: "c3", clientNom: "Mamadou Diallo", dossierId: "d4", titre: "Stage récupération de points (optionnel)", montant: 200, statut: "refuse", dateEmission: "2026-02-15", dateValidite: "2026-03-15" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Code obtenu — Hugo Lemaire", description: "Hugo Lemaire a obtenu son code de la route. Passage en phase conduite.", date: "2026-02-28", lu: true, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Paiement en retard — M. Diallo", description: "La facture de Mamadou Diallo (formation accélérée) est en retard de paiement.", date: "2026-03-05", lu: false, lien: "/admin/dossiers/d4", destinataire: "admin" },
    { id: "n3", type: "dossier", titre: "Examen conduite planifié", description: "L'examen de conduite de Yasmina Hamidi est prévu le 15 avril 2026.", date: "2026-03-20", lu: false, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n4", type: "message", titre: "Question de Mme Mercier", description: "Chloé Mercier demande quand elle pourra commencer les heures de conduite.", date: "2026-03-22", lu: false, lien: "/admin/dossiers/d5", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Renaud", prenom: "Stéphane", poste: "Moniteur auto", statut: "disponible", couleur: "#3B82F6", capaciteMax: 8 },
    { id: "demo-emp-2", nom: "Mbaye", prenom: "Ousmane", poste: "Moniteur auto", statut: "disponible", couleur: "#10B981", capaciteMax: 8 },
    { id: "demo-emp-3", nom: "Guillot", prenom: "Sandrine", poste: "Monitrice / Responsable code", statut: "disponible", couleur: "#F59E0B", capaciteMax: null },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-09-05" }],
    d2: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-11-20" }],
    d4: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-01" }],
    d5: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-01" }],
    d6: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-02-10" }],
  },
};
// ── CONSULTANT ──

const consultantMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Renault", prenom: "Philippe", email: "p.renault@axiogroup.fr", telephone: "06 12 34 56 78", entreprise: "Axio Group", statut: "actif", dateCreation: "2025-11-10", nombreDossiers: 2 },
    { id: "c2", nom: "Marchand", prenom: "Nathalie", email: "n.marchand@novaxis.fr", telephone: "06 23 45 67 89", entreprise: "Novaxis SAS", statut: "actif", dateCreation: "2025-12-03", nombreDossiers: 2 },
    { id: "c3", nom: "Beaumont", prenom: "Olivier", email: "o.beaumont@terralogis.fr", telephone: "06 34 56 78 90", entreprise: "TerraLogis", statut: "actif", dateCreation: "2026-01-15", nombreDossiers: 1 },
    { id: "c4", nom: "Fabre", prenom: "Caroline", email: "c.fabre@medianova.fr", telephone: "06 45 67 89 01", entreprise: "MediaNova", statut: "actif", dateCreation: "2026-02-01", nombreDossiers: 1 },
    { id: "c5", nom: "Girard", prenom: "Stéphane", email: "s.girard@veltisgroup.fr", telephone: "06 56 78 90 12", entreprise: "Veltis Group", statut: "inactif", dateCreation: "2025-09-20", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "CST-2026-001", clientId: "c1", clientNom: "Philippe Renault", typePrestation: "Audit organisationnel", montant: 8500, statut: "en_cours", dateCreation: "2026-01-10", dateEcheance: "2026-04-30" },
    { id: "d2", reference: "CST-2026-002", clientId: "c1", clientNom: "Philippe Renault", typePrestation: "Plan stratégique 2026-2028", montant: 15000, statut: "en_attente", dateCreation: "2026-02-20", dateEcheance: "2026-06-30" },
    { id: "d3", reference: "CST-2026-003", clientId: "c2", clientNom: "Nathalie Marchand", typePrestation: "Transformation digitale", montant: 22000, statut: "en_cours", dateCreation: "2026-01-05", dateEcheance: "2026-07-31" },
    { id: "d4", reference: "CST-2026-004", clientId: "c2", clientNom: "Nathalie Marchand", typePrestation: "Accompagnement conduite du changement", montant: 9800, statut: "en_cours", dateCreation: "2026-02-15", dateEcheance: "2026-05-15" },
    { id: "d5", reference: "CST-2026-005", clientId: "c3", clientNom: "Olivier Beaumont", typePrestation: "Diagnostic RH et recrutement", montant: 6500, statut: "en_attente", dateCreation: "2026-03-01", dateEcheance: "2026-05-30" },
    { id: "d6", reference: "CST-2026-006", clientId: "c4", clientNom: "Caroline Fabre", typePrestation: "Optimisation des processus internes", montant: 12000, statut: "en_cours", dateCreation: "2026-02-10", dateEcheance: "2026-06-15" },
    { id: "d7", reference: "CST-2025-012", clientId: "c5", clientNom: "Stéphane Girard", typePrestation: "Étude de marché international", montant: 18000, statut: "termine", dateCreation: "2025-09-25", dateEcheance: "2025-12-31" },
  ],
  factures: [
    { id: "f1", reference: "FCST-2026-001", clientId: "c1", clientNom: "Philippe Renault", dossierId: "d1", montant: 4250, statut: "payee", dateEmission: "2026-01-15", dateEcheance: "2026-02-15", description: "Audit organisationnel — Acompte 50%" },
    { id: "f2", reference: "FCST-2026-002", clientId: "c2", clientNom: "Nathalie Marchand", dossierId: "d3", montant: 7333, statut: "payee", dateEmission: "2026-01-10", dateEcheance: "2026-02-10", description: "Transformation digitale — Phase 1" },
    { id: "f3", reference: "FCST-2026-003", clientId: "c2", clientNom: "Nathalie Marchand", dossierId: "d3", montant: 7333, statut: "en_attente", dateEmission: "2026-03-10", dateEcheance: "2026-04-10", description: "Transformation digitale — Phase 2" },
    { id: "f4", reference: "FCST-2026-004", clientId: "c4", clientNom: "Caroline Fabre", dossierId: "d6", montant: 6000, statut: "en_retard", dateEmission: "2026-02-15", dateEcheance: "2026-03-15", description: "Optimisation processus — Acompte 50%" },
    { id: "f5", reference: "FCST-2025-008", clientId: "c5", clientNom: "Stéphane Girard", dossierId: "d7", montant: 18000, statut: "payee", dateEmission: "2025-12-20", dateEcheance: "2026-01-20", description: "Étude de marché — Solde final" },
  ],
  devis: [
    { id: "dv1", reference: "DCST-2026-001", clientId: "c1", clientNom: "Philippe Renault", dossierId: "d2", titre: "Plan stratégique 2026-2028", montant: 15000, statut: "en_attente", dateEmission: "2026-02-20", dateValidite: "2026-03-20" },
    { id: "dv2", reference: "DCST-2026-002", clientId: "c3", clientNom: "Olivier Beaumont", dossierId: "d5", titre: "Diagnostic RH complet + plan de recrutement", montant: 6500, statut: "en_attente", dateEmission: "2026-03-01", dateValidite: "2026-04-01" },
    { id: "dv3", reference: "DCST-2026-003", clientId: "c2", clientNom: "Nathalie Marchand", dossierId: "d4", titre: "Accompagnement conduite du changement — 3 mois", montant: 9800, statut: "accepte", dateEmission: "2026-02-10", dateValidite: "2026-03-10" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Nouveau livrable disponible", description: "Le rapport d'audit phase 1 pour Axio Group est disponible", date: "2026-03-25", lu: false, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Facture en retard", description: "La facture FCST-2026-004 de MediaNova est en retard de 12 jours", date: "2026-03-27", lu: false, lien: "/admin/factures/f4", destinataire: "admin" },
    { id: "n3", type: "devis", titre: "Devis en attente de validation", description: "Le devis pour le plan stratégique d'Axio Group expire le 20 mars", date: "2026-03-18", lu: true, lien: "/admin/devis/dv1", destinataire: "admin" },
    { id: "n4", type: "message", titre: "Nouveau message de Nathalie Marchand", description: "Retour sur le livrable phase 2 de la transformation digitale", date: "2026-03-26", lu: false, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n5", type: "dossier", titre: "Votre dossier a avancé", description: "Votre mission Transformation digitale est passée à l'étape Livrables envoyés", date: "2026-03-24", lu: false, lien: "/client/dossiers/d3", destinataire: "client" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Lefèvre", prenom: "Julien", poste: "Consultant senior", statut: "disponible", couleur: "#3B82F6", capaciteMax: 4 },
    { id: "demo-emp-2", nom: "Arnaud", prenom: "Sophie", poste: "Consultante stratégie", statut: "disponible", couleur: "#10B981", capaciteMax: 3 },
    { id: "demo-emp-3", nom: "Petit", prenom: "Marc", poste: "Consultant junior", statut: "disponible", couleur: "#F59E0B", capaciteMax: 5 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-10" }],
    d2: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-20" }],
    d3: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-01-05" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-01-20" }],
    d4: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-15" }],
    d5: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-03-01" }],
    d6: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-10" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-12" }],
    d7: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-09-25" }],
  },
};

// ── DESIGNER ──

const designerMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Moreau", prenom: "Camille", email: "c.moreau@laruchemedia.fr", telephone: "06 11 22 33 44", entreprise: "La Ruche Media", statut: "actif", dateCreation: "2025-10-20", nombreDossiers: 2 },
    { id: "c2", nom: "Vasseur", prenom: "Thomas", email: "t.vasseur@bionaturel.fr", telephone: "06 22 33 44 55", entreprise: "BioNaturel", statut: "actif", dateCreation: "2025-12-15", nombreDossiers: 2 },
    { id: "c3", nom: "Leclerc", prenom: "Marion", email: "m.leclerc@cafezephyr.fr", telephone: "06 33 44 55 66", entreprise: "Café Zéphyr", statut: "actif", dateCreation: "2026-01-08", nombreDossiers: 1 },
    { id: "c4", nom: "Roche", prenom: "Antoine", email: "a.roche@cabinet-roche.fr", telephone: "06 44 55 66 77", entreprise: "Cabinet Roche Avocats", statut: "actif", dateCreation: "2026-02-05", nombreDossiers: 1 },
    { id: "c5", nom: "Dupuis", prenom: "Émilie", email: "e.dupuis@maisonsoleil.fr", telephone: "06 55 66 77 88", entreprise: "Maison Soleil", statut: "inactif", dateCreation: "2025-07-12", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "DES-2026-001", clientId: "c1", clientNom: "Camille Moreau", typePrestation: "Identité visuelle complète", montant: 4500, statut: "en_cours", dateCreation: "2026-01-15", dateEcheance: "2026-03-31" },
    { id: "d2", reference: "DES-2026-002", clientId: "c1", clientNom: "Camille Moreau", typePrestation: "Charte réseaux sociaux", montant: 1800, statut: "en_attente", dateCreation: "2026-03-10", dateEcheance: "2026-04-30" },
    { id: "d3", reference: "DES-2026-003", clientId: "c2", clientNom: "Thomas Vasseur", typePrestation: "Packaging gamme bio", montant: 6200, statut: "en_cours", dateCreation: "2026-01-20", dateEcheance: "2026-04-15" },
    { id: "d4", reference: "DES-2026-004", clientId: "c2", clientNom: "Thomas Vasseur", typePrestation: "Refonte site web", montant: 3800, statut: "en_cours", dateCreation: "2026-02-10", dateEcheance: "2026-05-10" },
    { id: "d5", reference: "DES-2026-005", clientId: "c3", clientNom: "Marion Leclerc", typePrestation: "Menu et signalétique café", montant: 2200, statut: "en_attente", dateCreation: "2026-03-05", dateEcheance: "2026-04-20" },
    { id: "d6", reference: "DES-2026-006", clientId: "c4", clientNom: "Antoine Roche", typePrestation: "Plaquette commerciale cabinet", montant: 1500, statut: "en_cours", dateCreation: "2026-02-20", dateEcheance: "2026-03-31" },
    { id: "d7", reference: "DES-2025-018", clientId: "c5", clientNom: "Émilie Dupuis", typePrestation: "Logo et carte de visite", montant: 950, statut: "termine", dateCreation: "2025-07-15", dateEcheance: "2025-08-30" },
  ],
  factures: [
    { id: "f1", reference: "FDES-2026-001", clientId: "c1", clientNom: "Camille Moreau", dossierId: "d1", montant: 2250, statut: "payee", dateEmission: "2026-01-20", dateEcheance: "2026-02-20", description: "Identité visuelle — Acompte 50%" },
    { id: "f2", reference: "FDES-2026-002", clientId: "c2", clientNom: "Thomas Vasseur", dossierId: "d3", montant: 3100, statut: "payee", dateEmission: "2026-01-25", dateEcheance: "2026-02-25", description: "Packaging bio — Acompte 50%" },
    { id: "f3", reference: "FDES-2026-003", clientId: "c2", clientNom: "Thomas Vasseur", dossierId: "d4", montant: 1900, statut: "en_attente", dateEmission: "2026-03-15", dateEcheance: "2026-04-15", description: "Refonte site web — Acompte 50%" },
    { id: "f4", reference: "FDES-2026-004", clientId: "c4", clientNom: "Antoine Roche", dossierId: "d6", montant: 1500, statut: "en_retard", dateEmission: "2026-02-25", dateEcheance: "2026-03-25", description: "Plaquette cabinet — Totalité" },
    { id: "f5", reference: "FDES-2025-010", clientId: "c5", clientNom: "Émilie Dupuis", dossierId: "d7", montant: 950, statut: "payee", dateEmission: "2025-08-28", dateEcheance: "2025-09-28", description: "Logo + carte de visite — Solde" },
  ],
  devis: [
    { id: "dv1", reference: "DDES-2026-001", clientId: "c1", clientNom: "Camille Moreau", dossierId: "d2", titre: "Charte graphique réseaux sociaux — 15 templates", montant: 1800, statut: "en_attente", dateEmission: "2026-03-10", dateValidite: "2026-04-10" },
    { id: "dv2", reference: "DDES-2026-002", clientId: "c3", clientNom: "Marion Leclerc", dossierId: "d5", titre: "Menu grand format + signalétique intérieure", montant: 2200, statut: "en_attente", dateEmission: "2026-03-05", dateValidite: "2026-04-05" },
    { id: "dv3", reference: "DDES-2026-003", clientId: "c2", clientNom: "Thomas Vasseur", dossierId: "d4", titre: "Refonte site web — maquettes + intégration", montant: 3800, statut: "accepte", dateEmission: "2026-02-05", dateValidite: "2026-03-05" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Moodboard validé", description: "Camille Moreau a validé le moodboard pour l'identité visuelle", date: "2026-03-20", lu: false, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Facture en retard", description: "La facture FDES-2026-004 du Cabinet Roche est en retard de 2 jours", date: "2026-03-27", lu: false, lien: "/admin/factures/f4", destinataire: "admin" },
    { id: "n3", type: "message", titre: "Retour client sur maquettes", description: "Thomas Vasseur a envoyé ses retours sur les maquettes packaging", date: "2026-03-26", lu: false, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n4", type: "devis", titre: "Nouveau devis à valider", description: "Un devis pour la charte réseaux sociaux de La Ruche Media vous attend", date: "2026-03-10", lu: true, lien: "/client/devis/dv1", destinataire: "client" },
    { id: "n5", type: "dossier", titre: "Première proposition disponible", description: "Votre première proposition de packaging est disponible pour retour", date: "2026-03-22", lu: false, lien: "/client/dossiers/d3", destinataire: "client" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Garnier", prenom: "Léa", poste: "Directrice artistique", statut: "disponible", couleur: "#8B5CF6", capaciteMax: 4 },
    { id: "demo-emp-2", nom: "Barbier", prenom: "Hugo", poste: "Designer graphique", statut: "disponible", couleur: "#EC4899", capaciteMax: 5 },
    { id: "demo-emp-3", nom: "Colin", prenom: "Manon", poste: "Designer UI/UX", statut: "disponible", couleur: "#06B6D4", capaciteMax: 5 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-15" }],
    d2: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-10" }],
    d3: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-20" }, { employeeId: "demo-emp-2", role: "renfort", dateAssignation: "2026-02-01" }],
    d4: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-02-10" }],
    d5: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-05" }],
    d6: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-20" }],
    d7: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-07-15" }],
  },
};

// ── DEVELOPPEUR ──

const developpeurMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Blanc", prenom: "Julien", email: "j.blanc@fintechpay.fr", telephone: "06 10 20 30 40", entreprise: "FintechPay", statut: "actif", dateCreation: "2025-09-15", nombreDossiers: 2 },
    { id: "c2", nom: "Morin", prenom: "Aurélie", email: "a.morin@verteco.fr", telephone: "06 20 30 40 50", entreprise: "VertÉco", statut: "actif", dateCreation: "2025-11-20", nombreDossiers: 2 },
    { id: "c3", nom: "Perrin", prenom: "Damien", email: "d.perrin@urbantaste.fr", telephone: "06 30 40 50 60", entreprise: "Urban Taste", statut: "actif", dateCreation: "2026-01-05", nombreDossiers: 1 },
    { id: "c4", nom: "Lambert", prenom: "Chloé", email: "c.lambert@eduspark.fr", telephone: "06 40 50 60 70", entreprise: "EduSpark", statut: "actif", dateCreation: "2026-02-12", nombreDossiers: 1 },
    { id: "c5", nom: "Dumont", prenom: "François", email: "f.dumont@logipro.fr", telephone: "06 50 60 70 80", entreprise: "LogiPro SARL", statut: "inactif", dateCreation: "2025-05-10", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "DEV-2026-001", clientId: "c1", clientNom: "Julien Blanc", typePrestation: "Application mobile iOS/Android", montant: 28000, statut: "en_cours", dateCreation: "2026-01-10", dateEcheance: "2026-06-30" },
    { id: "d2", reference: "DEV-2026-002", clientId: "c1", clientNom: "Julien Blanc", typePrestation: "API de paiement sécurisée", montant: 12000, statut: "en_cours", dateCreation: "2026-02-15", dateEcheance: "2026-05-15" },
    { id: "d3", reference: "DEV-2026-003", clientId: "c2", clientNom: "Aurélie Morin", typePrestation: "Site e-commerce éco-responsable", montant: 18500, statut: "en_cours", dateCreation: "2026-01-20", dateEcheance: "2026-05-31" },
    { id: "d4", reference: "DEV-2026-004", clientId: "c2", clientNom: "Aurélie Morin", typePrestation: "Dashboard analytics interne", montant: 8500, statut: "en_attente", dateCreation: "2026-03-05", dateEcheance: "2026-06-05" },
    { id: "d5", reference: "DEV-2026-005", clientId: "c3", clientNom: "Damien Perrin", typePrestation: "Plateforme de réservation en ligne", montant: 15000, statut: "en_cours", dateCreation: "2026-01-25", dateEcheance: "2026-05-25" },
    { id: "d6", reference: "DEV-2026-006", clientId: "c4", clientNom: "Chloé Lambert", typePrestation: "Plateforme e-learning", montant: 22000, statut: "en_attente", dateCreation: "2026-03-01", dateEcheance: "2026-08-31" },
    { id: "d7", reference: "DEV-2025-009", clientId: "c5", clientNom: "François Dumont", typePrestation: "Site vitrine + CRM intégré", montant: 9500, statut: "termine", dateCreation: "2025-05-15", dateEcheance: "2025-09-30" },
  ],
  factures: [
    { id: "f1", reference: "FDEV-2026-001", clientId: "c1", clientNom: "Julien Blanc", dossierId: "d1", montant: 9333, statut: "payee", dateEmission: "2026-01-15", dateEcheance: "2026-02-15", description: "App mobile — Jalon 1 : maquettes validées" },
    { id: "f2", reference: "FDEV-2026-002", clientId: "c1", clientNom: "Julien Blanc", dossierId: "d1", montant: 9333, statut: "en_attente", dateEmission: "2026-03-20", dateEcheance: "2026-04-20", description: "App mobile — Jalon 2 : développement core" },
    { id: "f3", reference: "FDEV-2026-003", clientId: "c2", clientNom: "Aurélie Morin", dossierId: "d3", montant: 6166, statut: "payee", dateEmission: "2026-01-25", dateEcheance: "2026-02-25", description: "Site e-commerce — Phase 1 : architecture" },
    { id: "f4", reference: "FDEV-2026-004", clientId: "c3", clientNom: "Damien Perrin", dossierId: "d5", montant: 7500, statut: "en_retard", dateEmission: "2026-02-25", dateEcheance: "2026-03-25", description: "Plateforme réservation — Acompte 50%" },
    { id: "f5", reference: "FDEV-2025-005", clientId: "c5", clientNom: "François Dumont", dossierId: "d7", montant: 9500, statut: "payee", dateEmission: "2025-09-28", dateEcheance: "2025-10-28", description: "Site vitrine + CRM — Solde final" },
  ],
  devis: [
    { id: "dv1", reference: "DDEV-2026-001", clientId: "c2", clientNom: "Aurélie Morin", dossierId: "d4", titre: "Dashboard analytics — React + Supabase", montant: 8500, statut: "en_attente", dateEmission: "2026-03-05", dateValidite: "2026-04-05" },
    { id: "dv2", reference: "DDEV-2026-002", clientId: "c4", clientNom: "Chloé Lambert", dossierId: "d6", titre: "Plateforme e-learning complète — 6 mois", montant: 22000, statut: "en_attente", dateEmission: "2026-03-01", dateValidite: "2026-04-01" },
    { id: "dv3", reference: "DDEV-2026-003", clientId: "c1", clientNom: "Julien Blanc", dossierId: "d2", titre: "API paiement — intégration Stripe + monitoring", montant: 12000, statut: "accepte", dateEmission: "2026-02-10", dateValidite: "2026-03-10" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Recette client en attente", description: "Damien Perrin doit valider la recette de la plateforme de réservation", date: "2026-03-25", lu: false, lien: "/admin/dossiers/d5", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Facture en retard", description: "La facture FDEV-2026-004 d'Urban Taste est en retard de 2 jours", date: "2026-03-27", lu: false, lien: "/admin/factures/f4", destinataire: "admin" },
    { id: "n3", type: "message", titre: "Retour client sur maquettes", description: "Julien Blanc a commenté les maquettes de l'app mobile FintechPay", date: "2026-03-24", lu: false, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Mise en production effectuée", description: "Le site vitrine de LogiPro a été mis en production avec succès", date: "2025-09-28", lu: true, lien: "/admin/dossiers/d7", destinataire: "admin" },
    { id: "n5", type: "dossier", titre: "Votre projet avance", description: "Votre site e-commerce est passé à l'étape Dev en cours", date: "2026-03-15", lu: false, lien: "/client/dossiers/d3", destinataire: "client" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Nguyen", prenom: "Kevin", poste: "Développeur full-stack senior", statut: "disponible", couleur: "#3B82F6", capaciteMax: 3 },
    { id: "demo-emp-2", nom: "Rousseau", prenom: "Alexis", poste: "Développeur front-end", statut: "disponible", couleur: "#10B981", capaciteMax: 4 },
    { id: "demo-emp-3", nom: "Da Silva", prenom: "Lucas", poste: "Développeur back-end", statut: "disponible", couleur: "#F59E0B", capaciteMax: 4 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-10" }, { employeeId: "demo-emp-2", role: "renfort", dateAssignation: "2026-01-15" }],
    d2: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-02-15" }],
    d3: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-01-20" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-01" }],
    d4: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-05" }],
    d5: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-25" }],
    d6: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-03-01" }],
    d7: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-05-15" }],
  },
};

// ── PHOTOGRAPHE ──

const photographeMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Dupont", prenom: "Marine", email: "marine.dupont@gmail.com", telephone: "06 12 45 78 90", entreprise: "", statut: "actif", dateCreation: "2025-11-05", nombreDossiers: 2 },
    { id: "c2", nom: "Hernandez", prenom: "Sofia", email: "sofia.hernandez@hotmail.com", telephone: "06 23 56 89 01", entreprise: "", statut: "actif", dateCreation: "2026-01-10", nombreDossiers: 1 },
    { id: "c3", nom: "Bertrand", prenom: "Nicolas", email: "n.bertrand@luxeimmo.fr", telephone: "06 34 67 90 12", entreprise: "Luxe Immobilier", statut: "actif", dateCreation: "2026-01-20", nombreDossiers: 2 },
    { id: "c4", nom: "Leroy", prenom: "Isabelle", email: "i.leroy@maisonleroy.fr", telephone: "06 45 78 01 23", entreprise: "Maison Leroy", statut: "actif", dateCreation: "2026-02-15", nombreDossiers: 1 },
    { id: "c5", nom: "Martin", prenom: "Guillaume", email: "g.martin@outlook.fr", telephone: "06 56 89 12 34", entreprise: "", statut: "inactif", dateCreation: "2025-06-20", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "PHO-2026-001", clientId: "c1", clientNom: "Marine Dupont", typePrestation: "Mariage Dupont-Lefèvre", montant: 2800, statut: "en_cours", dateCreation: "2026-01-15", dateEcheance: "2026-06-28" },
    { id: "d2", reference: "PHO-2026-002", clientId: "c1", clientNom: "Marine Dupont", typePrestation: "Séance engagement couple", montant: 350, statut: "termine", dateCreation: "2026-02-10", dateEcheance: "2026-03-15" },
    { id: "d3", reference: "PHO-2026-003", clientId: "c2", clientNom: "Sofia Hernandez", typePrestation: "Shooting portrait professionnel", montant: 450, statut: "en_cours", dateCreation: "2026-02-20", dateEcheance: "2026-03-31" },
    { id: "d4", reference: "PHO-2026-004", clientId: "c3", clientNom: "Nicolas Bertrand", typePrestation: "Shooting immobilier — 5 biens", montant: 1500, statut: "en_cours", dateCreation: "2026-02-01", dateEcheance: "2026-04-15" },
    { id: "d5", reference: "PHO-2026-005", clientId: "c3", clientNom: "Nicolas Bertrand", typePrestation: "Visite virtuelle 360° — Villa Cannes", montant: 800, statut: "en_attente", dateCreation: "2026-03-10", dateEcheance: "2026-04-30" },
    { id: "d6", reference: "PHO-2026-006", clientId: "c4", clientNom: "Isabelle Leroy", typePrestation: "Shooting corporate équipe", montant: 1200, statut: "en_cours", dateCreation: "2026-02-25", dateEcheance: "2026-04-10" },
    { id: "d7", reference: "PHO-2025-015", clientId: "c5", clientNom: "Guillaume Martin", typePrestation: "Shooting famille extérieur", montant: 380, statut: "termine", dateCreation: "2025-06-25", dateEcheance: "2025-07-30" },
  ],
  factures: [
    { id: "f1", reference: "FPHO-2026-001", clientId: "c1", clientNom: "Marine Dupont", dossierId: "d1", montant: 1400, statut: "payee", dateEmission: "2026-01-20", dateEcheance: "2026-02-20", description: "Mariage Dupont-Lefèvre — Acompte 50%" },
    { id: "f2", reference: "FPHO-2026-002", clientId: "c1", clientNom: "Marine Dupont", dossierId: "d2", montant: 350, statut: "payee", dateEmission: "2026-03-10", dateEcheance: "2026-04-10", description: "Séance engagement — Galerie livrée" },
    { id: "f3", reference: "FPHO-2026-003", clientId: "c3", clientNom: "Nicolas Bertrand", dossierId: "d4", montant: 1500, statut: "en_attente", dateEmission: "2026-03-15", dateEcheance: "2026-04-15", description: "Shooting immobilier — 5 biens" },
    { id: "f4", reference: "FPHO-2026-004", clientId: "c4", clientNom: "Isabelle Leroy", dossierId: "d6", montant: 600, statut: "en_retard", dateEmission: "2026-02-28", dateEcheance: "2026-03-20", description: "Shooting corporate — Acompte 50%" },
    { id: "f5", reference: "FPHO-2025-009", clientId: "c5", clientNom: "Guillaume Martin", dossierId: "d7", montant: 380, statut: "payee", dateEmission: "2025-07-28", dateEcheance: "2025-08-28", description: "Shooting famille — Galerie livrée" },
  ],
  devis: [
    { id: "dv1", reference: "DPHO-2026-001", clientId: "c3", clientNom: "Nicolas Bertrand", dossierId: "d5", titre: "Visite virtuelle 360° — Villa Cannes", montant: 800, statut: "en_attente", dateEmission: "2026-03-10", dateValidite: "2026-04-10" },
    { id: "dv2", reference: "DPHO-2026-002", clientId: "c2", clientNom: "Sofia Hernandez", dossierId: "d3", titre: "Portrait professionnel — 2h studio + 10 retouches", montant: 450, statut: "accepte", dateEmission: "2026-02-15", dateValidite: "2026-03-15" },
    { id: "dv3", reference: "DPHO-2026-003", clientId: "c4", clientNom: "Isabelle Leroy", dossierId: "d6", titre: "Shooting corporate équipe — 15 collaborateurs", montant: 1200, statut: "accepte", dateEmission: "2026-02-20", dateValidite: "2026-03-20" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Galerie prête pour sélection", description: "La galerie du shooting immobilier pour Luxe Immobilier est prête", date: "2026-03-25", lu: false, lien: "/admin/dossiers/d4", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Acompte en retard", description: "L'acompte de Maison Leroy pour le shooting corporate est en retard de 7 jours", date: "2026-03-27", lu: false, lien: "/admin/factures/f4", destinataire: "admin" },
    { id: "n3", type: "message", titre: "Sélection photos reçue", description: "Marine Dupont a terminé sa sélection pour la séance engagement", date: "2026-03-08", lu: true, lien: "/admin/dossiers/d2", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Retouches terminées", description: "Les retouches du shooting portrait de Sofia Hernandez sont prêtes", date: "2026-03-26", lu: false, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n5", type: "dossier", titre: "Votre galerie est disponible", description: "Vos photos de la séance engagement sont prêtes à consulter", date: "2026-03-10", lu: false, lien: "/client/dossiers/d2", destinataire: "client" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Fournier", prenom: "Raphaël", poste: "Photographe principal", statut: "disponible", couleur: "#3B82F6", capaciteMax: 4 },
    { id: "demo-emp-2", nom: "Picard", prenom: "Anaïs", poste: "Photographe", statut: "disponible", couleur: "#EC4899", capaciteMax: 4 },
    { id: "demo-emp-3", nom: "Lemaire", prenom: "Bastien", poste: "Retoucheur photo", statut: "disponible", couleur: "#F59E0B", capaciteMax: 6 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-15" }, { employeeId: "demo-emp-2", role: "renfort", dateAssignation: "2026-01-15" }],
    d2: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-10" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-03-01" }],
    d3: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-20" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-03-20" }],
    d4: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-01" }],
    d5: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-03-10" }],
    d6: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-25" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-03-15" }],
    d7: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-06-25" }],
  },
};

// ── DJ / ANIMATEUR ──

const djAnimateurMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Dupont", prenom: "Mathieu", email: "mathieu.dupont@gmail.com", telephone: "06 11 33 55 77", entreprise: "", statut: "actif", dateCreation: "2025-10-15", nombreDossiers: 1 },
    { id: "c2", nom: "Ben Salah", prenom: "Yasmine", email: "y.bensalah@hotmail.com", telephone: "06 22 44 66 88", entreprise: "", statut: "actif", dateCreation: "2025-12-01", nombreDossiers: 2 },
    { id: "c3", nom: "Fontaine", prenom: "Éric", email: "e.fontaine@eventcorp.fr", telephone: "06 33 55 77 99", entreprise: "EventCorp", statut: "actif", dateCreation: "2026-01-10", nombreDossiers: 2 },
    { id: "c4", nom: "Chevalier", prenom: "Laura", email: "laura.chevalier@outlook.fr", telephone: "06 44 66 88 00", entreprise: "", statut: "actif", dateCreation: "2026-02-20", nombreDossiers: 1 },
    { id: "c5", nom: "Petit", prenom: "David", email: "david.petit@gmail.com", telephone: "06 55 77 99 11", entreprise: "", statut: "inactif", dateCreation: "2025-06-05", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "DJ-2026-001", clientId: "c1", clientNom: "Mathieu Dupont", typePrestation: "Mariage Dupont-Renard — DJ", montant: 1800, statut: "en_cours", dateCreation: "2026-01-20", dateEcheance: "2026-06-14" },
    { id: "d2", reference: "DJ-2026-002", clientId: "c2", clientNom: "Yasmine Ben Salah", typePrestation: "Anniversaire 30 ans — Soirée privée", montant: 650, statut: "en_cours", dateCreation: "2026-02-05", dateEcheance: "2026-04-12" },
    { id: "d3", reference: "DJ-2026-003", clientId: "c2", clientNom: "Yasmine Ben Salah", typePrestation: "Henné — Ambiance orientale", montant: 500, statut: "en_attente", dateCreation: "2026-03-01", dateEcheance: "2026-04-10" },
    { id: "d4", reference: "DJ-2026-004", clientId: "c3", clientNom: "Éric Fontaine", typePrestation: "Soirée entreprise — Gala annuel EventCorp", montant: 2500, statut: "en_cours", dateCreation: "2026-01-15", dateEcheance: "2026-05-22" },
    { id: "d5", reference: "DJ-2026-005", clientId: "c3", clientNom: "Éric Fontaine", typePrestation: "Team building musical — 80 personnes", montant: 1200, statut: "en_attente", dateCreation: "2026-03-10", dateEcheance: "2026-05-30" },
    { id: "d6", reference: "DJ-2026-006", clientId: "c4", clientNom: "Laura Chevalier", typePrestation: "Fiançailles — Soirée intime 50 personnes", montant: 900, statut: "en_cours", dateCreation: "2026-02-25", dateEcheance: "2026-04-19" },
    { id: "d7", reference: "DJ-2025-014", clientId: "c5", clientNom: "David Petit", typePrestation: "Fête de quartier — Animation DJ", montant: 400, statut: "termine", dateCreation: "2025-06-10", dateEcheance: "2025-07-14" },
  ],
  factures: [
    { id: "f1", reference: "FDJ-2026-001", clientId: "c1", clientNom: "Mathieu Dupont", dossierId: "d1", montant: 900, statut: "payee", dateEmission: "2026-01-25", dateEcheance: "2026-02-25", description: "Mariage Dupont-Renard — Acompte 50%" },
    { id: "f2", reference: "FDJ-2026-002", clientId: "c2", clientNom: "Yasmine Ben Salah", dossierId: "d2", montant: 325, statut: "payee", dateEmission: "2026-02-10", dateEcheance: "2026-03-10", description: "Anniversaire 30 ans — Acompte 50%" },
    { id: "f3", reference: "FDJ-2026-003", clientId: "c3", clientNom: "Éric Fontaine", dossierId: "d4", montant: 1250, statut: "en_attente", dateEmission: "2026-03-15", dateEcheance: "2026-04-15", description: "Gala annuel EventCorp — Acompte 50%" },
    { id: "f4", reference: "FDJ-2026-004", clientId: "c4", clientNom: "Laura Chevalier", dossierId: "d6", montant: 450, statut: "en_retard", dateEmission: "2026-02-28", dateEcheance: "2026-03-20", description: "Fiançailles — Acompte 50%" },
    { id: "f5", reference: "FDJ-2025-008", clientId: "c5", clientNom: "David Petit", dossierId: "d7", montant: 400, statut: "payee", dateEmission: "2025-07-15", dateEcheance: "2025-08-15", description: "Fête de quartier — Solde" },
  ],
  devis: [
    { id: "dv1", reference: "DDJ-2026-001", clientId: "c2", clientNom: "Yasmine Ben Salah", dossierId: "d3", titre: "Henné — Ambiance orientale — 3h sono + éclairage", montant: 500, statut: "en_attente", dateEmission: "2026-03-01", dateValidite: "2026-04-01" },
    { id: "dv2", reference: "DDJ-2026-002", clientId: "c3", clientNom: "Éric Fontaine", dossierId: "d5", titre: "Team building musical — DJ + quiz interactif", montant: 1200, statut: "en_attente", dateEmission: "2026-03-10", dateValidite: "2026-04-10" },
    { id: "dv3", reference: "DDJ-2026-003", clientId: "c4", clientNom: "Laura Chevalier", dossierId: "d6", titre: "Fiançailles — DJ + éclairage ambiance — 4h", montant: 900, statut: "accepte", dateEmission: "2026-02-20", dateValidite: "2026-03-20" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Événement dans 3 semaines", description: "Le mariage Dupont-Renard est prévu le 14 juin — brief final à planifier", date: "2026-03-25", lu: false, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Acompte en retard", description: "L'acompte de Laura Chevalier pour les fiançailles est en retard de 7 jours", date: "2026-03-27", lu: false, lien: "/admin/factures/f4", destinataire: "admin" },
    { id: "n3", type: "devis", titre: "Devis en attente", description: "Le devis pour le henné de Yasmine Ben Salah attend validation depuis 26 jours", date: "2026-03-27", lu: false, lien: "/admin/devis/dv1", destinataire: "admin" },
    { id: "n4", type: "message", titre: "Nouveau message d'Éric Fontaine", description: "Détails sur le thème et dress code du gala annuel EventCorp", date: "2026-03-24", lu: true, lien: "/admin/dossiers/d4", destinataire: "admin" },
    { id: "n5", type: "dossier", titre: "Contrat signé", description: "Votre contrat pour le DJ du mariage a été confirmé", date: "2026-01-28", lu: true, lien: "/client/dossiers/d1", destinataire: "client" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Kessler", prenom: "Maxime", poste: "DJ principal", statut: "disponible", couleur: "#8B5CF6", capaciteMax: 3 },
    { id: "demo-emp-2", nom: "Diallo", prenom: "Amadou", poste: "DJ / Animateur", statut: "disponible", couleur: "#F59E0B", capaciteMax: 4 },
    { id: "demo-emp-3", nom: "Vidal", prenom: "Romain", poste: "Régisseur son et lumière", statut: "disponible", couleur: "#10B981", capaciteMax: 5 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-20" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-01-20" }],
    d2: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-05" }],
    d3: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-01" }],
    d4: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-15" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-01-15" }],
    d5: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-10" }],
    d6: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-25" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-25" }],
    d7: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-06-10" }],
  },
};
// ── ÉVÉNEMENTIEL ──

const evenementielMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Lefèvre", prenom: "Aurélien", email: "aurelien.lefevre@novacorp.fr", telephone: "06 12 34 56 78", entreprise: "NovaCorp", statut: "actif", dateCreation: "2026-01-10", nombreDossiers: 2 },
    { id: "c2", nom: "Giraud", prenom: "Camille", email: "camille.giraud@gmail.com", telephone: "06 23 45 67 89", entreprise: "", statut: "actif", dateCreation: "2026-01-18", nombreDossiers: 1 },
    { id: "c3", nom: "Moreau", prenom: "Vincent", email: "v.moreau@greentech.io", telephone: "06 34 56 78 90", entreprise: "GreenTech Solutions", statut: "actif", dateCreation: "2026-02-03", nombreDossiers: 2 },
    { id: "c4", nom: "Dubois", prenom: "Nathalie", email: "n.dubois@mairie-versailles.fr", telephone: "06 45 67 89 01", entreprise: "Mairie de Versailles", statut: "actif", dateCreation: "2026-02-15", nombreDossiers: 1 },
    { id: "c5", nom: "Petit", prenom: "Julien", email: "julien.petit@startuplab.fr", telephone: "06 56 78 90 12", entreprise: "StartupLab", statut: "inactif", dateCreation: "2025-11-20", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "EVT-2026-001", clientId: "c1", clientNom: "Lefèvre Aurélien", typePrestation: "Séminaire entreprise 200 pers.", montant: 18500, statut: "en_cours", dateCreation: "2026-01-12", dateEcheance: "2026-04-15" },
    { id: "d2", reference: "EVT-2026-002", clientId: "c1", clientNom: "Lefèvre Aurélien", typePrestation: "Team building outdoor 50 pers.", montant: 6200, statut: "en_attente", dateCreation: "2026-02-20", dateEcheance: "2026-05-30" },
    { id: "d3", reference: "EVT-2026-003", clientId: "c2", clientNom: "Giraud Camille", typePrestation: "Anniversaire privé 120 pers.", montant: 9800, statut: "en_cours", dateCreation: "2026-01-25", dateEcheance: "2026-06-14" },
    { id: "d4", reference: "EVT-2026-004", clientId: "c3", clientNom: "Moreau Vincent", typePrestation: "Lancement produit tech", montant: 22000, statut: "en_cours", dateCreation: "2026-02-05", dateEcheance: "2026-04-28" },
    { id: "d5", reference: "EVT-2026-005", clientId: "c3", clientNom: "Moreau Vincent", typePrestation: "Soirée de gala 300 pers.", montant: 35000, statut: "en_attente", dateCreation: "2026-03-01", dateEcheance: "2026-09-20" },
    { id: "d6", reference: "EVT-2026-006", clientId: "c4", clientNom: "Dubois Nathalie", typePrestation: "Cérémonie officielle mairie", montant: 12500, statut: "en_cours", dateCreation: "2026-02-18", dateEcheance: "2026-05-08" },
    { id: "d7", reference: "EVT-2026-007", clientId: "c5", clientNom: "Petit Julien", typePrestation: "Afterwork networking 80 pers.", montant: 4500, statut: "termine", dateCreation: "2025-12-01", dateEcheance: "2026-01-30" },
  ],
  factures: [
    { id: "f1", reference: "FACT-EVT-001", clientId: "c1", clientNom: "Lefèvre Aurélien", dossierId: "d1", montant: 9250, statut: "payee", dateEmission: "2026-01-15", dateEcheance: "2026-02-15", description: "Acompte 50% — Séminaire entreprise" },
    { id: "f2", reference: "FACT-EVT-002", clientId: "c2", clientNom: "Giraud Camille", dossierId: "d3", montant: 4900, statut: "payee", dateEmission: "2026-02-01", dateEcheance: "2026-03-01", description: "Acompte 50% — Anniversaire privé" },
    { id: "f3", reference: "FACT-EVT-003", clientId: "c3", clientNom: "Moreau Vincent", dossierId: "d4", montant: 11000, statut: "en_attente", dateEmission: "2026-02-10", dateEcheance: "2026-03-10", description: "Acompte 50% — Lancement produit" },
    { id: "f4", reference: "FACT-EVT-004", clientId: "c4", clientNom: "Dubois Nathalie", dossierId: "d6", montant: 12500, statut: "en_retard", dateEmission: "2026-02-20", dateEcheance: "2026-03-20", description: "Facture totale — Cérémonie officielle" },
    { id: "f5", reference: "FACT-EVT-005", clientId: "c5", clientNom: "Petit Julien", dossierId: "d7", montant: 4500, statut: "payee", dateEmission: "2026-01-31", dateEcheance: "2026-02-28", description: "Solde final — Afterwork networking" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-EVT-001", clientId: "c1", clientNom: "Lefèvre Aurélien", dossierId: "d2", titre: "Team building outdoor 50 personnes", montant: 6200, statut: "en_attente", dateEmission: "2026-02-22", dateValidite: "2026-03-22" },
    { id: "dv2", reference: "DEV-EVT-002", clientId: "c3", clientNom: "Moreau Vincent", dossierId: "d5", titre: "Soirée de gala 300 personnes — Château de Vincennes", montant: 35000, statut: "en_attente", dateEmission: "2026-03-05", dateValidite: "2026-04-05" },
    { id: "dv3", reference: "DEV-EVT-003", clientId: "c4", clientNom: "Dubois Nathalie", dossierId: "d6", titre: "Cérémonie officielle avec cocktail", montant: 12500, statut: "accepte", dateEmission: "2026-02-16", dateValidite: "2026-03-16" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Nouveau dossier créé", description: "Séminaire entreprise 200 pers. — NovaCorp", date: "2026-01-12", lu: true, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n2", type: "devis", titre: "Devis en attente de validation", description: "Soirée de gala 300 pers. — GreenTech Solutions", date: "2026-03-05", lu: false, lien: "/admin/dossiers/d5", destinataire: "admin" },
    { id: "n3", type: "facture", titre: "Facture en retard", description: "Cérémonie officielle — Mairie de Versailles — 12 500 €", date: "2026-03-21", lu: false, lien: "/admin/dossiers/d6", destinataire: "admin" },
    { id: "n4", type: "message", titre: "Nouveau message client", description: "Camille Giraud a envoyé un message concernant son anniversaire", date: "2026-03-15", lu: false, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n5", type: "dossier", titre: "Dossier terminé", description: "Afterwork networking — StartupLab — Prestation réalisée", date: "2026-01-30", lu: true, lien: "/admin/dossiers/d7", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Renard", prenom: "Sophie", poste: "Cheffe de projet événementiel", statut: "disponible", couleur: "#8B5CF6", capaciteMax: 4 },
    { id: "demo-emp-2", nom: "Martin", prenom: "Lucas", poste: "Chef de projet événementiel", statut: "disponible", couleur: "#F59E0B", capaciteMax: 4 },
    { id: "demo-emp-3", nom: "Leclerc", prenom: "Inès", poste: "Coordinatrice logistique", statut: "disponible", couleur: "#10B981", capaciteMax: 5 },
  ],
  assignments: {
    "d1": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-12" }],
    "d2": [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-20" }],
    "d3": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-25" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-10" }],
    "d4": [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-05" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-12" }],
    "d5": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-03-01" }],
    "d6": [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-02-18" }],
    "d7": [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-12-01" }],
  },
};

// ── COMMUNITY MANAGER ──

const communityManagerMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Barbier", prenom: "Élodie", email: "elodie@maisonbarbier.fr", telephone: "06 11 22 33 44", entreprise: "Maison Barbier", statut: "actif", dateCreation: "2026-01-05", nombreDossiers: 2 },
    { id: "c2", nom: "Fernandez", prenom: "Carlos", email: "carlos@soleilfit.com", telephone: "06 22 33 44 55", entreprise: "Soleil Fit", statut: "actif", dateCreation: "2026-01-12", nombreDossiers: 1 },
    { id: "c3", nom: "Nguyen", prenom: "Linh", email: "linh.nguyen@thecraft.fr", telephone: "06 33 44 55 66", entreprise: "The Craft Studio", statut: "actif", dateCreation: "2026-02-01", nombreDossiers: 2 },
    { id: "c4", nom: "Roche", prenom: "Maxime", email: "m.roche@vitalismontpellier.fr", telephone: "06 44 55 66 77", entreprise: "Vitalis Montpellier", statut: "actif", dateCreation: "2026-02-10", nombreDossiers: 1 },
    { id: "c5", nom: "Blanchard", prenom: "Amandine", email: "amandine@laptitefab.fr", telephone: "06 55 66 77 88", entreprise: "La P'tite Fab", statut: "inactif", dateCreation: "2025-10-15", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "CM-2026-001", clientId: "c1", clientNom: "Barbier Élodie", typePrestation: "Pack réseaux sociaux — Instagram + Facebook", montant: 1200, statut: "en_cours", dateCreation: "2026-01-08", dateEcheance: "2026-04-08" },
    { id: "d2", reference: "CM-2026-002", clientId: "c1", clientNom: "Barbier Élodie", typePrestation: "Campagne publicitaire Meta Ads", montant: 2500, statut: "en_attente", dateCreation: "2026-03-01", dateEcheance: "2026-04-30" },
    { id: "d3", reference: "CM-2026-003", clientId: "c2", clientNom: "Fernandez Carlos", typePrestation: "Gestion Instagram + TikTok — Salle de sport", montant: 1500, statut: "en_cours", dateCreation: "2026-01-15", dateEcheance: "2026-07-15" },
    { id: "d4", reference: "CM-2026-004", clientId: "c3", clientNom: "Nguyen Linh", typePrestation: "Stratégie de contenu marque artisanale", montant: 3200, statut: "en_cours", dateCreation: "2026-02-05", dateEcheance: "2026-05-05" },
    { id: "d5", reference: "CM-2026-005", clientId: "c3", clientNom: "Nguyen Linh", typePrestation: "Campagne Instagram Reels — Lancement collection", montant: 1800, statut: "en_attente", dateCreation: "2026-03-10", dateEcheance: "2026-04-20" },
    { id: "d6", reference: "CM-2026-006", clientId: "c4", clientNom: "Roche Maxime", typePrestation: "Pack LinkedIn B2B — Cabinet ostéopathe", montant: 900, statut: "en_cours", dateCreation: "2026-02-12", dateEcheance: "2026-05-12" },
    { id: "d7", reference: "CM-2026-007", clientId: "c5", clientNom: "Blanchard Amandine", typePrestation: "Audit réseaux sociaux + recommandations", montant: 650, statut: "termine", dateCreation: "2025-10-20", dateEcheance: "2025-11-20" },
  ],
  factures: [
    { id: "f1", reference: "FACT-CM-001", clientId: "c1", clientNom: "Barbier Élodie", dossierId: "d1", montant: 1200, statut: "payee", dateEmission: "2026-01-08", dateEcheance: "2026-02-08", description: "Pack réseaux sociaux — Trimestre 1" },
    { id: "f2", reference: "FACT-CM-002", clientId: "c2", clientNom: "Fernandez Carlos", dossierId: "d3", montant: 750, statut: "payee", dateEmission: "2026-01-15", dateEcheance: "2026-02-15", description: "Gestion Instagram + TikTok — Mois 1-2" },
    { id: "f3", reference: "FACT-CM-003", clientId: "c3", clientNom: "Nguyen Linh", dossierId: "d4", montant: 1600, statut: "en_attente", dateEmission: "2026-02-05", dateEcheance: "2026-03-05", description: "Acompte 50% — Stratégie de contenu" },
    { id: "f4", reference: "FACT-CM-004", clientId: "c4", clientNom: "Roche Maxime", dossierId: "d6", montant: 900, statut: "en_retard", dateEmission: "2026-02-12", dateEcheance: "2026-03-12", description: "Pack LinkedIn B2B — Trimestre complet" },
    { id: "f5", reference: "FACT-CM-005", clientId: "c5", clientNom: "Blanchard Amandine", dossierId: "d7", montant: 650, statut: "payee", dateEmission: "2025-11-20", dateEcheance: "2025-12-20", description: "Audit réseaux sociaux" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-CM-001", clientId: "c1", clientNom: "Barbier Élodie", dossierId: "d2", titre: "Campagne publicitaire Meta Ads — Budget 2 500 €", montant: 2500, statut: "en_attente", dateEmission: "2026-03-01", dateValidite: "2026-03-31" },
    { id: "dv2", reference: "DEV-CM-002", clientId: "c3", clientNom: "Nguyen Linh", dossierId: "d5", titre: "Campagne Instagram Reels — Lancement collection printemps", montant: 1800, statut: "en_attente", dateEmission: "2026-03-10", dateValidite: "2026-04-10" },
    { id: "dv3", reference: "DEV-CM-003", clientId: "c2", clientNom: "Fernandez Carlos", dossierId: "d3", titre: "Extension TikTok — Création contenu vidéo mensuel", montant: 800, statut: "accepte", dateEmission: "2026-02-20", dateValidite: "2026-03-20" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Nouveau dossier créé", description: "Pack réseaux sociaux — Maison Barbier", date: "2026-01-08", lu: true, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n2", type: "devis", titre: "Devis envoyé", description: "Campagne Meta Ads — Maison Barbier — 2 500 €", date: "2026-03-01", lu: false, lien: "/admin/dossiers/d2", destinataire: "admin" },
    { id: "n3", type: "facture", titre: "Facture en retard", description: "Pack LinkedIn B2B — Vitalis Montpellier — 900 €", date: "2026-03-13", lu: false, lien: "/admin/dossiers/d6", destinataire: "admin" },
    { id: "n4", type: "message", titre: "Nouveau message client", description: "Linh Nguyen — Question sur le calendrier éditorial", date: "2026-03-18", lu: false, lien: "/admin/dossiers/d4", destinataire: "admin" },
    { id: "n5", type: "dossier", titre: "Dossier terminé", description: "Audit réseaux sociaux — La P'tite Fab", date: "2025-11-20", lu: true, lien: "/admin/dossiers/d7", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Da Silva", prenom: "Mélissa", poste: "Community Manager senior", statut: "disponible", couleur: "#EC4899", capaciteMax: 5 },
    { id: "demo-emp-2", nom: "Kone", prenom: "Ibrahim", poste: "Chargé de compte digital", statut: "disponible", couleur: "#3B82F6", capaciteMax: 5 },
    { id: "demo-emp-3", nom: "Perrin", prenom: "Chloé", poste: "Community Manager junior", statut: "disponible", couleur: "#F97316", capaciteMax: 4 },
  ],
  assignments: {
    "d1": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-08" }],
    "d2": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-03-01" }],
    "d3": [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-01-15" }],
    "d4": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-05" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-15" }],
    "d5": [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-03-10" }],
    "d6": [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-12" }],
    "d7": [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2025-10-20" }],
  },
};

// ── FORMATEUR ──

const formateurMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Bertrand", prenom: "Claire", email: "claire.bertrand@logipro.fr", telephone: "06 10 20 30 40", entreprise: "LogiPro SARL", statut: "actif", dateCreation: "2026-01-08", nombreDossiers: 2 },
    { id: "c2", nom: "Hamidi", prenom: "Rachid", email: "rachid.hamidi@gmail.com", telephone: "06 20 30 40 50", entreprise: "", statut: "actif", dateCreation: "2026-01-20", nombreDossiers: 1 },
    { id: "c3", nom: "Leconte", prenom: "Marie", email: "m.leconte@cabinet-leconte.fr", telephone: "06 30 40 50 60", entreprise: "Cabinet Leconte", statut: "actif", dateCreation: "2026-02-01", nombreDossiers: 2 },
    { id: "c4", nom: "Pham", prenom: "Thomas", email: "thomas.pham@urbancode.io", telephone: "06 40 50 60 70", entreprise: "UrbanCode", statut: "actif", dateCreation: "2026-02-15", nombreDossiers: 1 },
    { id: "c5", nom: "Garcia", prenom: "Isabelle", email: "isabelle.garcia@afpa.fr", telephone: "06 50 60 70 80", entreprise: "AFPA Toulouse", statut: "inactif", dateCreation: "2025-09-10", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "FOR-2026-001", clientId: "c1", clientNom: "Bertrand Claire", typePrestation: "Formation Excel avancé — 3 jours", montant: 2400, statut: "en_cours", dateCreation: "2026-01-10", dateEcheance: "2026-02-28" },
    { id: "d2", reference: "FOR-2026-002", clientId: "c1", clientNom: "Bertrand Claire", typePrestation: "Formation Power BI — Initiation", montant: 1800, statut: "en_attente", dateCreation: "2026-03-05", dateEcheance: "2026-04-15" },
    { id: "d3", reference: "FOR-2026-003", clientId: "c2", clientNom: "Hamidi Rachid", typePrestation: "Initiation marketing digital — 2 jours", montant: 1200, statut: "en_cours", dateCreation: "2026-01-22", dateEcheance: "2026-03-15" },
    { id: "d4", reference: "FOR-2026-004", clientId: "c3", clientNom: "Leconte Marie", typePrestation: "Formation management d'équipe — 5 jours", montant: 4500, statut: "en_cours", dateCreation: "2026-02-03", dateEcheance: "2026-04-30" },
    { id: "d5", reference: "FOR-2026-005", clientId: "c3", clientNom: "Leconte Marie", typePrestation: "Atelier prise de parole en public", montant: 800, statut: "en_attente", dateCreation: "2026-03-12", dateEcheance: "2026-04-20" },
    { id: "d6", reference: "FOR-2026-006", clientId: "c4", clientNom: "Pham Thomas", typePrestation: "Formation cybersécurité — Sensibilisation équipe", montant: 3200, statut: "en_cours", dateCreation: "2026-02-18", dateEcheance: "2026-04-10" },
    { id: "d7", reference: "FOR-2026-007", clientId: "c5", clientNom: "Garcia Isabelle", typePrestation: "Formation bureautique — Pack Office complet", montant: 1600, statut: "termine", dateCreation: "2025-09-15", dateEcheance: "2025-12-15" },
  ],
  factures: [
    { id: "f1", reference: "FACT-FOR-001", clientId: "c1", clientNom: "Bertrand Claire", dossierId: "d1", montant: 2400, statut: "payee", dateEmission: "2026-01-10", dateEcheance: "2026-02-10", description: "Formation Excel avancé — 3 jours — 4 stagiaires" },
    { id: "f2", reference: "FACT-FOR-002", clientId: "c2", clientNom: "Hamidi Rachid", dossierId: "d3", montant: 1200, statut: "en_attente", dateEmission: "2026-01-22", dateEcheance: "2026-02-22", description: "Initiation marketing digital — 2 jours" },
    { id: "f3", reference: "FACT-FOR-003", clientId: "c3", clientNom: "Leconte Marie", dossierId: "d4", montant: 2250, statut: "payee", dateEmission: "2026-02-03", dateEcheance: "2026-03-03", description: "Acompte 50% — Formation management d'équipe" },
    { id: "f4", reference: "FACT-FOR-004", clientId: "c4", clientNom: "Pham Thomas", dossierId: "d6", montant: 3200, statut: "en_retard", dateEmission: "2026-02-18", dateEcheance: "2026-03-18", description: "Formation cybersécurité — Sensibilisation" },
    { id: "f5", reference: "FACT-FOR-005", clientId: "c5", clientNom: "Garcia Isabelle", dossierId: "d7", montant: 1600, statut: "payee", dateEmission: "2025-12-15", dateEcheance: "2026-01-15", description: "Formation bureautique — Pack Office complet" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-FOR-001", clientId: "c1", clientNom: "Bertrand Claire", dossierId: "d2", titre: "Formation Power BI — Initiation — 2 jours — 6 stagiaires", montant: 1800, statut: "en_attente", dateEmission: "2026-03-05", dateValidite: "2026-04-05" },
    { id: "dv2", reference: "DEV-FOR-002", clientId: "c3", clientNom: "Leconte Marie", dossierId: "d5", titre: "Atelier prise de parole en public — 1 jour — 8 participants", montant: 800, statut: "en_attente", dateEmission: "2026-03-12", dateValidite: "2026-04-12" },
    { id: "dv3", reference: "DEV-FOR-003", clientId: "c4", clientNom: "Pham Thomas", dossierId: "d6", titre: "Formation cybersécurité — Module avancé (optionnel)", montant: 2800, statut: "refuse", dateEmission: "2026-02-20", dateValidite: "2026-03-20" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Formation en cours", description: "Excel avancé — LogiPro SARL — Jour 2/3", date: "2026-02-15", lu: true, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n2", type: "devis", titre: "Devis envoyé", description: "Power BI Initiation — LogiPro SARL — 1 800 €", date: "2026-03-05", lu: false, lien: "/admin/dossiers/d2", destinataire: "admin" },
    { id: "n3", type: "facture", titre: "Facture en retard", description: "Cybersécurité — UrbanCode — 3 200 €", date: "2026-03-19", lu: false, lien: "/admin/dossiers/d6", destinataire: "admin" },
    { id: "n4", type: "message", titre: "Nouveau message stagiaire", description: "Rachid Hamidi — Demande de report de session", date: "2026-03-10", lu: false, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n5", type: "dossier", titre: "Attestation délivrée", description: "Formation bureautique — AFPA Toulouse — Terminée", date: "2025-12-15", lu: true, lien: "/admin/dossiers/d7", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Duval", prenom: "Antoine", poste: "Formateur senior — Bureautique & Data", statut: "disponible", couleur: "#6366F1", capaciteMax: 3 },
    { id: "demo-emp-2", nom: "Moulin", prenom: "Sarah", poste: "Formatrice — Management & Soft skills", statut: "disponible", couleur: "#14B8A6", capaciteMax: 3 },
    { id: "demo-emp-3", nom: "Benali", prenom: "Youssef", poste: "Formateur — IT & Cybersécurité", statut: "disponible", couleur: "#EF4444", capaciteMax: 3 },
  ],
  assignments: {
    "d1": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-10" }],
    "d2": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-03-05" }],
    "d3": [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-01-22" }],
    "d4": [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-03" }],
    "d5": [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-12" }],
    "d6": [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-02-18" }],
    "d7": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-09-15" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2025-10-01" }],
  },
};

// ── TRAITEUR ──

const traiteurMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Vasseur", prenom: "Pauline", email: "pauline.vasseur@gmail.com", telephone: "06 12 45 78 90", entreprise: "", statut: "actif", dateCreation: "2026-01-05", nombreDossiers: 2 },
    { id: "c2", nom: "Lambert", prenom: "Frédéric", email: "f.lambert@axiom-consulting.fr", telephone: "06 23 56 89 01", entreprise: "Axiom Consulting", statut: "actif", dateCreation: "2026-01-18", nombreDossiers: 1 },
    { id: "c3", nom: "Toussaint", prenom: "Chantal", email: "chantal.toussaint@orange.fr", telephone: "06 34 67 90 12", entreprise: "", statut: "actif", dateCreation: "2026-02-02", nombreDossiers: 2 },
    { id: "c4", nom: "Boucher", prenom: "Romain", email: "romain@eventsparis.fr", telephone: "06 45 78 01 23", entreprise: "Events Paris", statut: "actif", dateCreation: "2026-02-20", nombreDossiers: 1 },
    { id: "c5", nom: "Leroy", prenom: "Sandrine", email: "sandrine.leroy@hotmail.fr", telephone: "06 56 89 12 34", entreprise: "", statut: "inactif", dateCreation: "2025-10-01", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "TRT-2026-001", clientId: "c1", clientNom: "Vasseur Pauline", typePrestation: "Buffet mariage 80 pers. — Menu gastronomique", montant: 7200, statut: "en_cours", dateCreation: "2026-01-08", dateEcheance: "2026-06-21" },
    { id: "d2", reference: "TRT-2026-002", clientId: "c1", clientNom: "Vasseur Pauline", typePrestation: "Brunch lendemain mariage 40 pers.", montant: 1600, statut: "en_attente", dateCreation: "2026-02-10", dateEcheance: "2026-06-22" },
    { id: "d3", reference: "TRT-2026-003", clientId: "c2", clientNom: "Lambert Frédéric", typePrestation: "Cocktail entreprise 120 pers. — Finger food", montant: 5400, statut: "en_cours", dateCreation: "2026-01-20", dateEcheance: "2026-04-10" },
    { id: "d4", reference: "TRT-2026-004", clientId: "c3", clientNom: "Toussaint Chantal", typePrestation: "Repas anniversaire 60 pers. — Menu tradition", montant: 3600, statut: "en_cours", dateCreation: "2026-02-05", dateEcheance: "2026-05-15" },
    { id: "d5", reference: "TRT-2026-005", clientId: "c3", clientNom: "Toussaint Chantal", typePrestation: "Plateau apéritif communion 30 pers.", montant: 1200, statut: "en_attente", dateCreation: "2026-03-15", dateEcheance: "2026-05-25" },
    { id: "d6", reference: "TRT-2026-006", clientId: "c4", clientNom: "Boucher Romain", typePrestation: "Cocktail dînatoire gala 200 pers.", montant: 14000, statut: "en_cours", dateCreation: "2026-02-22", dateEcheance: "2026-06-05" },
    { id: "d7", reference: "TRT-2026-007", clientId: "c5", clientNom: "Leroy Sandrine", typePrestation: "Buffet froid baptême 50 pers.", montant: 2200, statut: "termine", dateCreation: "2025-10-05", dateEcheance: "2025-12-08" },
  ],
  factures: [
    { id: "f1", reference: "FACT-TRT-001", clientId: "c1", clientNom: "Vasseur Pauline", dossierId: "d1", montant: 3600, statut: "payee", dateEmission: "2026-01-10", dateEcheance: "2026-02-10", description: "Acompte 50% — Buffet mariage 80 pers." },
    { id: "f2", reference: "FACT-TRT-002", clientId: "c2", clientNom: "Lambert Frédéric", dossierId: "d3", montant: 2700, statut: "payee", dateEmission: "2026-01-22", dateEcheance: "2026-02-22", description: "Acompte 50% — Cocktail entreprise" },
    { id: "f3", reference: "FACT-TRT-003", clientId: "c3", clientNom: "Toussaint Chantal", dossierId: "d4", montant: 3600, statut: "en_attente", dateEmission: "2026-02-05", dateEcheance: "2026-03-05", description: "Repas anniversaire 60 pers. — Facture totale" },
    { id: "f4", reference: "FACT-TRT-004", clientId: "c4", clientNom: "Boucher Romain", dossierId: "d6", montant: 7000, statut: "en_retard", dateEmission: "2026-02-25", dateEcheance: "2026-03-25", description: "Acompte 50% — Cocktail dînatoire gala" },
    { id: "f5", reference: "FACT-TRT-005", clientId: "c5", clientNom: "Leroy Sandrine", dossierId: "d7", montant: 2200, statut: "payee", dateEmission: "2025-12-10", dateEcheance: "2026-01-10", description: "Solde final — Buffet froid baptême" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-TRT-001", clientId: "c1", clientNom: "Vasseur Pauline", dossierId: "d2", titre: "Brunch lendemain mariage — 40 pers. — Formule complète", montant: 1600, statut: "en_attente", dateEmission: "2026-02-10", dateValidite: "2026-03-10" },
    { id: "dv2", reference: "DEV-TRT-002", clientId: "c3", clientNom: "Toussaint Chantal", dossierId: "d5", titre: "Plateau apéritif communion — 30 pers. — Salé + sucré", montant: 1200, statut: "en_attente", dateEmission: "2026-03-15", dateValidite: "2026-04-15" },
    { id: "dv3", reference: "DEV-TRT-003", clientId: "c4", clientNom: "Boucher Romain", dossierId: "d6", titre: "Cocktail dînatoire gala — 200 pers. — Menu prestige", montant: 14000, statut: "accepte", dateEmission: "2026-02-20", dateValidite: "2026-03-20" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Menu validé par le client", description: "Buffet mariage 80 pers. — Vasseur Pauline", date: "2026-02-20", lu: true, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n2", type: "devis", titre: "Devis en attente", description: "Brunch lendemain mariage — Vasseur Pauline — 1 600 €", date: "2026-02-10", lu: false, lien: "/admin/dossiers/d2", destinataire: "admin" },
    { id: "n3", type: "facture", titre: "Facture en retard", description: "Cocktail dînatoire gala — Events Paris — 7 000 €", date: "2026-03-26", lu: false, lien: "/admin/dossiers/d6", destinataire: "admin" },
    { id: "n4", type: "message", titre: "Nouveau message client", description: "Chantal Toussaint — Modification du menu anniversaire", date: "2026-03-20", lu: false, lien: "/admin/dossiers/d4", destinataire: "admin" },
    { id: "n5", type: "dossier", titre: "Prestation terminée", description: "Buffet froid baptême — Leroy Sandrine — Soldé", date: "2025-12-08", lu: true, lien: "/admin/dossiers/d7", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Delorme", prenom: "Julien", poste: "Chef cuisinier", statut: "disponible", couleur: "#DC2626", capaciteMax: 3 },
    { id: "demo-emp-2", nom: "Nakamura", prenom: "Yuki", poste: "Cheffe pâtissière", statut: "disponible", couleur: "#D946EF", capaciteMax: 3 },
    { id: "demo-emp-3", nom: "Faure", prenom: "Sébastien", poste: "Second de cuisine", statut: "disponible", couleur: "#0EA5E9", capaciteMax: 4 },
  ],
  assignments: {
    "d1": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-08" }, { employeeId: "demo-emp-2", role: "renfort", dateAssignation: "2026-01-15" }],
    "d2": [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-02-10" }],
    "d3": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-20" }],
    "d4": [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-02-05" }],
    "d5": [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-15" }],
    "d6": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-22" }, { employeeId: "demo-emp-2", role: "renfort", dateAssignation: "2026-03-01" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-03-01" }],
    "d7": [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2025-10-05" }],
  },
};

// ── IMMOBILIER ──

const immobilierMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Marchand", prenom: "Philippe", email: "philippe.marchand@free.fr", telephone: "06 11 33 55 77", entreprise: "", statut: "actif", dateCreation: "2026-01-03", nombreDossiers: 2 },
    { id: "c2", nom: "Benali", prenom: "Samira", email: "samira.benali@gmail.com", telephone: "06 22 44 66 88", entreprise: "", statut: "actif", dateCreation: "2026-01-15", nombreDossiers: 1 },
    { id: "c3", nom: "Durand", prenom: "Jean-Pierre", email: "jp.durand@sci-lestoits.fr", telephone: "06 33 55 77 99", entreprise: "SCI Les Toits", statut: "actif", dateCreation: "2026-02-01", nombreDossiers: 2 },
    { id: "c4", nom: "Fournier", prenom: "Stéphanie", email: "stephanie.fournier@outlook.fr", telephone: "06 44 66 88 00", entreprise: "", statut: "actif", dateCreation: "2026-02-12", nombreDossiers: 1 },
    { id: "c5", nom: "Ozdemir", prenom: "Kemal", email: "kemal.ozdemir@laposte.net", telephone: "06 55 77 99 11", entreprise: "", statut: "inactif", dateCreation: "2025-08-20", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "IMM-2026-001", clientId: "c1", clientNom: "Marchand Philippe", typePrestation: "Mandat vente — T3 Nice centre — 72m²", montant: 285000, statut: "en_cours", dateCreation: "2026-01-05", dateEcheance: "2026-07-05" },
    { id: "d2", reference: "IMM-2026-002", clientId: "c1", clientNom: "Marchand Philippe", typePrestation: "Mandat vente — Studio Antibes — 28m²", montant: 145000, statut: "en_attente", dateCreation: "2026-03-01", dateEcheance: "2026-09-01" },
    { id: "d3", reference: "IMM-2026-003", clientId: "c2", clientNom: "Benali Samira", typePrestation: "Recherche acquéreur — Maison Marseille 13008", montant: 420000, statut: "en_cours", dateCreation: "2026-01-18", dateEcheance: "2026-07-18" },
    { id: "d4", reference: "IMM-2026-004", clientId: "c3", clientNom: "Durand Jean-Pierre", typePrestation: "Gestion locative — T2 Lyon 3e", montant: 850, statut: "en_cours", dateCreation: "2026-02-03", dateEcheance: "2027-02-03" },
    { id: "d5", reference: "IMM-2026-005", clientId: "c3", clientNom: "Durand Jean-Pierre", typePrestation: "Gestion locative — T4 Lyon 7e", montant: 1200, statut: "en_cours", dateCreation: "2026-02-03", dateEcheance: "2027-02-03" },
    { id: "d6", reference: "IMM-2026-006", clientId: "c4", clientNom: "Fournier Stéphanie", typePrestation: "Mandat recherche — T3 Bordeaux centre — Budget 280 000 €", montant: 280000, statut: "en_cours", dateCreation: "2026-02-14", dateEcheance: "2026-08-14" },
    { id: "d7", reference: "IMM-2026-007", clientId: "c5", clientNom: "Ozdemir Kemal", typePrestation: "Mandat vente — T2 Toulouse — 45m²", montant: 165000, statut: "termine", dateCreation: "2025-08-25", dateEcheance: "2026-01-15" },
  ],
  factures: [
    { id: "f1", reference: "FACT-IMM-001", clientId: "c1", clientNom: "Marchand Philippe", dossierId: "d1", montant: 14250, statut: "en_attente", dateEmission: "2026-03-15", dateEcheance: "2026-04-15", description: "Honoraires agence 5% — T3 Nice (vente en cours)" },
    { id: "f2", reference: "FACT-IMM-002", clientId: "c2", clientNom: "Benali Samira", dossierId: "d3", montant: 21000, statut: "en_attente", dateEmission: "2026-03-10", dateEcheance: "2026-04-10", description: "Honoraires agence 5% — Maison Marseille" },
    { id: "f3", reference: "FACT-IMM-003", clientId: "c3", clientNom: "Durand Jean-Pierre", dossierId: "d4", montant: 510, statut: "payee", dateEmission: "2026-03-01", dateEcheance: "2026-03-31", description: "Frais de gestion locative — T2 Lyon 3e — Trimestre 1" },
    { id: "f4", reference: "FACT-IMM-004", clientId: "c3", clientNom: "Durand Jean-Pierre", dossierId: "d5", montant: 720, statut: "en_retard", dateEmission: "2026-02-03", dateEcheance: "2026-03-03", description: "Frais de gestion locative — T4 Lyon 7e — Trimestre 1" },
    { id: "f5", reference: "FACT-IMM-005", clientId: "c5", clientNom: "Ozdemir Kemal", dossierId: "d7", montant: 8250, statut: "payee", dateEmission: "2026-01-15", dateEcheance: "2026-02-15", description: "Honoraires agence 5% — Vente T2 Toulouse finalisée" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-IMM-001", clientId: "c1", clientNom: "Marchand Philippe", dossierId: "d2", titre: "Mandat exclusif vente — Studio Antibes 28m² — Honoraires 5%", montant: 7250, statut: "en_attente", dateEmission: "2026-03-01", dateValidite: "2026-03-31" },
    { id: "dv2", reference: "DEV-IMM-002", clientId: "c4", clientNom: "Fournier Stéphanie", dossierId: "d6", titre: "Mandat recherche — T3 Bordeaux — Honoraires acquéreur 3%", montant: 8400, statut: "accepte", dateEmission: "2026-02-14", dateValidite: "2026-03-14" },
    { id: "dv3", reference: "DEV-IMM-003", clientId: "c3", clientNom: "Durand Jean-Pierre", dossierId: "d4", titre: "Renouvellement gestion locative — T2 Lyon 3e — Année 2", montant: 2040, statut: "en_attente", dateEmission: "2026-03-20", dateValidite: "2026-04-20" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Offre reçue", description: "T3 Nice — Offre à 275 000 € reçue — En attente réponse vendeur", date: "2026-03-12", lu: false, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n2", type: "dossier", titre: "Visite planifiée", description: "Maison Marseille — 3 visites programmées cette semaine", date: "2026-03-17", lu: false, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n3", type: "facture", titre: "Facture en retard", description: "Gestion locative T4 Lyon 7e — SCI Les Toits — 720 €", date: "2026-03-04", lu: false, lien: "/admin/dossiers/d5", destinataire: "admin" },
    { id: "n4", type: "message", titre: "Nouveau message propriétaire", description: "Stéphanie Fournier — Retour sur visite T3 quartier Chartrons", date: "2026-03-22", lu: false, lien: "/admin/dossiers/d6", destinataire: "admin" },
    { id: "n5", type: "dossier", titre: "Vente finalisée", description: "T2 Toulouse — Acte signé chez le notaire — Commission encaissée", date: "2026-01-15", lu: true, lien: "/admin/dossiers/d7", destinataire: "admin" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Rousseau", prenom: "Marc", poste: "Agent immobilier — Responsable ventes", statut: "disponible", couleur: "#0D9488", capaciteMax: 5 },
    { id: "demo-emp-2", nom: "Diallo", prenom: "Fatou", poste: "Agent immobilier — Gestion locative", statut: "disponible", couleur: "#A855F7", capaciteMax: 6 },
    { id: "demo-emp-3", nom: "Collin", prenom: "Benoît", poste: "Agent immobilier junior", statut: "disponible", couleur: "#F59E0B", capaciteMax: 4 },
  ],
  assignments: {
    "d1": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-05" }],
    "d2": [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-03-01" }],
    "d3": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-18" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-01" }],
    "d4": [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-03" }],
    "d5": [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-03" }],
    "d6": [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-02-14" }],
    "d7": [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-08-25" }],
  },
};// ── MARIAGE ──

const mariageMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Laurent", prenom: "Émilie", email: "emilie.laurent@gmail.com", telephone: "06 12 34 56 78", entreprise: "", statut: "actif", dateCreation: "2026-01-10", nombreDossiers: 2 },
    { id: "c2", nom: "Benassir", prenom: "Yasmine", email: "yasmine.benassir@gmail.com", telephone: "06 23 45 67 89", entreprise: "", statut: "actif", dateCreation: "2026-01-18", nombreDossiers: 1 },
    { id: "c3", nom: "Moreau", prenom: "Chloé", email: "chloe.moreau@outlook.fr", telephone: "06 34 56 78 90", entreprise: "", statut: "actif", dateCreation: "2026-02-05", nombreDossiers: 1 },
    { id: "c4", nom: "Da Silva", prenom: "Inès", email: "ines.dasilva@gmail.com", telephone: "06 45 67 89 01", entreprise: "", statut: "actif", dateCreation: "2026-02-20", nombreDossiers: 2 },
    { id: "c5", nom: "Petit", prenom: "Camille", email: "camille.petit@yahoo.fr", telephone: "06 56 78 90 12", entreprise: "", statut: "inactif", dateCreation: "2025-11-15", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "MAR-2026-001", clientId: "c1", clientNom: "Émilie Laurent", typePrestation: "Robe sur mesure — Mariage 21 juin", montant: 4500, statut: "en_cours", dateCreation: "2026-01-10", dateEcheance: "2026-06-01" },
    { id: "d2", reference: "MAR-2026-002", clientId: "c1", clientNom: "Émilie Laurent", typePrestation: "Voile et accessoires assortis", montant: 850, statut: "en_cours", dateCreation: "2026-01-15", dateEcheance: "2026-06-01" },
    { id: "d3", reference: "MAR-2026-003", clientId: "c2", clientNom: "Yasmine Benassir", typePrestation: "Robe de mariée orientale — Mariage 12 septembre", montant: 5200, statut: "en_attente", dateCreation: "2026-01-18", dateEcheance: "2026-08-20" },
    { id: "d4", reference: "MAR-2026-004", clientId: "c3", clientNom: "Chloé Moreau", typePrestation: "Retouches robe importée", montant: 780, statut: "en_cours", dateCreation: "2026-02-05", dateEcheance: "2026-04-15" },
    { id: "d5", reference: "MAR-2026-005", clientId: "c4", clientNom: "Inès Da Silva", typePrestation: "Robe sur mesure — Mariage 4 octobre", montant: 3800, statut: "en_cours", dateCreation: "2026-02-20", dateEcheance: "2026-09-15" },
    { id: "d6", reference: "MAR-2026-006", clientId: "c4", clientNom: "Inès Da Silva", typePrestation: "Robes demoiselles d'honneur x3", montant: 2100, statut: "en_attente", dateCreation: "2026-02-25", dateEcheance: "2026-09-15" },
    { id: "d7", reference: "MAR-2025-047", clientId: "c5", clientNom: "Camille Petit", typePrestation: "Robe sur mesure — Mariage décembre 2025", montant: 3600, statut: "termine", dateCreation: "2025-11-15", dateEcheance: "2025-12-01" },
  ],
  factures: [
    { id: "f1", reference: "FAC-MAR-001", clientId: "c1", clientNom: "Émilie Laurent", dossierId: "d1", montant: 2250, statut: "payee", dateEmission: "2026-01-12", dateEcheance: "2026-01-27", description: "Acompte 50% — Robe sur mesure" },
    { id: "f2", reference: "FAC-MAR-002", clientId: "c2", clientNom: "Yasmine Benassir", dossierId: "d3", montant: 2600, statut: "en_attente", dateEmission: "2026-02-01", dateEcheance: "2026-02-15", description: "Acompte 50% — Robe orientale" },
    { id: "f3", reference: "FAC-MAR-003", clientId: "c3", clientNom: "Chloé Moreau", dossierId: "d4", montant: 780, statut: "en_retard", dateEmission: "2026-02-10", dateEcheance: "2026-03-10", description: "Retouches robe importée — totalité" },
    { id: "f4", reference: "FAC-MAR-004", clientId: "c4", clientNom: "Inès Da Silva", dossierId: "d5", montant: 1900, statut: "payee", dateEmission: "2026-02-22", dateEcheance: "2026-03-08", description: "Acompte 50% — Robe sur mesure" },
    { id: "f5", reference: "FAC-MAR-005", clientId: "c5", clientNom: "Camille Petit", dossierId: "d7", montant: 3600, statut: "payee", dateEmission: "2025-12-05", dateEcheance: "2025-12-20", description: "Solde final — Robe livrée" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-MAR-001", clientId: "c2", clientNom: "Yasmine Benassir", dossierId: "d3", titre: "Robe de mariée orientale complète", montant: 5200, statut: "accepte", dateEmission: "2026-01-20", dateValidite: "2026-02-20" },
    { id: "dv2", reference: "DEV-MAR-002", clientId: "c4", clientNom: "Inès Da Silva", dossierId: "d6", titre: "3 robes demoiselles d'honneur — tissu satin", montant: 2100, statut: "en_attente", dateEmission: "2026-02-28", dateValidite: "2026-03-30" },
    { id: "dv3", reference: "DEV-MAR-003", clientId: "c3", clientNom: "Chloé Moreau", dossierId: "d4", titre: "Retouches complètes robe Pronovias", montant: 780, statut: "accepte", dateEmission: "2026-02-06", dateValidite: "2026-03-06" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Essayage intermédiaire planifié", description: "Émilie Laurent — essayage prévu le 15 avril 2026", date: "2026-03-25", lu: false, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Facture en retard", description: "Chloé Moreau — 780 € impayés depuis le 10 mars", date: "2026-03-20", lu: false, lien: "/admin/dossiers/d4", destinataire: "admin" },
    { id: "n3", type: "message", titre: "Nouveau message client", description: "Yasmine Benassir a envoyé un message concernant le choix du tissu", date: "2026-03-24", lu: true, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Votre essayage approche", description: "Essayage intermédiaire prévu le 15 avril — confirmez votre présence", date: "2026-03-25", lu: false, lien: "/client/dossiers/d1", destinataire: "client" },
    { id: "n5", type: "devis", titre: "Nouveau devis à valider", description: "Devis pour les robes demoiselles d'honneur — 2 100 €", date: "2026-02-28", lu: false, lien: "/client/dossiers/d6", destinataire: "client" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Delacroix", prenom: "Isabelle", poste: "Conseillère mariée", statut: "disponible", couleur: "#8B5CF6", capaciteMax: 8 },
    { id: "demo-emp-2", nom: "Mercier", prenom: "Françoise", poste: "Retoucheuse couture", statut: "disponible", couleur: "#EC4899", capaciteMax: 6 },
    { id: "demo-emp-3", nom: "Nguyen", prenom: "Linh", poste: "Couturière modéliste", statut: "disponible", couleur: "#F59E0B", capaciteMax: 5 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-10" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-01" }],
    d2: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-01-15" }],
    d3: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-18" }],
    d4: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-05" }],
    d5: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-02-20" }, { employeeId: "demo-emp-1", role: "renfort", dateAssignation: "2026-03-01" }],
    d6: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-02-25" }],
    d7: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-11-15" }],
  },
};

// ── CABINET D'AVOCATS ──

const cabinetAvocatsMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Martin", prenom: "Philippe", email: "philippe.martin@orange.fr", telephone: "06 11 22 33 44", entreprise: "", statut: "actif", dateCreation: "2026-01-08", nombreDossiers: 1 },
    { id: "c2", nom: "Rousseau", prenom: "Claire", email: "claire.rousseau@gmail.com", telephone: "06 22 33 44 55", entreprise: "", statut: "actif", dateCreation: "2026-01-20", nombreDossiers: 2 },
    { id: "c3", nom: "Dubois", prenom: "Jean-Marc", email: "jm.dubois@techfrance.fr", telephone: "06 33 44 55 66", entreprise: "TechFrance SARL", statut: "actif", dateCreation: "2026-02-03", nombreDossiers: 1 },
    { id: "c4", nom: "El Amrani", prenom: "Nadia", email: "nadia.elamrani@gmail.com", telephone: "06 44 55 66 77", entreprise: "", statut: "actif", dateCreation: "2026-02-15", nombreDossiers: 2 },
    { id: "c5", nom: "Lefèvre", prenom: "Antoine", email: "a.lefevre@lefevre-immo.fr", telephone: "06 55 66 77 88", entreprise: "Lefèvre Immobilier", statut: "inactif", dateCreation: "2025-10-05", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "AVO-2026-001", clientId: "c1", clientNom: "Philippe Martin", typePrestation: "Divorce amiable — Convention parentale", montant: 3200, statut: "en_cours", dateCreation: "2026-01-08", dateEcheance: "2026-05-30" },
    { id: "d2", reference: "AVO-2026-002", clientId: "c2", clientNom: "Claire Rousseau", typePrestation: "Contentieux prud'homal — Licenciement abusif", montant: 4500, statut: "en_cours", dateCreation: "2026-01-20", dateEcheance: "2026-07-15" },
    { id: "d3", reference: "AVO-2026-003", clientId: "c2", clientNom: "Claire Rousseau", typePrestation: "Assignation propriétaire — Troubles du voisinage", montant: 1800, statut: "en_attente", dateCreation: "2026-02-10", dateEcheance: "2026-06-30" },
    { id: "d4", reference: "AVO-2026-004", clientId: "c3", clientNom: "Jean-Marc Dubois", typePrestation: "Contentieux commercial — Recouvrement créance", montant: 6000, statut: "en_cours", dateCreation: "2026-02-03", dateEcheance: "2026-08-01" },
    { id: "d5", reference: "AVO-2026-005", clientId: "c4", clientNom: "Nadia El Amrani", typePrestation: "Droit de la famille — Garde alternée", montant: 2800, statut: "en_cours", dateCreation: "2026-02-15", dateEcheance: "2026-06-15" },
    { id: "d6", reference: "AVO-2026-006", clientId: "c4", clientNom: "Nadia El Amrani", typePrestation: "Consultation droit du travail", montant: 350, statut: "termine", dateCreation: "2026-03-01", dateEcheance: "2026-03-15" },
    { id: "d7", reference: "AVO-2025-089", clientId: "c5", clientNom: "Antoine Lefèvre", typePrestation: "Litige bail commercial — Vice caché", montant: 5500, statut: "termine", dateCreation: "2025-10-05", dateEcheance: "2026-01-30" },
  ],
  factures: [
    { id: "f1", reference: "FAC-AVO-001", clientId: "c1", clientNom: "Philippe Martin", dossierId: "d1", montant: 1600, statut: "payee", dateEmission: "2026-01-10", dateEcheance: "2026-01-25", description: "Provision sur honoraires — Divorce amiable" },
    { id: "f2", reference: "FAC-AVO-002", clientId: "c2", clientNom: "Claire Rousseau", dossierId: "d2", montant: 2250, statut: "payee", dateEmission: "2026-01-22", dateEcheance: "2026-02-06", description: "Provision sur honoraires — Prud'hommes" },
    { id: "f3", reference: "FAC-AVO-003", clientId: "c3", clientNom: "Jean-Marc Dubois", dossierId: "d4", montant: 3000, statut: "en_attente", dateEmission: "2026-03-01", dateEcheance: "2026-03-31", description: "Honoraires phase instruction — Recouvrement" },
    { id: "f4", reference: "FAC-AVO-004", clientId: "c4", clientNom: "Nadia El Amrani", dossierId: "d6", montant: 350, statut: "payee", dateEmission: "2026-03-05", dateEcheance: "2026-03-20", description: "Consultation droit du travail — 1h" },
    { id: "f5", reference: "FAC-AVO-005", clientId: "c5", clientNom: "Antoine Lefèvre", dossierId: "d7", montant: 5500, statut: "payee", dateEmission: "2026-01-15", dateEcheance: "2026-02-15", description: "Solde honoraires — Litige bail commercial" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-AVO-001", clientId: "c2", clientNom: "Claire Rousseau", dossierId: "d3", titre: "Convention d'honoraires — Troubles du voisinage", montant: 1800, statut: "en_attente", dateEmission: "2026-02-12", dateValidite: "2026-03-12" },
    { id: "dv2", reference: "DEV-AVO-002", clientId: "c4", clientNom: "Nadia El Amrani", dossierId: "d5", titre: "Convention d'honoraires — Garde alternée", montant: 2800, statut: "accepte", dateEmission: "2026-02-16", dateValidite: "2026-03-16" },
    { id: "dv3", reference: "DEV-AVO-003", clientId: "c3", clientNom: "Jean-Marc Dubois", dossierId: "d4", titre: "Honoraires estimés — Contentieux commercial complet", montant: 6000, statut: "accepte", dateEmission: "2026-02-05", dateValidite: "2026-03-05" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Audience programmée", description: "Claire Rousseau — Audience prud'homale fixée au 22 mai 2026", date: "2026-03-26", lu: false, lien: "/admin/dossiers/d2", destinataire: "admin" },
    { id: "n2", type: "message", titre: "Pièces reçues du client", description: "Philippe Martin a transmis les justificatifs de revenus", date: "2026-03-24", lu: true, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n3", type: "facture", titre: "Facture en attente", description: "TechFrance SARL — 3 000 € en attente de règlement", date: "2026-03-15", lu: false, lien: "/admin/dossiers/d4", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Mise à jour de votre dossier", description: "Votre dossier de divorce avance — nouvelles pièces à fournir", date: "2026-03-25", lu: false, lien: "/client/dossiers/d1", destinataire: "client" },
    { id: "n5", type: "devis", titre: "Convention d'honoraires disponible", description: "Merci de valider la convention pour le dossier voisinage", date: "2026-02-12", lu: false, lien: "/client/dossiers/d3", destinataire: "client" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Garnier", prenom: "Maître Sophie", poste: "Avocate associée", statut: "disponible", couleur: "#3B82F6", capaciteMax: 12 },
    { id: "demo-emp-2", nom: "Bensaïd", prenom: "Maître Karim", poste: "Avocat collaborateur", statut: "disponible", couleur: "#10B981", capaciteMax: 10 },
    { id: "demo-emp-3", nom: "Fournier", prenom: "Laura", poste: "Juriste assistante", statut: "disponible", couleur: "#F59E0B", capaciteMax: 15 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-08" }],
    d2: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-01-20" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-01-22" }],
    d3: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-10" }],
    d4: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-03" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-05" }],
    d5: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-15" }],
    d6: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-01" }],
    d7: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-10-05" }],
  },
};

// ── EXPERT-COMPTABLE ──

const expertComptableMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Renard", prenom: "Stéphane", email: "s.renard@boulangerie-renard.fr", telephone: "06 10 20 30 40", entreprise: "Boulangerie Renard", statut: "actif", dateCreation: "2025-09-01", nombreDossiers: 2 },
    { id: "c2", nom: "Charif", prenom: "Amina", email: "amina@charif-consulting.fr", telephone: "06 20 30 40 50", entreprise: "Charif Consulting", statut: "actif", dateCreation: "2025-10-15", nombreDossiers: 1 },
    { id: "c3", nom: "Bernard", prenom: "Luc", email: "luc.bernard@greentech.fr", telephone: "06 30 40 50 60", entreprise: "GreenTech Solutions SAS", statut: "actif", dateCreation: "2026-01-05", nombreDossiers: 2 },
    { id: "c4", nom: "Picard", prenom: "Marie", email: "marie.picard@auto-picard.fr", telephone: "06 40 50 60 70", entreprise: "Garage Picard Auto", statut: "actif", dateCreation: "2026-01-20", nombreDossiers: 1 },
    { id: "c5", nom: "Koné", prenom: "Ibrahim", email: "ibrahim@kone-import.fr", telephone: "06 50 60 70 80", entreprise: "Koné Import-Export", statut: "inactif", dateCreation: "2025-06-01", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "CPT-2026-001", clientId: "c1", clientNom: "Boulangerie Renard", typePrestation: "Bilan annuel 2025", montant: 2800, statut: "en_cours", dateCreation: "2026-01-10", dateEcheance: "2026-04-30" },
    { id: "d2", reference: "CPT-2026-002", clientId: "c1", clientNom: "Boulangerie Renard", typePrestation: "Déclaration TVA T1 2026", montant: 450, statut: "en_cours", dateCreation: "2026-03-15", dateEcheance: "2026-04-20" },
    { id: "d3", reference: "CPT-2026-003", clientId: "c2", clientNom: "Charif Consulting", typePrestation: "Liasse fiscale 2025 + IS", montant: 1800, statut: "en_attente", dateCreation: "2026-02-01", dateEcheance: "2026-05-15" },
    { id: "d4", reference: "CPT-2026-004", clientId: "c3", clientNom: "GreenTech Solutions SAS", typePrestation: "Audit comptable pré-levée de fonds", montant: 5500, statut: "en_cours", dateCreation: "2026-01-05", dateEcheance: "2026-04-01" },
    { id: "d5", reference: "CPT-2026-005", clientId: "c3", clientNom: "GreenTech Solutions SAS", typePrestation: "Mise en place comptabilité analytique", montant: 3200, statut: "en_attente", dateCreation: "2026-02-20", dateEcheance: "2026-06-30" },
    { id: "d6", reference: "CPT-2026-006", clientId: "c4", clientNom: "Garage Picard Auto", typePrestation: "Déclaration TVA T1 + Bilan simplifié", montant: 1200, statut: "en_cours", dateCreation: "2026-01-20", dateEcheance: "2026-04-30" },
    { id: "d7", reference: "CPT-2025-042", clientId: "c5", clientNom: "Koné Import-Export", typePrestation: "Bilan annuel 2024", montant: 3500, statut: "termine", dateCreation: "2025-06-01", dateEcheance: "2025-12-31" },
  ],
  factures: [
    { id: "f1", reference: "FAC-CPT-001", clientId: "c1", clientNom: "Boulangerie Renard", dossierId: "d1", montant: 2800, statut: "en_attente", dateEmission: "2026-03-01", dateEcheance: "2026-03-31", description: "Honoraires bilan annuel 2025" },
    { id: "f2", reference: "FAC-CPT-002", clientId: "c3", clientNom: "GreenTech Solutions SAS", dossierId: "d4", montant: 2750, statut: "payee", dateEmission: "2026-01-15", dateEcheance: "2026-02-15", description: "Acompte 50% — Audit pré-levée de fonds" },
    { id: "f3", reference: "FAC-CPT-003", clientId: "c4", clientNom: "Garage Picard Auto", dossierId: "d6", montant: 1200, statut: "en_retard", dateEmission: "2026-02-15", dateEcheance: "2026-03-15", description: "Forfait TVA + Bilan simplifié" },
    { id: "f4", reference: "FAC-CPT-004", clientId: "c2", clientNom: "Charif Consulting", dossierId: "d3", montant: 900, statut: "payee", dateEmission: "2026-02-05", dateEcheance: "2026-02-20", description: "Acompte liasse fiscale 2025" },
    { id: "f5", reference: "FAC-CPT-005", clientId: "c5", clientNom: "Koné Import-Export", dossierId: "d7", montant: 3500, statut: "payee", dateEmission: "2025-12-20", dateEcheance: "2026-01-20", description: "Solde bilan annuel 2024" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-CPT-001", clientId: "c3", clientNom: "GreenTech Solutions SAS", dossierId: "d5", titre: "Mise en place comptabilité analytique — Forfait", montant: 3200, statut: "en_attente", dateEmission: "2026-02-22", dateValidite: "2026-03-22" },
    { id: "dv2", reference: "DEV-CPT-002", clientId: "c2", clientNom: "Charif Consulting", dossierId: "d3", titre: "Liasse fiscale + déclaration IS 2025", montant: 1800, statut: "accepte", dateEmission: "2026-02-02", dateValidite: "2026-03-02" },
    { id: "dv3", reference: "DEV-CPT-003", clientId: "c1", clientNom: "Boulangerie Renard", dossierId: "d2", titre: "Forfait déclaration TVA trimestrielle", montant: 450, statut: "accepte", dateEmission: "2026-03-16", dateValidite: "2026-04-16" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Échéance TVA approche", description: "Boulangerie Renard — Déclaration TVA T1 à déposer avant le 20 avril", date: "2026-03-26", lu: false, lien: "/admin/dossiers/d2", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Impayé — Relance à effectuer", description: "Garage Picard Auto — 1 200 € en retard depuis le 15 mars", date: "2026-03-22", lu: false, lien: "/admin/dossiers/d6", destinataire: "admin" },
    { id: "n3", type: "dossier", titre: "Pièces manquantes", description: "Charif Consulting — Grand livre et journaux de banque attendus", date: "2026-03-20", lu: true, lien: "/admin/dossiers/d3", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Votre bilan est en préparation", description: "Nous finalisons votre bilan annuel 2025 — résultat sous 3 semaines", date: "2026-03-15", lu: false, lien: "/client/dossiers/d1", destinataire: "client" },
    { id: "n5", type: "devis", titre: "Nouveau devis disponible", description: "Devis pour la mise en place de votre comptabilité analytique", date: "2026-02-22", lu: false, lien: "/client/dossiers/d5", destinataire: "client" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Vasseur", prenom: "Nathalie", poste: "Expert-comptable diplômée", statut: "disponible", couleur: "#6366F1", capaciteMax: 15 },
    { id: "demo-emp-2", nom: "Traoré", prenom: "Moussa", poste: "Collaborateur comptable", statut: "disponible", couleur: "#14B8A6", capaciteMax: 20 },
    { id: "demo-emp-3", nom: "Lemoine", prenom: "Julie", poste: "Collaboratrice comptable junior", statut: "disponible", couleur: "#F97316", capaciteMax: 18 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-10" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-01" }],
    d2: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-03-15" }],
    d3: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-01" }],
    d4: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-05" }],
    d5: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-20" }],
    d6: [{ employeeId: "demo-emp-3", role: "responsable", dateAssignation: "2026-01-20" }],
    d7: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-06-01" }],
  },
};

// ── CABINET DE RECRUTEMENT ──

const cabinetRecrutementMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Fournier", prenom: "Sandrine", email: "s.fournier@mediasphere.fr", telephone: "06 11 33 55 77", entreprise: "MédiaSphère", statut: "actif", dateCreation: "2026-01-12", nombreDossiers: 2 },
    { id: "c2", nom: "Hamidi", prenom: "Rachid", email: "r.hamidi@logipharma.fr", telephone: "06 22 44 66 88", entreprise: "LogiPharma SAS", statut: "actif", dateCreation: "2026-01-25", nombreDossiers: 1 },
    { id: "c3", nom: "Leclerc", prenom: "Benoît", email: "b.leclerc@urbancode.io", telephone: "06 33 55 77 99", entreprise: "UrbanCode", statut: "actif", dateCreation: "2026-02-08", nombreDossiers: 2 },
    { id: "c4", nom: "Diallo", prenom: "Fatoumata", email: "f.diallo@solidaris.org", telephone: "06 44 66 88 00", entreprise: "Solidaris Association", statut: "actif", dateCreation: "2026-02-18", nombreDossiers: 1 },
    { id: "c5", nom: "Morel", prenom: "Vincent", email: "v.morel@atelier-morel.fr", telephone: "06 55 77 99 11", entreprise: "Atelier Morel & Fils", statut: "inactif", dateCreation: "2025-09-10", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "REC-2026-001", clientId: "c1", clientNom: "MédiaSphère", typePrestation: "Recrutement Directeur Commercial", montant: 12000, statut: "en_cours", dateCreation: "2026-01-12", dateEcheance: "2026-04-15" },
    { id: "d2", reference: "REC-2026-002", clientId: "c1", clientNom: "MédiaSphère", typePrestation: "Recrutement Community Manager senior", montant: 7500, statut: "en_attente", dateCreation: "2026-02-01", dateEcheance: "2026-05-01" },
    { id: "d3", reference: "REC-2026-003", clientId: "c2", clientNom: "LogiPharma SAS", typePrestation: "Recrutement Responsable Supply Chain", montant: 15000, statut: "en_cours", dateCreation: "2026-01-25", dateEcheance: "2026-05-30" },
    { id: "d4", reference: "REC-2026-004", clientId: "c3", clientNom: "UrbanCode", typePrestation: "Recrutement Lead Développeur Full-Stack", montant: 10000, statut: "en_cours", dateCreation: "2026-02-08", dateEcheance: "2026-04-30" },
    { id: "d5", reference: "REC-2026-005", clientId: "c3", clientNom: "UrbanCode", typePrestation: "Recrutement Chargé de projet IT", montant: 8000, statut: "en_cours", dateCreation: "2026-02-15", dateEcheance: "2026-05-15" },
    { id: "d6", reference: "REC-2026-006", clientId: "c4", clientNom: "Solidaris Association", typePrestation: "Recrutement Coordinateur de programmes", montant: 6000, statut: "en_attente", dateCreation: "2026-02-18", dateEcheance: "2026-05-31" },
    { id: "d7", reference: "REC-2025-031", clientId: "c5", clientNom: "Atelier Morel & Fils", typePrestation: "Recrutement Chef d'atelier menuiserie", montant: 8500, statut: "termine", dateCreation: "2025-09-10", dateEcheance: "2025-12-15" },
  ],
  factures: [
    { id: "f1", reference: "FAC-REC-001", clientId: "c1", clientNom: "MédiaSphère", dossierId: "d1", montant: 4000, statut: "payee", dateEmission: "2026-01-15", dateEcheance: "2026-02-15", description: "Acompte 33% — Recrutement Directeur Commercial" },
    { id: "f2", reference: "FAC-REC-002", clientId: "c2", clientNom: "LogiPharma SAS", dossierId: "d3", montant: 5000, statut: "payee", dateEmission: "2026-02-01", dateEcheance: "2026-03-01", description: "Acompte 33% — Recrutement Resp. Supply Chain" },
    { id: "f3", reference: "FAC-REC-003", clientId: "c3", clientNom: "UrbanCode", dossierId: "d4", montant: 5000, statut: "en_attente", dateEmission: "2026-03-10", dateEcheance: "2026-04-10", description: "Acompte 50% — Recrutement Lead Dev" },
    { id: "f4", reference: "FAC-REC-004", clientId: "c5", clientNom: "Atelier Morel & Fils", dossierId: "d7", montant: 8500, statut: "payee", dateEmission: "2025-12-20", dateEcheance: "2026-01-20", description: "Solde — Recrutement Chef d'atelier (poste pourvu)" },
    { id: "f5", reference: "FAC-REC-005", clientId: "c1", clientNom: "MédiaSphère", dossierId: "d1", montant: 4000, statut: "en_retard", dateEmission: "2026-03-01", dateEcheance: "2026-03-15", description: "2e tranche — Short-list présentée" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-REC-001", clientId: "c1", clientNom: "MédiaSphère", dossierId: "d2", titre: "Mission recrutement Community Manager senior", montant: 7500, statut: "en_attente", dateEmission: "2026-02-03", dateValidite: "2026-03-03" },
    { id: "dv2", reference: "DEV-REC-002", clientId: "c4", clientNom: "Solidaris Association", dossierId: "d6", titre: "Mission recrutement Coordinateur de programmes", montant: 6000, statut: "en_attente", dateEmission: "2026-02-20", dateValidite: "2026-03-20" },
    { id: "dv3", reference: "DEV-REC-003", clientId: "c3", clientNom: "UrbanCode", dossierId: "d5", titre: "Mission recrutement Chargé de projet IT", montant: 8000, statut: "accepte", dateEmission: "2026-02-16", dateValidite: "2026-03-16" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Candidat retenu en entretien final", description: "MédiaSphère — Directeur Commercial : 2 finalistes retenus", date: "2026-03-26", lu: false, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Facture en retard", description: "MédiaSphère — 4 000 € impayés depuis le 15 mars", date: "2026-03-22", lu: false, lien: "/admin/dossiers/d1", destinataire: "admin" },
    { id: "n3", type: "dossier", titre: "Sourcing en cours", description: "UrbanCode — 45 profils identifiés pour le poste Lead Dev", date: "2026-03-20", lu: true, lien: "/admin/dossiers/d4", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Short-list disponible", description: "3 candidats présélectionnés pour le poste de Directeur Commercial", date: "2026-03-10", lu: false, lien: "/client/dossiers/d1", destinataire: "client" },
    { id: "n5", type: "devis", titre: "Proposition de mission", description: "Votre devis pour le recrutement du Coordinateur est disponible", date: "2026-02-20", lu: false, lien: "/client/dossiers/d6", destinataire: "client" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Prevost", prenom: "Audrey", poste: "Chargée de recrutement senior", statut: "disponible", couleur: "#8B5CF6", capaciteMax: 8 },
    { id: "demo-emp-2", nom: "Cissé", prenom: "Oumar", poste: "Chargé de recrutement", statut: "disponible", couleur: "#06B6D4", capaciteMax: 10 },
    { id: "demo-emp-3", nom: "Blanc", prenom: "Élise", poste: "Chargée de sourcing", statut: "disponible", couleur: "#F43F5E", capaciteMax: 12 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-12" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-01-15" }],
    d2: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-01" }],
    d3: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-25" }],
    d4: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-08" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-02-10" }],
    d5: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-15" }],
    d6: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-18" }],
    d7: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2025-09-10" }],
  },
};

// ── CABINETS (Services professionnels génériques) ──

const cabinetsMock: SectorMockData = {
  clients: [
    { id: "c1", nom: "Girard", prenom: "Hélène", email: "h.girard@girard-mode.fr", telephone: "06 12 45 78 90", entreprise: "Girard Mode SARL", statut: "actif", dateCreation: "2026-01-05", nombreDossiers: 1 },
    { id: "c2", nom: "Bouaziz", prenom: "Mehdi", email: "m.bouaziz@nextstep.fr", telephone: "06 23 56 89 01", entreprise: "NextStep Digital", statut: "actif", dateCreation: "2026-01-18", nombreDossiers: 2 },
    { id: "c3", nom: "Carpentier", prenom: "Élodie", email: "e.carpentier@bio-eden.fr", telephone: "06 34 67 90 12", entreprise: "Bio Eden", statut: "actif", dateCreation: "2026-02-02", nombreDossiers: 1 },
    { id: "c4", nom: "Okafor", prenom: "Chinedu", email: "c.okafor@afrilink.fr", telephone: "06 45 78 01 23", entreprise: "AfriLink Solutions", statut: "actif", dateCreation: "2026-02-12", nombreDossiers: 2 },
    { id: "c5", nom: "Lambert", prenom: "Thierry", email: "t.lambert@lambert-tp.fr", telephone: "06 56 89 12 34", entreprise: "Lambert TP", statut: "inactif", dateCreation: "2025-08-20", nombreDossiers: 1 },
  ],
  dossiers: [
    { id: "d1", reference: "CAB-2026-001", clientId: "c1", clientNom: "Girard Mode SARL", typePrestation: "Mission conseil RH — Réorganisation équipe", montant: 4800, statut: "en_cours", dateCreation: "2026-01-05", dateEcheance: "2026-04-30" },
    { id: "d2", reference: "CAB-2026-002", clientId: "c2", clientNom: "NextStep Digital", typePrestation: "Audit conformité RGPD", montant: 6500, statut: "en_cours", dateCreation: "2026-01-18", dateEcheance: "2026-04-15" },
    { id: "d3", reference: "CAB-2026-003", clientId: "c2", clientNom: "NextStep Digital", typePrestation: "Accompagnement transformation digitale", montant: 12000, statut: "en_attente", dateCreation: "2026-02-10", dateEcheance: "2026-09-30" },
    { id: "d4", reference: "CAB-2026-004", clientId: "c3", clientNom: "Bio Eden", typePrestation: "Diagnostic stratégique — Lancement e-commerce", montant: 3500, statut: "en_cours", dateCreation: "2026-02-02", dateEcheance: "2026-04-20" },
    { id: "d5", reference: "CAB-2026-005", clientId: "c4", clientNom: "AfriLink Solutions", typePrestation: "Conseil juridique — Implantation filiale France", montant: 8000, statut: "en_cours", dateCreation: "2026-02-12", dateEcheance: "2026-06-30" },
    { id: "d6", reference: "CAB-2026-006", clientId: "c4", clientNom: "AfriLink Solutions", typePrestation: "Rédaction pacte d'associés", montant: 3000, statut: "en_attente", dateCreation: "2026-03-01", dateEcheance: "2026-05-15" },
    { id: "d7", reference: "CAB-2025-078", clientId: "c5", clientNom: "Lambert TP", typePrestation: "Audit sécurité chantier + plan de conformité", montant: 5200, statut: "termine", dateCreation: "2025-08-20", dateEcheance: "2025-12-15" },
  ],
  factures: [
    { id: "f1", reference: "FAC-CAB-001", clientId: "c1", clientNom: "Girard Mode SARL", dossierId: "d1", montant: 2400, statut: "payee", dateEmission: "2026-01-10", dateEcheance: "2026-02-10", description: "Acompte 50% — Mission conseil RH" },
    { id: "f2", reference: "FAC-CAB-002", clientId: "c2", clientNom: "NextStep Digital", dossierId: "d2", montant: 6500, statut: "en_attente", dateEmission: "2026-03-15", dateEcheance: "2026-04-15", description: "Honoraires audit RGPD — totalité" },
    { id: "f3", reference: "FAC-CAB-003", clientId: "c3", clientNom: "Bio Eden", dossierId: "d4", montant: 1750, statut: "payee", dateEmission: "2026-02-05", dateEcheance: "2026-03-05", description: "Acompte 50% — Diagnostic stratégique" },
    { id: "f4", reference: "FAC-CAB-004", clientId: "c4", clientNom: "AfriLink Solutions", dossierId: "d5", montant: 4000, statut: "en_retard", dateEmission: "2026-02-20", dateEcheance: "2026-03-20", description: "Acompte 50% — Conseil implantation filiale" },
    { id: "f5", reference: "FAC-CAB-005", clientId: "c5", clientNom: "Lambert TP", dossierId: "d7", montant: 5200, statut: "payee", dateEmission: "2025-12-18", dateEcheance: "2026-01-18", description: "Solde — Audit sécurité chantier" },
  ],
  devis: [
    { id: "dv1", reference: "DEV-CAB-001", clientId: "c2", clientNom: "NextStep Digital", dossierId: "d3", titre: "Accompagnement transformation digitale — 6 mois", montant: 12000, statut: "en_attente", dateEmission: "2026-02-12", dateValidite: "2026-03-12" },
    { id: "dv2", reference: "DEV-CAB-002", clientId: "c4", clientNom: "AfriLink Solutions", dossierId: "d6", titre: "Rédaction pacte d'associés + statuts", montant: 3000, statut: "en_attente", dateEmission: "2026-03-03", dateValidite: "2026-04-03" },
    { id: "dv3", reference: "DEV-CAB-003", clientId: "c3", clientNom: "Bio Eden", dossierId: "d4", titre: "Diagnostic stratégique e-commerce", montant: 3500, statut: "accepte", dateEmission: "2026-02-03", dateValidite: "2026-03-03" },
  ],
  notifications: [
    { id: "n1", type: "dossier", titre: "Livrable en attente de validation", description: "NextStep Digital — Rapport d'audit RGPD prêt pour revue", date: "2026-03-27", lu: false, lien: "/admin/dossiers/d2", destinataire: "admin" },
    { id: "n2", type: "facture", titre: "Facture en retard", description: "AfriLink Solutions — 4 000 € impayés depuis le 20 mars", date: "2026-03-25", lu: false, lien: "/admin/dossiers/d5", destinataire: "admin" },
    { id: "n3", type: "message", titre: "Nouveau message client", description: "Bio Eden — Élodie Carpentier demande un point d'avancement", date: "2026-03-24", lu: true, lien: "/admin/dossiers/d4", destinataire: "admin" },
    { id: "n4", type: "dossier", titre: "Votre diagnostic avance", description: "Le diagnostic stratégique est en phase de finalisation", date: "2026-03-20", lu: false, lien: "/client/dossiers/d4", destinataire: "client" },
    { id: "n5", type: "devis", titre: "Devis à valider", description: "Votre devis pour l'accompagnement transformation digitale est disponible", date: "2026-02-12", lu: false, lien: "/client/dossiers/d3", destinataire: "client" },
  ],
  teamMembers: [
    { id: "demo-emp-1", nom: "Dufresne", prenom: "Marc", poste: "Associé senior", statut: "disponible", couleur: "#0EA5E9", capaciteMax: 8 },
    { id: "demo-emp-2", nom: "Ayari", prenom: "Sonia", poste: "Collaboratrice conseil", statut: "disponible", couleur: "#A855F7", capaciteMax: 10 },
    { id: "demo-emp-3", nom: "Roche", prenom: "Damien", poste: "Collaborateur junior", statut: "disponible", couleur: "#22C55E", capaciteMax: 12 },
  ],
  assignments: {
    d1: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-01-05" }],
    d2: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-01-18" }, { employeeId: "demo-emp-3", role: "renfort", dateAssignation: "2026-01-20" }],
    d3: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-10" }],
    d4: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2026-02-02" }],
    d5: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-02-12" }, { employeeId: "demo-emp-2", role: "renfort", dateAssignation: "2026-02-15" }],
    d6: [{ employeeId: "demo-emp-1", role: "responsable", dateAssignation: "2026-03-01" }],
    d7: [{ employeeId: "demo-emp-2", role: "responsable", dateAssignation: "2025-08-20" }],
  },
};

// ── MAPPING SECTEUR → MOCK DATA ──
// [MBA] Chaque secteur a son propre mock — plus de fallback sur mockData.ts
const SECTOR_MOCK_MAP: Record<SectorKey, SectorMockData> = {
  conciergerie: conciergerieMock,
  nettoyage: nettoyageMock,
  reparateur: reparateurMock,
  "centre-islamique": centreIslamiqueMock,
  "association-sportive": associationSportiveMock,
  "coach-sportif": coachSportifMock,
  garages: garagesMock,
  btp: btpMock,
  boutique: boutiqueMock,
  coiffure: coiffureMock,
  "auto-ecole": autoEcoleMock,
  consultant: consultantMock,
  designer: designerMock,
  developpeur: developpeurMock,
  photographe: photographeMock,
  "dj-animateur": djAnimateurMock,
  evenementiel: evenementielMock,
  "community-manager": communityManagerMock,
  formateur: formateurMock,
  traiteur: traiteurMock,
  immobilier: immobilierMock,
  mariage: mariageMock,
  "cabinet-avocats": cabinetAvocatsMock,
  "expert-comptable": expertComptableMock,
  "cabinet-recrutement": cabinetRecrutementMock,
  cabinets: cabinetsMock,
};

// [MBA] Génère des demandes mock à partir des clients et dossiers du secteur
// Chaque secteur obtient 3 demandes contextuelles automatiquement
function generateSectorDemandes(mock: SectorMockData): SectorDemande[] {
  if (mock.demandes) return mock.demandes;
  const clients = mock.clients.slice(0, 3);
  const dossiers = mock.dossiers;
  return clients.map((c, i) => {
    const relatedDossier = dossiers.find(d => d.clientId === c.id) || dossiers[i];
    const statuses: SectorDemande["statut"][] = ["en_revue", "nouvelle", "validee"];
    return {
      id: `dem-${i + 1}`,
      reference: `DEM-2026-${String(i + 1).padStart(3, "0")}`,
      clientId: c.id,
      clientNom: `${c.prenom} ${c.nom}`.trim() || c.nom,
      titre: relatedDossier?.typePrestation || "Nouvelle demande",
      typePrestation: relatedDossier?.typePrestation || "Autre",
      description: `Demande de ${(relatedDossier?.typePrestation || "prestation").toLowerCase()} pour ${c.prenom ? `${c.prenom} ${c.nom}` : c.nom}.`,
      budget: relatedDossier ? `${relatedDossier.montant.toLocaleString()} €` : undefined,
      statut: statuses[i] || "nouvelle",
      dateCreation: "2026-02-15",
      dateMiseAJour: "2026-02-20",
    };
  });
}

export function getSectorMockData(sector: SectorKey | null): SectorMockData | null {
  if (!sector) return null;
  const data = SECTOR_MOCK_MAP[sector] ?? null;
  if (data && !data.demandes) {
    // [MBA] Auto-génère les demandes si le secteur n'en a pas
    data.demandes = generateSectorDemandes(data);
  }
  return data;
}
