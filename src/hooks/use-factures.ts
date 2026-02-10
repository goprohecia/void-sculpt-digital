import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { Facture, FactureStatus } from "@/data/mockData";

function mapRow(row: any): Facture {
  return {
    id: row.id,
    reference: row.reference,
    clientId: row.client_id,
    clientNom: row.client_nom,
    dossierId: row.dossier_id ?? "",
    montant: Number(row.montant),
    statut: row.statut as FactureStatus,
    dateEmission: row.date_emission?.split("T")[0] ?? "",
    dateEcheance: row.date_echeance?.split("T")[0] ?? "",
  };
}

export function useFactures() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["factures"],
    queryFn: async () => {
      const { data, error } = await supabase.from("factures").select("*").order("date_emission", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Facture[] = isDemo ? demoData.factures : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const updateStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: FactureStatus }) => {
      if (isDemo) { demoData.updateFactureStatut(id, statut); return; }
      const { error } = await supabase.from("factures").update({ statut }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["factures"] }),
  });

  const addFacture = useMutation({
    mutationFn: async (f: Facture) => {
      if (isDemo) { demoData.addFacture(f); return; }
      const { error } = await supabase.from("factures").insert({
        id: f.id, reference: f.reference, client_id: f.clientId, client_nom: f.clientNom,
        dossier_id: f.dossierId || null, montant: f.montant, statut: f.statut,
        date_emission: f.dateEmission, date_echeance: f.dateEcheance,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["factures"] }),
  });

  const getFacturesByClient = (clientId: string) => data.filter((f) => f.clientId === clientId);
  const getFacturesByDossier = (dossierId: string) => data.filter((f) => f.dossierId === dossierId);
  const getFactureById = (id: string) => data.find((f) => f.id === id);

  return {
    factures: data, loading, error: query.error,
    updateFactureStatut: updateStatut.mutate,
    addFacture: addFacture.mutate,
    getFacturesByClient, getFacturesByDossier, getFactureById,
  };
}
