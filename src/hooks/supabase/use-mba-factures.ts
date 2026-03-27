// [MBA] Hook MVP Supabase — Factures (Payments)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import { mapFactureRow, type MbaFacture, type FactureStatus } from "@/types/mba-core";

export function useMbaFactures() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["mba-factures"],
    queryFn: async (): Promise<MbaFacture[]> => {
      const { data, error } = await supabase
        .from("factures")
        .select("*")
        .order("date_emission", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => mapFactureRow(row as Record<string, unknown>));
    },
    enabled: !isDemo && !authLoading,
  });

  const factures: MbaFacture[] = isDemo
    ? demoData.factures.map((f) => ({
        id: f.id,
        compteId: null,
        reference: f.reference,
        clientId: f.clientId,
        clientNom: f.clientNom,
        dossierId: f.dossierId ?? null,
        montant: f.montant,
        statut: f.statut as FactureStatus,
        description: (f as any).description ?? null,
        serviceCategoryId: null,
        dateEmission: f.dateEmission,
        dateEcheance: f.dateEcheance,
        createdAt: f.dateEmission,
        updatedAt: f.dateEmission,
      }))
    : (query.data ?? []);

  const isLoading = authLoading || (!isDemo && query.isLoading);

  const updateStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: FactureStatus }) => {
      if (isDemo) {
        demoData.updateFactureStatut({ id, statut });
        return;
      }
      const { error } = await supabase.from("factures").update({ statut }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-factures"] }),
  });

  return {
    factures,
    isLoading,
    updateStatut: updateStatut.mutate,
    getFacturesByDossier: (dossierId: string) => factures.filter((f) => f.dossierId === dossierId),
    getFacturesByClient: (clientId: string) => factures.filter((f) => f.clientId === clientId),
  };
}
