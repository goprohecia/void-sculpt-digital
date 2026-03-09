import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { Devis, DevisStatus } from "@/data/mockData";

function mapRow(row: any): Devis {
  return {
    id: row.id,
    reference: row.reference,
    clientId: row.client_id,
    clientNom: row.client_nom,
    dossierId: row.dossier_id ?? undefined,
    titre: row.titre,
    montant: Number(row.montant),
    statut: row.statut as DevisStatus,
    dateEmission: row.date_emission?.split("T")[0] ?? "",
    dateValidite: row.date_validite?.split("T")[0] ?? "",
    signatureDataUrl: row.signature_url ?? undefined,
    signataireNom: row.signataire_nom ?? undefined,
    dateSignature: row.date_signature?.split("T")[0] ?? undefined,
    serviceCategoryId: row.service_category_id ?? undefined,
    description: row.description ?? "",
  };
}

export function useDevis() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["devis"],
    queryFn: async () => {
      const { data, error } = await supabase.from("devis").select("*").order("date_emission", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Devis[] = isDemo ? demoData.devis : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const updateStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: DevisStatus }) => {
      if (isDemo) { demoData.updateDevisStatut(id, statut); return; }
      const { error } = await supabase.from("devis").update({ statut }).eq("id", id);
      if (error) throw error;

      // Notifications for status changes
      const d = data.find((x) => x.id === id);
      if (d) {
        try {
          if (statut === "accepte") {
            await supabase.from("notifications").insert({
              type: "devis", titre: "Devis accepté",
              description: `${d.clientNom} a accepté le devis ${d.reference} (${d.montant.toLocaleString()} €)`,
              lien: "/admin/facturation", destinataire: "admin",
            });
          } else if (statut === "refuse") {
            await supabase.from("notifications").insert({
              type: "devis", titre: "Devis refusé",
              description: `${d.clientNom} a refusé le devis ${d.reference}`,
              lien: "/admin/facturation", destinataire: "admin",
            });
          }
        } catch (e) { console.error("Erreur notification devis statut:", e); }
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devis"] }),
  });

  const updateSignature = useMutation({
    mutationFn: async ({ id, signatureDataUrl, signataireNom, dateSignature }: { id: string; signatureDataUrl: string; signataireNom: string; dateSignature: string }) => {
      if (isDemo) { demoData.updateDevisSignature(id, signatureDataUrl, signataireNom, dateSignature); return; }
      const { error } = await supabase.from("devis").update({
        signature_url: signatureDataUrl, signataire_nom: signataireNom, date_signature: dateSignature, statut: "accepte",
      }).eq("id", id);
      if (error) throw error;

      // Notification admin: devis signé
      const d = data.find((x) => x.id === id);
      if (d) {
        try {
          await Promise.all([
            supabase.from("notifications").insert({
              type: "devis", titre: "Devis signé",
              description: `${d.clientNom} a signé le devis ${d.reference} (${d.montant.toLocaleString()} €)`,
              lien: "/admin/facturation", destinataire: "admin",
            }),
            supabase.from("email_logs").insert({
              type: "devis", destinataire: d.clientNom,
              sujet: `Devis signé — ${d.reference}`,
              contenu: `<p>Le devis <strong>${d.reference}</strong> a été signé par <strong>${signataireNom}</strong> le ${dateSignature}.</p>`,
              client_id: d.clientId, reference: d.reference,
            }),
          ]);
        } catch (e) { console.error("Erreur notification signature devis:", e); }
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devis"] }),
  });

  const addDevis = useMutation({
    mutationFn: async (d: Devis) => {
      if (isDemo) { demoData.addDevis(d); return; }
      const { error } = await supabase.from("devis").insert({
        id: d.id, reference: d.reference, client_id: d.clientId, client_nom: d.clientNom,
        dossier_id: d.dossierId || null, titre: d.titre, montant: d.montant, statut: d.statut,
        date_emission: d.dateEmission, date_validite: d.dateValidite,
      });
      if (error) throw error;

      // Notification client + email log
      try {
        const { data: clientRow } = await supabase.from("clients").select("email").eq("id", d.clientId).maybeSingle();
        await Promise.all([
          supabase.from("notifications").insert({
            type: "devis", titre: "Nouveau devis",
            description: `Un devis "${d.titre}" (${d.montant.toLocaleString()} €) est disponible`,
            lien: "/client/devis", destinataire: "client", client_id: d.clientId,
          }),
          supabase.from("email_logs").insert({
            type: "devis", destinataire: clientRow?.email || d.clientNom,
            sujet: `Nouveau devis — ${d.reference}`,
            contenu: `<p>Bonjour,</p><p>Un nouveau devis <strong>"${d.titre}"</strong> d'un montant de <strong>${d.montant.toLocaleString()} €</strong> est disponible dans votre espace client.</p><p>Vous pouvez le consulter et l'accepter directement en ligne.</p><p>L'équipe Impartial</p>`,
            client_id: d.clientId, reference: d.reference,
          }),
        ]);
      } catch (e) { console.error("Erreur notifications/email_logs devis:", e); }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devis"] }),
  });

  const getDevisByClient = (clientId: string) => data.filter((d) => d.clientId === clientId);
  const getDevisByDossier = (dossierId: string) => data.filter((d) => d.dossierId === dossierId);

  return {
    devis: data, loading, error: query.error,
    updateDevisStatut: updateStatut.mutate,
    updateDevisSignature: updateSignature.mutate,
    addDevis: addDevis.mutate,
    getDevisByClient, getDevisByDossier,
  };
}
