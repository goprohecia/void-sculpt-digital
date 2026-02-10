import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { relances as mockRelances, type Relance } from "@/data/mockData";

function mapRow(row: any): Relance {
  return {
    id: row.id,
    factureId: row.facture_id,
    factureRef: row.facture_ref,
    clientId: row.client_id,
    clientNom: row.client_nom,
    montant: row.montant,
    statut: row.statut as Relance["statut"],
    dateRelance: row.date_relance ?? "",
    dateProchaine: row.date_prochaine ?? "",
    type: row.type,
  };
}

export function useRelances() {
  const { isDemo, isLoading: authLoading } = useIsDemo();

  const query = useQuery({
    queryKey: ["relances"],
    queryFn: async () => {
      const { data, error } = await supabase.from("relances").select("*").order("date_relance", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Relance[] = isDemo ? mockRelances : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  return { relances: data, loading, error: query.error };
}
