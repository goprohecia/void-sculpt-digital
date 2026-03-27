// [MBA] Hook MVP Supabase — Missions ménage (Conciergerie spécifique)
// EN ATTENTE: confirmation table "missions" par Hamza
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { mapMissionRow, type Mission, type MissionStatus } from "@/types/mba-conciergerie";

// [MBA] Flag — passer à true quand Hamza confirme la table missions
const MISSIONS_TABLE_READY = false;

export function useMbaMissions() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["mba-missions"],
    queryFn: async (): Promise<Mission[]> => {
      const { data, error } = await supabase
        .from("missions" as any)
        .select("*")
        .order("date_prevue", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row: any) => mapMissionRow(row));
    },
    enabled: MISSIONS_TABLE_READY && !isDemo && !authLoading,
  });

  const missions: Mission[] = query.data ?? [];
  const isLoading = authLoading || (!isDemo && MISSIONS_TABLE_READY && query.isLoading);

  const createMission = useMutation({
    mutationFn: async (mission: Pick<Mission, "logementId" | "reservationId" | "type" | "datePrevue" | "heurePrevue" | "prestataireId" | "montant">) => {
      if (!MISSIONS_TABLE_READY || isDemo) return;
      const { error } = await supabase.from("missions" as any).insert({
        logement_id: mission.logementId,
        reservation_id: mission.reservationId,
        type: mission.type,
        statut: "en_attente",
        date_prevue: mission.datePrevue,
        heure_prevue: mission.heurePrevue,
        prestataire_id: mission.prestataireId,
        montant: mission.montant,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-missions"] }),
  });

  // [MBA] CDC Conciergerie — démarrer mission (horodatage automatique)
  const startMission = useMutation({
    mutationFn: async (id: string) => {
      if (!MISSIONS_TABLE_READY || isDemo) return;
      const { error } = await supabase.from("missions" as any).update({
        statut: "en_cours",
        heure_debut: new Date().toISOString(),
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-missions"] }),
  });

  // [MBA] CDC Conciergerie — terminer mission (horodatage automatique)
  const endMission = useMutation({
    mutationFn: async (id: string) => {
      if (!MISSIONS_TABLE_READY || isDemo) return;
      const { error } = await supabase.from("missions" as any).update({
        statut: "terminee",
        heure_fin: new Date().toISOString(),
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-missions"] }),
  });

  // [MBA] CDC Conciergerie — valider mission (admin/manager)
  const validateMission = useMutation({
    mutationFn: async ({ id, noteQualite, commentaire, validePar }: { id: string; noteQualite: number; commentaire?: string; validePar: string }) => {
      if (!MISSIONS_TABLE_READY || isDemo) return;
      const { error } = await supabase.from("missions" as any).update({
        statut: "validee",
        note_qualite: noteQualite,
        commentaire_validation: commentaire ?? null,
        valide_par: validePar,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-missions"] }),
  });

  const updateStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: MissionStatus }) => {
      if (!MISSIONS_TABLE_READY || isDemo) return;
      const { error } = await supabase.from("missions" as any).update({ statut }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-missions"] }),
  });

  return {
    missions,
    isLoading,
    isTableReady: MISSIONS_TABLE_READY,
    createMission: createMission.mutate,
    startMission: startMission.mutate,
    endMission: endMission.mutate,
    validateMission: validateMission.mutate,
    updateStatut: updateStatut.mutate,
    getMissionsByLogement: (logementId: string) => missions.filter((m) => m.logementId === logementId),
    getMissionsByPrestataire: (prestataireId: string) => missions.filter((m) => m.prestataireId === prestataireId),
    getMissionsToday: () => {
      const today = new Date().toISOString().split("T")[0];
      return missions.filter((m) => m.datePrevue.startsWith(today));
    },
  };
}
