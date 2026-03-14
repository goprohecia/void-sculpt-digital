import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import type { DateRange } from "@/components/admin/AnalyticsDatePicker";

function toIso(d: Date) {
  return d.toISOString();
}

export function useAnalyticsData(range: DateRange) {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const from = toIso(range.from);
  const to = toIso(range.to);

  const dossiers = useQuery({
    queryKey: ["analytics-dossiers", from, to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dossiers")
        .select("id, statut, date_creation, montant, type_prestation, client_id, client_nom")
        .gte("date_creation", from)
        .lte("date_creation", to);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const clients = useQuery({
    queryKey: ["analytics-clients", from, to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, statut, date_creation")
        .gte("date_creation", from)
        .lte("date_creation", to);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const factures = useQuery({
    queryKey: ["analytics-factures", from, to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("factures")
        .select("id, statut, montant, date_emission, date_echeance, client_id, client_nom, reference")
        .gte("date_emission", from)
        .lte("date_emission", to);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const demandes = useQuery({
    queryKey: ["analytics-demandes", from, to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demandes")
        .select("id, statut, date_creation, titre, client_nom, reference, type_prestation")
        .gte("date_creation", from)
        .lte("date_creation", to);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const tickets = useQuery({
    queryKey: ["analytics-tickets", from, to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("id, statut, priorite, date_creation, reference, client_nom, sujet")
        .gte("date_creation", from)
        .lte("date_creation", to);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const bonsCommande = useQuery({
    queryKey: ["analytics-bons-commande", from, to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bons_commande")
        .select("montant_total, date_commande, statut")
        .gte("date_commande", from)
        .lte("date_commande", to);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !isDemo && !authLoading,
  });

  const isLoading = dossiers.isLoading || clients.isLoading || factures.isLoading || demandes.isLoading || tickets.isLoading || bonsCommande.isLoading;

  // Computed KPIs
  const dossiersList = dossiers.data ?? [];
  const clientsList = clients.data ?? [];
  const facturesList = factures.data ?? [];
  const demandesList = demandes.data ?? [];
  const ticketsList = tickets.data ?? [];
  const bonsCommandeList = bonsCommande.data ?? [];

  const dossiersOuverts = dossiersList.filter((d) => d.statut !== "termine" && d.statut !== "livre" && d.statut !== "archive").length;
  const dossiersClotures = dossiersList.filter((d) => d.statut === "termine" || d.statut === "livre").length;
  const clientsActifs = clientsList.filter((c) => c.statut === "actif").length;
  const nouveauxClients = clientsList.length;

  const caTotal = facturesList.filter((f) => f.statut === "payee").reduce((s, f) => s + Number(f.montant), 0);
  const totalFacture = facturesList.reduce((s, f) => s + Number(f.montant), 0);

  const totalDepenses = bonsCommandeList.reduce((s, bc) => s + Number(bc.montant_total), 0);

  return {
    isLoading,
    dossiers: dossiersList,
    clients: clientsList,
    factures: facturesList,
    demandes: demandesList,
    tickets: ticketsList,
    bonsCommande: bonsCommandeList,
    kpis: {
      dossiersOuverts,
      dossiersClotures,
      clientsActifs,
      nouveauxClients,
      caTotal,
      totalFacture,
      totalDepenses,
      totalDossiers: dossiersList.length,
    },
  };
}
