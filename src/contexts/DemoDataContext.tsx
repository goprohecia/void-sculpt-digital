import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  factures as initialFactures,
  devis as initialDevis,
  dossiers as initialDossiers,
  clients,
  type Facture,
  type FactureStatus,
  type Devis,
  type DevisStatus,
  type Dossier,
  type DossierStatus,
} from "@/data/mockData";

// ---- Demande type ----
export type DemandeStatus = "nouvelle" | "en_revue" | "validee" | "refusee";
export type DemandePrestation = "Site web" | "App mobile" | "E-commerce" | "Back-office" | "360" | "Autre";

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
  updateFactureStatut: (id: string, statut: FactureStatus) => void;
  updateDevisStatut: (id: string, statut: DevisStatus) => void;
  updateDossierStatut: (id: string, statut: DossierStatus) => void;
  addDemande: (demande: Demande) => void;
  updateDemandeStatut: (id: string, statut: DemandeStatus) => void;
  addDevis: (d: Devis) => void;
  addFacture: (f: Facture) => void;
  addDossier: (d: Dossier) => void;
  getDemandesByClient: (clientId: string) => Demande[];
  getDossiersByClient: (clientId: string) => Dossier[];
  getFacturesByClient: (clientId: string) => Facture[];
  getDevisByClient: (clientId: string) => Devis[];
  getFacturesByDossier: (dossierId: string) => Facture[];
  getDevisByDossier: (dossierId: string) => Devis[];
  getDossierById: (id: string) => Dossier | undefined;
  getFactureById: (id: string) => Facture | undefined;
}

const DemoDataContext = createContext<DemoDataContextType | null>(null);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [factures, setFactures] = useState<Facture[]>([...initialFactures]);
  const [devisState, setDevis] = useState<Devis[]>([...initialDevis]);
  const [dossiersState, setDossiers] = useState<Dossier[]>([...initialDossiers]);
  const [demandes, setDemandes] = useState<Demande[]>([...initialDemandes]);

  const updateFactureStatut = useCallback((id: string, statut: FactureStatus) => {
    setFactures((prev) => prev.map((f) => (f.id === id ? { ...f, statut } : f)));
  }, []);

  const updateDevisStatut = useCallback((id: string, statut: DevisStatus) => {
    setDevis((prev) => prev.map((d) => (d.id === id ? { ...d, statut } : d)));
  }, []);

  const updateDossierStatut = useCallback((id: string, statut: DossierStatus) => {
    setDossiers((prev) => prev.map((d) => (d.id === id ? { ...d, statut } : d)));
  }, []);

  const addDemande = useCallback((demande: Demande) => {
    setDemandes((prev) => [demande, ...prev]);
  }, []);

  const updateDemandeStatut = useCallback((id: string, statut: DemandeStatus) => {
    setDemandes((prev) => prev.map((d) => (d.id === id ? { ...d, statut, dateMiseAJour: new Date().toISOString().split("T")[0] } : d)));
  }, []);

  const addDevis = useCallback((d: Devis) => {
    setDevis((prev) => [d, ...prev]);
  }, []);

  const addFacture = useCallback((f: Facture) => {
    setFactures((prev) => [f, ...prev]);
  }, []);

  const addDossier = useCallback((d: Dossier) => {
    setDossiers((prev) => [d, ...prev]);
  }, []);

  const getDemandesByClient = useCallback((clientId: string) => demandes.filter((d) => d.clientId === clientId), [demandes]);
  const getDossiersByClient = useCallback((clientId: string) => dossiersState.filter((d) => d.clientId === clientId), [dossiersState]);
  const getFacturesByClient = useCallback((clientId: string) => factures.filter((f) => f.clientId === clientId), [factures]);
  const getDevisByClient = useCallback((clientId: string) => devisState.filter((d) => d.clientId === clientId), [devisState]);
  const getFacturesByDossier = useCallback((dossierId: string) => factures.filter((f) => f.dossierId === dossierId), [factures]);
  const getDevisByDossier = useCallback((dossierId: string) => devisState.filter((d) => d.dossierId === dossierId), [devisState]);
  const getDossierById = useCallback((id: string) => dossiersState.find((d) => d.id === id), [dossiersState]);
  const getFactureById = useCallback((id: string) => factures.find((f) => f.id === id), [factures]);

  return (
    <DemoDataContext.Provider value={{
      factures, devis: devisState, dossiers: dossiersState, demandes,
      updateFactureStatut, updateDevisStatut, updateDossierStatut,
      addDemande, updateDemandeStatut, addDevis, addFacture, addDossier,
      getDemandesByClient, getDossiersByClient, getFacturesByClient, getDevisByClient,
      getFacturesByDossier, getDevisByDossier, getDossierById, getFactureById,
    }}>
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}
