import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CalendlyEvent {
  id: string;
  clientNom: string;
  clientEmail: string;
  date: string;
  heure: string;
  sujet: string;
  statut: "a_venir" | "passe" | "annule";
  location: string;
}

async function fetchCalendlyEvents(minDate?: string, maxDate?: string, status?: string): Promise<CalendlyEvent[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Non authentifié");

  const params: Record<string, string> = {};
  if (minDate) params.min_date = minDate;
  if (maxDate) params.max_date = maxDate;
  if (status) params.status = status;

  const queryString = new URLSearchParams(params).toString();
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendly-events?${queryString}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Failed to fetch Calendly events: ${errBody}`);
  }

  const json = await res.json();
  return json.events || [];
}

export function useCalendlyEvents(minDate?: string, maxDate?: string) {
  return useQuery({
    queryKey: ["calendly-events", minDate, maxDate],
    queryFn: () => fetchCalendlyEvents(minDate, maxDate),
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}
