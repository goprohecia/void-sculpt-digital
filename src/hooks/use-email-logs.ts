import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { EmailLog, EmailLogType } from "@/contexts/DemoDataContext";

function mapRow(row: any): EmailLog {
  return {
    id: row.id,
    type: row.type as EmailLogType,
    destinataire: row.destinataire,
    sujet: row.sujet,
    contenu: row.contenu,
    dateEnvoi: row.date_envoi,
    clientId: row.client_id ?? undefined,
    reference: row.reference ?? undefined,
  };
}

export function useEmailLogs() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["email_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("email_logs").select("*").order("date_envoi", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: EmailLog[] = isDemo ? demoData.emailLogs : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const pushEmail = useMutation({
    mutationFn: async ({ type, destinataire, sujet, contenu, clientId, reference }: {
      type: EmailLogType; destinataire: string; sujet: string; contenu: string; clientId?: string; reference?: string;
    }) => {
      if (isDemo) { demoData.pushEmail(type, destinataire, sujet, contenu, clientId, reference); return; }
      const { error } = await supabase.from("email_logs").insert({
        type, destinataire, sujet, contenu, client_id: clientId || null, reference: reference || null,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["email_logs"] }),
  });

  return {
    emailLogs: data, loading, error: query.error,
    pushEmail: (type: EmailLogType, destinataire: string, sujet: string, contenu: string, clientId?: string, reference?: string) =>
      pushEmail.mutate({ type, destinataire, sujet, contenu, clientId, reference }),
  };
}
