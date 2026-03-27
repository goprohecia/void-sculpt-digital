// [MBA] Hook MVP Supabase — Clients
// Dual-mode: demo (useDemoData) + production (Supabase)
// Prêt à brancher — ne pas activer le mode Supabase tant que Hamza n'a pas confirmé
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import { mapClientRow, type MbaClient } from "@/types/mba-core";

export function useMbaClients() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["mba-clients"],
    queryFn: async (): Promise<MbaClient[]> => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("date_creation", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => mapClientRow(row as Record<string, unknown>));
    },
    enabled: !isDemo && !authLoading,
  });

  // [MBA] En mode démo, mapper les mock data vers MbaClient
  const clients: MbaClient[] = isDemo
    ? demoData.clients.map((c) => ({
        id: c.id,
        compteId: null,
        nom: c.nom,
        prenom: c.prenom,
        email: c.email,
        telephone: c.telephone,
        entreprise: c.entreprise,
        siret: null,
        adresse: null,
        codePostal: null,
        ville: null,
        pays: null,
        statut: c.statut as MbaClient["statut"],
        segment: (c as any).segment ?? "client",
        emailOptOut: false,
        nombreDossiers: c.nombreDossiers,
        userId: null,
        dateCreation: c.dateCreation,
        createdAt: c.dateCreation,
        updatedAt: c.dateCreation,
      }))
    : (query.data ?? []);

  const isLoading = authLoading || (!isDemo && query.isLoading);

  const createClient = useMutation({
    mutationFn: async (client: Omit<MbaClient, "id" | "createdAt" | "updatedAt" | "compteId">) => {
      if (isDemo) return;
      const { error } = await supabase.from("clients").insert({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone,
        entreprise: client.entreprise,
        statut: client.statut,
        segment: client.segment,
        nombre_dossiers: client.nombreDossiers,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-clients"] }),
  });

  const updateClient = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MbaClient> }) => {
      if (isDemo) {
        demoData.updateClient(id, {
          nom: updates.nom,
          prenom: updates.prenom,
          email: updates.email,
          telephone: updates.telephone,
          entreprise: updates.entreprise,
        });
        return;
      }
      const dbUpdates: Record<string, unknown> = {};
      if (updates.nom !== undefined) dbUpdates.nom = updates.nom;
      if (updates.prenom !== undefined) dbUpdates.prenom = updates.prenom;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.telephone !== undefined) dbUpdates.telephone = updates.telephone;
      if (updates.entreprise !== undefined) dbUpdates.entreprise = updates.entreprise;
      if (updates.statut !== undefined) dbUpdates.statut = updates.statut;
      const { error } = await supabase.from("clients").update(dbUpdates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-clients"] }),
  });

  return {
    clients,
    isLoading,
    createClient: createClient.mutate,
    updateClient: updateClient.mutate,
    getClientById: (id: string) => clients.find((c) => c.id === id),
  };
}
