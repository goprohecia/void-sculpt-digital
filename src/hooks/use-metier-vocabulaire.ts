import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoPlan } from "@/contexts/DemoPlanContext";

/**
 * Fetches business vocabulary labels from metier_vocabulaire table.
 * Falls back to DemoPlanContext sector-based labels.
 * Returns a lookup: getLabel(champ, fallback) → custom label.
 */
export function useMetierVocabulaire() {
  const { isDemo } = useIsDemo();
  const { demoSector } = useDemoPlan();

  const { data: vocab = [] } = useQuery({
    queryKey: ["metier-vocabulaire", demoSector],
    queryFn: async () => {
      // Try fetching account-specific vocabulary first, then global defaults
      const { data, error } = await (supabase as any)
        .from("metier_vocabulaire")
        .select("champ, label_custom, compte_id")
        .or(`metier_id.eq.${demoSector},metier_id.eq.default`)
        .order("compte_id", { ascending: false, nullsFirst: false }); // Account-specific first

      if (error) return [];
      return data || [];
    },
    enabled: !isDemo && !!demoSector,
    staleTime: 5 * 60_000,
  });

  // Static fallback mapping (used in demo mode or when DB has no entries)
  const STATIC_MAP: Record<string, Record<string, string>> = {
    garages: { dossier: "Véhicule", dossiers: "Véhicules" },
    immobilier: { dossier: "Mandat", dossiers: "Mandats" },
    cabinets: { dossier: "Affaire", dossiers: "Affaires" },
    "cabinet-avocats": { dossier: "Affaire", dossiers: "Affaires" },
    btp: { dossier: "Chantier", dossiers: "Chantiers" },
    coiffure: { dossier: "Prestation", dossiers: "Prestations" },
    "coach-sportif": { dossier: "Séance", dossiers: "Séances" },
    photographe: { dossier: "Shooting", dossiers: "Shootings" },
    mariage: { dossier: "Mariage", dossiers: "Mariages" },
    evenementiel: { dossier: "Événement", dossiers: "Événements" },
    nettoyage: { dossier: "Intervention", dossiers: "Interventions" },
    traiteur: { dossier: "Commande", dossiers: "Commandes" },
    reparateur: { dossier: "Réparation", dossiers: "Réparations" },
    "auto-ecole": { dossier: "Élève", dossiers: "Élèves" },
    formateur: { dossier: "Formation", dossiers: "Formations" },
    consultant: { dossier: "Mission", dossiers: "Missions" },
    developpeur: { dossier: "Projet", dossiers: "Projets" },
    designer: { dossier: "Projet", dossiers: "Projets" },
    "community-manager": { dossier: "Mandat", dossiers: "Mandats" },
    "dj-animateur": { dossier: "Prestation", dossiers: "Prestations" },
    boutique: { dossier: "Commande", dossiers: "Commandes" },
    conciergerie: { dossier: "Service", dossiers: "Services" },
    "cabinet-recrutement": { dossier: "Recrutement", dossiers: "Recrutements" },
    "expert-comptable": { dossier: "Dossier comptable", dossiers: "Dossiers comptables" },
  };

  const getLabel = (champ: string, fallback?: string): string => {
    // Check DB vocab (account-specific first)
    const dbEntry = vocab.find((v: any) => v.champ === champ);
    if (dbEntry) return dbEntry.label_custom;

    // Static fallback
    const sector = demoSector || "";
    const sectorMap = STATIC_MAP[sector];
    if (sectorMap?.[champ]) return sectorMap[champ];

    return fallback || champ.charAt(0).toUpperCase() + champ.slice(1);
  };

  const dossierLabel = getLabel("dossier", "Dossier");
  const dossiersLabel = getLabel("dossiers", "Dossiers");

  return { getLabel, dossierLabel, dossiersLabel };
}
