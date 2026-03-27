// [MBA] Types MVP — modèles domaine core dérivés du schéma Supabase BDD v6
// Ces types sont la SOURCE DE VÉRITÉ côté front pour toutes les entités métier.
// Ils mappent 1:1 sur les tables Supabase (snake_case → camelCase).
// Les hooks (src/hooks/supabase/) convertissent entre les deux.

// ────────────────────────────────────────────────────────
// STATUTS
// ────────────────────────────────────────────────────────

export type ClientStatus = "actif" | "inactif";
export type ClientSegment = "client" | "prospect";

export type DossierStatus = "en_cours" | "termine" | "en_attente" | "annule" | "archive";

export type FactureStatus = "payee" | "en_attente" | "en_retard";

export type DevisStatus = "accepte" | "en_attente" | "refuse" | "expire";

export type MessageRole = "admin" | "employee" | "client";

export type EmployeeStatus = "actif" | "inactif";
export type EmployeeLevel = "agent" | "manager" | "director";

export type NotificationType = "dossier" | "facture" | "message" | "devis" | "ticket" | "assignation" | "statut";
export type NotificationDestinataire = "admin" | "client" | "employee" | "all";

export type AppointmentStatus = "a_venir" | "passe" | "annule";

// ────────────────────────────────────────────────────────
// ENTITÉS CORE
// ────────────────────────────────────────────────────────

/** Client / Propriétaire / Membre / Élève — selon le secteur */
export interface MbaClient {
  id: string;
  compteId: string | null;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise: string;
  siret?: string | null;
  adresse?: string | null;
  codePostal?: string | null;
  ville?: string | null;
  pays?: string | null;
  statut: ClientStatus;
  segment: ClientSegment;
  emailOptOut: boolean;
  nombreDossiers: number;
  userId?: string | null;
  dateCreation: string;
  createdAt: string;
  updatedAt: string;
}

/** Dossier / Case — unité de travail principale */
export interface MbaDossier {
  id: string;
  compteId: string | null;
  reference: string;
  clientId: string;
  clientNom: string;
  typePrestation: string;
  montant: number;
  statut: DossierStatus;
  employeeId: string | null;
  demandeId: string | null;
  previewUrl: string | null;
  rdvEffectue: boolean;
  dateCreation: string;
  dateEcheance: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Facture / Payment */
export interface MbaFacture {
  id: string;
  compteId: string | null;
  reference: string;
  clientId: string;
  clientNom: string;
  dossierId: string | null;
  montant: number;
  statut: FactureStatus;
  description: string | null;
  serviceCategoryId: string | null;
  dateEmission: string;
  dateEcheance: string;
  createdAt: string;
  updatedAt: string;
}

/** Devis / Quote */
export interface MbaDevis {
  id: string;
  compteId: string | null;
  reference: string;
  clientId: string;
  clientNom: string;
  dossierId: string | null;
  titre: string;
  montant: number;
  statut: DevisStatus;
  dateEmission: string;
  dateValidite: string;
  signatureDataUrl?: string | null;
  signataireNom?: string | null;
  dateSignature?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Employé / Salarié / Agent / Coach / Technicien — selon le secteur */
export interface MbaEmployee {
  id: string;
  compteId: string | null;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  poste: string | null;
  statut: EmployeeStatus;
  accesModules: Record<string, boolean>;
  dateEmbauche: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Message dans une conversation */
export interface MbaMessage {
  id: string;
  compteId: string | null;
  conversationId: string;
  contenu: string;
  role: MessageRole;
  isGroupMessage: boolean;
  /** batch_id pour les messages groupés — null pour les messages individuels */
  batchId?: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  mediaName: string | null;
  mediaSize: number | null;
  date: string;
  createdAt: string;
}

/** Conversation (thread de messages) */
export interface MbaConversation {
  id: string;
  compteId: string | null;
  clientId: string | null;
  clientNom: string;
  sujet: string;
  dernierMessage: string | null;
  nonLus: number;
  createdAt: string;
  updatedAt: string;
}

/** Notification */
export interface MbaNotification {
  id: string;
  compteId: string | null;
  type: NotificationType;
  titre: string;
  description: string;
  date: string;
  lu: boolean;
  lien: string | null;
  destinataire: NotificationDestinataire;
  clientId?: string | null;
  employeeId?: string | null;
  canal?: string | null;
  createdAt: string;
}

/** Rendez-vous / Appointment */
export interface MbaAppointment {
  id: string;
  compteId: string | null;
  titre: string;
  description: string | null;
  clientId: string | null;
  clientNom: string | null;
  employeeId: string | null;
  dossierId: string | null;
  dateDebut: string;
  dateFin: string;
  statut: AppointmentStatus;
  lieu: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Document attaché à un dossier */
export interface MbaDocument {
  id: string;
  compteId: string | null;
  dossierId: string;
  nom: string;
  type: string;
  url: string;
  taille: number | null;
  uploadePar: string | null;
  createdAt: string;
}

/** Photo attachée à un dossier */
export interface MbaPhoto {
  id: string;
  compteId: string | null;
  dossierId: string;
  url: string;
  nom: string | null;
  /** ISO timestamp de la prise de vue */
  timestamp: string;
  /** Coordonnées GPS si disponibles */
  latitude: number | null;
  longitude: number | null;
  /** Catégorie: "avant" | "apres" pour conciergerie, null pour les autres secteurs */
  categorie: string | null;
  uploadePar: string | null;
  createdAt: string;
}

/** Note interne sur un dossier */
export interface MbaNote {
  id: string;
  compteId: string | null;
  dossierId: string;
  contenu: string;
  auteurId: string | null;
  auteurNom: string | null;
  createdAt: string;
}

/** Assignation employé ↔ dossier */
export interface MbaAssignment {
  id: string;
  dossierId: string;
  employeeId: string;
  role: "responsable" | "renfort";
  dateAssignation: string;
}

/** Timeline step d'un dossier */
export interface MbaTimelineStep {
  id: string;
  dossierId: string;
  stepIndex: number;
  stepName: string;
  completedAt: string | null;
  completedBy: string | null;
  notes: Record<string, unknown> | null;
  createdAt: string;
}

// ────────────────────────────────────────────────────────
// HELPERS — mapping Supabase Row ↔ MbaType
// Utilisés par les hooks pour convertir entre snake_case (DB) et camelCase (front)
// ────────────────────────────────────────────────────────

/** Convertit un row Supabase clients en MbaClient */
export function mapClientRow(row: Record<string, unknown>): MbaClient {
  return {
    id: row.id as string,
    compteId: (row.compte_id as string) ?? null,
    nom: row.nom as string,
    prenom: row.prenom as string,
    email: row.email as string,
    telephone: (row.telephone as string) ?? "",
    entreprise: (row.entreprise as string) ?? "",
    siret: (row.siret as string) ?? null,
    adresse: (row.adresse as string) ?? null,
    codePostal: (row.code_postal as string) ?? null,
    ville: (row.ville as string) ?? null,
    pays: (row.pays as string) ?? null,
    statut: (row.statut as ClientStatus) ?? "actif",
    segment: (row.segment as ClientSegment) ?? "client",
    emailOptOut: (row.email_opt_out as boolean) ?? false,
    nombreDossiers: (row.nombre_dossiers as number) ?? 0,
    userId: (row.user_id as string) ?? null,
    dateCreation: ((row.date_creation as string) ?? "").split("T")[0],
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
  };
}

/** Convertit un row Supabase dossiers en MbaDossier */
export function mapDossierRow(row: Record<string, unknown>): MbaDossier {
  return {
    id: row.id as string,
    compteId: (row.compte_id as string) ?? null,
    reference: row.reference as string,
    clientId: row.client_id as string,
    clientNom: row.client_nom as string,
    typePrestation: row.type_prestation as string,
    montant: (row.montant as number) ?? 0,
    statut: (row.statut as DossierStatus) ?? "en_attente",
    employeeId: (row.employee_id as string) ?? null,
    demandeId: (row.demande_id as string) ?? null,
    previewUrl: (row.preview_url as string) ?? null,
    rdvEffectue: (row.rdv_effectue as boolean) ?? false,
    dateCreation: ((row.date_creation as string) ?? "").split("T")[0],
    dateEcheance: (row.date_echeance as string) ?? null,
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
  };
}

/** Convertit un row Supabase factures en MbaFacture */
export function mapFactureRow(row: Record<string, unknown>): MbaFacture {
  return {
    id: row.id as string,
    compteId: (row.compte_id as string) ?? null,
    reference: row.reference as string,
    clientId: row.client_id as string,
    clientNom: row.client_nom as string,
    dossierId: (row.dossier_id as string) ?? null,
    montant: (row.montant as number) ?? 0,
    statut: (row.statut as FactureStatus) ?? "en_attente",
    description: (row.description as string) ?? null,
    serviceCategoryId: (row.service_category_id as string) ?? null,
    dateEmission: ((row.date_emission as string) ?? "").split("T")[0],
    dateEcheance: ((row.date_echeance as string) ?? "").split("T")[0],
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
  };
}

/** Convertit un row Supabase messages en MbaMessage */
export function mapMessageRow(row: Record<string, unknown>): MbaMessage {
  return {
    id: row.id as string,
    compteId: (row.compte_id as string) ?? null,
    conversationId: row.conversation_id as string,
    contenu: row.contenu as string,
    role: (row.role as MessageRole) ?? "admin",
    isGroupMessage: (row.is_group_message as boolean) ?? false,
    batchId: (row.batch_id as string) ?? null,
    mediaUrl: (row.media_url as string) ?? null,
    mediaType: (row.media_type as string) ?? null,
    mediaName: (row.media_name as string) ?? null,
    mediaSize: (row.media_size as number) ?? null,
    date: (row.date as string) ?? "",
    createdAt: (row.created_at as string) ?? "",
  };
}

/** Convertit un row Supabase employees en MbaEmployee */
export function mapEmployeeRow(row: Record<string, unknown>): MbaEmployee {
  return {
    id: row.id as string,
    compteId: (row.compte_id as string) ?? null,
    nom: row.nom as string,
    prenom: row.prenom as string,
    email: (row.email as string) ?? "",
    telephone: (row.telephone as string) ?? null,
    poste: (row.poste as string) ?? null,
    statut: (row.statut as EmployeeStatus) ?? "actif",
    accesModules: (row.acces_modules as Record<string, boolean>) ?? {},
    dateEmbauche: (row.date_embauche as string) ?? null,
    userId: (row.user_id as string) ?? null,
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
  };
}
