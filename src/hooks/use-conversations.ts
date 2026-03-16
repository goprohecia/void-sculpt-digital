import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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
    destinataireType: row.destinataire_type ?? "admin",
  };
}

function mapMessage(row: any): Message & { media_url?: string; media_type?: string; media_name?: string; media_size?: number } {
  return {
    id: row.id,
    contenu: row.contenu,
    role: row.role as Message["role"],
    date: row.date,
    is_group_message: row.is_group_message ?? false,
    media_url: row.media_url ?? undefined,
    media_type: row.media_type ?? undefined,
    media_name: row.media_name ?? undefined,
    media_size: row.media_size ?? undefined,
  };
}

export function useConversations() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const queryClient = useQueryClient();

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

  // Realtime subscriptions
  useEffect(() => {
    if (isDemo) return;

    const channel = supabase
      .channel("conversations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isDemo, queryClient]);

  const data: Conversation[] = isDemo ? mockConversations : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const getConversationsByClient = (clientId: string) => {
    if (isDemo) return mockGetByClient(clientId);
    return data.filter((c) => c.clientId === clientId);
  };

  return { conversations: data, loading, error: query.error, getConversationsByClient };
}
