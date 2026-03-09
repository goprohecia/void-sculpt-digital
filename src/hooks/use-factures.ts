import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { Facture, FactureStatus } from "@/data/mockData";

function mapRow(row: any): Facture {
  return {
    id: row.id,
    reference: row.reference,
    clientId: row.client_id,
    clientNom: row.client_nom,
    dossierId: row.dossier_id ?? "",
    montant: Number(row.montant),
    statut: row.statut as FactureStatus,
    dateEmission: row.date_emission?.split("T")[0] ?? "",
    dateEcheance: row.date_echeance?.split("T")[0] ?? "",
    serviceCategoryId: row.service_category_id ?? undefined,
    description: row.description ?? "",
  };
}

export function useFactures() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["factures"],
    queryFn: async () => {
      const { data, error } = await supabase.from("factures").select("*").order("date_emission", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Facture[] = isDemo ? demoData.factures : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const updateStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: FactureStatus }) => {
      if (isDemo) { demoData.updateFactureStatut(id, statut); return; }
      const { error } = await supabase.from("factures").update({ statut }).eq("id", id);
      if (error) throw error;

      // Send payment confirmation email + notifications when marking as paid
      if (statut === "payee") {
        const facture = data.find((f) => f.id === id);
        if (facture) {
          const { data: clientRow } = await supabase.from("clients").select("email, prenom").eq("id", facture.clientId).maybeSingle();
          if (clientRow?.email) {
            try {
              await supabase.functions.invoke("send-paiement", {
                body: {
                  email: clientRow.email,
                  prenom: clientRow.prenom || "Client",
                  factureRef: facture.reference,
                  montant: facture.montant,
                },
              });
            } catch (e) {
              console.error("Erreur envoi email paiement:", e);
            }
          }

          // Notifications + email log
          try {
            await Promise.all([
              supabase.from("notifications").insert({
                type: "facture", titre: "Paiement reçu",
                description: `${facture.clientNom} a réglé la facture ${facture.reference} (${facture.montant.toLocaleString()} €)`,
                lien: "/admin/facturation", destinataire: "admin",
              }),
              supabase.from("notifications").insert({
                type: "facture", titre: "Paiement confirmé",
                description: `Votre paiement de ${facture.montant.toLocaleString()} € pour ${facture.reference} est confirmé`,
                lien: "/client/factures", destinataire: "client", client_id: facture.clientId,
              }),
              supabase.from("email_logs").insert({
                type: "paiement", destinataire: clientRow?.email || facture.clientNom,
                sujet: `Confirmation de paiement — ${facture.reference}`,
                contenu: `<p>Bonjour,</p><p>Nous confirmons la réception de votre paiement de <strong>${facture.montant.toLocaleString()} €</strong> pour la facture <strong>${facture.reference}</strong>.</p><p>Merci pour votre confiance.</p><p>L'équipe Impartial</p>`,
                client_id: facture.clientId, reference: facture.reference,
              }),
            ]);
          } catch (e) { console.error("Erreur notifications/email_logs paiement:", e); }
        }
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["factures"] }),
  });

  const addFacture = useMutation({
    mutationFn: async (f: Facture) => {
      if (isDemo) { demoData.addFacture(f); return; }
      const { error } = await supabase.from("factures").insert({
        id: f.id, reference: f.reference, client_id: f.clientId, client_nom: f.clientNom,
        dossier_id: f.dossierId || null, montant: f.montant, statut: f.statut,
        date_emission: f.dateEmission, date_echeance: f.dateEcheance,
      });
      if (error) throw error;

      // Notification client + email log
      try {
        const { data: clientRow } = await supabase.from("clients").select("email").eq("id", f.clientId).maybeSingle();
        await Promise.all([
          supabase.from("notifications").insert({
            type: "facture", titre: "Nouvelle facture",
            description: `Facture ${f.reference} (${f.montant.toLocaleString()} €) disponible`,
            lien: "/client/factures", destinataire: "client", client_id: f.clientId,
          }),
          supabase.from("email_logs").insert({
            type: "devis", destinataire: clientRow?.email || f.clientNom,
            sujet: `Nouvelle facture — ${f.reference}`,
            contenu: `<p>Bonjour,</p><p>Une nouvelle facture <strong>${f.reference}</strong> d'un montant de <strong>${f.montant.toLocaleString()} €</strong> est disponible dans votre espace client.</p><p>L'équipe Impartial</p>`,
            client_id: f.clientId, reference: f.reference,
          }),
        ]);
      } catch (e) { console.error("Erreur notifications/email_logs facture:", e); }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["factures"] }),
  });

  const getFacturesByClient = (clientId: string) => data.filter((f) => f.clientId === clientId);
  const getFacturesByDossier = (dossierId: string) => data.filter((f) => f.dossierId === dossierId);
  const getFactureById = (id: string) => data.find((f) => f.id === id);

  return {
    factures: data, loading, error: query.error,
    updateFactureStatut: updateStatut.mutate,
    addFacture: addFacture.mutate,
    getFacturesByClient, getFacturesByDossier, getFactureById,
  };
}
