import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";

export interface DossierEmploye {
  id: string;
  dossier_id: string;
  employe_id: string;
  role_sur_dossier: string;
  date_assignation: string;
}

export function useDossierEmploye() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["dossier_employe"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dossier_employe")
        .select("*")
        .order("date_assignation", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DossierEmploye[];
    },
    enabled: !isDemo && !authLoading,
  });

  const allAssignments: DossierEmploye[] = isDemo ? [] : (query.data ?? []);

  const getEmployesByDossier = (dossierId: string) =>
    allAssignments.filter((a) => a.dossier_id === dossierId);

  const getDossiersByEmploye = (employeId: string) =>
    allAssignments.filter((a) => a.employe_id === employeId);

  const assignEmploye = useMutation({
    mutationFn: async ({
      dossierId,
      employeId,
      role = "intervenant",
    }: {
      dossierId: string;
      employeId: string;
      role?: string;
    }) => {
      if (isDemo) return;
      const { error } = await supabase.from("dossier_employe").upsert(
        { dossier_id: dossierId, employe_id: employeId, role_sur_dossier: role },
        { onConflict: "dossier_id,employe_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dossier_employe"] }),
  });

  const removeEmploye = useMutation({
    mutationFn: async ({ dossierId, employeId }: { dossierId: string; employeId: string }) => {
      if (isDemo) return;
      const { error } = await supabase
        .from("dossier_employe")
        .delete()
        .eq("dossier_id", dossierId)
        .eq("employe_id", employeId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dossier_employe"] }),
  });

  const bulkAssign = useMutation({
    mutationFn: async ({
      dossierId,
      assignments,
    }: {
      dossierId: string;
      assignments: { employeId: string; role: string }[];
    }) => {
      if (isDemo) return;
      // Remove existing
      await supabase.from("dossier_employe").delete().eq("dossier_id", dossierId);
      // Insert new
      if (assignments.length > 0) {
        const rows = assignments.map((a) => ({
          dossier_id: dossierId,
          employe_id: a.employeId,
          role_sur_dossier: a.role,
        }));
        const { error } = await supabase.from("dossier_employe").insert(rows);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dossier_employe"] }),
  });

  return {
    assignments: allAssignments,
    loading: authLoading || (!isDemo && query.isLoading),
    getEmployesByDossier,
    getDossiersByEmploye,
    assignEmploye: assignEmploye.mutate,
    removeEmploye: removeEmploye.mutate,
    bulkAssign: bulkAssign.mutate,
  };
}
