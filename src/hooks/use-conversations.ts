import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { conversations as mockConversations, getConversationsByClient as mockGetByClient, type Conversation, type Message } from "@/data/mockData";

function mapRow(row: any, messages: Message[]): Conversation {
  return {
    id: row.id,
    clientId: row.client_id,
    clientNom: row.client_nom,
    sujet: row.sujet,
    nonLus: row.non_lus,
    dernierMessage: row.dernier_message?.split("T")[0] ?? "",
    messages,
  };
}

function mapMessage(row: any): Message {
  return {
    id: row.id,
    contenu: row.contenu,
    role: row.role as Message["role"],
    date: row.date,
  };
}

export function useConversations() {
  const { isDemo, isLoading: authLoading } = useIsDemo();

  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data: convs, error } = await supabase.from("conversations").select("*").order("dernier_message", { ascending: false });
      if (error) throw error;
      const ids = (convs ?? []).map((c) => c.id);
      let msgs: any[] = [];
      if (ids.length > 0) {
        const { data } = await supabase.from("messages").select("*").in("conversation_id", ids).order("date", { ascending: true });
        msgs = data ?? [];
      }
      return (convs ?? []).map((c) => {
        const convMsgs = msgs.filter((m) => m.conversation_id === c.id).map(mapMessage);
        return mapRow(c, convMsgs);
      });
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Conversation[] = isDemo ? mockConversations : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const getConversationsByClient = (clientId: string) => {
    if (isDemo) return mockGetByClient(clientId);
    return data.filter((c) => c.clientId === clientId);
  };

  return { conversations: data, loading, error: query.error, getConversationsByClient };
}
