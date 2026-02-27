import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";

export interface EmailTemplate {
  id: string;
  nom: string;
  sujet: string;
  contenu: string;
  type: string;
  created_at: string;
  updated_at: string;
}

const DEMO_TEMPLATES: EmailTemplate[] = [
  { id: "tpl-1", nom: "Relance standard", sujet: "Relance facture {{factureRef}}", contenu: "<p>Bonjour,</p><p>Nous nous permettons de vous rappeler que la facture <strong>{{factureRef}}</strong> d'un montant de <strong>{{montant}} €</strong> est en attente de règlement.</p><p>Merci de procéder au paiement dans les meilleurs délais.</p><p>L'équipe Impartial</p>", type: "relance", created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "tpl-2", nom: "Relance urgente", sujet: "Relance urgente - Facture {{factureRef}}", contenu: "<p>Bonjour,</p><p>Malgré nos précédents rappels, la facture <strong>{{factureRef}}</strong> de <strong>{{montant}} €</strong> reste impayée.</p><p>Nous vous prions de régulariser cette situation sous 48h.</p><p>Cordialement,<br/>L'équipe Impartial</p>", type: "relance", created_at: "2026-01-15", updated_at: "2026-01-15" },
];

export function useEmailTemplates() {
  const { isDemo, isLoading: authLoading } = useIsDemo();
  const qc = useQueryClient();

  const query = useQuery<EmailTemplate[]>({
    queryKey: ["email_templates"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("email_templates").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !isDemo && !authLoading,
  });

  const templates = isDemo ? DEMO_TEMPLATES : (query.data ?? []);

  const addTemplate = useMutation({
    mutationFn: async (tpl: Omit<EmailTemplate, "id" | "created_at" | "updated_at">) => {
      if (isDemo) return;
      const { error } = await (supabase as any).from("email_templates").insert(tpl);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["email_templates"] }),
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...rest }: Partial<EmailTemplate> & { id: string }) => {
      if (isDemo) return;
      const { error } = await (supabase as any).from("email_templates").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["email_templates"] }),
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return;
      const { error } = await (supabase as any).from("email_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["email_templates"] }),
  });

  return { templates, addTemplate: addTemplate.mutate, updateTemplate: updateTemplate.mutate, deleteTemplate: deleteTemplate.mutate, isLoading: query.isLoading };
}
