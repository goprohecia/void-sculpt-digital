import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";

export interface ScheduledEmail {
  id: string;
  objet: string;
  contenu: string;
  destinataires_json: Array<{ email: string; prenom?: string; clientId?: string }>;
  date_envoi_planifie: string;
  statut: string;
  nb_destinataires: number;
  created_at: string;
}

export function useScheduledEmails() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["emails_planifies"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("emails_planifies")
        .select("*")
        .order("date_envoi_planifie", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ScheduledEmail[];
    },
    enabled: !isDemo && !authLoading,
  });

  const cancelEmail = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("emails_planifies")
        .update({ statut: "annule", updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("statut", "planifie");
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emails_planifies"] }),
  });

  const scheduleEmail = useMutation({
    mutationFn: async (payload: {
      objet: string;
      contenu: string;
      destinataires_json: Array<{ email: string; prenom?: string; clientId?: string }>;
      date_envoi_planifie: string;
      pieces_jointes?: Array<{ name: string; url: string }>;
    }) => {
      const { error } = await (supabase as any)
        .from("emails_planifies")
        .insert({
          objet: payload.objet,
          contenu: payload.contenu,
          destinataires_json: payload.destinataires_json,
          date_envoi_planifie: payload.date_envoi_planifie,
          nb_destinataires: payload.destinataires_json.length,
          pieces_jointes: payload.pieces_jointes || [],
          statut: "planifie",
        });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emails_planifies"] }),
  });

  return {
    scheduledEmails: isDemo ? [] : (query.data ?? []),
    isLoading: authLoading || query.isLoading,
    cancelEmail,
    scheduleEmail,
  };
}
