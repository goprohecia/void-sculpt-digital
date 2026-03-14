import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useEffect } from "react";

export interface CalendarEvent {
  id: string;
  type: string;
  titre: string;
  description: string | null;
  date_debut: string;
  date_fin: string;
  employe_id: string | null;
  client_id: string | null;
  statut: string;
  compte_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface IndisponibiliteRequest {
  id: string;
  employe_id: string;
  date_debut: string;
  date_fin: string;
  motif: string;
  statut: string;
  commentaire_admin: string | null;
  date_traitement: string | null;
  compte_id: string | null;
  created_at: string;
}

const DEMO_EVENTS: CalendarEvent[] = [
  { id: "evt-1", type: "rdv", titre: "RDV client Dupont", description: "Réunion de suivi", date_debut: new Date().toISOString(), date_fin: new Date(Date.now() + 3600000).toISOString(), employe_id: null, client_id: null, statut: "confirme", compte_id: "demo-compte", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "evt-2", type: "reunion", titre: "Réunion d'équipe", description: "", date_debut: new Date(Date.now() + 86400000).toISOString(), date_fin: new Date(Date.now() + 86400000 + 5400000).toISOString(), employe_id: null, client_id: null, statut: "confirme", compte_id: "demo-compte", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export function useCalendarEvents() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const qc = useQueryClient();

  const query = useQuery<CalendarEvent[]>({
    queryKey: ["evenements_calendrier"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("evenements_calendrier")
        .select("*")
        .order("date_debut", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !isDemo && !authLoading,
  });

  // Realtime subscription
  useEffect(() => {
    if (isDemo) return;
    const channel = supabase
      .channel("calendrier-realtime")
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "evenements_calendrier" },
        () => {
          qc.invalidateQueries({ queryKey: ["evenements_calendrier"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isDemo, qc]);

  const events = isDemo ? DEMO_EVENTS : (query.data ?? []);

  const addEvent = useMutation({
    mutationFn: async (evt: Omit<CalendarEvent, "id" | "created_at" | "updated_at" | "compte_id">) => {
      if (isDemo) return;
      const { error } = await (supabase as any).from("evenements_calendrier").insert(evt);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["evenements_calendrier"] }),
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<CalendarEvent>) => {
      if (isDemo) return;
      const { error } = await (supabase as any).from("evenements_calendrier").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["evenements_calendrier"] }),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return;
      const { error } = await (supabase as any).from("evenements_calendrier").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["evenements_calendrier"] }),
  });

  return {
    events,
    isLoading: query.isLoading,
    addEvent: addEvent.mutateAsync,
    updateEvent: updateEvent.mutateAsync,
    deleteEvent: deleteEvent.mutateAsync,
  };
}

export function useIndisponibilites() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const qc = useQueryClient();

  const query = useQuery<IndisponibiliteRequest[]>({
    queryKey: ["demandes_indisponibilite"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("demandes_indisponibilite")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !isDemo && !authLoading,
  });

  const demandes = isDemo ? [] : (query.data ?? []);

  const createDemande = useMutation({
    mutationFn: async (d: { employe_id: string; date_debut: string; date_fin: string; motif: string }) => {
      if (isDemo) return;
      const { error } = await (supabase as any).from("demandes_indisponibilite").insert(d);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["demandes_indisponibilite"] }),
  });

  const handleDemande = useMutation({
    mutationFn: async ({ id, statut, commentaire_admin }: { id: string; statut: string; commentaire_admin?: string }) => {
      if (isDemo) return;
      const { error } = await (supabase as any)
        .from("demandes_indisponibilite")
        .update({ statut, commentaire_admin, date_traitement: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;

      // If approved, create a conge event
      if (statut === "validee") {
        const { data: demande } = await (supabase as any)
          .from("demandes_indisponibilite")
          .select("*")
          .eq("id", id)
          .single();
        if (demande) {
          await (supabase as any).from("evenements_calendrier").insert({
            type: "conge",
            titre: `Congé — ${demande.motif}`,
            description: demande.motif,
            date_debut: demande.date_debut,
            date_fin: demande.date_fin,
            employe_id: demande.employe_id,
            statut: "confirme",
          });
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["demandes_indisponibilite"] });
      qc.invalidateQueries({ queryKey: ["evenements_calendrier"] });
    },
  });

  return {
    demandes,
    isLoading: query.isLoading,
    createDemande: createDemande.mutateAsync,
    handleDemande: handleDemande.mutateAsync,
  };
}
