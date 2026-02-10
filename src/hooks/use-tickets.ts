import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { tickets as mockTickets, getTicketsByClient as mockGetByClient, type Ticket, type TicketMessage } from "@/data/mockData";

function mapMessage(row: any): TicketMessage {
  return {
    id: row.id,
    contenu: row.contenu,
    role: row.role as TicketMessage["role"],
    date: row.date,
  };
}

function mapRow(row: any, messages: TicketMessage[]): Ticket {
  return {
    id: row.id,
    reference: row.reference,
    clientId: row.client_id,
    clientNom: row.client_nom,
    sujet: row.sujet,
    description: row.description,
    priorite: row.priorite as Ticket["priorite"],
    statut: row.statut as Ticket["statut"],
    dateCreation: row.date_creation ?? "",
    dateMiseAJour: row.date_mise_a_jour ?? "",
    messages,
  };
}

export function useTickets() {
  const { isDemo, isLoading: authLoading } = useIsDemo();

  const query = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data: tix, error } = await supabase.from("tickets").select("*").order("date_creation", { ascending: false });
      if (error) throw error;
      const ids = (tix ?? []).map((t) => t.id);
      let msgs: any[] = [];
      if (ids.length > 0) {
        const { data } = await supabase.from("ticket_messages").select("*").in("ticket_id", ids).order("date", { ascending: true });
        msgs = data ?? [];
      }
      return (tix ?? []).map((t) => {
        const tMsgs = msgs.filter((m) => m.ticket_id === t.id).map(mapMessage);
        return mapRow(t, tMsgs);
      });
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Ticket[] = isDemo ? mockTickets : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const getTicketsByClient = (clientId: string) => {
    if (isDemo) return mockGetByClient(clientId);
    return data.filter((t) => t.clientId === clientId);
  };

  return { tickets: data, loading, error: query.error, getTicketsByClient };
}
