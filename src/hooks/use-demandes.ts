import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { Demande, DemandeStatus } from "@/contexts/DemoDataContext";

function mapRow(row: any): Demande {
  return {
    id: row.id,
    reference: row.reference,
    clientId: row.client_id,
    clientNom: row.client_nom,
    titre: row.titre,
    typePrestation: row.type_prestation,
    description: row.description,
    budget: row.budget ?? undefined,
    statut: row.statut as DemandeStatus,
    dateCreation: row.date_creation?.split("T")[0] ?? "",
    dateMiseAJour: row.date_mise_a_jour?.split("T")[0] ?? "",
  };
}

export function useDemandes() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["demandes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("demandes").select("*").order("date_creation", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Demande[] = isDemo ? demoData.demandes : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const addDemande = useMutation({
    mutationFn: async (d: Demande) => {
      if (isDemo) { demoData.addDemande(d); return; }
      const { error } = await supabase.from("demandes").insert({
        id: d.id, reference: d.reference, client_id: d.clientId, client_nom: d.clientNom,
        titre: d.titre, type_prestation: d.typePrestation, description: d.description,
        budget: d.budget || null, statut: d.statut,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["demandes"] }),
  });

  const updateStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: DemandeStatus }) => {
      if (isDemo) { demoData.updateDemandeStatut(id, statut); return; }
      const { error } = await supabase.from("demandes").update({ statut, date_mise_a_jour: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["demandes"] }),
  });

  const getDemandesByClient = (clientId: string) => data.filter((d) => d.clientId === clientId);

  return {
    demandes: data, loading, error: query.error,
    addDemande: addDemande.mutate,
    updateDemandeStatut: updateStatut.mutate,
    getDemandesByClient,
  };
}
