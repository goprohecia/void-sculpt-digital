import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import { DEMO_CLIENT_ID } from "@/data/mockData";

/**
 * Centralized hook that returns the current client's ID and info.
 * - In demo mode: returns DEMO_CLIENT_ID and mock client data
 * - In real mode: queries the `clients` table by user_id to find the matching record
 */
export function useClientId() {
  const { isDemo, isLoading: authLoading, supabaseUserId } = useIsDemo();
  const demoData = useDemoData();

  const query = useQuery({
    queryKey: ["client-by-user", supabaseUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", supabaseUserId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !isDemo && !authLoading && !!supabaseUserId,
  });

  if (isDemo) {
    const client = demoData.getClientById(DEMO_CLIENT_ID);
    return {
      clientId: DEMO_CLIENT_ID,
      clientName: client ? `${client.prenom} ${client.nom}` : "Client",
      clientPrenom: client?.prenom ?? "Client",
      clientEntreprise: client?.entreprise ?? "",
      clientInitials: client ? `${client.prenom.charAt(0)}${client.nom.charAt(0)}` : "CL",
      isLoading: authLoading,
      isDemo: true,
    };
  }

  const row = query.data;
  return {
    clientId: row?.id ?? null,
    clientName: row ? `${row.prenom} ${row.nom}` : "Client",
    clientPrenom: row?.prenom ?? "Client",
    clientEntreprise: row?.entreprise ?? "",
    clientInitials: row ? `${row.prenom.charAt(0)}${row.nom.charAt(0)}` : "CL",
    isLoading: authLoading || query.isLoading,
    isDemo: false,
  };
}
