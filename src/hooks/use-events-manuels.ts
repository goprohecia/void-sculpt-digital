import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";

export interface EventManuel {
  id: string;
  titre: string;
  description: string;
  date: string;
  heure: string;
  duree: number;
  employee_id?: string;
  client_id?: string;
  type: string;
  created_at: string;
}

const DEMO_EVENTS: EventManuel[] = [
  { id: "evt-1", titre: "Réunion interne", description: "Point d'équipe hebdomadaire", date: new Date().toISOString(), heure: "10:00", duree: 60, type: "interne", created_at: new Date().toISOString() },
];

export function useEventsManuels() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const qc = useQueryClient();

  const query = useQuery<EventManuel[]>({
    queryKey: ["events_manuels"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("events_manuels").select("*").order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !isDemo && !authLoading,
  });

  const events = isDemo ? DEMO_EVENTS : (query.data ?? []);

  const addEvent = useMutation({
    mutationFn: async (evt: Omit<EventManuel, "id" | "created_at">) => {
      if (isDemo) return;
      const { error } = await (supabase as any).from("events_manuels").insert(evt);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events_manuels"] }),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return;
      const { error } = await (supabase as any).from("events_manuels").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events_manuels"] }),
  });

  return { events, addEvent: addEvent.mutate, deleteEvent: deleteEvent.mutate, isLoading: query.isLoading };
}
