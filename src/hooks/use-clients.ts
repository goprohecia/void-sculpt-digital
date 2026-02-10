import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { Client } from "@/data/mockData";

function mapRowToClient(row: any): Client {
  return {
    id: row.id,
    nom: row.nom,
    prenom: row.prenom,
    email: row.email,
    telephone: row.telephone,
    entreprise: row.entreprise,
    siret: row.siret ?? undefined,
    adresse: row.adresse ?? undefined,
    codePostal: row.code_postal ?? undefined,
    ville: row.ville ?? undefined,
    pays: row.pays ?? undefined,
    statut: row.statut as Client["statut"],
    dateCreation: row.date_creation?.split("T")[0] ?? "",
    nombreDossiers: row.nombre_dossiers,
  };
}

export function useClients() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("date_creation", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRowToClient);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Client[] = isDemo ? demoData.clients : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const updateClient = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      if (isDemo) {
        demoData.updateClient(id, updates);
        return;
      }
      const dbUpdates: Record<string, any> = {};
      if (updates.nom !== undefined) dbUpdates.nom = updates.nom;
      if (updates.prenom !== undefined) dbUpdates.prenom = updates.prenom;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.telephone !== undefined) dbUpdates.telephone = updates.telephone;
      if (updates.entreprise !== undefined) dbUpdates.entreprise = updates.entreprise;
      if (updates.siret !== undefined) dbUpdates.siret = updates.siret;
      if (updates.adresse !== undefined) dbUpdates.adresse = updates.adresse;
      if (updates.codePostal !== undefined) dbUpdates.code_postal = updates.codePostal;
      if (updates.ville !== undefined) dbUpdates.ville = updates.ville;
      if (updates.pays !== undefined) dbUpdates.pays = updates.pays;
      if (updates.statut !== undefined) dbUpdates.statut = updates.statut;
      const { error } = await supabase.from("clients").update(dbUpdates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return;
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const getClientById = (id: string) => data.find((c) => c.id === id);

  return {
    clients: data,
    loading,
    error: query.error,
    updateClient: updateClient.mutate,
    updateClientAsync: updateClient.mutateAsync,
    deleteClient: deleteClient.mutate,
    getClientById,
  };
}
