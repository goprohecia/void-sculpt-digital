import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { Demande, DemandeStatus } from "@/contexts/DemoDataContext";

function mapRow(row: any): Demande {
  return {
    id: row.id,
    reference: row.reference,
    clientId: row.client_id,
    clientNom: row.client_nom,
    titre: row.titre,
    typePrestation: row.type_prestation,
    description: row.description,
    budget: row.budget ?? undefined,
    statut: row.statut as DemandeStatus,
    dateCreation: row.date_creation?.split("T")[0] ?? "",
    dateMiseAJour: row.date_mise_a_jour?.split("T")[0] ?? "",
  };
}

export function useDemandes() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const demoData = useDemoData();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["demandes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("demandes").select("*").order("date_creation", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: !isDemo && !authLoading,
  });

  const data: Demande[] = isDemo ? demoData.demandes : (query.data ?? []);
  const loading = authLoading || (!isDemo && query.isLoading);

  const addDemande = useMutation({
    mutationFn: async (d: Demande) => {
      if (isDemo) { demoData.addDemande(d); return; }
      const { error } = await supabase.from("demandes").insert({
        id: d.id, reference: d.reference, client_id: d.clientId, client_nom: d.clientNom,
        titre: d.titre, type_prestation: d.typePrestation, description: d.description,
        budget: d.budget || null, statut: d.statut,
      });
      if (error) throw error;

      // Send reception email
      const { data: clientRow } = await supabase.from("clients").select("email, prenom").eq("id", d.clientId).maybeSingle();
      if (clientRow?.email) {
        try {
          await supabase.functions.invoke("send-demande-reception", {
            body: { email: clientRow.email, prenom: clientRow.prenom, demandeRef: d.reference, titre: d.titre },
          });
        } catch (e) { console.error("Erreur envoi email demande:", e); }
      }

      // Notifications + email log (fire & forget)
      try {
        await Promise.all([
          supabase.from("notifications").insert({
            type: "dossier", titre: "Nouvelle demande",
            description: `${d.clientNom} a soumis une demande : "${d.titre}"`,
            lien: "/admin/dossiers", destinataire: "admin",
          }),
          supabase.from("notifications").insert({
            type: "dossier", titre: "Demande envoyée",
            description: `Votre demande "${d.titre}" a bien été envoyée`,
            lien: "/client/demandes", destinataire: "client", client_id: d.clientId,
          }),
          supabase.from("email_logs").insert({
            type: "demande", destinataire: clientRow?.email || d.clientNom,
            sujet: `Demande reçue — ${d.reference}`,
            contenu: `<p>Bonjour,</p><p>Nous avons bien reçu votre demande <strong>"${d.titre}"</strong> (réf. ${d.reference}).</p><p>Notre équipe l'examine et reviendra vers vous rapidement.</p><p>L'équipe Impartial</p>`,
            client_id: d.clientId, reference: d.reference,
          }),
        ]);
      } catch (e) { console.error("Erreur notifications/email_logs demande:", e); }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["demandes"] }),
  });

  const updateStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: DemandeStatus }) => {
      if (isDemo) { demoData.updateDemandeStatut(id, statut); return; }
      const { error } = await supabase.from("demandes").update({ statut, date_mise_a_jour: new Date().toISOString() }).eq("id", id);
      if (error) throw error;

      // Send validation/refus email + notifications
      if (statut === "validee" || statut === "refusee") {
        const dem = data.find((d) => d.id === id);
        if (dem) {
          const { data: clientRow } = await supabase.from("clients").select("email, prenom").eq("id", dem.clientId).maybeSingle();
          const label = statut === "validee" ? "validée" : "refusée";

          if (clientRow?.email) {
            try {
              await supabase.functions.invoke("send-demande-statut", {
                body: { email: clientRow.email, prenom: clientRow.prenom, demandeRef: dem.reference, titre: dem.titre, statut },
              });
            } catch (e) { console.error("Erreur envoi email statut demande:", e); }
          }

          try {
            await Promise.all([
              supabase.from("notifications").insert({
                type: "dossier", titre: `Demande ${label}`,
                description: `Votre demande "${dem.titre}" a été ${label}`,
                lien: "/client/demandes", destinataire: "client", client_id: dem.clientId,
              }),
              supabase.from("email_logs").insert({
                type: "validation", destinataire: clientRow?.email || dem.clientNom,
                sujet: `Demande ${label} — ${dem.reference}`,
                contenu: `<p>Bonjour,</p><p>Votre demande <strong>"${dem.titre}"</strong> (réf. ${dem.reference}) a été <strong>${label}</strong>.</p>${statut === "validee" ? "<p>Nous vous contacterons prochainement pour les prochaines étapes.</p>" : "<p>N'hésitez pas à nous contacter pour plus d'informations.</p>"}<p>L'équipe Impartial</p>`,
                client_id: dem.clientId, reference: dem.reference,
              }),
            ]);
          } catch (e) { console.error("Erreur notifications/email_logs statut demande:", e); }
        }
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["demandes"] }),
  });

  const getDemandesByClient = (clientId: string) => data.filter((d) => d.clientId === clientId);

  return {
    demandes: data, loading, error: query.error,
    addDemande: addDemande.mutate,
    updateDemandeStatut: updateStatut.mutate,
    getDemandesByClient,
  };
}
