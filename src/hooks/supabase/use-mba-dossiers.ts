// [MBA] Hook MVP Supabase — Dossiers (Cases)
// Dual-mode: demo (useDemoData) + production (Supabase)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import { mapDossierRow, type MbaDossier, type DossierStatus } from "@/types/mba-core";

export function useMbaDossiers() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["mba-dossiers"],
    queryFn: async (): Promise<MbaDossier[]> => {
      const { data, error } = await supabase
        .from("dossiers")
        .select("*")
        .order("date_creation", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => mapDossierRow(row as Record<string, unknown>));
    },
    enabled: !isDemo && !authLoading,
  });

  const dossiers: MbaDossier[] = isDemo
    ? demoData.dossiers.map((d) => ({
        id: d.id,
        compteId: null,
        reference: d.reference,
        clientId: d.clientId,
        clientNom: d.clientNom,
        typePrestation: d.typePrestation,
        montant: d.montant,
        statut: d.statut as DossierStatus,
        employeeId: null,
        demandeId: (d as any).demandeId ?? null,
        previewUrl: (d as any).previewUrl ?? null,
        rdvEffectue: (d as any).rdvEffectue ?? false,
        dateCreation: d.dateCreation,
        dateEcheance: d.dateEcheance ?? null,
        createdAt: d.dateCreation,
        updatedAt: d.dateCreation,
      }))
    : (query.data ?? []);

  const isLoading = authLoading || (!isDemo && query.isLoading);

  const createDossier = useMutation({
    mutationFn: async (dossier: Pick<MbaDossier, "reference" | "clientId" | "clientNom" | "typePrestation" | "montant">) => {
      if (isDemo) {
        demoData.addDossier({
          id: `d${Date.now()}`,
          reference: dossier.reference,
          clientId: dossier.clientId,
          clientNom: dossier.clientNom,
          typePrestation: dossier.typePrestation,
          montant: dossier.montant,
          statut: "en_attente",
          dateCreation: new Date().toISOString().split("T")[0],
          dateEcheance: "",
        });
        return;
      }
      const { error } = await supabase.from("dossiers").insert({
        reference: dossier.reference,
        client_id: dossier.clientId,
        client_nom: dossier.clientNom,
        type_prestation: dossier.typePrestation,
        montant: dossier.montant,
        statut: "en_attente",
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-dossiers"] }),
  });

  const updateStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: DossierStatus }) => {
      if (isDemo) {
        demoData.updateDossierStatut({ id, statut });
        return;
      }
      const { error } = await supabase.from("dossiers").update({ statut }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-dossiers"] }),
  });

  return {
    dossiers,
    isLoading,
    createDossier: createDossier.mutate,
    updateStatut: updateStatut.mutate,
    getDossierById: (id: string) => dossiers.find((d) => d.id === id),
    getDossiersByClient: (clientId: string) => dossiers.filter((d) => d.clientId === clientId),
  };
}
