import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { PreviewVisit } from "@/contexts/DemoDataContext";

function mapRow(row: any): PreviewVisit {
  return {
    id: row.id,
    dossierId: row.dossier_id,
    date: row.date,
    device: row.device as PreviewVisit["device"],
  };
}

export function usePreviewVisits() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["preview_visits"],
    queryFn: async () => {
      const { data, error } = await supabase.from("preview_visits").select("*").order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: PreviewVisit[] = isDemo ? demoData.previewVisits : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const addVisit = useMutation({
    mutationFn: async (dossierId: string) => {
      if (isDemo) { demoData.addPreviewVisit(dossierId); return; }
      const devices: Array<"desktop" | "mobile" | "tablet"> = ["desktop", "mobile", "tablet"];
      const { error } = await supabase.from("preview_visits").insert({
        dossier_id: dossierId, device: devices[Math.floor(Math.random() * devices.length)],
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preview_visits"] }),
  });

  const getByDossier = (dossierId: string) => data.filter((v) => v.dossierId === dossierId);

  return {
    previewVisits: data, loading, error: query.error,
    addPreviewVisit: addVisit.mutate,
    getPreviewVisitsByDossier: getByDossier,
  };
}
