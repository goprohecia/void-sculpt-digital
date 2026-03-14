import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";

export interface ClientDossier {
  id: string;
  client_id: string;
  dossier_id: string;
  date_liaison: string;
}

export function useClientDossier() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["client_dossier"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_dossier")
        .select("*")
        .order("date_liaison", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ClientDossier[];
    },
    enabled: !isDemo && !authLoading,
  });

  const allLinks: ClientDossier[] = isDemo ? [] : (query.data ?? []);

  const getDossiersByClient = (clientId: string) =>
    allLinks.filter((l) => l.client_id === clientId);

  const getClientsByDossier = (dossierId: string) =>
    allLinks.filter((l) => l.dossier_id === dossierId);

  const linkClient = useMutation({
    mutationFn: async ({ clientId, dossierId }: { clientId: string; dossierId: string }) => {
      if (isDemo) return;
      const { error } = await supabase.from("client_dossier").upsert(
        { client_id: clientId, dossier_id: dossierId },
        { onConflict: "client_id,dossier_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client_dossier"] }),
  });

  const unlinkClient = useMutation({
    mutationFn: async ({ clientId, dossierId }: { clientId: string; dossierId: string }) => {
      if (isDemo) return;
      const { error } = await supabase
        .from("client_dossier")
        .delete()
        .eq("client_id", clientId)
        .eq("dossier_id", dossierId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client_dossier"] }),
  });

  return {
    links: allLinks,
    loading: authLoading || (!isDemo && query.isLoading),
    getDossiersByClient,
    getClientsByDossier,
    linkClient: linkClient.mutate,
    unlinkClient: unlinkClient.mutate,
  };
}
