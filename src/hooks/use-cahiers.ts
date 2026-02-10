import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { CahierDesCharges, CdcHistoriqueEntry } from "@/contexts/DemoDataContext";

function mapRow(row: any, historique: CdcHistoriqueEntry[] = []): CahierDesCharges {
  return {
    id: row.id,
    demandeId: row.demande_id,
    contexte: row.contexte,
    publicCible: row.public_cible,
    fonctionnalites: row.fonctionnalites ?? [],
    designNotes: row.design_notes,
    contraintesTechniques: row.contraintes_techniques,
    planningSouhaite: row.planning_souhaite,
    budgetComplementaire: row.budget_complementaire,
    remarques: row.remarques,
    commentairesAdmin: row.commentaires_admin ?? undefined,
    motifRejet: row.motif_rejet ?? undefined,
    nbRejets: row.nb_rejets ?? 0,
    statut: row.statut as CahierDesCharges["statut"],
    dateMiseAJour: row.date_mise_a_jour?.split("T")[0] ?? "",
    historique,
  };
}

function mapHistoriqueRow(row: any): CdcHistoriqueEntry {
  return {
    id: row.id,
    action: row.action,
    auteur: row.auteur,
    description: row.description,
    date: row.date,
  };
}

export function useCahiers() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["cahiers_des_charges"],
    queryFn: async () => {
      const { data: cahiers, error } = await supabase.from("cahiers_des_charges").select("*");
      if (error) throw error;
      const ids = (cahiers ?? []).map((c) => c.id);
      let historiques: any[] = [];
      if (ids.length > 0) {
        const { data: hist } = await supabase.from("cdc_historique").select("*").in("cahier_id", ids).order("date", { ascending: true });
        historiques = hist ?? [];
      }
      return (cahiers ?? []).map((c) => {
        const hist = historiques.filter((h) => h.cahier_id === c.id).map(mapHistoriqueRow);
        return mapRow(c, hist);
      });
    },
    enabled: !isDemo && !authLoading,
  });

  const data: CahierDesCharges[] = isDemo ? demoData.cahiersDesCharges : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const getCahierByDemande = (demandeId: string) => data.find((c) => c.demandeId === demandeId);

  const saveCahier = useMutation({
    mutationFn: async (cahier: CahierDesCharges) => {
      if (isDemo) { demoData.saveCahierDesCharges(cahier); return; }
      const dbData = {
        demande_id: cahier.demandeId, contexte: cahier.contexte, public_cible: cahier.publicCible,
        fonctionnalites: cahier.fonctionnalites, design_notes: cahier.designNotes,
        contraintes_techniques: cahier.contraintesTechniques, planning_souhaite: cahier.planningSouhaite,
        budget_complementaire: cahier.budgetComplementaire, remarques: cahier.remarques,
        commentaires_admin: cahier.commentairesAdmin || null, motif_rejet: cahier.motifRejet || null,
        nb_rejets: cahier.nbRejets || 0, statut: cahier.statut,
      };
      const existing = data.find((c) => c.demandeId === cahier.demandeId);
      if (existing) {
        const { error } = await supabase.from("cahiers_des_charges").update(dbData).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cahiers_des_charges").insert({ id: cahier.id, ...dbData });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cahiers_des_charges"] }),
  });

  const updateComment = useMutation({
    mutationFn: async ({ demandeId, comment }: { demandeId: string; comment: string }) => {
      if (isDemo) { demoData.updateCahierComment(demandeId, comment); return; }
      const cahier = data.find((c) => c.demandeId === demandeId);
      if (!cahier) return;
      await supabase.from("cahiers_des_charges").update({ commentaires_admin: comment }).eq("id", cahier.id);
      await supabase.from("cdc_historique").insert({ cahier_id: cahier.id, action: "commentaire_admin", auteur: "admin", description: "Commentaire ajouté par l'équipe" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cahiers_des_charges"] }),
  });

  const validateCahier = useMutation({
    mutationFn: async (demandeId: string) => {
      if (isDemo) { demoData.validateCahier(demandeId); return; }
      const cahier = data.find((c) => c.demandeId === demandeId);
      if (!cahier) return;
      await supabase.from("cahiers_des_charges").update({ statut: "validé" }).eq("id", cahier.id);
      await supabase.from("cdc_historique").insert({ cahier_id: cahier.id, action: "validation", auteur: "admin", description: "Cahier des charges validé" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cahiers_des_charges"] }),
  });

  const rejectCahier = useMutation({
    mutationFn: async ({ demandeId, motif }: { demandeId: string; motif: string }) => {
      if (isDemo) { demoData.rejectCahier(demandeId, motif); return; }
      const cahier = data.find((c) => c.demandeId === demandeId);
      if (!cahier) return;
      await supabase.from("cahiers_des_charges").update({ statut: "rejeté", motif_rejet: motif, nb_rejets: (cahier.nbRejets || 0) + 1 }).eq("id", cahier.id);
      await supabase.from("cdc_historique").insert({ cahier_id: cahier.id, action: "rejet", auteur: "admin", description: `Cahier des charges rejeté : ${motif}` });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cahiers_des_charges"] }),
  });

  return {
    cahiersDesCharges: data, loading, error: query.error,
    getCahierByDemande,
    saveCahierDesCharges: saveCahier.mutate,
    updateCahierComment: (demandeId: string, comment: string) => updateComment.mutate({ demandeId, comment }),
    validateCahier: validateCahier.mutate,
    rejectCahier: (demandeId: string, motif: string) => rejectCahier.mutate({ demandeId, motif }),
  };
}
