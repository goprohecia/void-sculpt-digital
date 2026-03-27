// [MBA] Hook MVP Supabase — Logements (Conciergerie spécifique)
// EN ATTENTE: confirmation table "logements" par Hamza
// Les requêtes Supabase sont préparées mais disabled tant que la table n'existe pas
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { mapLogementRow, type Logement, type LogementStatus } from "@/types/mba-conciergerie";

// [MBA] Flag — passer à true quand Hamza confirme la table logements
const LOGEMENTS_TABLE_READY = false;

export function useMbaLogements() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["mba-logements"],
    queryFn: async (): Promise<Logement[]> => {
      const { data, error } = await supabase
        .from("logements" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row: any) => mapLogementRow(row));
    },
    // [MBA] Désactivé tant que la table n'existe pas
    enabled: LOGEMENTS_TABLE_READY && !isDemo && !authLoading,
  });

  const logements: Logement[] = query.data ?? [];
  const isLoading = authLoading || (!isDemo && LOGEMENTS_TABLE_READY && query.isLoading);

  const createLogement = useMutation({
    mutationFn: async (logement: Omit<Logement, "id" | "createdAt" | "updatedAt">) => {
      if (!LOGEMENTS_TABLE_READY || isDemo) return;
      const { error } = await supabase.from("logements" as any).insert({
        proprietaire_id: logement.proprietaireId,
        nom: logement.nom,
        type: logement.type,
        adresse: logement.adresse,
        code_postal: logement.codePostal,
        ville: logement.ville,
        pays: logement.pays,
        etage: logement.etage,
        capacite: logement.capacite,
        code_acces: logement.codeAcces,
        instructions_menage: logement.instructionsMenage,
        lien_airbnb: logement.lienAirbnb,
        lien_booking: logement.lienBooking,
        photos_reference: logement.photosReference,
        statut: logement.statut,
        region: logement.region,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-logements"] }),
  });

  const updateLogement = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Logement> }) => {
      if (!LOGEMENTS_TABLE_READY || isDemo) return;
      const dbUpdates: Record<string, unknown> = {};
      if (updates.nom !== undefined) dbUpdates.nom = updates.nom;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.adresse !== undefined) dbUpdates.adresse = updates.adresse;
      if (updates.ville !== undefined) dbUpdates.ville = updates.ville;
      if (updates.capacite !== undefined) dbUpdates.capacite = updates.capacite;
      if (updates.codeAcces !== undefined) dbUpdates.code_acces = updates.codeAcces;
      if (updates.instructionsMenage !== undefined) dbUpdates.instructions_menage = updates.instructionsMenage;
      if (updates.statut !== undefined) dbUpdates.statut = updates.statut;
      if (updates.lienAirbnb !== undefined) dbUpdates.lien_airbnb = updates.lienAirbnb;
      if (updates.lienBooking !== undefined) dbUpdates.lien_booking = updates.lienBooking;
      if (updates.lienVrbo !== undefined) dbUpdates.lien_vrbo = updates.lienVrbo;
      const { error } = await supabase.from("logements" as any).update(dbUpdates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-logements"] }),
  });

  return {
    logements,
    isLoading,
    isTableReady: LOGEMENTS_TABLE_READY,
    createLogement: createLogement.mutate,
    updateLogement: updateLogement.mutate,
    getLogementsByProprietaire: (propId: string) => logements.filter((l) => l.proprietaireId === propId),
    getLogementsByRegion: (region: string) => logements.filter((l) => l.region === region),
  };
}
