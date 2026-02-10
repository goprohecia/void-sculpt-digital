import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  factures as initialFactures,
  devis as initialDevis,
  dossiers as initialDossiers,
  clients as initialClients,
  notifications as initialNotifications,
  type Client,
  type Facture,
  type FactureStatus,
  type Devis,
  type DevisStatus,
  type Dossier,
  type DossierStatus,
  type Notification,
} from "@/data/mockData";

// ---- EmailLog type ----
export type EmailLogType = "relance" | "devis" | "paiement" | "demande" | "validation";

export interface EmailLog {
  id: string;
  type: EmailLogType;
  destinataire: string;
  sujet: string;
  contenu: string;
  dateEnvoi: string;
  clientId?: string;
  reference?: string;
}

// ---- SendLog type ----
export type SendLogDocType = "facture" | "devis";

export interface SendLog {
  id: string;
  docType: SendLogDocType;
  docReference: string;
  clientId: string;
  clientNom: string;
  dateEnvoi: string;
}

// ---- PreviewVisit type ----
export interface PreviewVisit {
  id: string;
  dossierId: string;
  date: string;
  device: "desktop" | "mobile" | "tablet";
}

// Generate initial mock visits for dossiers that have previewUrl
function generateMockVisits(): PreviewVisit[] {
  const dossierIds = ["d1", "d3", "d4", "d6", "d7", "d10", "d11", "d12", "d14", "d16", "d20", "d22", "d24"];
  const devices: Array<"desktop" | "mobile" | "tablet"> = ["desktop", "mobile", "tablet"];
  const visits: PreviewVisit[] = [];
  let id = 1;
  for (const did of dossierIds) {
    const count = Math.floor(Math.random() * 8) + 2;
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const hour = Math.floor(Math.random() * 14) + 8;
      const min = Math.floor(Math.random() * 60);
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      d.setHours(hour, min, 0, 0);
      visits.push({
        id: `pv_${id++}`,
        dossierId: did,
        date: d.toISOString(),
        device: devices[Math.floor(Math.random() * devices.length)],
      });
    }
  }
  return visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export type DemandeStatus = "nouvelle" | "en_revue" | "validee" | "refusee";
export type DemandePrestation = "Site web" | "App mobile" | "E-commerce" | "Back-office" | "360" | "Autre";

export type CdcHistoriqueAction = "creation" | "mise_a_jour" | "soumission" | "commentaire_admin" | "validation" | "rejet";

export interface CdcHistoriqueEntry {
  id: string;
  action: CdcHistoriqueAction;
  auteur: "client" | "admin";
  description: string;
  date: string;
}

export interface CdcPieceJointe {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface CahierDesCharges {
  id: string;
  demandeId: string;
  contexte: string;
  publicCible: string;
  fonctionnalites: string[];
  designNotes: string;
  contraintesTechniques: string;
  planningSouhaite: string;
  budgetComplementaire: string;
  remarques: string;
  commentairesAdmin?: string;
  motifRejet?: string;
  nbRejets?: number;
  piecesJointes?: CdcPieceJointe[];
  statut: "brouillon" | "complet" | "validé" | "rejeté";
  dateMiseAJour: string;
  historique: CdcHistoriqueEntry[];
}

export interface Demande {
  id: string;
  reference: string;
  clientId: string;
  clientNom: string;
  titre: string;
  typePrestation: DemandePrestation;
  description: string;
  budget?: string;
  statut: DemandeStatus;
  dateCreation: string;
  dateMiseAJour: string;
}

const initialCahiers: CahierDesCharges[] = [
  {
    id: "cdc1",
    demandeId: "dem1",
    contexte: "Luxe & Mode est une maison de mode haut de gamme fondée en 2015. Nous souhaitons moderniser notre présence e-commerce pour offrir une expérience d'achat en ligne à la hauteur de notre positionnement premium. L'objectif est d'augmenter le taux de conversion de 30% et d'améliorer la fidélisation client.",
    publicCible: "Femmes 25-55 ans, CSP+, passionnées de mode et de luxe. Personas principales : la fashionista connectée (28-35 ans) et la cliente fidèle (40-55 ans) qui privilégie la qualité.",
    fonctionnalites: [
      "Catalogue produits avec filtres avancés (taille, couleur, matière, prix)",
      "Panier et tunnel d'achat optimisé mobile-first",
      "Programme de fidélité avec points et avantages exclusifs",
      "Wishlist et alertes de disponibilité",
      "Intégration des avis clients vérifiés",
      "Click & Collect en boutique",
    ],
    designNotes: "Charte graphique minimaliste et élégante. Couleurs : noir, blanc, doré. Typographie : serif pour les titres, sans-serif pour le corps. Inspirations : Net-a-Porter, Farfetch. Priorité à l'image produit grand format.",
    contraintesTechniques: "Hébergement cloud scalable. Intégration Shopify ou solution headless. API paiement : Stripe + PayPal. Compatibilité IE11 non requise. Performance : LCP < 2.5s.",
    planningSouhaite: "Livraison souhaitée mi-juin 2026. Jalons : maquettes validées fin février, développement mars-mai, recette début juin.",
    budgetComplementaire: "Budget dédié à l'UX/UI design déjà alloué séparément (5 000 €). Le budget mentionné dans la demande couvre uniquement le développement.",
    remarques: "Nous disposons déjà d'un stock photo professionnel. Un accès au back-office actuel sera fourni pour la migration des données produits.",
    commentairesAdmin: "Projet très intéressant, le scope est bien défini. Prévoir une phase de migration des données produits existantes. Attention au budget serré pour le programme de fidélité — proposer un MVP d'abord.",
    statut: "validé",
    dateMiseAJour: "2026-02-04",
    historique: [
      { id: "h1", action: "creation", auteur: "client", description: "Cahier des charges créé", date: "2026-02-01T10:30:00" },
      { id: "h2", action: "mise_a_jour", auteur: "client", description: "Sections design et fonctionnalités complétées", date: "2026-02-02T14:15:00" },
      { id: "h3", action: "soumission", auteur: "client", description: "Cahier des charges soumis pour validation", date: "2026-02-03T09:00:00" },
      { id: "h4", action: "commentaire_admin", auteur: "admin", description: "Commentaire ajouté par l'équipe", date: "2026-02-03T16:45:00" },
      { id: "h5", action: "validation", auteur: "admin", description: "Cahier des charges validé", date: "2026-02-04T11:20:00" },
    ],
  },
];

const initialDemandes: Demande[] = [
  {
    id: "dem1", reference: "DEM-2026-001", clientId: "c3", clientNom: "Luxe & Mode",
    titre: "Refonte complète du site e-commerce", typePrestation: "E-commerce",
    description: "Nous souhaitons refondre entièrement notre boutique en ligne avec un design plus moderne, une meilleure UX mobile et l'intégration d'un programme de fidélité.",
    budget: "20 000 – 30 000 €", statut: "en_revue",
    dateCreation: "2026-02-01", dateMiseAJour: "2026-02-05",
  },
  {
    id: "dem2", reference: "DEM-2026-002", clientId: "c3", clientNom: "Luxe & Mode",
    titre: "Application de gestion interne", typePrestation: "Back-office",
    description: "Besoin d'un outil interne pour gérer les stocks, les commandes fournisseurs et le suivi logistique.",
    budget: "15 000 €", statut: "nouvelle",
    dateCreation: "2026-02-07", dateMiseAJour: "2026-02-07",
  },
  {
    id: "dem3", reference: "DEM-2026-003", clientId: "c3", clientNom: "Luxe & Mode",
    titre: "Landing page campagne été 2026", typePrestation: "Site web",
    description: "Landing page promotionnelle pour la collection été, avec formulaire d'inscription newsletter et intégration réseaux sociaux.",
    statut: "validee",
    dateCreation: "2026-01-20", dateMiseAJour: "2026-01-25",
  },
];

interface DemoDataContextType {
  factures: Facture[];
  devis: Devis[];
  dossiers: Dossier[];
  demandes: Demande[];
  clients: Client[];
  notifications: Notification[];
  emailLogs: EmailLog[];
  sendLogs: SendLog[];
  updateFactureStatut: (id: string, statut: FactureStatus) => void;
  updateDevisStatut: (id: string, statut: DevisStatus) => void;
  updateDevisSignature: (id: string, signatureDataUrl: string, signataireNom: string, dateSignature: string) => void;
  updateDossierStatut: (id: string, statut: DossierStatus) => void;
  updateDossierPreviewUrl: (id: string, previewUrl: string) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  addDemande: (demande: Demande) => void;
  updateDemandeStatut: (id: string, statut: DemandeStatus) => void;
  addDevis: (d: Devis) => void;
  addFacture: (f: Facture) => void;
  addDossier: (d: Dossier) => void;
  addNotification: (n: Notification) => void;
  pushEmail: (type: EmailLogType, destinataire: string, sujet: string, contenu: string, clientId?: string, reference?: string) => void;
  addSendLog: (docType: SendLogDocType, docReference: string, clientId: string, clientNom: string) => void;
  getDemandesByClient: (clientId: string) => Demande[];
  getDossiersByClient: (clientId: string) => Dossier[];
  getFacturesByClient: (clientId: string) => Facture[];
  getDevisByClient: (clientId: string) => Devis[];
  getFacturesByDossier: (dossierId: string) => Facture[];
  getDevisByDossier: (dossierId: string) => Devis[];
  getDossierById: (id: string) => Dossier | undefined;
  getFactureById: (id: string) => Facture | undefined;
  getClientById: (id: string) => Client | undefined;
  getNotificationsAdmin: () => Notification[];
  getNotificationsByClient: (clientId: string) => Notification[];
  previewVisits: PreviewVisit[];
  getPreviewVisitsByDossier: (dossierId: string) => PreviewVisit[];
  addPreviewVisit: (dossierId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role: "admin" | "client", clientId?: string) => void;
  cahiersDesCharges: CahierDesCharges[];
  getCahierByDemande: (demandeId: string) => CahierDesCharges | undefined;
  getCahierByDossier: (dossierId: string) => CahierDesCharges | undefined;
  saveCahierDesCharges: (cahier: CahierDesCharges) => void;
  updateCahierComment: (demandeId: string, comment: string) => void;
  validateCahier: (demandeId: string) => void;
  rejectCahier: (demandeId: string, motif: string) => void;
  marquerRdvEffectue: (dossierId: string) => void;
}

const DemoDataContext = createContext<DemoDataContextType | null>(null);

function nowISO() {
  return new Date().toISOString().replace("T", " ").slice(0, 16);
}

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [factures, setFactures] = useState<Facture[]>([...initialFactures]);
  const [devisState, setDevis] = useState<Devis[]>([...initialDevis]);
  const [dossiersState, setDossiers] = useState<Dossier[]>([...initialDossiers]);
  const [clientsState, setClients] = useState<Client[]>([...initialClients]);
  const [demandes, setDemandes] = useState<Demande[]>([...initialDemandes]);
  const [notifs, setNotifs] = useState<Notification[]>([...initialNotifications]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [sendLogs, setSendLogs] = useState<SendLog[]>([]);
  const [previewVisits, setPreviewVisits] = useState<PreviewVisit[]>(generateMockVisits());
  const [cahiersDesCharges, setCahiersDesCharges] = useState<CahierDesCharges[]>([...initialCahiers]);
  const pushEmail = useCallback((type: EmailLogType, destinataire: string, sujet: string, contenu: string, clientId?: string, reference?: string) => {
    const email: EmailLog = {
      id: `em_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type, destinataire, sujet, contenu,
      dateEnvoi: new Date().toISOString(),
      clientId, reference,
    };
    setEmailLogs((prev) => [email, ...prev]);
  }, []);

  const addSendLog = useCallback((docType: SendLogDocType, docReference: string, clientId: string, clientNom: string) => {
    const log: SendLog = {
      id: `sl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      docType, docReference, clientId, clientNom,
      dateEnvoi: new Date().toISOString(),
    };
    setSendLogs((prev) => [log, ...prev]);
  }, []);

  const addNotification = useCallback((n: Notification) => {
    setNotifs((prev) => [n, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback((role: "admin" | "client", clientId?: string) => {
    setNotifs((prev) =>
      prev.map((n) => {
        if (role === "admin" && (n.destinataire === "admin" || n.destinataire === "all")) return { ...n, lu: true };
        if (role === "client" && (n.destinataire === "client" || n.destinataire === "all") && (!clientId || n.clientId === clientId)) return { ...n, lu: true };
        return n;
      })
    );
  }, []);

  const pushNotif = useCallback((type: Notification["type"], titre: string, description: string, lien: string, destinataire: Notification["destinataire"], clientId?: string) => {
    const n: Notification = {
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type, titre, description, date: nowISO(), lu: false, lien, destinataire, clientId,
    };
    setNotifs((prev) => [n, ...prev]);
  }, []);

  const updateFactureStatut = useCallback((id: string, statut: FactureStatus) => {
    setFactures((prev) => {
      const facture = prev.find((f) => f.id === id);
      if (facture && statut === "payee") {
        pushNotif("facture", "Paiement reçu", `${facture.clientNom} a réglé la facture ${facture.reference} (${facture.montant.toLocaleString()} €)`, "/admin/facturation", "admin");
        pushNotif("facture", "Paiement confirmé", `Votre paiement de ${facture.montant.toLocaleString()} € pour ${facture.reference} est confirmé`, "/client/factures", "client", facture.clientId);
        pushEmail("paiement", facture.clientNom, `Confirmation de paiement — ${facture.reference}`,
          `<p>Bonjour,</p><p>Nous confirmons la réception de votre paiement de <strong>${facture.montant.toLocaleString()} €</strong> pour la facture <strong>${facture.reference}</strong>.</p><p>Merci pour votre confiance.</p><p>L'équipe Impartial</p>`,
          facture.clientId, facture.reference);
        pushEmail("paiement", "admin@impartial.fr", `Paiement reçu — ${facture.reference}`,
          `<p>Le client <strong>${facture.clientNom}</strong> a réglé la facture <strong>${facture.reference}</strong> d'un montant de <strong>${facture.montant.toLocaleString()} €</strong>.</p>`,
          undefined, facture.reference);
      }
      return prev.map((f) => (f.id === id ? { ...f, statut } : f));
    });
  }, [pushNotif, pushEmail]);

  const updateDevisStatut = useCallback((id: string, statut: DevisStatus) => {
    setDevis((prev) => {
      const d = prev.find((x) => x.id === id);
      if (d && statut === "accepte") {
        pushNotif("devis", "Devis accepté", `${d.clientNom} a accepté le devis ${d.reference} (${d.montant.toLocaleString()} €)`, "/admin/facturation", "admin");
      } else if (d && statut === "refuse") {
        pushNotif("devis", "Devis refusé", `${d.clientNom} a refusé le devis ${d.reference}`, "/admin/facturation", "admin");
      }
      return prev.map((x) => (x.id === id ? { ...x, statut } : x));
    });
  }, [pushNotif]);

  const updateDevisSignature = useCallback((id: string, signatureDataUrl: string, signataireNom: string, dateSignature: string) => {
    setDevis((prev) => prev.map((d) => (d.id === id ? { ...d, signatureDataUrl, signataireNom, dateSignature } : d)));
  }, []);

  const updateDossierStatut = useCallback((id: string, statut: DossierStatus) => {
    setDossiers((prev) => prev.map((d) => (d.id === id ? { ...d, statut } : d)));
  }, []);

  const updateDossierPreviewUrl = useCallback((id: string, previewUrl: string) => {
    setDossiers((prev) => prev.map((d) => (d.id === id ? { ...d, previewUrl } : d)));
  }, []);

  const addDemande = useCallback((demande: Demande) => {
    setDemandes((prev) => [demande, ...prev]);
    pushNotif("dossier", "Nouvelle demande", `${demande.clientNom} a soumis une demande : "${demande.titre}"`, "/admin/dossiers", "admin");
    pushNotif("dossier", "Demande envoyée", `Votre demande "${demande.titre}" a bien été envoyée`, "/client/demandes", "client", demande.clientId);
    pushEmail("demande", demande.clientNom, `Demande reçue — ${demande.reference}`,
      `<p>Bonjour,</p><p>Nous avons bien reçu votre demande <strong>"${demande.titre}"</strong> (réf. ${demande.reference}).</p><p>Notre équipe l'examine et reviendra vers vous rapidement.</p><p>L'équipe Impartial</p>`,
      demande.clientId, demande.reference);
  }, [pushNotif, pushEmail]);

  const updateDemandeStatut = useCallback((id: string, statut: DemandeStatus) => {
    setDemandes((prev) => {
      const dem = prev.find((d) => d.id === id);
      if (dem && (statut === "validee" || statut === "refusee")) {
        const label = statut === "validee" ? "validée" : "refusée";
        pushNotif("dossier", `Demande ${label}`, `Votre demande "${dem.titre}" a été ${label}`, "/client/demandes", "client", dem.clientId);
        pushEmail("validation", dem.clientNom, `Demande ${label} — ${dem.reference}`,
          `<p>Bonjour,</p><p>Votre demande <strong>"${dem.titre}"</strong> (réf. ${dem.reference}) a été <strong>${label}</strong>.</p>${statut === "validee" ? "<p>Nous vous contacterons prochainement pour les prochaines étapes.</p>" : "<p>N'hésitez pas à nous contacter pour plus d'informations.</p>"}<p>L'équipe Impartial</p>`,
          dem.clientId, dem.reference);
      }
      return prev.map((d) => (d.id === id ? { ...d, statut, dateMiseAJour: new Date().toISOString().split("T")[0] } : d));
    });
  }, [pushNotif, pushEmail]);

  const addDevis = useCallback((d: Devis) => {
    setDevis((prev) => [d, ...prev]);
    pushNotif("devis", "Nouveau devis", `Un devis "${d.titre}" (${d.montant.toLocaleString()} €) est disponible`, "/client/devis", "client", d.clientId);
    pushEmail("devis", d.clientNom, `Nouveau devis — ${d.reference}`,
      `<p>Bonjour,</p><p>Un nouveau devis <strong>"${d.titre}"</strong> d'un montant de <strong>${d.montant.toLocaleString()} €</strong> est disponible dans votre espace client.</p><p>Vous pouvez le consulter et l'accepter directement en ligne.</p><p>L'équipe Impartial</p>`,
      d.clientId, d.reference);
  }, [pushNotif, pushEmail]);

  const addFacture = useCallback((f: Facture) => {
    setFactures((prev) => [f, ...prev]);
    pushNotif("facture", "Nouvelle facture", `Facture ${f.reference} (${f.montant.toLocaleString()} €) disponible`, "/client/factures", "client", f.clientId);
    pushEmail("devis", f.clientNom, `Nouvelle facture — ${f.reference}`,
      `<p>Bonjour,</p><p>Une nouvelle facture <strong>${f.reference}</strong> d'un montant de <strong>${f.montant.toLocaleString()} €</strong> est disponible dans votre espace client.</p><p>L'équipe Impartial</p>`,
      f.clientId, f.reference);
  }, [pushNotif, pushEmail]);

  const addDossier = useCallback((d: Dossier) => {
    setDossiers((prev) => [d, ...prev]);
  }, []);

  const updateClient = useCallback((id: string, data: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const getDemandesByClient = useCallback((clientId: string) => demandes.filter((d) => d.clientId === clientId), [demandes]);
  const getDossiersByClient = useCallback((clientId: string) => dossiersState.filter((d) => d.clientId === clientId), [dossiersState]);
  const getFacturesByClient = useCallback((clientId: string) => factures.filter((f) => f.clientId === clientId), [factures]);
  const getDevisByClient = useCallback((clientId: string) => devisState.filter((d) => d.clientId === clientId), [devisState]);
  const getFacturesByDossier = useCallback((dossierId: string) => factures.filter((f) => f.dossierId === dossierId), [factures]);
  const getDevisByDossier = useCallback((dossierId: string) => devisState.filter((d) => d.dossierId === dossierId), [devisState]);
  const getDossierById = useCallback((id: string) => dossiersState.find((d) => d.id === id), [dossiersState]);
  const getFactureById = useCallback((id: string) => factures.find((f) => f.id === id), [factures]);
  const getClientById = useCallback((id: string) => clientsState.find((c) => c.id === id), [clientsState]);
  const getNotificationsAdmin = useCallback(() => notifs.filter((n) => n.destinataire === "admin" || n.destinataire === "all"), [notifs]);
  const getNotificationsByClient = useCallback((clientId: string) => notifs.filter((n) => (n.destinataire === "client" || n.destinataire === "all") && n.clientId === clientId), [notifs]);
  const getPreviewVisitsByDossier = useCallback((dossierId: string) => previewVisits.filter((v) => v.dossierId === dossierId), [previewVisits]);
  const addPreviewVisit = useCallback((dossierId: string) => {
    const devices: Array<"desktop" | "mobile" | "tablet"> = ["desktop", "mobile", "tablet"];
    const visit: PreviewVisit = {
      id: `pv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      dossierId,
      date: new Date().toISOString(),
      device: devices[Math.floor(Math.random() * devices.length)],
    };
    setPreviewVisits((prev) => [visit, ...prev]);
  }, []);
  const getCahierByDemande = useCallback((demandeId: string) => cahiersDesCharges.find((c) => c.demandeId === demandeId), [cahiersDesCharges]);
  const getCahierByDossier = useCallback((dossierId: string) => {
    const dossier = dossiersState.find((d) => d.id === dossierId);
    if (!dossier?.demandeId) return undefined;
    return cahiersDesCharges.find((c) => c.demandeId === dossier.demandeId);
  }, [dossiersState, cahiersDesCharges]);
  const saveCahierDesCharges = useCallback((cahier: CahierDesCharges) => {
    setCahiersDesCharges((prev) => {
      const idx = prev.findIndex((c) => c.demandeId === cahier.demandeId);
      if (idx >= 0) return prev.map((c, i) => (i === idx ? cahier : c));
      return [...prev, cahier];
    });
  }, []);
  const updateCahierComment = useCallback((demandeId: string, comment: string) => {
    const now = new Date().toISOString();
    const entry: CdcHistoriqueEntry = { id: `h_${Date.now()}`, action: "commentaire_admin", auteur: "admin", description: "Commentaire ajouté par l'équipe", date: now };
    setCahiersDesCharges((prev) => prev.map((c) => c.demandeId === demandeId ? { ...c, commentairesAdmin: comment, historique: [...c.historique, entry] } : c));
    // Notification + email to client
    const dem = demandes.find((d) => d.id === demandeId);
    if (dem) {
      pushNotif("dossier", "Nouveau commentaire CDC", `L'équipe a laissé un retour sur le cahier des charges de "${dem.titre}"`, "/client/demandes", "client", dem.clientId);
      pushEmail("validation", dem.clientNom, `Retour sur votre cahier des charges — ${dem.reference}`,
        `<p>Bonjour,</p><p>Notre équipe a laissé un commentaire sur le cahier des charges de votre demande <strong>"${dem.titre}"</strong>.</p><p>Connectez-vous à votre espace client pour le consulter.</p><p>L'équipe Impartial</p>`,
        dem.clientId, dem.reference);
    }
  }, [demandes, pushNotif, pushEmail]);

  const validateCahier = useCallback((demandeId: string) => {
    const now = new Date().toISOString();
    const entry: CdcHistoriqueEntry = { id: `h_${Date.now()}`, action: "validation", auteur: "admin", description: "Cahier des charges validé", date: now };
    setCahiersDesCharges((prev) => prev.map((c) => c.demandeId === demandeId ? { ...c, statut: "validé" as const, dateMiseAJour: now.split("T")[0], historique: [...c.historique, entry] } : c));
    const dem = demandes.find((d) => d.id === demandeId);
    if (dem) {
      pushNotif("dossier", "Cahier des charges validé", `Votre cahier des charges pour "${dem.titre}" a été validé. Le développement peut commencer !`, "/client/dossiers", "client", dem.clientId);
      pushEmail("validation", dem.clientNom, `Cahier des charges validé — ${dem.reference}`,
        `<p>Bonjour,</p><p>Votre cahier des charges pour <strong>"${dem.titre}"</strong> a été validé par notre équipe.</p><p>Le développement de votre projet peut maintenant commencer.</p><p>L'équipe Impartial</p>`,
        dem.clientId, dem.reference);
    }
  }, [demandes, pushNotif, pushEmail]);

  const rejectCahier = useCallback((demandeId: string, motif: string) => {
    const now = new Date().toISOString();
    const entry: CdcHistoriqueEntry = { id: `h_${Date.now()}`, action: "rejet", auteur: "admin", description: `Cahier des charges rejeté : ${motif}`, date: now };
    setCahiersDesCharges((prev) => prev.map((c) => c.demandeId === demandeId ? { ...c, statut: "rejeté" as const, motifRejet: motif, nbRejets: (c.nbRejets || 0) + 1, dateMiseAJour: now.split("T")[0], historique: [...c.historique, entry] } : c));
    const dem = demandes.find((d) => d.id === demandeId);
    if (dem) {
      pushNotif("dossier", "Cahier des charges rejeté", `Votre cahier des charges pour "${dem.titre}" nécessite des modifications. Motif : ${motif}`, "/client/dossiers", "client", dem.clientId);
      pushEmail("validation", dem.clientNom, `Cahier des charges à modifier — ${dem.reference}`,
        `<p>Bonjour,</p><p>Votre cahier des charges pour <strong>"${dem.titre}"</strong> nécessite des modifications.</p><p><strong>Motif :</strong> ${motif}</p><p>Merci de le corriger et de le soumettre à nouveau depuis votre espace client.</p><p>L'équipe Impartial</p>`,
        dem.clientId, dem.reference);
    }
  }, [demandes, pushNotif, pushEmail]);

  const marquerRdvEffectue = useCallback((dossierId: string) => {
    setDossiers((prev) => prev.map((d) => (d.id === dossierId ? { ...d, rdvEffectue: true } : d)));
    const dossier = dossiersState.find((d) => d.id === dossierId);
    if (dossier) {
      pushNotif("dossier", "Rendez-vous effectué", `Le rendez-vous pour le dossier ${dossier.reference} a été marqué comme effectué`, "/client/dossiers", "client", dossier.clientId);
    }
  }, [dossiersState, pushNotif]);

  return (
    <DemoDataContext.Provider value={{
      factures, devis: devisState, dossiers: dossiersState, demandes, clients: clientsState, notifications: notifs, emailLogs, sendLogs, previewVisits,
      updateFactureStatut, updateDevisStatut, updateDevisSignature, updateDossierStatut, updateDossierPreviewUrl, updateClient,
      addDemande, updateDemandeStatut, addDevis, addFacture, addDossier, addNotification, pushEmail, addSendLog,
      getDemandesByClient, getDossiersByClient, getFacturesByClient, getDevisByClient,
      getFacturesByDossier, getDevisByDossier, getDossierById, getFactureById, getClientById,
      getNotificationsAdmin, getNotificationsByClient, getPreviewVisitsByDossier, addPreviewVisit,
      markNotificationRead, markAllNotificationsRead,
      cahiersDesCharges, getCahierByDemande, getCahierByDossier, saveCahierDesCharges, updateCahierComment, validateCahier, rejectCahier, marquerRdvEffectue,
    }}>
      {children}
    </DemoDataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}
