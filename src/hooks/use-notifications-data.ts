import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { Notification } from "@/data/mockData";

function mapRow(row: any): Notification {
  return {
    id: row.id,
    type: row.type,
    titre: row.titre,
    description: row.description,
    date: row.date,
    lu: row.lu,
    lien: row.lien,
    destinataire: row.destinataire,
    clientId: row.client_id ?? undefined,
    employeeId: row.employee_id ?? undefined,
    canal: row.canal ?? undefined,
  };
}

export function useNotificationsData() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("notifications").select("*").order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Notification[] = isDemo ? demoData.notifications : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) { demoData.markNotificationRead(id); return; }
      const { error } = await supabase.from("notifications").update({ lu: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllRead = useMutation({
    mutationFn: async ({ role, clientId }: { role: "admin" | "client"; clientId?: string }) => {
      if (isDemo) { demoData.markAllNotificationsRead(role, clientId); return; }
      let q = supabase.from("notifications").update({ lu: true });
      if (role === "admin") {
        q = q.or("destinataire.eq.admin,destinataire.eq.all");
      } else {
        q = q.or("destinataire.eq.client,destinataire.eq.all");
        if (clientId) q = q.eq("client_id", clientId);
      }
      const { error } = await q;
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const addNotification = useMutation({
    mutationFn: async (n: Notification) => {
      if (isDemo) { demoData.addNotification(n); return; }
      const { error } = await supabase.from("notifications").insert({
        id: n.id, type: n.type, titre: n.titre, description: n.description,
        date: n.date, lu: n.lu, lien: n.lien, destinataire: n.destinataire,
        client_id: n.clientId || null,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const getNotificationsAdmin = () => data.filter((n) => n.destinataire === "admin" || n.destinataire === "all");
  const getNotificationsByClient = (clientId: string) => data.filter((n) => (n.destinataire === "client" || n.destinataire === "all") && n.clientId === clientId);

  return {
    notifications: data, loading, error: query.error,
    markNotificationRead: markRead.mutate,
    markAllNotificationsRead: (role: "admin" | "client", clientId?: string) => markAllRead.mutate({ role, clientId }),
    addNotification: addNotification.mutate,
    getNotificationsAdmin, getNotificationsByClient,
  };
}
