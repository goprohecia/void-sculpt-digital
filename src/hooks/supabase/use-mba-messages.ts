// [MBA] Hook MVP Supabase — Messages & Conversations
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { mapMessageRow, type MbaMessage, type MbaConversation, type MessageRole } from "@/types/mba-core";

export function useMbaMessages(conversationId?: string) {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["mba-messages", conversationId],
    queryFn: async (): Promise<MbaMessage[]> => {
      if (!conversationId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("date", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row) => mapMessageRow(row as Record<string, unknown>));
    },
    enabled: !isDemo && !authLoading && !!conversationId,
  });

  const messages: MbaMessage[] = isDemo ? [] : (query.data ?? []);
  const isLoading = authLoading || (!isDemo && query.isLoading);

  const sendMessage = useMutation({
    mutationFn: async (msg: { conversationId: string; contenu: string; role: MessageRole; isGroupMessage?: boolean; batchId?: string }) => {
      if (isDemo) return;
      const { error } = await supabase.from("messages").insert({
        conversation_id: msg.conversationId,
        contenu: msg.contenu,
        role: msg.role,
        date: new Date().toISOString(),
        is_group_message: msg.isGroupMessage ?? false,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mba-messages"] }),
  });

  // [MBA] Addendum messagerie groupée — envoi batch (1 row par destinataire)
  const sendGroupMessage = useMutation({
    mutationFn: async (msg: { conversationIds: string[]; contenu: string; role: MessageRole; batchId: string }) => {
      if (isDemo) return;
      const rows = msg.conversationIds.map((convId) => ({
        conversation_id: convId,
        contenu: msg.contenu,
        role: msg.role,
        date: new Date().toISOString(),
        is_group_message: true,
      }));
      const { error } = await supabase.from("messages").insert(rows as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mba-messages"] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  return {
    messages,
    isLoading,
    sendMessage: sendMessage.mutate,
    sendGroupMessage: sendGroupMessage.mutate,
  };
}
