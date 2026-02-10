import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { Devis, DevisStatus } from "@/data/mockData";

function mapRow(row: any): Devis {
  return {
    id: row.id,
    reference: row.reference,
    clientId: row.client_id,
    clientNom: row.client_nom,
    dossierId: row.dossier_id ?? undefined,
    titre: row.titre,
    montant: Number(row.montant),
    statut: row.statut as DevisStatus,
    dateEmission: row.date_emission?.split("T")[0] ?? "",
    dateValidite: row.date_validite?.split("T")[0] ?? "",
    signatureDataUrl: row.signature_url ?? undefined,
    signataireNom: row.signataire_nom ?? undefined,
    dateSignature: row.date_signature?.split("T")[0] ?? undefined,
  };
}

export function useDevis() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["devis"],
    queryFn: async () => {
      const { data, error } = await supabase.from("devis").select("*").order("date_emission", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Devis[] = isDemo ? demoData.devis : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const updateStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: DevisStatus }) => {
      if (isDemo) { demoData.updateDevisStatut(id, statut); return; }
      const { error } = await supabase.from("devis").update({ statut }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devis"] }),
  });

  const updateSignature = useMutation({
    mutationFn: async ({ id, signatureDataUrl, signataireNom, dateSignature }: { id: string; signatureDataUrl: string; signataireNom: string; dateSignature: string }) => {
      if (isDemo) { demoData.updateDevisSignature(id, signatureDataUrl, signataireNom, dateSignature); return; }
      const { error } = await supabase.from("devis").update({
        signature_url: signatureDataUrl, signataire_nom: signataireNom, date_signature: dateSignature, statut: "accepte",
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devis"] }),
  });

  const addDevis = useMutation({
    mutationFn: async (d: Devis) => {
      if (isDemo) { demoData.addDevis(d); return; }
      const { error } = await supabase.from("devis").insert({
        id: d.id, reference: d.reference, client_id: d.clientId, client_nom: d.clientNom,
        dossier_id: d.dossierId || null, titre: d.titre, montant: d.montant, statut: d.statut,
        date_emission: d.dateEmission, date_validite: d.dateValidite,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devis"] }),
  });

  const getDevisByClient = (clientId: string) => data.filter((d) => d.clientId === clientId);
  const getDevisByDossier = (dossierId: string) => data.filter((d) => d.dossierId === dossierId);

  return {
    devis: data, loading, error: query.error,
    updateDevisStatut: updateStatut.mutate,
    updateDevisSignature: updateSignature.mutate,
    addDevis: addDevis.mutate,
    getDevisByClient, getDevisByDossier,
  };
}
