import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { SendLog, SendLogDocType } from "@/contexts/DemoDataContext";

function mapRow(row: any): SendLog {
  return {
    id: row.id,
    docType: row.doc_type as SendLogDocType,
    docReference: row.doc_reference,
    clientId: row.client_id,
    clientNom: row.client_nom,
    dateEnvoi: row.date_envoi,
  };
}

export function useSendLogs() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["send_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("send_logs").select("*").order("date_envoi", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: SendLog[] = isDemo ? demoData.sendLogs : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const addSendLog = useMutation({
    mutationFn: async ({ docType, docReference, clientId, clientNom }: { docType: SendLogDocType; docReference: string; clientId: string; clientNom: string }) => {
      if (isDemo) { demoData.addSendLog(docType, docReference, clientId, clientNom); return; }
      const { error } = await supabase.from("send_logs").insert({ doc_type: docType, doc_reference: docReference, client_id: clientId, client_nom: clientNom });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["send_logs"] }),
  });

  return {
    sendLogs: data, loading, error: query.error,
    addSendLog: (docType: SendLogDocType, docReference: string, clientId: string, clientNom: string) =>
      addSendLog.mutate({ docType, docReference, clientId, clientNom }),
  };
}
