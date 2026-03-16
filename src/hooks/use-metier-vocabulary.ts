import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";

const VOCABULARY_MAP: Record<string, Record<string, string>> = {
  garage: { dossier: "Véhicule traité", dossiers: "Véhicules traités" },
  agence_immo: { dossier: "Bien géré", dossiers: "Biens gérés" },
  avocat: { dossier: "Affaire", dossiers: "Affaires" },
  btp: { dossier: "Chantier", dossiers: "Chantiers" },
  coiffure: { dossier: "Prestation", dossiers: "Prestations" },
  conciergerie: { dossier: "Séjour", dossiers: "Séjours" },
  formateur: { dossier: "Formation", dossiers: "Formations" },
  cm: { dossier: "Campagne", dossiers: "Campagnes" },
  "centre-islamique": { dossier: "Inscription", dossiers: "Inscriptions" },
  "association-sportive": { dossier: "Adhésion", dossiers: "Adhésions" },
  default: { dossier: "Dossier", dossiers: "Dossiers" },
};

export function useMetierVocabulary() {
  const { isDemo, isLoading: authLoading, supabaseUserId } = useIsDemo();

  const { data: sector } = useQuery({
    queryKey: ["user-sector", supabaseUserId],
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("sector")
        .eq("user_id", supabaseUserId!)
        .maybeSingle();
      return (data as any)?.sector as string | null;
    },
    enabled: !isDemo && !authLoading && !!supabaseUserId,
  });

  const effectiveSector = sector || "default";
  const vocab = VOCABULARY_MAP[effectiveSector] || VOCABULARY_MAP.default;

  return {
    sector: effectiveSector,
    label: (key: string) => vocab[key] || VOCABULARY_MAP.default[key] || key,
    dossierLabel: vocab.dossier || "Dossier",
    dossiersLabel: vocab.dossiers || "Dossiers",
  };
}
