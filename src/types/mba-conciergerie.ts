// [MBA] Types MVP Conciergerie — tables spécifiques au secteur
// EN ATTENTE confirmation schéma Hamza pour: logements, missions, checklists, photos_mission
// Ces types sont préparés d'après le CDC Conciergerie v1 et les Instructions Dylan v3.
// Quand Hamza confirmera les tables, les hooks pourront être branchés directement.

import type { MbaEmployee } from "./mba-core";

// ────────────────────────────────────────────────────────
// STATUTS CONCIERGERIE
// ────────────────────────────────────────────────────────

export type LogementType = "appartement" | "studio" | "villa" | "maison" | "loft" | "chambre";
export type LogementStatus = "disponible" | "reserve" | "en_menage" | "maintenance" | "archive";

export type MissionType = "standard" | "depart" | "grand_menage" | "checkin" | "checkout" | "maintenance";
export type MissionStatus = "en_attente" | "assignee" | "en_cours" | "terminee" | "validee" | "probleme";

export type PhotoCategorie = "avant" | "apres" | "probleme";

export type ReservationPlateforme = "airbnb" | "booking" | "vrbo" | "direct" | "autre";

// ────────────────────────────────────────────────────────
// LOGEMENT — fiche bien immobilier géré
// Table attendue: logements
// ────────────────────────────────────────────────────────

export interface Logement {
  id: string;
  compteId: string;
  proprietaireId: string;
  /** Nom court du bien (ex: "T3 Vieux-Port") */
  nom: string;
  type: LogementType;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  etage: string | null;
  capacite: number;
  /** Code d'accès pour le prestataire */
  codeAcces: string | null;
  /** Instructions spéciales ménage — visibles prestataire uniquement */
  instructionsMenage: string | null;
  /** URL Airbnb du logement */
  lienAirbnb: string | null;
  /** URL Booking du logement */
  lienBooking: string | null;
  /** URL Vrbo du logement */
  lienVrbo: string | null;
  /** Photos de référence (URLs Supabase Storage) */
  photosReference: string[];
  statut: LogementStatus;
  /** Région pour le filtrage manager */
  region: string | null;
  createdAt: string;
  updatedAt: string;
}

// ────────────────────────────────────────────────────────
// RÉSERVATION — import manuel Phase 1 (iCal Phase 2)
// Table attendue: reservations
// ────────────────────────────────────────────────────────

export interface Reservation {
  id: string;
  compteId: string;
  logementId: string;
  /** Nom du voyageur */
  voyageurNom: string;
  voyageurEmail: string | null;
  voyageurTelephone: string | null;
  nombreVoyageurs: number;
  dateArrivee: string;
  dateDepart: string;
  plateforme: ReservationPlateforme;
  /** Référence externe (Airbnb confirmation code, etc.) */
  referenceExterne: string | null;
  /** Montant de la nuitée (pour le CA) */
  montantNuitees: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ────────────────────────────────────────────────────────
// MISSION MÉNAGE — unité de travail pour le prestataire
// Table attendue: missions
// ────────────────────────────────────────────────────────

export interface Mission {
  id: string;
  compteId: string;
  logementId: string;
  /** Lien vers la réservation qui a déclenché cette mission (null si manuelle) */
  reservationId: string | null;
  /** Lien vers le dossier MBA (fiche dossier standard) */
  dossierId: string | null;
  type: MissionType;
  statut: MissionStatus;
  /** Prestataire assigné */
  prestataireId: string | null;
  /** Manager qui a assigné la mission */
  assignePar: string | null;
  /** Date et heure prévues */
  datePrevue: string;
  heurePrevue: string | null;
  /** Horodatage début/fin (rempli par le prestataire) */
  heureDebut: string | null;
  heureFin: string | null;
  /** Note qualité après validation (1-5) */
  noteQualite: number | null;
  /** Commentaire du validateur */
  commentaireValidation: string | null;
  /** Validé par (admin ou manager ID) */
  validePar: string | null;
  /** Montant facturé pour cette mission */
  montant: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ────────────────────────────────────────────────────────
// CHECK-LIST MÉNAGE — tâches par logement
// Table attendue: checklist_templates (config) + checklist_items (exécution)
// ────────────────────────────────────────────────────────

/** Template de check-list — configuré par l'admin par logement */
export interface ChecklistTemplate {
  id: string;
  compteId: string;
  logementId: string;
  taches: ChecklistTache[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistTache {
  id: string;
  label: string;
  ordre: number;
  obligatoire: boolean;
}

/** Instance de check-list — une par mission, remplie par le prestataire */
export interface ChecklistInstance {
  id: string;
  missionId: string;
  templateId: string;
  items: ChecklistItemStatus[];
  completedAt: string | null;
  createdAt: string;
}

export interface ChecklistItemStatus {
  tacheId: string;
  label: string;
  done: boolean;
  completedAt: string | null;
}

// ────────────────────────────────────────────────────────
// PHOTO MISSION — preuves de travail horodatées + géolocalisées
// Table attendue: mission_photos
// Storage: supabase storage bucket "mission-photos"
// ────────────────────────────────────────────────────────

export interface MissionPhoto {
  id: string;
  missionId: string;
  /** URL Supabase Storage */
  url: string;
  /** Catégorie: avant intervention, après intervention, ou signalement problème */
  categorie: PhotoCategorie;
  /** Pièce du logement (optionnel) */
  piece: string | null;
  /** ISO timestamp exact de la prise de vue */
  timestamp: string;
  /** GPS latitude */
  latitude: number | null;
  /** GPS longitude */
  longitude: number | null;
  /** ID du prestataire qui a uploadé */
  uploadePar: string;
  createdAt: string;
}

// ────────────────────────────────────────────────────────
// RAPPORT MÉNAGE — généré automatiquement après validation
// Table attendue: rapports_menage
// ────────────────────────────────────────────────────────

export interface RapportMenage {
  id: string;
  missionId: string;
  logementId: string;
  proprietaireId: string;
  prestataireId: string;
  /** Résumé auto: heure début/fin, nb photos, note qualité */
  heureDebut: string;
  heureFin: string;
  nombrePhotos: number;
  noteQualite: number | null;
  /** URL du PDF généré (Supabase Storage) — Edge Function Hamza */
  pdfUrl: string | null;
  /** Date d'envoi au propriétaire */
  envoyeAu: string | null;
  createdAt: string;
}

// ────────────────────────────────────────────────────────
// COMMISSION MANAGER — suivi rémunération
// Table attendue: commissions
// ────────────────────────────────────────────────────────

export interface Commission {
  id: string;
  compteId: string;
  managerId: string;
  /** Mois concerné (YYYY-MM) */
  mois: string;
  /** CA total de la région du manager ce mois */
  caRegion: number;
  /** Taux de commission (0.10 = 10%) */
  tauxCommission: number;
  /** Montant calculé */
  montantCommission: number;
  /** Commission parrainage (si applicable) */
  montantParrainage: number;
  statut: "calcule" | "valide" | "paye";
  createdAt: string;
}

// ────────────────────────────────────────────────────────
// HELPERS — mappers (à compléter quand Hamza confirme le schéma exact)
// ────────────────────────────────────────────────────────

export function mapLogementRow(row: Record<string, unknown>): Logement {
  return {
    id: row.id as string,
    compteId: (row.compte_id as string) ?? "",
    proprietaireId: (row.proprietaire_id as string) ?? "",
    nom: (row.nom as string) ?? "",
    type: (row.type as LogementType) ?? "appartement",
    adresse: (row.adresse as string) ?? "",
    codePostal: (row.code_postal as string) ?? "",
    ville: (row.ville as string) ?? "",
    pays: (row.pays as string) ?? "France",
    etage: (row.etage as string) ?? null,
    capacite: (row.capacite as number) ?? 0,
    codeAcces: (row.code_acces as string) ?? null,
    instructionsMenage: (row.instructions_menage as string) ?? null,
    lienAirbnb: (row.lien_airbnb as string) ?? null,
    lienBooking: (row.lien_booking as string) ?? null,
    lienVrbo: (row.lien_vrbo as string) ?? null,
    photosReference: (row.photos_reference as string[]) ?? [],
    statut: (row.statut as LogementStatus) ?? "disponible",
    region: (row.region as string) ?? null,
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
  };
}

export function mapMissionRow(row: Record<string, unknown>): Mission {
  return {
    id: row.id as string,
    compteId: (row.compte_id as string) ?? "",
    logementId: (row.logement_id as string) ?? "",
    reservationId: (row.reservation_id as string) ?? null,
    dossierId: (row.dossier_id as string) ?? null,
    type: (row.type as MissionType) ?? "standard",
    statut: (row.statut as MissionStatus) ?? "en_attente",
    prestataireId: (row.prestataire_id as string) ?? null,
    assignePar: (row.assigne_par as string) ?? null,
    datePrevue: (row.date_prevue as string) ?? "",
    heurePrevue: (row.heure_prevue as string) ?? null,
    heureDebut: (row.heure_debut as string) ?? null,
    heureFin: (row.heure_fin as string) ?? null,
    noteQualite: (row.note_qualite as number) ?? null,
    commentaireValidation: (row.commentaire_validation as string) ?? null,
    validePar: (row.valide_par as string) ?? null,
    montant: (row.montant as number) ?? null,
    notes: (row.notes as string) ?? null,
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
  };
}

export function mapMissionPhotoRow(row: Record<string, unknown>): MissionPhoto {
  return {
    id: row.id as string,
    missionId: (row.mission_id as string) ?? "",
    url: (row.url as string) ?? "",
    categorie: (row.categorie as PhotoCategorie) ?? "apres",
    piece: (row.piece as string) ?? null,
    timestamp: (row.timestamp as string) ?? "",
    latitude: (row.latitude as number) ?? null,
    longitude: (row.longitude as number) ?? null,
    uploadePar: (row.uploade_par as string) ?? "",
    createdAt: (row.created_at as string) ?? "",
  };
}
