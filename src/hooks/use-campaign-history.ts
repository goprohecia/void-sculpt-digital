import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";

export interface Campaign {
  id: string;
  objet: string;
  date_envoi: string;
  nb_destinataires: number;
  statut: string;
  source: string;
  // Aggregated from email_events
  ouvertures?: number;
  clics?: number;
  bounces?: number;
}

export function useCampaignHistory() {
  const { isDemo, isLoading: authLoading } = useIsDemo();

  const query = useQuery({
    queryKey: ["campagnes_email"],
    queryFn: async () => {
      const { data: campaigns, error } = await (supabase as any)
        .from("campagnes_email")
        .select("*")
        .order("date_envoi", { ascending: false });
      if (error) throw error;

      // Fetch email_events aggregated per campaign
      const campaignIds = (campaigns ?? []).map((c: any) => c.id);
      let eventsMap: Record<string, { ouvertures: number; clics: number; bounces: number }> = {};

      if (campaignIds.length > 0) {
        const { data: events } = await supabase
          .from("email_events")
          .select("campagne_id, type_event")
          .in("campagne_id", campaignIds);

        if (events) {
          for (const ev of events) {
            if (!ev.campagne_id) continue;
            if (!eventsMap[ev.campagne_id]) {
              eventsMap[ev.campagne_id] = { ouvertures: 0, clics: 0, bounces: 0 };
            }
            if (ev.type_event === "opened") eventsMap[ev.campagne_id].ouvertures++;
            else if (ev.type_event === "clicked") eventsMap[ev.campagne_id].clics++;
            else if (ev.type_event === "bounced") eventsMap[ev.campagne_id].bounces++;
          }
        }
      }

      return (campaigns ?? []).map((c: any) => ({
        id: c.id,
        objet: c.objet,
        date_envoi: c.date_envoi,
        nb_destinataires: c.nb_destinataires,
        statut: c.statut,
        source: c.source || "masse",
        ...(eventsMap[c.id] || { ouvertures: 0, clics: 0, bounces: 0 }),
      })) as Campaign[];
    },
    enabled: !isDemo && !authLoading,
  });

  return {
    campaigns: isDemo ? [] : (query.data ?? []),
    isLoading: authLoading || query.isLoading,
  };
}
