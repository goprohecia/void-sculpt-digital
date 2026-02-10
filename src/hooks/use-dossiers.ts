import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { Dossier, DossierStatus } from "@/data/mockData";

function mapRow(row: any): Dossier {
  return {
    id: row.id,
    reference: row.reference,
    clientId: row.client_id,
    clientNom: row.client_nom,
    typePrestation: row.type_prestation,
    montant: Number(row.montant),
    statut: row.statut as DossierStatus,
    dateCreation: row.date_creation?.split("T")[0] ?? "",
    dateEcheance: row.date_echeance?.split("T")[0] ?? "",
    previewUrl: row.preview_url ?? undefined,
    demandeId: row.demande_id ?? undefined,
    rdvEffectue: row.rdv_effectue ?? false,
  };
}

export function useDossiers() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["dossiers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("dossiers").select("*").order("date_creation", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Dossier[] = isDemo ? demoData.dossiers : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const updateStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: DossierStatus }) => {
      if (isDemo) { demoData.updateDossierStatut(id, statut); return; }
      const { error } = await supabase.from("dossiers").update({ statut }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dossiers"] }),
  });

  const updatePreviewUrl = useMutation({
    mutationFn: async ({ id, previewUrl }: { id: string; previewUrl: string }) => {
      if (isDemo) { demoData.updateDossierPreviewUrl(id, previewUrl); return; }
      const { error } = await supabase.from("dossiers").update({ preview_url: previewUrl }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dossiers"] }),
  });

  const addDossier = useMutation({
    mutationFn: async (d: Dossier) => {
      if (isDemo) { demoData.addDossier(d); return; }
      const { error } = await supabase.from("dossiers").insert({
        id: d.id, reference: d.reference, client_id: d.clientId, client_nom: d.clientNom,
        type_prestation: d.typePrestation, montant: d.montant, statut: d.statut,
        date_creation: d.dateCreation, date_echeance: d.dateEcheance || null,
        preview_url: d.previewUrl || null, demande_id: d.demandeId || null,
        rdv_effectue: d.rdvEffectue ?? false,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dossiers"] }),
  });

  const marquerRdvEffectue = useMutation({
    mutationFn: async (dossierId: string) => {
      if (isDemo) { demoData.marquerRdvEffectue(dossierId); return; }
      const { error } = await supabase.from("dossiers").update({ rdv_effectue: true }).eq("id", dossierId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dossiers"] }),
  });

  const getDossiersByClient = (clientId: string) => data.filter((d) => d.clientId === clientId);
  const getDossierById = (id: string) => data.find((d) => d.id === id);

  return {
    dossiers: data, loading, error: query.error,
    updateDossierStatut: updateStatut.mutate,
    updateDossierPreviewUrl: updatePreviewUrl.mutate,
    addDossier: addDossier.mutate,
    marquerRdvEffectue: marquerRdvEffectue.mutate,
    getDossiersByClient, getDossierById,
  };
}
